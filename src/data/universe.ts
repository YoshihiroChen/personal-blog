import type { CelestialNode, ThemeId } from '@/types/universe';

export const themes: Record<ThemeId, { color: string; light: string; label: string; kind: number }> = {
  sun: { color: '#f5ae45', light: '#ffdb91', label: 'About me · Where it all begins', kind: 5 },
  moon: { color: '#99958e', light: '#c9ccd0', label: 'Knowledge · Growth', kind: 6 },
  ice: { color: '#82aeb4', light: '#b5d9df', label: 'Ice giant · Beyond', kind: 0 },
  knowledge: { color: '#92afb8', light: '#bad8e5', label: 'Learning · Growth', kind: 0 },
  language: { color: '#789da4', light: '#9ae0e5', label: 'Language · Connection', kind: 0 },
  technology: { color: '#647b90', light: '#a5c9ff', label: 'Technology · Making', kind: 0 },
  ocean: { color: '#16446b', light: '#64abd1', label: 'Uncertainty · Discovery', kind: 1 },
  lava: { color: '#913f2c', light: '#f29462', label: 'Restlessness · Pressure', kind: 2 },
  warmth: { color: '#b89c7b', light: '#ffdeb2', label: 'Warmth · Love', kind: 3 },
  growth: { color: '#ac967e', light: '#e0c4a0', label: 'Growth · Possibility', kind: 3 },
  discovery: { color: '#b4aaa0', light: '#e6d0ae', label: 'Curiosity · Exploration', kind: 3 },
  solitude: { color: '#3a5c8b', light: '#96bdf7', label: 'Solitude · Stillness', kind: 1 },
  rebirth: { color: '#a7b7be', light: '#e2e9ea', label: 'Endings · New beginnings', kind: 0 },
  earth: { color: '#578baa', light: '#8ec9ff', label: 'Journeys · Places', kind: 4 },
};
const leaf = (id: string, name: string, english: string, themeId: ThemeId = 'technology', since = 2022): CelestialNode => ({ id, type: 'moon', name, english, themeId, since, description: `Notes, experiments, and things learned along the way with ${english}. Personal entries are coming soon.`, visual: { radius: 0.8 } });
const branch = (id: string, name: string, english: string, children: CelestialNode[]): CelestialNode => ({ ...leaf(id, name, english), type: 'planet', children, visual: { radius: 1.3 } });
const knowledge: CelestialNode = {
  id: 'knowledge', type: 'moon', name: 'Moon · Knowledge & Growth', english: 'The Moon · Knowledge', themeId: 'moon', since: 2018,
  description: 'A growing collection of things I learn, from languages to technology. Follow a thread and see where it leads.',
  storyIds: ['learning'], visual: { radius: .7, atmosphere: false }, children: [
    { ...branch('languages', 'Languages', 'A World of Words', [leaf('chinese', 'Chinese', 'Chinese', 'language', 2018), leaf('english', 'English', 'English', 'language', 2018), { ...leaf('japanese', 'Japanese', 'Japanese', 'language', 2020), storyIds: ['japanese'] }, leaf('german', 'German', 'German', 'language', 2025)]), themeId: 'language', since: 2018 },
    { ...branch('it', 'Technology', 'The Art of Building', [
      branch('frontend', 'Frontend', 'Frontend', [leaf('html', 'HTML', 'HTML'), leaf('css', 'CSS', 'CSS'), leaf('javascript', 'JavaScript', 'JavaScript'), leaf('typescript', 'TypeScript', 'TypeScript'), { ...leaf('react', 'React', 'React'), children: [leaf('nextjs', 'Next.js', 'Next.js')] }, leaf('threejs', 'Three.js', 'Three.js')]),
      branch('backend', 'Backend', 'Backend', [leaf('python', 'Python', 'Python'), leaf('fastapi', 'FastAPI', 'FastAPI'), leaf('ruby', 'Ruby', 'Ruby'), leaf('rails', 'Rails', 'Rails'), leaf('nodejs', 'Node.js', 'Node.js')]),
      branch('cloud', 'Cloud & Infrastructure', 'Cloud', [leaf('aws', 'AWS', 'AWS'), leaf('docker', 'Docker', 'Docker'), leaf('cicd', 'CI/CD', 'CI/CD'), leaf('linux', 'Linux', 'Linux')]),
      branch('database', 'Databases', 'Database', [leaf('sql', 'SQL', 'SQL'), leaf('postgresql', 'PostgreSQL', 'PostgreSQL'), leaf('redis', 'Redis', 'Redis')]),
      branch('ai', 'Artificial Intelligence', 'Artificial Intelligence', [leaf('llm', 'Large Language Models', 'LLM'), leaf('rag', 'Retrieval-Augmented Generation', 'RAG'), leaf('agent', 'AI Agents', 'AI Agent')]),
    ]), since: 2022 },
  ],
};
const emotions: CelestialNode = { id: 'emotions', type: 'region', name: 'Inner Worlds', english: 'The Inner Worlds', themeId: 'solitude', description: 'Some experiences take more than a sentence to explain. These worlds leave a little room for them.', children: [
  { id: 'mercury', type: 'planet', name: 'Mercury · Adrift', english: 'The Drowned World', themeId: 'ocean', since: 2018, description: 'Sometimes finding your way starts with giving yourself permission to drift.', storyIds: ['adrift'], visual: { radius: 1.3 } },
  { id: 'mars', type: 'planet', name: 'Mars · Under Pressure', english: 'The Burning World', themeId: 'lava', since: 2020, description: 'A place for restless days, and for the possibilities that take shape when the pressure settles.', storyIds: ['adrift', 'burning'], visual: { radius: 1.2 } },
  { id: 'venus', type: 'planet', name: 'Venus · Warmth', english: 'The Tender World', themeId: 'warmth', since: 2021, description: 'Small, bright moments that make even the most unfamiliar place feel like home.', storyIds: ['warmth'], visual: { radius: 1.3 } },
  { id: 'jupiter', type: 'planet', name: 'Jupiter · Becoming', english: 'The Becoming World', themeId: 'growth', since: 2022, description: 'Learning to move through the storms and make room for who I might become.', storyIds: ['learning'], visual: { radius: 1.75 } },
  { id: 'saturn', type: 'planet', name: 'Saturn · Curiosity', english: 'The Curious World', themeId: 'discovery', since: 2023, description: 'Following questions, taking the long way around, and seeing what turns up.', visual: { radius: 1.45, rings: true } },
  { id: 'neptune', type: 'planet', name: 'Neptune · Stillness', english: 'The Silent World', themeId: 'solitude', since: 2024, description: 'Turning down the noise and listening to what remains.', storyIds: ['silence'], visual: { radius: 1.25 } },
  { id: 'uranus', type: 'planet', name: 'Uranus', english: 'Uranus', themeId: 'ice', description: 'A reminder that there is more than one way to find your rhythm.', visual: { radius: 1.15 } },
  { id: 'pluto', type: 'celestial-body', name: 'Pluto · New Beginnings', english: 'The Returning Light', themeId: 'rebirth', since: 2027, state: 'future', description: 'A place held open for what comes next. Every ending leaves room for a beginning.', visual: { radius: 0.8 } },
] };
export const universe: CelestialNode = { id: 'universe', type: 'galaxy', name: 'My Universe', english: 'My Universe', themeId: 'knowledge', description: 'Every planet holds a story.', children: [{ id: 'sun', type: 'star', name: 'Sun', english: 'The Sun', themeId: 'sun', description: 'I’m Jiahong Chen. Here’s a little about me and the things that make up my world.', visual: { radius: 1.8, atmosphere: false } }, emotions, { id: 'earth', type: 'planet', name: 'Travel Earth', english: 'Somewhere on Earth', themeId: 'earth', since: 2020, description: 'Places, small discoveries, and notes from along the way.', storyIds: ['tokyo'], visual: { radius: 1.6, rotationSpeed: 0.035 }, children: [knowledge] }] };
function attachParents(node: CelestialNode, parentId?: string): CelestialNode { return { ...node, parentId, children: node.children?.map(child => attachParents(child, node.id)) }; }
export const root = attachParents(universe);
export function flatten(node: CelestialNode): CelestialNode[] { return [node, ...(node.children?.flatMap(flatten) ?? [])]; }
export const nodes = flatten(root);
export const nodeById = Object.fromEntries(nodes.map(node => [node.id, node]));
export function ancestors(id: string): CelestialNode[] { const result: CelestialNode[] = []; let node: CelestialNode | undefined = nodeById[id]; while (node) { result.unshift(node); node = node.parentId ? nodeById[node.parentId] : undefined; } return result; }
// Physical orbits are configured separately in solar-system.ts; content remains recursive.
