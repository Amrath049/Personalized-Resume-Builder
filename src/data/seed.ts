// Initial data: a sample resume (master) + a tailored example version.
// Replace the placeholder content below with your own details — every field
// is editable in the app and stored only in your browser (localStorage).

import type { Resume, SavedVersion, Settings } from "../types";
import { DEFAULT_SECTION_CONFIG } from "./templates";

const HEADER = {
  name: "ALEX MORGAN",
  title: "Full-Stack Software Engineer | React | Node.js | TypeScript",
  location: "San Francisco, CA",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 123-4567",
  linkedin: "linkedin.com/in/alex-morgan",
  github: "github.com/alexmorgan",
};

const TASK_MANAGER = {
  name: "TeamFlow – Collaborative Task Manager",
  techStack: "Node.js, Express.js, PostgreSQL, React",
  bullets: [
    "Built a real-time task management application for small teams with role-based access control.",
    "Designed a RESTful API with Express.js and integrated WebSocket notifications for live updates.",
    "Optimized PostgreSQL queries and indexing strategy, reducing average response time by 40%.",
  ],
};

const COURSES = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    provider: "AWS Training",
    detail: "2024 | Cloud Architecture, IAM, EC2, S3, RDS, Lambda",
  },
  {
    title: "Advanced TypeScript & Design Patterns",
    provider: "Udemy",
    detail: "2023 | Generics, Decorators, SOLID principles, DI containers",
  },
];

// ---- MASTER (the base resume you start from) ----
export const MASTER_RESUME: Resume = {
  header: { ...HEADER },
  summary:
    "Full-Stack Software Engineer with 3+ years of experience building scalable web applications and APIs. Proficient in React, Node.js, TypeScript, and cloud-native architectures. Passionate about clean code, developer experience, and shipping reliable products.",
  experience: [
    {
      role: "Software Engineer",
      company: "Acme Technologies Inc.",
      dateRange: "January 2022 — Present, San Francisco, CA",
      bullets: [
        "Designed and built RESTful and GraphQL APIs consumed by web and mobile clients serving 50 k+ active users.",
        "Led migration of a monolithic Node.js service to a microservices architecture, improving deployment frequency by 3×.",
        "Implemented CI/CD pipelines with GitHub Actions and Docker, cutting release cycle from weekly to daily.",
        "Collaborated with product, design, and QA in two-week sprints; mentored two junior engineers.",
        "Authored ADRs and API documentation, reducing onboarding time for new team members.",
        "Improved test coverage from 45 % to 85 % by introducing Jest unit tests and Playwright e2e tests.",
      ],
    },
    {
      role: "Junior Software Engineer",
      company: "Bright Solutions LLC",
      dateRange: "June 2021 — December 2021, Remote",
      bullets: [
        "Developed React front-end components and integrated them with backend REST APIs.",
        "Fixed customer-reported bugs and wrote regression tests to prevent recurrence.",
        "Participated in code reviews and weekly technical design discussions.",
      ],
    },
  ],
  projects: [
    {
      name: "ShopStack – Open-Source E-Commerce Platform",
      techStack: "Next.js, Node.js, MongoDB, Stripe, Redis",
      bullets: [
        "Built a full-featured e-commerce platform supporting multi-vendor storefronts, product catalogues, and checkout.",
        "Integrated Stripe Checkout and webhooks for payment processing and subscription billing.",
        "Added Redis caching for product listings, dropping average page load by 60 %.",
        "Open-sourced on GitHub; 400+ stars and 20 contributors within the first year.",
      ],
    },
    { ...TASK_MANAGER, bullets: [...TASK_MANAGER.bullets] },
  ],
  skills: [
    { label: "Languages", value: "JavaScript, TypeScript, Python" },
    { label: "Frontend", value: "React, Next.js, HTML5, CSS3, Tailwind CSS" },
    { label: "Backend", value: "Node.js, Express.js, NestJS, GraphQL" },
    { label: "Databases", value: "MongoDB, PostgreSQL, MySQL, Redis" },
    {
      label: "Cloud & DevOps",
      value: "AWS (EC2, S3, Lambda, RDS), Docker, GitHub Actions, Vercel",
    },
    {
      label: "Tools & Practices",
      value: "Git, Postman, Jest, Playwright, Agile/Scrum, Jira",
    },
    {
      label: "Concepts",
      value:
        "REST & GraphQL APIs, Microservices, CI/CD, TDD, System Design, Data Structures & Algorithms",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science – Computer Science",
      institution: "State University",
      detail: "2017 – 2021 | GPA: 3.7 / 4.0 | Dean's List (4 semesters)",
    },
  ],
  courses: COURSES.map((c) => ({ ...c })),
};

