import { useEffect } from "react";
import { profile } from "./data";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import ScrollLine from "./components/ScrollLine";
import { About, Contact, Experience, Featured, Hero, Projects, Skills } from "./components/Sections";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#featured", label: "Featured" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

// Fade sections in the first time they scroll into view
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// Smooth scrolling for wheel and anchor links, skipped for reduced motion
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 } });
    return () => lenis.destroy();
  }, []);
}

export default function App() {
  useSmoothScroll();
  useReveal();
  return (
    <>
      <header className="nav">
        <a className="brand" href="#top">
          ansh<span>.</span>gandhi
        </a>
        <nav>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>
      <main>
        <ScrollLine />
        <Hero />
        <About />
        <Featured />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer className="footer">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Built with React and Three.js</span>
      </footer>
    </>
  );
}
