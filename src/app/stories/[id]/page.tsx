import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReadingLayout from '@/components/ui/ReadingLayout';
import { stories, storyById } from '@/data/stories';
import { nodeById } from '@/data/universe';
import { dateLabel } from '@/lib/content';
export const dynamicParams=false;
export function generateStaticParams(){return stories.filter(s=>s.status==='public').map(s=>({id:s.id}));}
export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{const {id}=await params;return{title:storyById[id]?.title??'故事未找到',description:storyById[id]?.summary};}
export default async function Story({params}:{params:Promise<{id:string}>}){const {id}=await params;const story=storyById[id];if(!story)notFound();const published=stories.filter(s=>s.status==='public'),i=published.findIndex(s=>s.id===id);return <ReadingLayout eyebrow={`${dateLabel(story.date)} / A CHAPTER OF LIFE`} title={story.title} description={story.subtitle}><div className="reading-tags">{story.emotionTags.join(' / ')}</div><article className="reading-prose">{story.paragraphs.map((p,i)=><p key={i}>{p}</p>)}<h2>关联的星球</h2>{story.celestialNodeIds.map(id=><p key={id}><Link href={`/?node=${encodeURIComponent(id)}`}>{nodeById[id].name} ↗</Link></p>)}</article><div className="story-pagination">{i>0?<Link href={`/stories/${published[i-1].id}/`}>← {published[i-1].title}</Link>:<span/>}{i<published.length-1&&<Link href={`/stories/${published[i+1].id}/`}>{published[i+1].title} →</Link>}</div></ReadingLayout>;}