// ---- EXAMPLE TAILORED VERSION (shows how to customize for a specific JD) ----
const TECHCORP_RESUME: Resume = {
  header: {
    ...HEADER,
    title: "Backend Engineer | Node.js | Distributed Systems | TypeScript",
  },
  summary:
    "Backend-focused engineer with 3+ years of experience designing distributed systems and high-throughput APIs. Proven track record delivering microservices on AWS, implementing observability pipelines, and mentoring peers. Excited to bring deep Node.js expertise and a strong testing culture to TechCorp's platform team.",
  experience: [
    {
      role: "Software Engineer – Platform Team",
      company: "Acme Technologies Inc.",
      dateRange: "January 2022 — Present, San Francisco, CA",
      bullets: [
        "Architected and delivered a microservices migration that reduced p95 API latency from 800 ms to 120 ms.",
        "Designed event-driven pipelines using Kafka and AWS SQS to decouple services and improve fault tolerance.",
        "Built a centralized logging and tracing layer (OpenTelemetry + Datadog) adopted across 8 backend services.",
        "Drove adoption of contract testing (Pact) between teams, eliminating integration regressions in CI.",
        "Mentored two junior engineers through structured pairing, design reviews, and weekly 1:1s.",
      ],
    },
    {
      role: "Junior Software Engineer",
      company: "Bright Solutions LLC",
      dateRange: "June 2021 — December 2021, Remote",
      bullets: [
        "Developed and shipped REST API endpoints used by the company's flagship mobile app.",
        "Wrote unit and integration tests with Jest, increasing coverage from 30 % to 65 % in four months.",
        "Resolved critical production bugs under time pressure, communicating clearly with stakeholders.",
      ],
    },
  ],
  projects: [
    {
      name: "ShopStack – Open-Source E-Commerce Platform",
      techStack: "Next.js, Node.js, MongoDB, Stripe, Redis",
      bullets: [
        "Designed a scalable multi-tenant architecture handling thousands of concurrent storefronts.",
        "Implemented idempotent Stripe webhook handling to ensure reliable payment state transitions.",
        "Profiled and optimized hot code paths, achieving a 60 % reduction in average response time.",
        "Maintained the open-source project: triaging issues, reviewing PRs, and writing contributor docs.",
      ],
    },
    { ...TASK_MANAGER, bullets: [...TASK_MANAGER.bullets] },
  ],
  skills: [
    { label: "Languages", value: "JavaScript, TypeScript, Python" },
    {
      label: "Backend",
      value: "Node.js, Express.js, NestJS, GraphQL, gRPC",
    },
    {
      label: "Messaging & Streaming",
      value: "Apache Kafka, AWS SQS/SNS, RabbitMQ",
    },
    { label: "Databases", value: "MongoDB, PostgreSQL, Redis, Elasticsearch" },
    {
      label: "Cloud & Observability",
      value:
        "AWS (EC2, Lambda, RDS, S3), Docker, Kubernetes, OpenTelemetry, Datadog",
    },
    {
      label: "Tools & Practices",
      value: "Git, Jest, Playwright, Pact, GitHub Actions, Agile/Scrum",
    },
    {
      label: "Concepts",
      value:
        "Distributed Systems, Event-Driven Architecture, Microservices, TDD, System Design, SOLID",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science – Computer Science",
      institution: "State University",
      detail: "2017 – 2021 | GPA: 3.7 / 4.0 | Dean's List (4 semesters)",
    },
  ],
  courses: COURSES.map((c) => ({ ...c })),
};

export const SEED_VERSIONS: SavedVersion[] = [
  {
    id: "seed-techcorp",
    name: "TechCorp (example)",
    updatedAt: 0,
    resume: TECHCORP_RESUME,
  },
];

export const DEFAULT_SETTINGS: Settings = {
  pageSize: "A4",
  fontScale: 1,
  aiProvider: "gemini",
  geminiKey: "",
  geminiModel: "gemini-2.5-flash",
  groqKey: "",
  groqModel: "llama-3.3-70b-versatile",
  proxyUrl: "",
  templateId: "tech",
  sectionOverrides: DEFAULT_SECTION_CONFIG,
};

export const DEFAULT_FILENAME = "My_Resume";
