import type { CelestialNode, ThemeId } from '@/types/universe';

export const themes: Record<ThemeId, { color: string; light: string; label: string; kind: number }> = {
  sun: { color: '#f5ae45', light: '#ffdb91', label: '关于我 · 宇宙的起点', kind: 5 },
  moon: { color: '#99958e', light: '#c9ccd0', label: '知识 · 成长', kind: 6 },
  ice: { color: '#82aeb4', light: '#b5d9df', label: '冰巨星 · 远方', kind: 0 },
  knowledge: { color: '#92afb8', light: '#bad8e5', label: '学习 · 生长', kind: 0 },
  language: { color: '#789da4', light: '#9ae0e5', label: '语言 · 连接', kind: 0 },
  technology: { color: '#647b90', light: '#a5c9ff', label: '技术 · 创造', kind: 0 },
  ocean: { color: '#16446b', light: '#64abd1', label: '迷茫 · 寻找', kind: 1 },
  lava: { color: '#913f2c', light: '#f29462', label: '焦躁 · 压力', kind: 2 },
  warmth: { color: '#b89c7b', light: '#ffdeb2', label: '温暖 · 爱', kind: 3 },
  growth: { color: '#ac967e', light: '#e0c4a0', label: '成长 · 突破', kind: 3 },
  discovery: { color: '#b4aaa0', light: '#e6d0ae', label: '好奇 · 探索', kind: 3 },
  solitude: { color: '#3a5c8b', light: '#96bdf7', label: '孤独 · 沉默', kind: 1 },
  rebirth: { color: '#a7b7be', light: '#e2e9ea', label: '告别 · 重生', kind: 0 },
  earth: { color: '#578baa', light: '#8ec9ff', label: '足迹 · 远方', kind: 4 },
};
const leaf = (id: string, name: string, english: string, themeId: ThemeId = 'technology', since = 2022): CelestialNode => ({ id, type: 'moon', name, english, themeId, since, description: `关于 ${english} 的学习、记录与实践。这是一处等待你写下真实经历的知识坐标。`, visual: { radius: 0.8 } });
const branch = (id: string, name: string, english: string, children: CelestialNode[]): CelestialNode => ({ ...leaf(id, name, english), type: 'planet', children, visual: { radius: 1.3 } });
const knowledge: CelestialNode = {
  id: 'knowledge', type: 'moon', name: '月球 · 知识与成长', english: 'The Moon · Knowledge', themeId: 'moon', since: 2018,
  description: '每一次好奇，都是一颗新星的诞生。沿着语言与技术的轨道，探索一个不断生长的知识世界。',
  storyIds: ['learning'], visual: { radius: .7, atmosphere: false }, children: [
    { ...branch('languages', '语言星球', 'A World of Words', [leaf('chinese', '汉语', 'Chinese', 'language', 2018), leaf('english', '英语', 'English', 'language', 2018), { ...leaf('japanese', '日语', 'Japanese', 'language', 2020), storyIds: ['japanese'] }, leaf('german', '德语', 'German', 'language', 2025)]), themeId: 'language', since: 2018 },
    { ...branch('it', 'IT 星球', 'The Art of Building', [
      branch('frontend', '前端开发', 'Frontend', [leaf('html', 'HTML', 'HTML'), leaf('css', 'CSS', 'CSS'), leaf('javascript', 'JavaScript', 'JavaScript'), leaf('typescript', 'TypeScript', 'TypeScript'), { ...leaf('react', 'React', 'React'), children: [leaf('nextjs', 'Next.js', 'Next.js')] }, leaf('threejs', 'Three.js', 'Three.js')]),
      branch('backend', '后端开发', 'Backend', [leaf('python', 'Python', 'Python'), leaf('fastapi', 'FastAPI', 'FastAPI'), leaf('ruby', 'Ruby', 'Ruby'), leaf('rails', 'Rails', 'Rails'), leaf('nodejs', 'Node.js', 'Node.js')]),
      branch('cloud', '云与基础设施', 'Cloud', [leaf('aws', 'AWS', 'AWS'), leaf('docker', 'Docker', 'Docker'), leaf('cicd', 'CI/CD', 'CI/CD'), leaf('linux', 'Linux', 'Linux')]),
      branch('database', '数据库', 'Database', [leaf('sql', 'SQL', 'SQL'), leaf('postgresql', 'PostgreSQL', 'PostgreSQL'), leaf('redis', 'Redis', 'Redis')]),
      branch('ai', '人工智能', 'Artificial Intelligence', [leaf('llm', '大语言模型', 'LLM'), leaf('rag', '检索增强生成', 'RAG'), leaf('agent', '智能体', 'AI Agent')]),
    ]), since: 2022 },
  ],
};
const emotions: CelestialNode = { id: 'emotions', type: 'region', name: '情绪与人生', english: 'The Inner Worlds', themeId: 'solitude', description: '那些无法用一句话说清的时刻，都在这里拥有自己的星球。', children: [
  { id: 'mercury', type: 'planet', name: '水星 · 迷茫之海', english: 'The Drowned World', themeId: 'ocean', since: 2018, description: '有时候，寻找方向的第一步，是允许自己暂时漂浮。', storyIds: ['adrift'], visual: { radius: 1.3 } },
  { id: 'mars', type: 'planet', name: '火星 · 焦躁之火', english: 'The Burning World', themeId: 'lava', since: 2020, description: '把急切与压力留在熔岩里，等待它们慢慢冷却成新的陆地。', storyIds: ['adrift', 'burning'], visual: { radius: 1.2 } },
  { id: 'venus', type: 'planet', name: '金星 · 温暖之境', english: 'The Tender World', themeId: 'warmth', since: 2021, description: '那些微小而明亮的瞬间，让遥远的宇宙有了家的温度。', storyIds: ['warmth'], visual: { radius: 1.3 } },
  { id: 'jupiter', type: 'planet', name: '木星 · 成长之境', english: 'The Becoming World', themeId: 'growth', since: 2022, description: '穿过风暴，成为比昨天更辽阔的自己。', storyIds: ['learning'], visual: { radius: 1.75 } },
  { id: 'saturn', type: 'planet', name: '土星 · 探索之境', english: 'The Curious World', themeId: 'discovery', since: 2023, description: '好奇心是引力，让未知的世界彼此相连。', visual: { radius: 1.45, rings: true } },
  { id: 'neptune', type: 'planet', name: '海王星 · 孤独之境', english: 'The Silent World', themeId: 'solitude', since: 2024, description: '在寂静的深蓝里，听见自己。', storyIds: ['silence'], visual: { radius: 1.25 } },
  { id: 'uranus', type: 'planet', name: '天王星', english: 'Uranus', themeId: 'ice', description: '在更远的轨道上，以属于自己的节奏，环绕太阳。', visual: { radius: 1.15 } },
  { id: 'pluto', type: 'celestial-body', name: '冥王星 · 重生之境', english: 'The Returning Light', themeId: 'rebirth', since: 2027, state: 'future', description: '写给未来的坐标：结束之后，还有新的日出。', visual: { radius: 0.8 } },
] };
export const universe: CelestialNode = { id: 'universe', type: 'galaxy', name: '我的人生宇宙', english: 'My Universe', themeId: 'knowledge', description: 'Every planet holds a story.', children: [{ id: 'sun', type: 'star', name: '太阳', english: 'The Sun', themeId: 'sun', description: '这片宇宙从我开始。走近太阳，认识我与这个不断生长的世界。', visual: { radius: 1.8, atmosphere: false } }, emotions, { id: 'earth', type: 'planet', name: '旅行地球', english: 'Somewhere on Earth', themeId: 'earth', since: 2020, description: '世界很大，把经过的地方，变成生命里闪光的坐标。', storyIds: ['tokyo'], visual: { radius: 1.6, rotationSpeed: 0.035 }, children: [knowledge] }] };
function attachParents(node: CelestialNode, parentId?: string): CelestialNode { return { ...node, parentId, children: node.children?.map(child => attachParents(child, node.id)) }; }
export const root = attachParents(universe);
export function flatten(node: CelestialNode): CelestialNode[] { return [node, ...(node.children?.flatMap(flatten) ?? [])]; }
export const nodes = flatten(root);
export const nodeById = Object.fromEntries(nodes.map(node => [node.id, node]));
export function ancestors(id: string): CelestialNode[] { const result: CelestialNode[] = []; let node: CelestialNode | undefined = nodeById[id]; while (node) { result.unshift(node); node = node.parentId ? nodeById[node.parentId] : undefined; } return result; }
// Physical orbits are configured separately in solar-system.ts; content remains recursive.
