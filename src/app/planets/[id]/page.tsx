import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import UniverseApp from '@/components/ui/UniverseApp';
import ReadingLayout from '@/components/ui/ReadingLayout';
import { nodeById, themes } from '@/data/universe';
import { stories } from '@/data/stories';
import { planetIds, planetHref } from '@/lib/planets';

export const dynamicParams = false;
export function generateStaticParams() { return planetIds.map(id => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: id === 'sun' ? 'About Me · The Sun' : nodeById[id]?.name ?? 'World not found' };
}
export default async function PlanetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!planetIds.includes(id)) notFound();
  const node = nodeById[id];
  if (id === 'sun' || id === 'earth' || id === 'knowledge' || node.parentId === 'emotions') {
    return <UniverseApp initialNode={id} initialSelected={id}/>;
  }
  const related = stories.filter(story => story.status === 'public' && story.celestialNodeIds.includes(id));
  return <ReadingLayout eyebrow={`${node.english.toUpperCase()} / ${themes[node.themeId].label}`} title={node.name} description={node.description}>
      <div className="reading-prose"><h2>Explore {node.name}</h2><p>{node.description}</p>
        <p><Link href={`/?node=${encodeURIComponent(id)}`}>Explore this world in 3D →</Link></p>
      </div>
      {node.children?.length ? <section className="reading-cards"><h2>Keep exploring</h2>{node.children.map(child => <article key={child.id}><h3>{child.name}</h3><p>{child.description}</p><Link href={planetIds.includes(child.id) ? planetHref(child.id) : `/?node=${encodeURIComponent(child.id)}`}>Explore {child.name} →</Link></article>)}</section> : null}
      <section className="reading-cards"><h2>Stories from this world</h2>{related.length ? related.map(story => <article key={story.id}><h3><Link href={`/stories/${story.id}/`}>{story.title} →</Link></h3><p>{story.summary}</p></article>) : <p className="reading-lead">There’s a story here waiting to be told.</p>}</section>
    <nav className="planet-page-links" aria-label="Other worlds">{planetIds.filter(other => other !== id).map(other => <Link key={other} href={planetHref(other)}>{nodeById[other].name} ↗</Link>)}</nav>
  </ReadingLayout>;
}
