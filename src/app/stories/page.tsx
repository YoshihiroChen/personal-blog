import type { Metadata } from 'next';
import Link from 'next/link';
import ReadingLayout from '@/components/ui/ReadingLayout';
import { stories } from '@/data/stories';
import { dateLabel } from '@/lib/content';
export const metadata:Metadata={title:'Inner Worlds'};
export default function Stories(){return <ReadingLayout eyebrow="THE INNER WORLDS" title="Stories from this world" description="Some days feel like an ocean. Others feel like fire. A collection of stories for all the spaces in between."><div className="reading-cards">{stories.filter(s=>s.status==='public').map(s=><article key={s.id}><time>{dateLabel(s.date)}</time><h2><Link href={`/stories/${s.id}/`}>{s.title} ↗</Link></h2><p>{s.summary}</p><div className="reading-tags">{s.emotionTags.join(' / ')} · {s.demo?'Sample story':'Personal note'}</div></article>)}</div></ReadingLayout>;}
