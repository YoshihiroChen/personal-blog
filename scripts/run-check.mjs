import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { cpus, loadavg, platform } from 'node:os';

const commands = {
  test: ['--import', 'tsx', 'scripts/test-data.ts'],
  validate: ['--import', 'tsx', 'scripts/validate-data.ts'],
  typecheck: ['node_modules/typescript/bin/tsc', '--noEmit'],
  build: ['node_modules/next/dist/bin/next', 'build', '--webpack'],
  dev: ['node_modules/next/dist/bin/next', 'dev', '--webpack', '--hostname', '0.0.0.0', '--port', '3100'],
  browser: ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(3)],
};
const task = process.argv[2];
if (!commands[task]) throw new Error('Unknown check');
const linux = platform() === 'linux';
function memory() {
  if (!linux) return null;
  const info = readFileSync('/proc/meminfo', 'utf8');
  return {
    total: Number(info.match(/^MemTotal:\s+(\d+)/m)[1]) / 1024,
    available: Number(info.match(/^MemAvailable:\s+(\d+)/m)[1]) / 1024,
  };
}
const initial = memory();
const loadLimit = Math.max(2, cpus().length * 2);
if (linux && loadavg()[0] > loadLimit) {
  console.error(`已跳过 ${task}：系统负载 ${loadavg()[0].toFixed(2)} 超过阈值 ${loadLimit}。`);
  process.exit(2);
}
if (task === 'browser' && initial && initial.total < 6144) {
  console.error('此服务器内存不足 6 GB，已阻止重型浏览器测试。请在本地电脑执行。');
  process.exit(2);
}
if (initial && initial.available < 1000) {
  console.error(`已跳过 ${task}：当前可用内存 ${Math.round(initial.available)} MiB，需至少 1000 MiB。`);
  process.exit(2);
}
const budget = task === 'browser' ? 2048 : 640;
const reserve = 600;
let executable = process.execPath;
let args = commands[task];
if (linux) {
  // Pin this job and its children to one allowed CPU; keep existing services responsive.
  const allowed = readFileSync('/proc/self/status', 'utf8').match(/^Cpus_allowed_list:\s+(\S+)/m)?.[1];
  const core = allowed?.split(/[,-]/)[0];
  args = ['-n', '15', process.execPath, ...args];
  executable = 'nice';
  if (core) { args = ['-c', core, executable, ...args]; executable = 'taskset'; }
}
console.log(`[resource] ${task}: single job, one CPU, RSS budget ${budget} MiB${initial ? `; available ${Math.round(initial.available)} MiB` : ''}`);
const child = spawn(executable, args, {
  stdio: 'inherit', detached: linux,
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=384', UV_THREADPOOL_SIZE: '1', RAYON_NUM_THREADS: '1', OMP_NUM_THREADS: '1', NEXT_TELEMETRY_DISABLED: '1' },
});
let stopped = false, peak = 0, minimumAvailable = initial?.available ?? Infinity;
let killTimer;
function stop(reason) {
  if (stopped) return;
  stopped = true;
  console.error(`[resource] 已停止本次 ${task}：${reason}。现有服务保持运行。`);
  const kill = signal => { try { process.kill(linux ? -child.pid : child.pid, signal); } catch {} };
  kill('SIGTERM');
  killTimer = setTimeout(() => kill('SIGKILL'), 3000);
}
const monitor = linux ? setInterval(() => {
  try {
    const current = memory();
    minimumAvailable = Math.min(minimumAvailable, current.available);
    const result = spawn('ps', ['-eo', 'pgid=,rss='], { stdio: ['ignore', 'pipe', 'ignore'] });
    let output = '';
    result.stdout.on('data', chunk => { output += chunk; });
    result.on('close', () => {
      const rss = output.split('\n').reduce((sum, row) => {
        const [group, resident] = row.trim().split(/\s+/).map(Number);
        return sum + (group === child.pid ? resident || 0 : 0);
      }, 0) / 1024;
      peak = Math.max(peak, rss);
      if (rss > budget) stop(`进程组内存 ${Math.round(rss)} MiB 超过预算 ${budget} MiB`);
    });
    if (loadavg()[0] > loadLimit) stop(`CPU 负载超过阈值 ${loadLimit}`);
    if (current.available < reserve) stop(`系统可用内存低于 ${reserve} MiB`);
  } catch (error) { stop(`资源监测不可用：${error.message}`); }
}, 2000) : null;
child.on('error', error => { console.error(error.message); if (monitor) clearInterval(monitor); process.exitCode = 1; });
child.on('exit', (code, signal) => {
  if (monitor) clearInterval(monitor);
  console.log(`[resource] ${task}: sampled peak RSS ${peak ? `${Math.round(peak)} MiB` : 'not sampled (short job)'}; minimum available ${Number.isFinite(minimumAvailable) ? Math.round(minimumAvailable) : 'n/a'} MiB`);
  process.exitCode = stopped ? 2 : code ?? (signal ? 1 : 0);
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop(signal));
