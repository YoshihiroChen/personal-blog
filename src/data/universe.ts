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
const skillNotes: Record<string, string> = {
  "languages": "Chinese: native or bilingual proficiency. Japanese and English: full professional proficiency. German: professional working proficiency. Qualifications include JLPT N1 (161), TOEFL (104), IELTS (7.5), and Goethe-Zertifikat B2.",
  "chinese": "Native or bilingual proficiency in Chinese.",
  "english": "Full professional proficiency. Studied English Literature at Sun Yat-sen University from 2019 to 2023. TOEFL: 104, issued by ETS in April 2023; IELTS: 7.5, British Council. GRE: 322, issued by ETS in October 2022.",
  "japanese": "Full professional proficiency. JLPT N1: 161, awarded by the Japan Foundation and Japan Educational Exchanges and Services. Received First Prize and then the Special Prize in a 2018 Japanese essay competition, followed by an eight-day exchange in Japan. Supported Japanese-market localisation during a ByteDance internship in 2022.",
  "german": "Professional working proficiency. Goethe-Zertifikat B2, Goethe-Institut.",
  "it": "Full-stack Web development across frontend, backend, databases, cloud deployment, and operation. Independent product development since January 2025; Software Engineer at Tata Consultancy Services since April 2026.",
  "frontend": "Built and operated Web interfaces with Next.js, React, TypeScript, HTML, CSS, JavaScript, Tailwind CSS, and Bootstrap. A Next.js learning platform developed in September–December 2025 has reached approximately 4,000 cumulative users.",
  "html": "Used in the Rails job-hunting application, the Next.js learning platform, and the ongoing Django team project.",
  "css": "Used for UI development across Rails, Next.js, and Django projects, including Bootstrap and Tailwind CSS.",
  "javascript": "Used in frontend development for the Rails service, Next.js interfaces, and the Django team project.",
  "typescript": "Used with Next.js and React for learning platforms, the RAG study assistant, and the distributed career-consultation booking service.",
  "react": "Used with Next.js for Web interfaces, including learning content, a study assistant, booking screens, and administration screens.",
  "nextjs": "Used in a frontend-focused personal project in September–December 2025, reaching approximately 4,000 cumulative users. Since January 2026, responsible for the technical side of a two-person Next.js/FastAPI service, now an IT learning platform supporting a three-student bootcamp. Also used for booking and RAG assistant interfaces.",
  "threejs": "This personal website uses Three.js for its interactive 3D scenes.",
  "backend": "Backend and API development with Ruby on Rails, Python, FastAPI, Django, and SQLAlchemy. Experience with MVC, microservices, asynchronous messaging, and API/database design. Leading a four-person Django financial-services project since May 2026; its frontend-focused MVP is in development, with backend functionality being implemented progressively.",
  "python": "Used with FastAPI, Django, SQLAlchemy, and AI/RAG services. Python projects include an IT learning platform, a distributed booking service, an AI study assistant, and a four-person Django team project.",
  "fastapi": "Responsible for system design, frontend/backend development, database and API design, deployment, and operation of a two-person Next.js/FastAPI platform since January 2026. Also built microservices for a distributed booking system and a RAG study assistant.",
  "ruby": "Used Ruby through Ruby on Rails to independently plan, build, deploy, and operate a job-hunting support Web application for international students. Main development: April–August 2025.",
  "rails": "Independently built a full-stack job-hunting support service using Rails MVC. Features include self-assessment, industry analysis, a job-role database, AI-assisted application essay generation, and schedule management. Main development: April–August 2025; subsequent operation and iteration brought the service to more than 10,000 cumulative users. Stack: Rails, HTML/CSS/JavaScript, Bootstrap, SQLite3, AWS EC2, Nginx, Puma, Git/GitHub, and Google Analytics. Website: https://job-hunting-jp.com/",
  "nodejs": "A topic reserved for future notes. No separate Node.js backend project is listed in this profile.",
  "cloud": "Deployed and operated services using AWS EC2, Google Cloud VM, Vercel, Docker, Nginx, and Prometheus. The career-consultation booking service used three servers: two AWS EC2 instances and one Google Cloud VM. It was used for bookings and consultations by at least 10 participants and is currently paused to reduce hosting costs. AWS Cloud Practitioner qualification.",
  "aws": "AWS Cloud Practitioner qualification. Practical AWS EC2 experience deploying and operating Rails and FastAPI services, including two Booking API instances in a three-server AWS/GCP deployment.",
  "docker": "Used for containerised development and operation of FastAPI, Next.js, the RAG assistant, and the distributed booking service.",
  "cicd": "Used Git and GitHub across projects. Set up GitHub Actions quality checks and container image builds for the distributed booking system, alongside deployment, monitoring, failover, and backup/restore verification.",
  "linux": "Server deployment and operation with AWS EC2 and Google Cloud VM, Nginx load balancing and HTTPS, Puma, Docker, and Prometheus. Verified failover and backup/restore procedures for a distributed booking service.",
  "database": "Database design using SQLite3 and PostgreSQL, SQLAlchemy/Alembic, Redis, and pgvector. Combined database constraints, locking, and idempotency to protect bookings; used RabbitMQ with Transactional Outbox and Consumer Inbox for reliable, idempotent asynchronous notifications.",
  "sql": "Database design for full-stack services using SQLite3 and PostgreSQL. Used SQLAlchemy and Alembic for data access and migrations, and PostgreSQL uniqueness constraints to help prevent duplicate bookings.",
  "postgresql": "Used for learning-platform and booking data, with SQLAlchemy and Alembic. PostgreSQL uniqueness constraints helped enforce a single successful booking in a test of 100 concurrent requests. Used pgvector to store searchable embeddings for the RAG study assistant.",
  "redis": "Implemented booking-slot locking and rate limiting. Combined Redis, idempotency keys, and PostgreSQL uniqueness constraints to verify that 100 simultaneous booking requests for one slot resulted in exactly one successful booking.",
  "ai": "Developing a RAG-based AI learning assistant since June 2026, connected to course materials on an IT learning platform. Built material chunking, embeddings, retrieval, and LLM answer generation; continuing to improve retrieval logic, prompts, chunking, and response quality.",
  "llm": "Integrated LLM-based answer generation through the OpenAI API in a course-material-aware learning assistant. Also implemented AI-assisted application essay generation in the Rails job-hunting service.",
  "rag": "Built a searchable knowledge base by chunking and embedding course materials, retrieving relevant passages for a question, and using an LLM to generate a learning-focused response. Stack includes Python, FastAPI, OpenAI API, pgvector, PostgreSQL, SQLAlchemy, Docker, Next.js, React, TypeScript, AWS EC2, and Vercel. Continued development since June 2026.",
  "agent": "A topic reserved for future notes. The AI project currently described here is a RAG learning assistant; no autonomous-agent project is claimed."
};
const leaf = (id: string, name: string, english: string, themeId: ThemeId = 'technology', since = 2025): CelestialNode => ({ id, type: 'moon', name, english, themeId, since, description: skillNotes[id] ?? `Notes and project experience with ${english}.`, visual: { radius: 0.8 } });
const branch = (id: string, name: string, english: string, children: CelestialNode[]): CelestialNode => ({ ...leaf(id, name, english), type: 'planet', children, visual: { radius: 1.3 } });
const knowledge: CelestialNode = {
  id: 'knowledge', type: 'moon', name: 'Moon · Knowledge & Growth', english: 'The Moon · Knowledge', themeId: 'moon', since: 2018,
  description: 'My knowledge and skills across full-stack development, cloud infrastructure, AI-assisted learning, and four languages. Explore the bases for project experience and qualifications.',
  storyIds: ['learning'], visual: { radius: .7, atmosphere: false }, children: [
    { ...branch('languages', 'Languages', 'A World of Words', [leaf('chinese', 'Chinese', 'Chinese', 'language', 2018), leaf('english', 'English', 'English', 'language', 2018), { ...leaf('japanese', 'Japanese', 'Japanese', 'language', 2018), storyIds: ['japanese'] }, leaf('german', 'German', 'German', 'language', 2025)]), themeId: 'language', since: 2018 },
    { ...branch('it', 'Technology', 'The Art of Building', [
      branch('frontend', 'Frontend', 'Frontend', [leaf('html', 'HTML', 'HTML'), leaf('css', 'CSS', 'CSS'), leaf('javascript', 'JavaScript', 'JavaScript'), leaf('typescript', 'TypeScript', 'TypeScript'), { ...leaf('react', 'React', 'React'), children: [leaf('nextjs', 'Next.js', 'Next.js')] }, leaf('threejs', 'Three.js', 'Three.js')]),
      branch('backend', 'Backend', 'Backend', [leaf('python', 'Python', 'Python'), leaf('fastapi', 'FastAPI', 'FastAPI'), leaf('ruby', 'Ruby', 'Ruby'), leaf('rails', 'Rails', 'Rails'), leaf('nodejs', 'Node.js', 'Node.js')]),
      branch('cloud', 'Cloud & Infrastructure', 'Cloud', [leaf('aws', 'AWS', 'AWS'), leaf('docker', 'Docker', 'Docker'), leaf('cicd', 'CI/CD', 'CI/CD'), leaf('linux', 'Linux', 'Linux')]),
      branch('database', 'Databases', 'Database', [leaf('sql', 'SQL', 'SQL'), leaf('postgresql', 'PostgreSQL', 'PostgreSQL'), leaf('redis', 'Redis', 'Redis')]),
      branch('ai', 'Artificial Intelligence', 'Artificial Intelligence', [leaf('llm', 'Large Language Models', 'LLM'), leaf('rag', 'Retrieval-Augmented Generation', 'RAG'), leaf('agent', 'AI Agents', 'AI Agent')]),
    ]), since: 2025 },
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
