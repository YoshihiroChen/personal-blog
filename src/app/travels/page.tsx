import type { Metadata } from 'next';
import Link from 'next/link';
import ReadingLayout from '@/components/ui/ReadingLayout';
import { places,visits } from '@/data/travels';
import { storyById } from '@/data/stories';
import { dateLabel } from '@/lib/content';
export const metadata:Metadata={title:'地球上的足迹'};
export default function Travels(){return <ReadingLayout eyebrow="SOMEWHERE ON EARTH" title="把远方，变成坐标。" description="一颗地球，许多次出发。在不同的城市，收集不同的生活切片。"><div className="reading-cards">{places.map(place=><article key={place.id}><span className="eyebrow">{place.english.toUpperCase()} / {place.country.toUpperCase()}</span><h2>{place.name}</h2><p>{place.description}</p><p className="reading-tags">{place.latitude.toFixed(4)}° N · {place.longitude.toFixed(4)}° E</p>{visits.filter(v=>v.placeId===place.id&&v.status==='public').map(v=><section key={v.id} className="reading-visit"><time>{dateLabel(v.visitedAt)}</time><h3>{v.title}</h3><p>{v.description}</p>{v.photos.map(p=><img key={p.src} src={p.src} alt={p.alt} loading="lazy"/>)}{v.storyIds.filter(id=>storyById[id]).map(id=><Link key={id} href={`/stories/${id}/`}>阅读旅行故事 →</Link>)}</section>)}</article>)}</div></ReadingLayout>;}
