// All site content lives here, so text can be edited without touching components.

export const profile = {
  name: "Ansh Gandhi",
  role: "Software Development Engineer",
  company: "Bajaj Finance",
  location: "Pune, India",
  email: "ansh21000@gmail.com",
  github: "https://github.com/ansh-g-01",
  linkedin: "https://www.linkedin.com/in/ansh-gandhi-2906a2248/",
  // Served from public/; replace that file to update the resume
  resume: "/Ansh_Gandhi_Resume.pdf",
  tagline:
    "I build agentic systems, full-stack software and AI platform infrastructure: the whole bundle, so that automations ship and products land well.",
};

export const featured = {
  name: "AI Gateway at Bajaj",
  description:
    "I upgraded and extended the company's AI gateway, built on LiteLLM: one OpenAI-compatible API in front of 2,000+ models from 100+ providers, with role-based access control, batch processing and realtime voice on top.",
  stack: ["Python", "FastAPI", "LiteLLM", "Azure AD SSO", "ArgoCD"],
};

// Gateway figures as of the last 30 days, from the verified profile
export const gatewayStats = [
  { value: "2,000+", label: "models behind one API" },
  { value: "100+", label: "model providers" },
  { value: "8.5M+", label: "requests in 30 days" },
  { value: "$25K+", label: "model spend tracked in 30 days" },
];

export const about = [
  "I'm a Software Development Engineer at Bajaj Finance in Pune. Most of my work is on the company's AI gateway, which I upgraded and extended: one OpenAI-compatible API in front of 2,000+ models from 100+ providers, with access control, batch processing and realtime voice on top.",
  "I graduated with a B.Tech in Computer Science from VIT Vellore with a CGPA of 9.29. I'm most interested in AI agents and research-driven product engineering: prototyping how agents should talk to each other, then building the infrastructure that makes it practical.",
];

export type Job = {
  company: string;
  role: string;
  period: string;
  note?: string;
  points: string[];
};

export const experience: Job[] = [
  {
    company: "Bajaj Group",
    role: "Software Development Engineer",
    period: "Jan 2026 – Present",
    note: "Bajaj Finserv Health (SDE Intern Jan–Jun 2026, then SDE) · Bajaj Finance since Sep 2026",
    points: [
      "Upgraded and extended the company's AI gateway (Python, FastAPI, built on LiteLLM): one OpenAI-compatible API to 2,000+ models from 100+ providers, with 8.5M+ requests and $25K+ of model spend tracked over a period of 30 days.",
      "Added role-based access control with Azure AD single sign-on, batch processing for Azure OpenAI and Vertex, and realtime voice support used by the Voicebot team.",
      "Built and delivered an ID Verification Portal (Next.js, Express) for quarterly reviews of generic IDs, with manager campaigns, reminders and escalation, Azure ManageEngine sync and audit reports, replacing a ~15-day quarterly manual process.",
      "Built a webhook that keeps 20,000+ hospital records in sync from Oracle, an employee hierarchy API, and migrated legacy C# apps to FastAPI/Express, PostgreSQL and Next.js.",
    ],
  },
  {
    company: "Samsung PRISM",
    role: "Research Intern",
    period: "Jul – Sep 2025",
    note: "Samsung R&D Institute, Bangalore (Remote)",
    points: [
      "Developed an AI-driven tool that parses 2G telecom logs and auto-generates end-to-end call-flow diagrams aligned with 3GPP specifications.",
      "Implemented NLP-based message extraction and interactive Mermaid.js visualisation to speed up vRAN debugging and analysis.",
    ],
  },
  {
    company: "Tech Mahindra Makers Lab",
    role: "AIML Intern",
    period: "May – Aug 2025",
    note: "Pune, India",
    points: [
      "Researched ARC-based AGI using discrete reasoning, and experimented with neural networks and genetic algorithms for hybrid cognitive architectures.",
      "Developed agentic AI workflows using MCP (Model Context Protocol) and Agent-to-Agent (A2A) communication for modular task coordination.",
    ],
  },
  {
    company: "Edept",
    role: "UI/UX Intern",
    period: "Jun – Aug 2024",
    note: "Maharashtra, India",
    points: [
      "Designed and implemented a user-friendly skill deficit tool, applying UI/UX best practices to improve its usability and functionality.",
    ],
  },
];

export type Project = {
  name: string;
  summary: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    name: "SmartBill Manager",
    summary:
      "Reads scanned bills with Tesseract OCR plus an LLM to pull out amounts, names, IDs and emails, tracks paid and unpaid bills in SQLite and emails reminders for outstanding balances, behind a multi-user Streamlit UI.",
    stack: ["Tesseract", "Groq / Ollama", "SQLite", "Streamlit"],
  },
  {
    name: "Multi-Agent Disease Diagnosis",
    summary:
      "An orchestrator agent routes symptoms to specialist disease agents, each with its own ML models (Random Forest, Naive Bayes) as tools, which can ask for more inputs before classifying.",
    stack: ["LangChain", "OpenAI", "scikit-learn", "Random Forest", "Naive Bayes"],
  },
  {
    name: "Malaria Detection",
    summary:
      "Classifies blood smear images as infected or uninfected with a pre-trained CNN, with preprocessing and augmentation on an annotated patient image dataset.",
    stack: ["TensorFlow", "Keras", "CNN"],
  },
  {
    name: "QuickBites Discount Optimisation",
    summary: "Exploratory data analysis to optimise discounts for QuickBites.",
    stack: ["Exploratory data analysis"],
  },
];

export const skills = [
  { group: "Backend & platform", items: ["Python", "JavaScript", "FastAPI", "LiteLLM", "PostgreSQL"] },
  { group: "AI & agents", items: ["MCP", "A2A", "LangChain", "LangGraph", "CrewAI"] },
  { group: "Web", items: ["Node.js", "Express", "React", "Next.js"] },
  { group: "Infra & tooling", items: ["ArgoCD", "Nginx", "Git", "Docker"] },
];

export const education = {
  school: "VIT Vellore",
  degree: "B.Tech, Computer Science",
  period: "2022 – 2026",
  grade: "CGPA 9.29 / 10",
};

export const leadership = [
  "Lead Anchor at Riviera, VIT's cultural festival, for an audience of 20,000",
  "Events Head, VIT Anchoring Club, 25+ events",
];
