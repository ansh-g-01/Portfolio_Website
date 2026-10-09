// All site content lives here, so text can be edited without touching components.

export const profile = {
  name: "Ansh Gandhi",
  role: "Software Development Engineer",
  company: "Bajaj Finance",
  location: "Pune, India",
  email: "ansh21000@gmail.com",
  github: "https://github.com/ansh-g-01",
  linkedin: "https://www.linkedin.com/in/ansh-gandhi-2906a2248/",
  tagline:
    "I work on AI platform infrastructure and agentic systems: the plumbing that lets teams use large language models safely and at scale.",
};

// Gateway figures as of the last 30 days, from the verified profile
export const gatewayStats = [
  { value: "2,000+", label: "models behind one API" },
  { value: "100+", label: "model providers" },
  { value: "8.5M+", label: "requests in 30 days" },
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
      "Upgraded and extended the company's AI gateway (Python, FastAPI, built on LiteLLM): one OpenAI-compatible API to 2,000+ models from 100+ providers, with 8.5M+ requests and $25K+ of model spend tracked in the last 30 days.",
      "Added role-based access control with Azure AD single sign-on, batch processing for Azure OpenAI and Vertex, realtime voice support used by the Voicebot team, and an OpenAI-style Python SDK for 4 environments.",
      "Moved all traffic to the new version with zero downtime by running the new repo's ArgoCD pipeline against the live app's configuration.",
      "Led the response to the March 2026 LiteLLM PyPI supply-chain attack: checked dependencies, IP-restricted the remaining models and rotated keys. The gateway was not affected.",
      "Built and delivered an ID Verification Portal (Next.js, Express) for quarterly reviews of generic IDs, with manager campaigns, reminders and escalation, Azure ManageEngine sync and audit reports, replacing a ~15-day quarterly manual process.",
      "Built a webhook that keeps 20,000+ hospital records in sync from Oracle, an employee hierarchy API, and migrated legacy C# apps to FastAPI/Express, PostgreSQL and Next.js (21,000+ policies a year).",
    ],
  },
  {
    company: "Samsung PRISM",
    role: "Research Intern",
    period: "Jul – Sep 2025",
    points: ["Hybrid research internship."],
  },
  {
    company: "Tech Mahindra Makers Lab",
    role: "AIML Intern",
    period: "May – Aug 2025",
    points: [
      "Prototyped and compared MCP and A2A agent workflows, and did research on ARC/AGI.",
    ],
  },
  {
    company: "Edept",
    role: "UI/UX Intern",
    period: "Jun – Aug 2024",
    points: ["UI/UX design internship."],
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
      "Reads bills with Tesseract OCR plus an LLM, stores them in SQLite and sends email reminders, behind a Streamlit UI.",
    stack: ["Tesseract", "Groq / Ollama", "SQLite", "Streamlit"],
  },
  {
    name: "Multi-Agent Disease Diagnosis",
    summary:
      "An orchestrator agent routes symptoms to specialist agents.",
    stack: ["LangChain", "OpenAI", "scikit-learn"],
  },
  {
    name: "Malaria Detection",
    summary: "Malaria detection with a convolutional neural network.",
    stack: ["TensorFlow", "Keras", "CNN"],
  },
  {
    name: "QuickBites Discount Optimisation",
    summary: "Exploratory data analysis to optimise discounts for QuickBites.",
    stack: ["Exploratory data analysis"],
  },
];

export const skills = [
  { group: "Backend & platform", items: ["Python", "FastAPI", "LiteLLM", "PostgreSQL", "REST", "RBAC / SSO (Azure AD)"] },
  { group: "AI & agents", items: ["MCP", "A2A", "LangChain", "CrewAI"] },
  { group: "Web", items: ["Node.js", "Express", "React", "Next.js"] },
  { group: "Infra & tooling", items: ["ArgoCD", "Nginx", "Git", "AWS fundamentals"] },
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
