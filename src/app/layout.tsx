import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: { default: 'Jiahong Chen — My Universe', template: '%s · My Universe' }, description: 'The personal world of Jiahong Chen. Explore learning notes, stories, and places in an interactive universe.', icons: { icon: '/icon.svg' }, openGraph: { title: 'Jiahong Chen — My Universe', description: 'Welcome to my universe. I’m Jiahong Chen.', locale: 'en_US', type: 'website' } };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
