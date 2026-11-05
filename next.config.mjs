/** @type {import('next').NextConfig} */
export default { output: 'export', trailingSlash: true, images: { unoptimized: true }, transpilePackages: ['three'], experimental: { cpus: 1 } };
