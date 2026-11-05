import type { Metadata } from 'next';
import Link from 'next/link';
import ReadingLayout from '@/components/ui/ReadingLayout';
import { stories } from '@/data/stories';
import { dateLabel } from '@/lib/content';
export const metadata:Metadata={title:'情绪与人生'};
export default function Stories(){return <ReadingLayout eyebrow="THE INNER WORLDS" title="轨道上的故事" description="有些日子像海，有些时刻如火。每一种心情，都在这个宇宙里拥有自己的位置。"><div className="reading-cards">{stories.filter(s=>s.status==='public').map(s=><article key={s.id}><time>{dateLabel(s.date)}</time><h2><Link href={`/stories/${s.id}/`}>{s.title} ↗</Link></h2><p>{s.summary}</p><div className="reading-tags">{s.emotionTags.join(' / ')} · 示例故事</div></article>)}</div></ReadingLayout>;}
