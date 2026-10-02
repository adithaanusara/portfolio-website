export const profile = {
  name: 'Aditha Anusara',
  handle: 'adithaanusara',
  role: 'Software Engineering Undergraduate',
  tagline: 'Full Stack & Distributed Systems Developer',
  location: 'Colombo, Sri Lanka',
  email: 'adithaanusara31@gmail.com',
  phone: '+94 76 577 0642',
  github: 'https://github.com/adithaanusara',
  linkedin: 'https://www.linkedin.com/in/aditha-anusara-39832a351',
  about: [
    'I am a Computer Science undergraduate at the University of Colombo School of Computing who enjoys building software end to end — from mobile and web frontends to the services, queues and databases behind them.',
    'Lately I have been working on distributed systems with microservices, message brokers and containers, and on AI features using the Claude API, retrieval-augmented generation and tool calling.',
  ],
}

export const skills = [
  {
    category: 'Languages',
    items: ['Java', 'JavaScript', 'Python', 'PHP', 'TypeScript', 'SQL', 'HTML5', 'CSS3'],
  },
  {
    category: 'Frontend',
    items: ['React.js', 'React Native', 'Next.js', 'Tailwind CSS'],
  },
  {
    category: 'Backend & APIs',
    items: ['NestJS', 'FastAPI', 'Spring Boot', 'Java EE', 'JDBC', 'Hibernate/ORM'],
  },
  {
    category: 'AI & LLM',
    items: ['Anthropic Claude API', 'RAG', 'Tool/Function Calling', 'Prompt Engineering'],
  },
  {
    category: 'Databases & Storage',
    items: ['PostgreSQL', 'MySQL', 'NeonDB', 'Supabase', 'Prisma ORM', 'Cloudflare R2', 'Cloudinary'],
  },
  {
    category: 'DevOps & Tools',
    items: ['Docker', 'Kubernetes', 'RabbitMQ', 'Vercel', 'Git', 'GitHub', 'Postman', 'VS Code'],
  },
]

// Optional per project: `repo` (GitHub URL) and `demo` (live site URL).
// When set, link icons appear on the project card, e.g.
//   repo: 'https://github.com/adithaanusara/serendeva',
//   demo: 'https://serendeva.vercel.app',
export const projects = [
  {
    name: 'Serendeva',
    title: 'AI & VR Digital Wardrobe Platform',
    description:
      'Virtual wardrobe management, personalized outfit recommendations, 3D avatar fashion experiences, and B2B size mapping.',
    stack: ['React Native', 'Next.js', 'NestJS', 'Python', 'PostgreSQL', 'Prisma ORM', 'Cloudflare R2'],
  },
  {
    name: 'SwiftLogistics',
    title: 'Logistics & Shipment Tracking System',
    description:
      'Microservices backend covering warehouse and shipment workflows, with containerized deployment and a RabbitMQ message broker.',
    stack: ['Microservices', 'JavaScript', 'Python', 'RabbitMQ', 'Docker', 'Kubernetes', 'HTML'],
    repo: 'https://github.com/adithaanusara/swifttrack',
  },
  {
    name: 'WearAI',
    title: 'AI Powered Clothing E-Commerce Platform',
    description:
      'E-commerce storefront with a RAG and tool-calling AI assistant for smart product discovery.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'PostgreSQL', 'PayHere', 'Docker'],
    repo: 'https://github.com/adithaanusara/wearai',
    demo: 'https://wearai-web.vercel.app',
  },
  {
    name: 'Iskole',
    title: 'School Management System',
    description:
      'Role-based system for Sri Lankan schools handling marks, attendance, timetables, and security.',
    stack: ['PHP', 'MySQL', 'Docker', 'MVC Architecture'],
  },
  {
    name: 'FoodExpress Backend',
    title: 'Online Food Ordering System',
    description:
      'RESTful API with Spring Security and JWT authentication, built on a layered Controller-Service-Repository pattern.',
    stack: ['Java 21', 'Spring Boot', 'Spring Data JPA', 'JWT', 'MySQL', 'Maven'],
    repo: 'https://github.com/adithaanusara/foodexpress-backend',
  },
]

export const education = [
  {
    degree: 'B.Sc. in Computer Science',
    institution: 'University of Colombo School of Computing (UCSC)',
    period: '2023 – Present',
  },
  {
    degree: 'Software Engineering Program',
    institution: 'Institute of Java and Software Engineering (IJSE)',
    period: '2026',
  },
  {
    degree: 'G.C.E. Advanced Level (Physical Science)',
    institution: 'Mahinda College, Galle',
    period: null,
  },
]

export const certifications = [
  {
    title: 'Certified Master Java Developer (CMJD)',
    issuer: 'Institute of Java and Software Engineering (IJSE)',
    description:
      'Deep dive into SOLID principles, layered architecture, design patterns, DSA, Spring Framework, Hibernate/ORM, JDBC, and Java EE.',
  },
]

export const achievements = [
  {
    title: 'Former School Badminton Team Captain',
    description: 'Represented at District, Provincial, and National levels.',
  },
]

export const navLinks = [
  { id: 'about', label: 'about' },
  { id: 'skills', label: 'stack' },
  { id: 'projects', label: 'projects' },
  { id: 'education', label: 'education' },
  { id: 'contact', label: 'contact' },
]
