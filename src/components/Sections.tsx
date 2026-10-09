import { lazy, Suspense } from "react";
import {
  about,
  education,
  experience,
  featured,
  gatewayStats,
  leadership,
  profile,
  projects,
  skills,
} from "../data";

// Loaded separately so the text renders before Three.js downloads
const CharacterScene = lazy(() => import("./CharacterScene"));
const GatewayScene = lazy(() => import("./GatewayScene"));

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-text">
        <p className="eyebrow">
          {profile.role} · {profile.company}
        </p>
        <h1>{profile.name}</h1>
        <p className="lead">{profile.tagline}</p>
        <div className="hero-actions">
          <a className="button primary" href={`mailto:${profile.email}`}>
            Get in touch
          </a>
          <a className="button" href="#experience">
            See my work
          </a>
        </div>
      </div>
      <Suspense fallback={null}>
        <CharacterScene />
      </Suspense>
    </section>
  );
}

function SectionTitle({ index, children }: { index: string; children: string }) {
  return (
    <h2 className="section-title">
      <span>{index}</span>
      {children}
    </h2>
  );
}

export function About() {
  return (
    <section id="about" className="section reveal">
      <SectionTitle index="01">About</SectionTitle>
      <div className="about-grid">
        <div className="prose">
          {about.map((para) => (
            <p key={para.slice(0, 20)}>{para}</p>
          ))}
        </div>
        <aside className="card">
          <h3>Education</h3>
          <p className="strong">{education.school}</p>
          <p>{education.degree}</p>
          <p className="muted">
            {education.period} · {education.grade}
          </p>
          <h3>Beyond code</h3>
          <ul className="plain">
            {leadership.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

export function Featured() {
  return (
    <section id="featured" className="section reveal">
      <SectionTitle index="02">Featured</SectionTitle>
      <div className="featured-grid">
        <div>
          <h3 className="featured-name">{featured.name}</h3>
          <p className="featured-text">{featured.description}</p>
          <dl className="stats">
            {gatewayStats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
          <ul className="tags">
            {featured.stack.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
        <figure className="gateway-figure">
          <div className="scene-canvas">
            <Suspense fallback={null}>
              <GatewayScene />
            </Suspense>
          </div>
          <figcaption>
            <span className="dot request" /> requests
            <span className="dot response" /> responses
            <span className="caption-note">illustration of the AI gateway</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section reveal">
      <SectionTitle index="03">Experience</SectionTitle>
      <ol className="timeline">
        {experience.map((job) => (
          <li key={job.company} className="job">
            <div className="job-head">
              <div>
                <h3>{job.role}</h3>
                <p className="company">{job.company}</p>
              </div>
              <p className="period">{job.period}</p>
            </div>
            {job.note && <p className="muted small">{job.note}</p>}
            <ul>
              {job.points.map((point) => (
                <li key={point.slice(0, 30)}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section reveal">
      <SectionTitle index="04">Projects</SectionTitle>
      <div className="project-grid">
        {projects.map((project) => (
          <article key={project.name} className="card project">
            <h3>{project.name}</h3>
            <p>{project.summary}</p>
            <ul className="tags">
              {project.stack.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
        More on GitHub →
      </a>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section reveal">
      <SectionTitle index="05">Skills</SectionTitle>
      <div className="skills-grid">
        {skills.map((group) => (
          <div key={group.group}>
            <h3>{group.group}</h3>
            <ul className="tags">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section contact reveal">
      <SectionTitle index="06">Contact</SectionTitle>
      <p className="contact-lead">
        Working on AI agents or LLM infrastructure? I'd like to hear about it.
      </p>
      <a className="contact-email" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <div className="contact-links">
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span className="muted">{profile.location}</span>
      </div>
    </section>
  );
}
