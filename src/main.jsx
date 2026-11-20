import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { contact, projects, skillGroups } from './content.jsx';
import './styles.css';

const sections = ['About', 'Skills', 'Projects', 'Certificates', 'Contact'];
const portraits = import.meta.glob('./assets/portrait.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' });
const portrait = Object.values(portraits)[0];
const certificates = Object.entries(import.meta.glob('./assets/certificates/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' }))
  .sort(([first], [second]) => second.localeCompare(first, undefined, { numeric: true }))
  .map(([path, src]) => ({ src, alt: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') }));
const certificatePdfs = Object.entries(import.meta.glob('./assets/certificates/*.pdf', { eager: true, import: 'default' }));
const certificatePreviews = import.meta.glob('./assets/certificates/previews/*.png', { eager: true, import: 'default' });

const symbols = {
  code: '‹/›',
  database: '▤',
  spark: '✦',
  tools: '⌘',
  calendar: '▦',
  book: '▣',
  photo: '▧',
};

function Symbol({ name, className = '' }) {
  return <span className={className} aria-hidden="true">{symbols[name]}</span>;
}

function SectionTitle({ id, children }) {
  return <h2 id={id} className="section-title"><Symbol name="spark" />{children}</h2>;
}

function About() {
  return (
    <section id="about" className="hero wrap" aria-labelledby="intro">
      <div className="hero-copy">
        <p className="eyebrow"><span /> IT Student · Pasay City, PH</p>
        <h1 id="intro">Maeden <em>Navarro<span>.</span></em></h1>
        <p className="intro">I’m a full-stack developer and a BS Information Technology student at National University MOA, specializing in <strong>Mobile and Web Applications.</strong> I enjoy building apps that make everyday tasks easier, and I’m eager to learn new tools and grow as a developer through hands-on projects.</p>
        <div className="actions">
          <a className="button primary" href="#projects">Explore my projects</a>
          <a className="button secondary" href="#contact">Get in touch</a>
        </div>
      </div>
      <figure className="portrait">
        <Symbol name="spark" className="portrait-spark" />
        <div className="portrait-frame">
          {portrait ? <img src={portrait} alt="Maeden Navarro" /> : <div className="portrait-placeholder"><Symbol name="photo" /><span>Portrait goes here</span></div>}
        </div>
        <figcaption>Maeden Navarro</figcaption>
      </figure>
    </section>
  );
}

function Certificates() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef(null);
  const visibleCertificates = expanded ? certificates : certificates.slice(0, 2);

  function openCertificate(certificate) {
    setSelected(certificate);
    dialog.current.showModal();
  }

  return (
    <section id="certificates" className="section wrap" aria-labelledby="certificates-title">
      <SectionTitle id="certificates-title">Certificates</SectionTitle>
      {certificates.length || certificatePdfs.length ? (
        <div id="certificate-list" className="certificate-grid">
          {visibleCertificates.map(certificate => (
            <button className="certificate-tile" key={certificate.src} onClick={() => openCertificate(certificate)} aria-label={`Enlarge ${certificate.alt}`}>
              <img loading="lazy" {...certificate} />
            </button>
          ))}
          {certificatePdfs.map(([path, href]) => {
            const filename = path.split('/').pop();
            const name = filename.replace(/\.pdf$/, '');
            const preview = certificatePreviews[`./assets/certificates/previews/${name}.png`];

            return (
              <a className="certificate-tile certificate-pdf" key={path} href={href} target="_blank" rel="noreferrer"
                aria-label={`Open ${name} certificate PDF (opens in a new tab)`}>
                {preview ? <img src={preview} alt="" loading="lazy" /> : filename}
              </a>
            );
          })}
        </div>
      ) : (
        <div className="certificate-empty"><Symbol name="photo" /><p>Certificate photos coming soon</p></div>
      )}
      {certificates.length > 2 && (
        <div className="actions">
          <button
            className="button secondary"
            type="button"
            aria-expanded={expanded}
            aria-controls="certificate-list"
            onClick={() => setExpanded(value => !value)}
          >
            {expanded ? 'Show Fewer Certificates' : 'View More Certificates'}
          </button>
        </div>
      )}
      <dialog ref={dialog} className="lightbox" onClose={() => setSelected(null)}>
        <form method="dialog"><button className="button secondary">Close</button></form>
        {selected && <img {...selected} />}
      </dialog>
    </section>
  );
}

function ProjectCard({ project, featured = false }) {
  return (
    <article className={featured ? 'project-card featured-project' : 'project-card'}>
      <div className={`project-art ${project.theme}`} aria-hidden="true"><Symbol name={project.icon} /></div>
      <div className="project-copy">
        <p className="project-type">{project.type}</p>
        <h3>{project.name}</h3>
        {featured && project.description && <p>{project.description}</p>}
        {project.adminInstruction && <p className="project-instruction">{project.adminInstruction}</p>}
        <div className="project-links">
          {project.links.map(link => (
            <a className="project-link" key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<span className="visually-hidden"> (opens in a new tab)</span></a>
          ))}
        </div>
      </div>
    </article>
  );
}

function Projects() {
  const [expanded, setExpanded] = useState(false);
  const capstone = projects.find(project => project.featured);

  return (
    <section id="projects" className="section wrap" aria-labelledby="projects-title">
      <SectionTitle id="projects-title">Projects</SectionTitle>
      <ProjectCard project={capstone} featured />
      <div className="actions">
        <button
          className="button secondary"
          type="button"
          aria-expanded={expanded}
          aria-controls="all-projects"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Fewer Projects' : 'View More Projects'}
        </button>
      </div>
      <div id="all-projects" hidden={!expanded}>
        <div className="project-grid">
          {projects.map(project => <ProjectCard key={project.name} project={project} />)}
        </div>
      </div>
    </section>
  );
}

function App() {
  const contactLinks = [
    ...contact.emails.map(email => [email, `mailto:${email}`]),
    ['LinkedIn', contact.linkedin],
    ['JobStreet', contact.jobstreet],
    ['GitHub', contact.github],
  ].filter(([, href]) => href);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="header">
        <div className="wrap header-inner">
          <a className="wordmark" href="#about" aria-label="Maeden Navarro, About">mn<span>.</span></a>
          <nav aria-label="Main navigation">
            {sections.map(section => <a key={section} href={`#${section.toLowerCase()}`}>{section}</a>)}
          </nav>
        </div>
      </header>
      <main id="main">
        <About />
        <section id="skills" className="section skill-section" aria-labelledby="skills-title">
          <div className="wrap">
            <SectionTitle id="skills-title">Skills</SectionTitle>
            <div className="skill-grid">
              {skillGroups.map(group => (
                <article className="skill-card" key={group.title}>
                  <div className="skill-heading"><Symbol name={group.icon} className="mini-icon" /><h3>{group.title}</h3></div>
                  <ul className="tags">{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>
        <Projects />
        <Certificates />
        <section id="contact" className="section wrap" aria-labelledby="contact-title">
          <div className="contact-panel">
            <SectionTitle id="contact-title">Contact</SectionTitle>
            <p>I’m interested in internships and student collaborations in mobile and web development.</p>
            {contactLinks.length ? (
              <div className="actions">{contactLinks.map(([label, href]) => <a className="button secondary" key={label} href={href}>{label}</a>)}</div>
            ) : <p className="contact-note">Contact links coming soon.</p>}
          </div>
        </section>
      </main>
      <footer className="wrap footer"><span>Maeden Navarro</span><a href="#about">Back to top</a></footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
