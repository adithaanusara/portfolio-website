export const profile = {
  name: 'Aditha Anusara',
  firstName: 'Aditha',
  handle: 'adithaanusara',
  role: 'Software Engineering Undergraduate',
  tagline: 'Full Stack & Distributed Systems Developer',
  location: 'Colombo, Sri Lanka',
  timeZone: 'Asia/Colombo',
  coordinates: [6.9271, 79.8612],
  email: 'adithaanusara31@gmail.com',
  phone: '+94 76 577 0642',
  github: 'https://github.com/adithaanusara',
  linkedin: 'https://www.linkedin.com/in/aditha-anusara-39832a351',
  quote: 'Building software end to end — from the screen you tap to the services, queues and databases behind it.',
  about:
    'I am a Computer Science undergraduate at the University of Colombo School of Computing who enjoys building software end to end — from mobile and web frontends to the services, queues and databases behind them. Lately I have been working on distributed systems with microservices, message brokers and containers, and on AI features using the Claude API, retrieval-augmented generation and tool calling.',
}

export const navLinks = [
  { id: 'about', label: 'about' },
  { id: 'journey', label: 'journey' },
  { id: 'stack', label: 'stack' },
  { id: 'projects', label: 'projects' },
  { id: 'certifications', label: 'certs' },
]

export const ribbons = {
  intro: ['Full Stack Development', 'Distributed Systems', 'Microservices', 'AI & LLM Apps', 'React · Next.js · NestJS', 'Spring Boot · FastAPI'],
  journey: ['University of Colombo School of Computing', 'B.Sc. in Computer Science', 'IJSE', 'Comprehensive Master Java Developer', 'Mahinda College, Galle'],
  stack: ['Frontend · Backend · DevOps', 'Docker · Kubernetes · RabbitMQ', 'Claude API · RAG · Tool Calling', 'PostgreSQL · MySQL · Prisma'],
  footer: [`GitHub: @adithaanusara`, 'Colombo, Sri Lanka', 'adithaanusara31@gmail.com', 'Full Stack & Distributed Systems'],
}

// Logo files live in src/assets/tech (from devicon, MIT). `invert` marks
// black logos that need flipping to show on the dark background.
export const skills = [
  {
    category: 'Languages',
    items: [
      { name: 'Java', icon: 'java' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Python', icon: 'python' },
      { name: 'PHP', icon: 'php' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'SQL' },
      { name: 'HTML5', icon: 'html5' },
      { name: 'CSS3', icon: 'css3' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React.js', icon: 'react' },
      { name: 'React Native', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs', invert: true },
      { name: 'Tailwind CSS', icon: 'tailwindcss' },
    ],
  },
  {
    category: 'Backend & APIs',
    items: [
      { name: 'NestJS', icon: 'nestjs' },
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'Spring Boot', icon: 'spring' },
      { name: 'Java EE' },
      { name: 'JDBC' },
      { name: 'Hibernate/ORM', icon: 'hibernate' },
    ],
  },
  {
    category: 'AI & LLM',
    items: [
      { name: 'Anthropic Claude API' },
      { name: 'RAG' },
      { name: 'Tool/Function Calling' },
      { name: 'Prompt Engineering' },
    ],
  },
  {
    category: 'Databases & Storage',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'NeonDB' },
      { name: 'Supabase', icon: 'supabase' },
      { name: 'Prisma ORM', icon: 'prisma', invert: true },
      { name: 'Cloudflare R2', icon: 'cloudflare' },
      { name: 'Cloudinary' },
    ],
  },
  {
    category: 'DevOps & Tools',
    items: [
      { name: 'Docker', icon: 'docker' },
      { name: 'Kubernetes', icon: 'kubernetes' },
      { name: 'RabbitMQ', icon: 'rabbitmq' },
      { name: 'Vercel', icon: 'vercel', invert: true },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github', invert: true },
      { name: 'Postman', icon: 'postman' },
      { name: 'VS Code', icon: 'vscode' },
    ],
  },
]

