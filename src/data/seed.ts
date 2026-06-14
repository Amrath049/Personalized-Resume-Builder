// Initial data: the user's real resume (master) + a tailored example version.
// Transcribed from the attached PDFs so the app is useful on first load.

import type { Resume, SavedVersion, Settings } from '../types';

const HEADER = {
  name: 'AMRATH PRASAD',
  title: 'Software Engineer | Node.js | NestJS | MongoDB',
  location: 'Udupi, Karnataka',
  email: 'amrathprasadpc@gmail.com',
  phone: '+91 9902362649',
  linkedin: 'linkedin.com/in/amrath-prasad-99234a209',
  github: 'github.com/Amrath049',
};

const CREE8 = {
  name: 'CREE-8 – Employee & Worksite Management Platform',
  techStack: 'Node.js, Express.js, MongoDB',
  bullets: [
    'Collaborated with the team to build an employee and worksite management system for a construction company.',
    'Developed and maintained employee management features, contributing to efficient workforce administration.',
    'Helped design and optimize MongoDB schemas for efficient data handling.',
  ],
};

const COURSES = [
  {
    title: 'Succeed in the Age of AI',
    provider: 'Udemy',
    detail:
      '2025 | AI Productivity, Decision-Making, Generative AI for Web Developers, Code with AI Assistance',
  },
  {
    title: 'NestJS Masterclass- NodeJS Framework Backend Development',
    provider: 'Udemy',
    detail: '2025 | NestJs | PostgreSQL | Software Documentation',
  },
];

// ---- MASTER (the standard resume) ----
export const MASTER_RESUME: Resume = {
  header: { ...HEADER },
  summary:
    'Software Engineer with experience in developing backend applications using Node.js, NestJS, JavaScript, and MongoDB. Strong foundation in software development, REST APIs, database management, debugging, and Agile practices. Passionate about solving problems, learning new technologies, and building reliable software solutions.',
  experience: [
    {
      role: 'Associate Software Engineer',
      company: 'Ordrio Technologies Private Limited',
      dateRange: 'November 2023—Present, Udupi, Karnataka',
      bullets: [
        'Developed and maintained scalable server-side applications using Node.js and NestJS.',
        'Design and implement RESTful APIs, ensuring seamless integration with frontend services and third-party applications.',
        'Handled microservices-based architecture for SaaS platforms.',
        'Utilize MongoDB and PostgreSQL for data storage, retrieval, and management, ensuring optimal performance and data integrity.',
        'Collaborated with cross-functional teams (front-end developers, product managers, and QA) to deliver features on time.',
        'Followed Agile development practices, participated in sprint planning, stand-ups, and code reviews.',
        'Wrote technical documentation for software projects including API references and module guides.',
        'Debugged and resolved application issues, improving system reliability and performance.',
      ],
    },
  ],
  projects: [
    {
      name: 'Nadi – SaaS Platform for SMEs',
      techStack: 'Node.js, NestJS, MongoDB, PostgreSQL, Microservices',
      bullets: [
        'Contributed to the development of a SaaS platform enabling small and medium businesses to go online.',
        'Built backend services for product inventory, customer management, website, and app management.',
        'Designed and implemented RESTful APIs, ensuring seamless integration with frontend services and third-party applications.',
        'Integrated payment gateways (Stripe, PhonePe, Razorpay) and notification services, enabling seamless transaction processing and customer communication.',
      ],
    },
    { ...CREE8, bullets: [...CREE8.bullets] },
  ],
  skills: [
    { label: 'Programming Languages', value: 'JavaScript, TypeScript' },
    { label: 'Backend Frameworks & Technologies', value: 'Node.js, NestJS, Express.js' },
    { label: 'API & Architecture', value: 'RESTful APIs, Microservices Architecture, OpenAPI/Swagger' },
    { label: 'Databases', value: 'MongoDB, PostgreSQL' },
    { label: 'Third-Party Integrations', value: 'Stripe, PhonePe, Razorpay, MSG91, Interakt' },
    { label: 'Tools & Practices', value: 'Git (Github), Postman, Docker, Agile/Scrum, Cursor.' },
    {
      label: 'Concepts',
      value:
        'Asynchronous Programming, Event-driven Architecture, Promises, API Security, Problem Solving, Data Structures & Algorithms',
    },
  ],
  education: [
    {
      degree: 'Bachelor of Engineering - Computer Science',
      institution: 'Visvesvaraya Technological University',
      detail: '2020 – 2024 | CGPA :7.99 | Moodlakatte Institute of Technology, Kundapura.',
    },
    {
      degree: 'Pre-University Education',
      institution: 'Department of Pre-University Education, Karnataka',
      detail: '2018 – 2020 | Percentage:78% | St.Marys PU College, Brahmavara.',
    },
  ],
  courses: COURSES.map((c) => ({ ...c })),
};

