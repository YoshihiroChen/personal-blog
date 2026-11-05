import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: { default: 'My Universe — 我的人生宇宙', template: '%s · My Universe' }, description: '知识是星光，情绪是引力，旅行是轨迹。一个可以自由探索的 3D 人生宇宙。', icons: { icon: '/icon.svg' }, openGraph: { title: 'My Universe — 我的人生宇宙', description: 'Every planet holds a story. Every story holds an emotion.', locale: 'zh_CN', type: 'website' } };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>;}
