import type { Story } from '@/types/universe';
// Only public content belongs in this module. Keep private drafts outside src/ and public/.
const example = { status: 'public', demo: true } as const;
export const stories: Story[] = [
  {
    id: 'curiosity-across-fields', title: 'Following My Curiosity',
    subtitle: 'Across disciplines, and deeper within them',
    summary: 'From English to Economics and IT, and from one language to another, I enjoy discovering new ways to understand the world.',
    date: { precision: 'unknown' }, emotionTags: ['Curiosity', 'Learning', 'Languages'],
    celestialNodeIds: ['saturn'], status: 'public', demo: false,
    paragraphs: [
      'I have a strong appetite for knowledge in all its forms. I majored in English as an undergraduate, studied Economics for my master’s degree, and now work in IT. I love the feeling of exploring different fields and discovering how each one offers a new way to see the world.',
      'That curiosity also leads me to keep exploring within a single field. Languages are one example: although I majored in English, I began teaching myself Japanese in junior high school and later came to Japan to study. During university, I also minored in German, and I am now learning Korean.',
      'For me, learning is a source of enjoyment in itself. There is always another subject to discover, another perspective to understand, or another language that opens a door.',
    ],
  },
  {
    id: 'beyond-competition', title: 'Beyond Competition',
    subtitle: 'Making room for fulfilment and happiness',
    summary: 'Growing up with intense competition, carrying that mindset to Japan, and gradually finding a different sense of purpose through working life.',
    date: { precision: 'unknown' }, emotionTags: ['Pressure', 'Self-realisation', 'Happiness'],
    celestialNodeIds: ['mars'], status: 'public', demo: false,
    paragraphs: [
      'From primary school through university, I lived within China’s high-pressure, competitive educational environment. That experience shaped my mindset so deeply that, even after I moved to Japan, I continued to approach life through competition for a while.',
      'After I started working, I gradually began to find a different sense of meaning in life. I came to believe that we live for self-realisation and for happiness.',
      'I want to give more space to becoming the person I want to be and enjoying my life. That is the direction I am gradually learning to follow.',
    ],
  },
  {"id": "learning", "title": "From Languages to Full-Stack Development", "subtitle": "Learning through real projects", "summary": "A background in English Literature and Applied Economics, followed by building and operating full-stack Web services.", "date": {"precision": "year", "value": "2025"}, "emotionTags": ["Learning", "Development"], "celestialNodeIds": ["knowledge"], "status": "public", "demo": false, "paragraphs": ["I studied English Literature at Sun Yat-sen University from 2019 to 2023, followed by a Master of Economics in Applied Economics at Osaka University from 2024 to 2026.", "Since January 2025, I have independently planned, designed, developed, deployed, and operated Web services. My Rails job-hunting support application was primarily developed from April to August 2025 and has reached more than 10,000 cumulative users. A Next.js learning platform developed in September–December 2025 has reached approximately 4,000 cumulative users.", "Since January 2026, I have handled the technical side of a two-person Next.js/FastAPI platform, covering system design, frontend and backend development, database and API design, and deployment and operation. The service evolved into an IT learning platform, where I currently support three bootcamp students.", "I joined Tata Consultancy Services as a Software Engineer in Tokyo in April 2026, working on full-stack Web development for a major Japanese automotive-sector client. My other projects include a Django team project, a RAG learning assistant, and a distributed consultation booking service."]},
  {"id": "japanese", "title": "Japanese Writing and Cultural Exchange", "subtitle": "From an essay to an exchange in Japan", "summary": "My 2018 Japanese essay competition experience, cultural exchange, and subsequent professional use of Japanese.", "date": {"precision": "year", "value": "2018"}, "emotionTags": ["Japanese", "Writing", "Cultural Exchange"], "celestialNodeIds": ["japanese"], "status": "public", "demo": false, "paragraphs": ["In 2018, I entered the Japanese Essay Competition for Chinese High School Students with an essay on the theme “My Dream.” I received First Prize, then the Special Prize after attending the award ceremony and second-round selection in Beijing. The organiser was the Tokyo Ueno Rotary Club.", "As a Special Prize recipient, I joined an eight-day exchange programme in Japan, visiting Rikuzentakata in Iwate Prefecture and Tokyo. The local exchanges deepened my understanding of Japanese society and culture.", "My Japanese proficiency is at a full professional level, with a JLPT N1 score of 161. During my June–September 2022 ByteDance internship, I supported Japanese-market product localisation through user interviews, market research, competitor analysis, and feedback to product and development teams."]},
  { ...example, id: 'tokyo', title: 'The Pull of a City', subtitle: 'A postcard from Tokyo', summary: 'Finding a new kind of everyday life on unfamiliar streets.', date: { precision: 'year', value: '2025' }, emotionTags: ['Travel', 'Discovery'], celestialNodeIds: ['earth'], paragraphs: ['The memory of a city is not always a landmark. Sometimes it is the light around a corner, a train caught just in time, or a walk with no particular destination.', 'This is a sample travel entry, not a claim that I have visited Tokyo. Personal dates, photographs, and journal entries will be added later.'] },
];
export const storyById = Object.fromEntries(stories.filter(s => s.status === 'public').map(story => [story.id, story]));
