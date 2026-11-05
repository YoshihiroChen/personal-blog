import type { Metadata } from 'next';
import Link from 'next/link';
import ReadingLayout from '@/components/ui/ReadingLayout';
import { nodeById } from '@/data/universe';
import { storyById } from '@/data/stories';
import type { CelestialNode } from '@/types/universe';
export const metadata:Metadata={title:'Knowledge & Growth'};
function Tree({nodes}:{nodes:CelestialNode[]}){return <ul className="reading-tree">{nodes.map(n=><li id={n.id} key={n.id}>{n.children?.length?<details open><summary>{n.name}{n.english!==n.name&&<small>{n.english}</small>}</summary><p>{n.description}</p><Tree nodes={n.children}/></details>:<div className="tree-leaf">{n.name}{n.english!==n.name&&<small>{n.english}</small>}<p>{n.description}</p></div>}{n.storyIds?.filter(id=>storyById[id]).map(id=><p key={id}><Link href={`/stories/${id}/`}>{storyById[id].title} →</Link></p>)}</li>)}</ul>;}
export default function Knowledge(){return <ReadingLayout eyebrow="THE LEARNING WORLD" title="Knowledge & Growth" description="An open notebook of languages, technology, and things I’m figuring out along the way."><Tree nodes={[nodeById.knowledge]}/></ReadingLayout>;}
