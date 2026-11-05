import type { Metadata } from 'next';
import UniverseApp from '@/components/ui/UniverseApp';
export const metadata: Metadata = {title:'My Works',description:'IT projects and language projects by Jiahong Chen. Explore the fleet.'};
export default function WorksPage(){return <UniverseApp initialWork="flagship"/>;}
