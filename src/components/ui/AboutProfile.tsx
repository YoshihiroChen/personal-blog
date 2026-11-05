import Link from 'next/link';

export default function AboutProfile() {
  return (<>
      <span className="panel-kicker">THE SUN / ABOUT ME</span><h2>Hi, I’m Jiahong Chen.</h2>
      <p className="panel-description">I’m a Tokyo-based software engineer working across frontend, backend, and cloud infrastructure. My background brings together applied economics, languages, and hands-on product development.</p>
      <div className="profile-sections"><section><h3>Experience</h3>
      <p><strong>Tata Consultancy Services · Software Engineer</strong><br/>April 2026–Present · Tokyo, Japan<br/>Full-stack Web application development for a major Japanese automotive-sector client, covering frontend, backend, and cloud environments.</p>
      <p><strong>Independent Development · Full-Stack Engineer</strong><br/>January 2025–Present · Tokyo, Japan<br/>Planning, designing, building, deploying, and operating Web services from the ground up, including frontend, backend, databases, and cloud infrastructure. Experience taking multiple services from an initial idea to real users and ongoing operation.</p>
      <p><strong>ByteDance · Intern</strong><br/>June–September 2022 · Beijing, China<br/>Supported product localisation and expansion into the Japanese market through user interviews, market research, and competitor analysis. Shared findings with product and development teams to inform improvements.</p></section>
      <section><h3>Education</h3><p><strong>Osaka University · Master of Economics</strong><br/>Applied Economics · 2024–2026</p><p><strong>Sun Yat-sen University · English Literature</strong><br/>School of International Studies · 2019–2023</p></section>
      <section><h3>Languages &amp; qualifications</h3>
      <p>Chinese: native or bilingual proficiency.<br/>Japanese: full professional proficiency.<br/>English: full professional proficiency.<br/>German: professional working proficiency.</p>
      <p>JLPT N1: 161<br/>TOEFL: 104 (April 2023)<br/>IELTS: 7.5<br/>Goethe-Zertifikat B2<br/>GRE: 322 (October 2022)<br/>AWS Cloud Practitioner</p><Link href="/planets/knowledge/">Explore my knowledge &amp; skills →</Link></section>
      <section><h3>Get in touch</h3><p><a href="mailto:keichenastra@gmail.com">keichenastra@gmail.com</a></p><p><a href="https://www.linkedin.com/in/jiahong-chen-336ab43a5/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></p></section></div>

  </>);
}
