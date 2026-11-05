import type { Metadata } from 'next';
import Link from 'next/link';
import ReadingLayout from '@/components/ui/ReadingLayout';
import { nodeById } from '@/data/universe';
import { storyById } from '@/data/stories';
import type { CelestialNode } from '@/types/universe';
export const metadata:Metadata={title:'知识与成长'};
function Tree({nodes}:{nodes:CelestialNode[]}){return <ul className="reading-tree">{nodes.map(n=><li id={n.id} key={n.id}>{n.children?.length?<details open><summary>{n.name}<small>{n.english}</small></summary><p>{n.description}</p><Tree nodes={n.children}/></details>:<div className="tree-leaf">{n.name}<small>{n.english}</small><p>{n.description}</p></div>}{n.storyIds?.filter(id=>storyById[id]).map(id=><p key={id}><Link href={`/stories/${id}/`}>{storyById[id].title} →</Link></p>)}</li>)}</ul>;}
export default function Knowledge(){return <ReadingLayout eyebrow="THE LEARNING WORLD" title="知识与成长" description="每一次好奇，都是一颗新星的诞生。语言与技术的完整档案，也可以在这里阅读。"><Tree nodes={[nodeById.knowledge]}/></ReadingLayout>;}