// Optional per project:
//   repo        GitHub URL, or `repos: [{ label, href }]` for several
//   demo        live site URL
//   screenshots file prefix in src/assets/projects — `lovelink` picks up
//               lovelink-1.webp, lovelink-2.webp, … and shows them as a gallery
//   status      short badge such as 'In progress'
// Projects without screenshots get a code-style preview built from `preview`.
export const projects = [
  {
    name: 'Serendeva',
    title: 'AI & VR Digital Wardrobe Platform',
    category: 'Mobile · Web · AI',
    description:
      'Virtual wardrobe management, personalized outfit recommendations, 3D avatar fashion experiences, and B2B size mapping.',
    stack: ['React Native', 'Next.js', 'NestJS', 'Python', 'PostgreSQL', 'Prisma ORM', 'Cloudflare R2'],
    highlights: [
      ['Platform', 'Mobile + Web'],
      ['Focus', 'AI & 3D'],
    ],
    preview: {
      file: 'wardrobe.service.ts',
      lines: [
        ['kw', 'const '], ['fn', 'outfits'], ['tx', ' = await '], ['fn', 'recommend'], ['tx', '({'], ['nl'],
        ['tx', '  wardrobe: user.'], ['fn', 'items'], ['tx', ','], ['nl'],
        ['tx', '  avatar: '], ['st', "'3d'"], ['tx', ','], ['nl'],
        ['tx', '  sizeMap: brand.'], ['fn', 'sizes'], ['tx', ','], ['nl'],
        ['tx', '})'], ['nl'],
      ],
    },
  },
  {
    name: 'SwiftLogistics',
    title: 'Logistics & Shipment Tracking System',
    category: 'Distributed Systems',
    description:
      'Microservices backend covering warehouse and shipment workflows, with containerized deployment and a RabbitMQ message broker.',
    stack: ['Microservices', 'JavaScript', 'Python', 'RabbitMQ', 'Docker', 'Kubernetes', 'HTML'],
    repo: 'https://github.com/adithaanusara/swifttrack',
    highlights: [
      ['Architecture', 'Microservices'],
      ['Messaging', 'RabbitMQ'],
    ],
    preview: {
      file: 'docker compose up',
      lines: [
        ['ok', '✔ '], ['tx', 'rabbitmq           '], ['ok', 'started'], ['nl'],
        ['ok', '✔ '], ['tx', 'order-service      '], ['ok', 'started'], ['nl'],
        ['ok', '✔ '], ['tx', 'warehouse-service  '], ['ok', 'started'], ['nl'],
        ['ok', '✔ '], ['tx', 'shipment-service   '], ['ok', 'started'], ['nl'],
        ['cm', '→ shipment.created  ▸ queue: tracking'], ['nl'],
      ],
    },
  },
  {
    name: 'WearAI',
    title: 'AI Powered Clothing E-Commerce Platform',
    category: 'AI · E-Commerce',
    status: 'In progress',
    description: 'E-commerce storefront with a RAG and tool-calling AI assistant for smart product discovery.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'PostgreSQL', 'PayHere', 'Docker'],
    repo: 'https://github.com/adithaanusara/wearai',
    demo: 'https://wearai-web.vercel.app',
    highlights: [
      ['AI', 'RAG + Tools'],
      ['Payments', 'PayHere'],
    ],
    preview: {
      file: 'assistant.py',
      lines: [
        ['kw', 'async def '], ['fn', 'ask'], ['tx', '(query: str):'], ['nl'],
        ['tx', '    docs = '], ['kw', 'await '], ['fn', 'retrieve'], ['tx', '(query, k='], ['st', '8'], ['tx', ')'], ['nl'],
        ['tx', '    tools = ['], ['fn', 'search_products'], ['tx', ', '], ['fn', 'check_size'], ['tx', ']'], ['nl'],
        ['kw', '    return await '], ['fn', 'claude'], ['tx', '(query, docs, tools)'], ['nl'],
        ['cm', '# → "3 linen shirts under LKR 5,000"'], ['nl'],
      ],
    },
  },
  {
    name: 'LoveLink Studio',
    title: 'Animated Memory Page Builder',
    category: 'Full Stack · Web App',
    description:
      'Romantic memory-sharing web app where users create animated surprise pages with photos, custom text and interactive extras like a sliding puzzle, then share them through a custom URL.',
    stack: ['Next.js', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Cloudinary', 'NextAuth', 'Framer Motion'],
    repo: 'https://github.com/adithaanusara/lovelink-studio',
    demo: 'https://lovelink-studio.vercel.app',
    screenshots: 'lovelink',
    highlights: [
      ['Editor', 'Drag & drop'],
      ['Sharing', 'Custom URL'],
    ],
  },
  {
    name: 'P&D Stone',
    title: 'Client Website — Natural Stone Cladding',
    category: 'Client Website',
    description:
      'Responsive, bilingual (English / Sinhala) website for a Sri Lankan natural stone cladding business, with product showcases, project galleries, animations and WhatsApp quotation requests.',
    stack: ['React', 'Vite', 'Framer Motion', 'Supabase', 'JavaScript', 'CSS'],
    repo: 'https://github.com/adithaanusara/stonecraft-client-site',
    demo: 'https://stonecraft-client-site.vercel.app',
    screenshots: 'pndstone',
    highlights: [
      ['Client', 'P&D Stone'],
      ['Languages', 'EN + සිං'],
    ],
  },
  {
    name: 'Iskole',
    title: 'School Management System',
    category: 'Web · MVC',
    description:
      'Role-based system for Sri Lankan schools with modules for marks, attendance, timetables, reports and announcements, plus secure authentication and sessions.',
    stack: ['PHP', 'MySQL', 'Docker', 'MVC Architecture'],
    screenshots: 'iskole',
    highlights: [
      ['Access', 'Role-based'],
      ['Pattern', 'MVC'],
    ],
    preview: {
      file: 'routes.php',
      lines: [
        ['fn', '$router'], ['tx', '->'], ['fn', 'get'], ['tx', '('], ['st', "'/marks'"], ['tx', ', '], ['st', "'MarksController'"], ['tx', ')'], ['nl'],
        ['tx', '  ->'], ['fn', 'role'], ['tx', '('], ['st', "'teacher'"], ['tx', ');'], ['nl'],
        ['fn', '$router'], ['tx', '->'], ['fn', 'post'], ['tx', '('], ['st', "'/attendance'"], ['tx', ', ...);'], ['nl'],
        ['fn', '$router'], ['tx', '->'], ['fn', 'get'], ['tx', '('], ['st', "'/timetable'"], ['tx', ', ...);'], ['nl'],
      ],
    },
  },
  {
    name: 'FoodExpress',
    title: 'Online Food Ordering System',
    category: 'Full Stack',
    description:
      'Spring Boot REST API with JWT-secured ADMIN and CUSTOMER roles and a layered Controller-Service-Repository design, paired with a React frontend for browsing, cart and checkout.',
    stack: ['Java 21', 'Spring Boot', 'Spring Data JPA', 'Spring Security', 'JWT', 'MySQL', 'React'],
    repos: [
      { label: 'backend', href: 'https://github.com/adithaanusara/foodexpress-backend' },
      { label: 'frontend', href: 'https://github.com/adithaanusara/online-food-ordering-frontend' },
    ],
    screenshots: 'foodexpress',
    highlights: [
      ['Auth', 'JWT'],
      ['Pattern', 'Layered'],
    ],
    preview: {
      file: 'OrderController.java',
      lines: [
        ['cm', '@PostMapping("/api/orders")'], ['nl'],
        ['kw', 'public '], ['tx', 'ResponseEntity<OrderDto> '], ['fn', 'place'], ['tx', '('], ['nl'],
        ['tx', '    @AuthenticationPrincipal User user,'], ['nl'],
        ['tx', '    @Valid @RequestBody OrderRequest req) {'], ['nl'],
        ['kw', '  return '], ['tx', 'ok(orderService.'], ['fn', 'place'], ['tx', '(user, req));'], ['nl'],
        ['tx', '}'], ['nl'],
      ],
    },
  },
]

// Chronological. Years are only shown where known.
export const journey = [
  {
    kind: 'School',
    title: 'G.C.E. Advanced Level',
    detail: 'Physical Science stream',
    institution: 'Mahinda College, Galle',
    period: '2022',
  },
  {
    kind: 'University',
    title: 'B.Sc. in Computer Science',
    detail: 'Undergraduate degree',
    institution: 'University of Colombo School of Computing (UCSC)',
    period: '2023 – Present',
  },
  {
    kind: 'Program',
    title: 'Software Engineering Program',
    detail: 'Professional software engineering training',
    institution: 'Institute of Software Engineering (IJSE)',
    period: '2026',
  },
  {
    kind: 'Certification',
    title: 'Comprehensive Master Java Developer',
    detail: 'CMJD diploma — SOLID, design patterns, Spring, Hibernate',
    institution: 'Institute of Software Engineering (IJSE)',
    period: 'June 2026',
  },
]

// Certificate images live in src/assets/certificates as <image>-card.webp
// (shown in the card) and <image>-full.webp (opened in the viewer).
export const certifications = [
  {
    title: 'Comprehensive Master Java Developer (CMJD)',
    short: 'CMJD',
    issuer: 'Institute of Software Engineering (IJSE), Sri Lanka',
    category: 'Software Engineering · Diploma',
    issued: 'June 2026',
    credentialId: 'C-2025-10165',
    image: 'cmjd-certificate',
    description:
      'Diploma fulfilling the requirements of the Oracle Certified Associate and Professional Java SE examinations (OCAJP / OCPJP). Deep dive into SOLID principles, layered architecture, design patterns, DSA, Spring Framework, Hibernate/ORM, JDBC, and Java EE.',
    topics: ['SOLID', 'Design Patterns', 'DSA', 'Spring', 'Hibernate', 'JDBC', 'Java EE'],
  },
]

export const achievements = [
  {
    title: 'Former School Badminton Team Captain',
    category: 'Sport & Leadership',
    description: 'Captained the school badminton team and played at District, Provincial and National level.',
    levels: ['District', 'Provincial', 'National'],
  },
]