// ---- EXAMPLE TAILORED VERSION (Wells Fargo) ----
const WELLS_FARGO_RESUME: Resume = {
  header: { ...HEADER, title: 'Software Engineer | Javascript | Node.js | NestJS' },
  summary:
    'Software Engineer with 2+ years building cloud-native, microservices-based backend systems using Node.js, NestJS, and RESTful APIs on a multi-tenant e-commerce platform. Experience designing, coding, testing, and documenting moderately complex services with attention to security, compliance, and reliability requirements. Hands-on with third-party and cloud integrations (Azure Communication Services, Azure Event Grid, payment gateways) and skilled at communicating technical solutions to cross-functional partners. Eager to grow into identity and access management (IAM/IGA) and secure identity capabilities under senior guidance.',
  experience: [
    {
      role: 'Associate Software Engineer (Promoted from Junior Backend Developer)',
      company: 'Ordrio Technologies Private Limited',
      dateRange: 'November 2023—Present, Udupi, Karnataka',
      bullets: [
        'Designed, coded, tested, and documented microservices-based backend services using Node.js and NestJS, covering payments, notifications, and search for a multitenant platform.',
        'Developed and integrated RESTful APIs ensuring reliable communication between frontend, internal services, and third-party providers.',
        'Built secure, compliance-aware messaging workflows, implementing regulatory validation (DLT sender ID, template, and country-code checks) before dispatch — exercising independent judgment within security and compliance constraints.',
        'Collaborated with cross-functional teams (front-end developers, product managers, and QA) to deliver features on time.',
        'Followed Agile development practices, participated in sprint planning, stand-ups, and code reviews.',
        'Authored technical documentation (API references, module guides) that made complex backend systems understandable to non-technical stakeholders and cross-functional teams.',
      ],
    },
  ],
  projects: [
    {
      name: 'Nadi – SaaS Platform for SMEs',
      techStack: 'Node.js, NestJS, MongoDB, PostgreSQL, Microservices',
      bullets: [
        'Contributed to the development of a SaaS platform enabling small and medium businesses to go online.',
        'Built backend services for product inventory, customer management, website, and app management.',
        'Designed and implemented RESTful APIs, ensuring seamless integration with frontend services and third-party applications.',
        'Integrated third-party engagement and payment services (Interakt/WhatsApp, MSG91, Stripe, Razorpay), gaining hands-on experience connecting external marketing and communication platforms via APIs and webhooks.',
      ],
    },
    { ...CREE8, bullets: [...CREE8.bullets] },
  ],
  skills: [
    { label: 'Programming Languages', value: 'JavaScript, TypeScript' },
    { label: 'Backend Frameworks & Technologies', value: 'Node.js, NestJS, Express.js' },
    {
      label: 'API & Architecture',
      value: 'RESTful APIs, Microservices Architecture, OpenAPI/Swagger, Webhooks handling',
    },
    { label: 'Databases', value: 'MongoDB, PostgreSQL' },
    { label: 'Third-Party Integrations', value: 'Stripe, PhonePe, Razorpay, MSG91, Interakt' },
    {
      label: 'Tools & Practices',
      value: 'Git (Github), Postman, Azure Communication Services, Agile/Scrum, Cursor AI, Claude AI.',
    },
    {
      label: 'Concepts',
      value:
        'Asynchronous Programming, Event-driven Architecture, Promises, API Security, Problem Solving, Data Structures & Algorithms',
    },
  ],
  education: [
    {
      degree: 'Bachelor of Engineering - Computer Science',
      institution: 'Visvesvaraya Technological University',
      detail: '2020 – 2024 | CGPA :7.99 | Moodlakatte Institute of Technology, Kundapura.',
    },
  ],
  courses: COURSES.map((c) => ({ ...c })),
};

export const SEED_VERSIONS: SavedVersion[] = [
  {
    id: 'seed-wells-fargo',
    name: 'Wells Fargo (example)',
    updatedAt: 0,
    resume: WELLS_FARGO_RESUME,
  },
];

export const DEFAULT_SETTINGS: Settings = {
  pageSize: 'A4',
  fontScale: 1,
  aiProvider: 'gemini',
  geminiKey: '',
  geminiModel: 'gemini-2.0-flash',
  groqKey: '',
  groqModel: 'llama-3.3-70b-versatile',
  proxyUrl: '',
};

export const DEFAULT_FILENAME = 'Amrath_Prasad_Resume';
