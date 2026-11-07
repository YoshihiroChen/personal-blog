export type FleetHullKind = 'flagship' | 'research' | 'communications';
export type FleetShipId = FleetHullKind | 'frontend-platform' | 'learning-platform' | 'django-service' | 'rag-assistant' | 'booking-system' | 'personal-blog';
export type WorkProjectId = Exclude<FleetShipId,'flagship'>;
export interface FleetShip {
  id: FleetShipId; kind: FleetHullKind; name: string; role: string; accent: string; code: string;
  position: [number,number,number]; scale: number;
}
export const fleetShips: FleetShip[] = [
  {id:'flagship',kind:'flagship',name:'My Works',role:'Portfolio introduction',accent:'#d9c39b',code:'JC / 001',position:[0,.25,3],scale:.8},
  {id:'research',kind:'research',name:'Job Hunting Support',role:'Personal development · Rails full stack · Apr–Aug 2025',accent:'#96c8dc',code:'JC / 002',position:[-2.8,0,0],scale:.52},
  {id:'communications',kind:'communications',name:'My Dream: A Japanese Essay',role:'Individual entry · Japanese writing · 2018',accent:'#dfb58c',code:'JC / 003',position:[2.8,0,0],scale:.52},
  {id:'frontend-platform',kind:'research',name:'IT Learning Platform',role:'Personal development · Next.js / React · Sep–Dec 2025',accent:'#a5c4b4',code:'JC / 004',position:[-3.6,0,-3],scale:.5},
  {id:'learning-platform',kind:'research',name:'IT Learning & Bootcamp',role:'Team development · Next.js / FastAPI · Jan 2026–Present',accent:'#b1b9dc',code:'JC / 005',position:[3.6,0,-3],scale:.52},
  {id:'django-service',kind:'research',name:'Financial Web Service',role:'Team development (lead) · Django · May 2026–Present',accent:'#b5c996',code:'JC / 006',position:[-4,0,-6],scale:.5},
  {id:'rag-assistant',kind:'research',name:'IT Study AI assistant',role:'Personal development · RAG engineering · Jun 2026–Present',accent:'#a4d4cf',code:'JC / 007',position:[0,0,-6],scale:.5},
  {id:'booking-system',kind:'research',name:'Career Consultation Booking',role:'Personal development · Next.js / FastAPI / Distributed systems · Aug 2026–Present',accent:'#d4b59f',code:'JC / 008',position:[4,0,-6],scale:.55},
  {id:'personal-blog',kind:'research',name:'Personal Blog',role:'Personal development · Next.js / React / Three.js · 2026–Present',accent:'#c2a9ec',code:'JC / 009',position:[0,0,-3],scale:.5},
];
/** Only the original three ships form the single solar-map entry. */
export const solarFleetShips: FleetShip[] = fleetShips.slice(0,3).map((ship,index)=>({
  ...ship,position:([[0,.35,0],[-2.7,-.4,2.4],[2,.15,1.6]] as [number,number,number][])[index],scale:[1,.64,.68][index],
}));
export const fleetShipById = Object.fromEntries(fleetShips.map(ship=>[ship.id,ship])) as Record<FleetShipId,FleetShip>;
export function isFleetShipId(id:string):id is FleetShipId{return fleetShips.some(ship=>ship.id===id);}
export interface WorkProject {title:string;category:'IT PROJECT'|'LANGUAGE PROJECT';intro:string;sections:{title:string;text:string}[];url?:string;status?:string}
export const workProjects: Record<WorkProjectId,WorkProject> = {
  'personal-blog':{title:'Personal Blog',category:'IT PROJECT',intro:'My Universe — the personal website you are exploring now. An independently developed, interactive portfolio that connects my identity, knowledge, work, and travels through a shared universe.',sections:[
    {title:'Design philosophy',text:'A personal website can be a place to explore, rather than only a page to scroll. The solar system brings different parts of my life into one navigable world: the Sun introduces me, the Moon holds knowledge and skills, Earth records places and experiences, and a fleet carries the things I have made.'},
    {title:'Knowledge as a landscape',text:'Learning becomes a journey from the lunar surface into Technology and Languages facilities, then into rooms, workstations, and field notes. This spatial hierarchy connects broad interests with the individual ideas I am studying.'},
    {title:'Work and lived experience',text:'Each project travels aboard its own vessel, with a distinct silhouette and mission equipment. Travel Earth connects personal memories to geographic locations. The universe is a growing record of learning, building, and encountering different cultures.'},
    {title:'Interaction and accessibility',text:'Camera transitions, orbital motion, lighting, and procedural surfaces create a sense of discovery. Search, breadcrumbs, touch controls, reduced motion, adjustable quality, and text archives provide alternative ways to find and read content.'},
    {title:'Technology and delivery',text:'Next.js, React, TypeScript, Three.js, React Three Fiber, Drei, GSAP, and Zustand. Static export hosted on Vercel, with browser-rendered 3D scenes and reusable, data-driven content structures.'},
    {title:'My role & timeline',text:'Personal development: concept, information architecture, interface design, frontend implementation, procedural 3D visuals, and deployment. Developed in 2026 and continuously evolving.'},
  ]},
  research:{title:'Job Hunting Support',category:'IT PROJECT',intro:'An independently planned, designed, developed, deployed, and operated job-hunting support Web application for international students. Main development: April–August 2025, followed by ongoing improvements.',sections:[
    {title:'My role',text:'Sole developer, responsible for service planning, frontend and backend development, database design, infrastructure, release, and operation.'},
    {title:'Features',text:'Self-assessment tools, industry research, a job-role database, AI-assisted application essay generation, and job-hunting schedule management, built on Rails MVC.'},
    {title:'Technology',text:'Ruby on Rails, HTML, CSS, JavaScript, Bootstrap, SQLite3, AWS EC2, Nginx, Puma, Git, GitHub, and Google Analytics.'},
    {title:'Impact',text:'More than 10,000 cumulative users. Continued post-launch improvements based on usage analysis and user feedback.'},
  ],url:'https://job-hunting-jp.com/'},
  communications:{title:'My Dream: A Japanese Essay',category:'LANGUAGE PROJECT',intro:'A Japanese essay on the theme “My Dream,” entered in the Japanese Essay Competition for Chinese High School Students in 2018.',sections:[
    {title:'Recognition',text:'Received First Prize, then the Special Prize after the award ceremony and second-round selection in Beijing. Organiser: Tokyo Ueno Rotary Club.'},
    {title:'Exchange in Japan',text:'Joined an eight-day exchange programme as a Special Prize recipient, visiting Rikuzentakata in Iwate Prefecture and Tokyo. Local exchanges deepened my understanding of Japanese society and culture.'},
    {title:'Language in practice',text:'Japanese writing and cross-cultural communication. The essay itself has not been published on this site.'},
  ]},
  'frontend-platform':{title:'IT Learning Platform',category:'IT PROJECT',intro:'A personal Next.js project providing IT job-search learning resources for Chinese international students. Main development: September–December 2025, followed by ongoing operation.',sections:[
    {title:'My role',text:'Independently planned and designed the service, developed its frontend and UI/UX, and handled deployment, release, and operation on AWS EC2 and Vercel.'},
    {title:'Features',text:'Learning materials, technical roadmaps, and exercises designed to support more effective, consistent preparation for IT job searches.'},
    {title:'Impact',text:'Approximately 4,000 cumulative users. Continued improvement based on usage and user feedback.'},
    {title:'Technology',text:'Next.js, React, TypeScript, HTML, CSS, Tailwind CSS, AWS EC2, Vercel, Git, and GitHub.'},
  ],url:'https://it-study-program.vercel.app/'},
  'learning-platform':{title:'IT Learning & Bootcamp',category:'IT PROJECT',intro:'A two-person Next.js/FastAPI service developed since January 2026. Initially a graduate-school information platform for Chinese international students, it evolved into a paid learning platform for people seeking IT jobs in Japan.',sections:[
    {title:'My role',text:'Technical lead responsible for system design, frontend and backend development, database and API design, deployment, and operation. My collaborator handles market research, service planning, and product design.'},
    {title:'Learning content',text:'Materials and roadmaps covering frontend, backend, databases, cloud infrastructure, and system design, organised from my own full-stack learning and practical experience.'},
    {title:'Current operation',text:'Running an IT job-search bootcamp with three students, providing learning support and improving the service based on their feedback.'},
    {title:'Technology',text:'Next.js, React, TypeScript, FastAPI, Python, PostgreSQL, SQLAlchemy, Tailwind CSS, Docker, AWS EC2, Vercel, Git, and GitHub.'},
  ],url:'https://it.injapans.com/'},
  'django-service':{title:'Financial Web Service',category:'IT PROJECT',intro:'Leading a four-person team developing a financial-sector Web service with Django since May 2026. The project is in MVP development and preparing for market validation.',status:'MVP IN DEVELOPMENT',sections:[
    {title:'Team leadership',text:'Led service ideation and planning following team discussions and market research, then guided the technical selection and established a Python/Django development approach.'},
    {title:'Development progress',text:'Currently developing the frontend-focused MVP. Backend functionality is being implemented progressively, with feedback informing feature and quality improvements ahead of a formal release.'},
    {title:'Technology & environment',text:'Python, Django, HTML, CSS, JavaScript, Git, and GitHub. Development is currently local; no public service link is listed.'},
  ]},
  'rag-assistant':{title:'IT Study AI assistant',category:'IT PROJECT',intro:'An AI learning assistant integrated into my IT learning platform, in development since June 2026. Retrieval-augmented generation connects answers to the platform’s course materials.',sections:[
    {title:'Knowledge pipeline',text:'Chunked and embedded course materials into a searchable knowledge base. Retrieves relevant material for a question, then uses a large language model to generate learning-focused answers.'},
    {title:'Ongoing work',text:'Continuing to improve prompts, retrieval logic, chunk splitting, embedding generation, and answer quality.'},
    {title:'Technology',text:'Python, FastAPI, OpenAI API, RAG, pgvector, PostgreSQL, SQLAlchemy, Docker, Next.js, React, TypeScript, AWS EC2, Vercel, Git, and GitHub.'},
  ],url:'https://jp-sns-mvp.vercel.app/ai-study'},
  'booking-system':{title:'Career Consultation Booking',category:'IT PROJECT',intro:'A personal high-concurrency, distributed career-consultation booking service, developed since August 2026. Responsible for planning, development, three-server deployment, monitoring, and operation.',status:'SERVICE PAUSED · HOSTING COSTS',sections:[
    {title:'Booking experience',text:'Booking and administration screens; creating, publishing, and deleting slots; automatic weekly publishing; booking and cancellation; and Google Calendar, Google Meet, and Gmail integration.'},
    {title:'Concurrency & reliability',text:'Combined Redis slot locking, idempotency keys, rate limiting, and PostgreSQL uniqueness constraints. Verified exactly one successful booking from 100 concurrent requests for the same slot. RabbitMQ, Transactional Outbox, and Consumer Inbox support reliable, idempotent asynchronous notifications.'},
    {title:'Infrastructure',text:'Distributed the Booking API across two AWS EC2 instances and one Google Cloud VM. Set up Nginx load balancing and HTTPS, Docker operation, Prometheus monitoring, and GitHub Actions quality checks and image builds. Verified failover, backups, and restore procedures.'},
    {title:'Usage & availability',text:'Used for real bookings and consultations by at least 10 cumulative participants. The service is currently paused to reduce hosting costs.'},
    {title:'Technology',text:'Python, FastAPI, Next.js, React, TypeScript, PostgreSQL, Redis, RabbitMQ, SQLAlchemy, Alembic, Docker, Nginx, Prometheus, AWS EC2, Google Cloud VM, Vercel, Google Calendar API, Gmail API, Git, GitHub, and GitHub Actions.'},
  ],url:'https://cs.injapans.com/'},
};
