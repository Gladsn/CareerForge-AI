import { AnalysisResult } from '../types/resume';

export interface SampleProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  masterResumeTex: string;
  jobDescription: string;
  demoResult: AnalysisResult;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'sample-fullstack',
    name: "Alex Morgan — Senior Full Stack (Jake's Resume Template)",
    role: "Senior Full Stack Engineer",
    company: "Vanguard Pay / FinTech Scaleup",
    masterResumeTex: `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\resumeSubHeadingListEnd{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Alex Morgan} \\\\ \\vspace{1pt}
    \\small 415-555-0192 $|$ \\href{mailto:alex.morgan@email.com}{\\underline{alex.morgan@email.com}} $|$ 
    \\href{https://linkedin.com/in/alexmorgan-dev}{\\underline{linkedin.com/in/alexmorgan-dev}} $|$
    \\href{https://github.com/alexmorgan-code}{\\underline{github.com/alexmorgan-code}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {University of Washington}{Seattle, WA}
      {Bachelor of Science in Computer Science}{Sept. 2017 -- June 2021}
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: TypeScript, JavaScript, Python, SQL (PostgreSQL), HTML/CSS, Bash} \\\\
     \\textbf{Frameworks}{: React, Next.js, Node.js, Express, Tailwind CSS, Jest, React Testing Library} \\\\
     \\textbf{Developer Tools}{: Git, Docker, AWS (ECS, S3, RDS), GitHub Actions, Redis, Postman} \\\\
     \\textbf{Concepts}{: RESTful APIs, Microservices, CI/CD, Agile/Scrum, Distributed Caching}
    }}
 \\end{itemize}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {Senior Software Engineer}{July 2023 -- Present}
      {CloudPulse Technologies}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Architected and delivered real-time analytics dashboard in React and TypeScript serving 45,000+ daily active users.}
        \\resumeItem{Engineered Node.js backend microservices handling 12,000 requests per minute with Redis caching layer, slashing p99 latency by 38\\%.}
        \\resumeItem{Refactored PostgreSQL queries and implemented connection pooling, decreasing database memory load by 24\\%.}
        \\resumeItem{Mentored 3 junior software engineers through bi-weekly 1:1s, code reviews, and system design walkthroughs.}
      \\resumeItemListEnd

    \\resumeSubheading
      {Software Engineer}{June 2021 -- June 2023}
      {Apex Financial Solutions}{Seattle, WA}
      \\resumeItemListStart
        \\resumeItem{Developed secure customer-facing payment checkout flow using React and Stripe API, processing \\$14M+ in annual transaction volume.}
        \\resumeItem{Constructed end-to-end CI/CD deployment pipelines with GitHub Actions and AWS ECS, reducing deployment lead time from 4 hours to 18 minutes.}
        \\resumeItem{Authored comprehensive test suites with Jest and Cypress achieving 88\\% test coverage across core payment modules.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      \\resumeSubheading
        {Distributed Task Queue}{TypeScript, Node.js, Redis, Docker}
        {Personal Project $|$ \\href{https://github.com/alexmorgan-code/task-queue}{\\underline{Code}}}{2023}
        \\resumeItemListStart
          \\resumeItem{Constructed an asynchronous task processing engine with prioritized scheduling, exponential retry policies, and dead-letter queues.}
          \\resumeItem{Benchmarked performance under simulated heavy loads of 100,000 concurrent jobs with zero task loss.}
        \\resumeItemListEnd
    \\resumeSubHeadingListEnd

\\end{document}`,
    jobDescription: `Position: Senior Full Stack Engineer
Company: Vanguard Pay
Location: Remote / San Francisco, CA

About the Role:
We are seeking a Senior Full Stack Engineer to join our Core Banking & High-Throughput Checkout platform. You will build mission-critical financial applications that move billions of dollars securely and reliably.

Key Responsibilities:
- Design, build, and maintain scalable customer-facing financial web apps using modern React and TypeScript.
- Architect high-throughput backend services and APIs in Node.js and Go (Golang) backed by PostgreSQL and distributed caching.
- Optimize database queries, connection pooling, and schema design for strict ACID financial compliance.
- Build resilient event-driven architectures utilizing Apache Kafka for asynchronous transaction settlement.
- Champion engineering best practices, automated CI/CD pipelines, and thorough unit/integration testing.

Qualifications:
- 4+ years of professional full-stack software development experience.
- Deep expertise in TypeScript, React, and Node.js.
- Strong hands-on experience designing and optimizing relational databases (PostgreSQL preferred).
- Hands-on experience with automated CI/CD and containerized deployments (Docker, AWS ECS/EKS).
- Experience with Go (Golang) or distributed streaming platforms like Apache Kafka is strongly preferred.
- Bachelor's degree in Computer Science or equivalent practical experience.`,
    demoResult: {
      matchScore: 86,
      scoreBreakdown: {
        skillsAlignment: 88,
        experienceRelevance: 91,
        keywordOptimization: 82,
        templateIntegrity: 98,
      },
      summary: "Alex Morgan's profile represents an 86% match for Vanguard Pay's Senior Full Stack Engineer position. The candidate brings verified production experience across TypeScript, React, Node.js microservices, PostgreSQL optimization, and AWS CI/CD pipelines directly in financial transaction environments (Apex Financial Solutions: $14M+ payment volume). Two specific requirement gaps were detected (Go/Golang and Apache Kafka), which have been documented honestly without hallucination.",
      matchedRequirements: [
        {
          id: 'mr-1',
          requirement: 'TypeScript & React Architecture for Financial Web Apps',
          sourceEvidence: "Apex Financial Solutions: developed secure payment checkout flow in React/Stripe ($14M+ volume); CloudPulse: built 45k DAU real-time dashboard in React & TypeScript.",
          category: 'core_skill',
          confidence: 0.98,
        },
        {
          id: 'mr-2',
          requirement: 'High-Throughput Node.js Microservices & Low-Latency APIs',
          sourceEvidence: "CloudPulse Technologies: engineered Node.js backend microservices handling 12,000 req/min with Redis caching, slashing p99 latency by 38%.",
          category: 'experience',
          confidence: 0.96,
        },
        {
          id: 'mr-3',
          requirement: 'PostgreSQL Query Optimization & Database Scaling',
          sourceEvidence: "CloudPulse: refactored PostgreSQL queries and implemented connection pooling, decreasing database memory load by 24%.",
          category: 'core_skill',
          confidence: 0.95,
        },
        {
          id: 'mr-4',
          requirement: 'Automated CI/CD & Containerized AWS Deployments',
          sourceEvidence: "Apex Financial: constructed CI/CD with GitHub Actions and AWS ECS, reducing lead time from 4 hrs to 18 mins; Docker listed in toolkit.",
          category: 'tool_framework',
          confidence: 0.94,
        },
        {
          id: 'mr-5',
          requirement: 'Computer Science Degree',
          sourceEvidence: "University of Washington: B.S. in Computer Science (2017 - 2021).",
          category: 'education',
          confidence: 1.0,
        },
      ],
      missingRequirements: [
        {
          id: 'miss-1',
          requirement: 'Go (Golang) backend microservice development',
          severity: 'preferred',
          recommendation: "Do not claim proficiency in Go. Instead, emphasize deep knowledge of strongly-typed backend architecture via TypeScript, concurrent event-driven programming, and willingness to leverage typed language foundations to ramp up rapidly in Go.",
          sourceCheck: 'Source resume verified: Contains TypeScript, JavaScript, Python, SQL, but no Go experience.',
        },
        {
          id: 'miss-2',
          requirement: 'Apache Kafka event-driven streaming architecture',
          severity: 'preferred',
          recommendation: "Highlight your verified Distributed Task Queue project and Redis Pub/Sub caching experience as proof of solid asynchronous message pattern fundamentals, while honestly noting Kafka is an adjacent technology you are actively studying.",
          sourceCheck: 'Source resume verified: Uses Redis caching and asynchronous queues; Apache Kafka is absent.',
        },
      ],
      tailoringRecommendations: [
        {
          id: 'rec-1',
          area: 'Technical Skills Section Re-ordering',
          suggestion: 'Elevate TypeScript, PostgreSQL, Node.js, and React to the first position under Languages and Frameworks to align with ATS keyword density.',
          reason: 'Matches Vanguard Pay screening priorities while remaining 100% truthful to existing source capabilities.',
        },
        {
          id: 'rec-2',
          area: 'Experience Bullet Prioritization',
          suggestion: 'Place financial checkout experience ($14M+ volume) and database query optimization at the forefront of the bullet hierarchy.',
          reason: 'Directly mirrors the job description’s emphasis on financial data integrity and high transaction throughput.',
        },
        {
          id: 'rec-3',
          area: 'Honest Interview Prep',
          suggestion: 'Prepare a narrative around transitioning from asynchronous Node.js task engines to Go goroutines and Kafka topics.',
          reason: 'Turns missing requirements into demonstration of senior engineering self-awareness and architectural curiosity.',
        },
      ],
      changesApplied: [
        {
          id: 'ch-1',
          section: 'Technical Skills',
          changeType: 'skill_emphasis',
          originalSnippet: 'Languages: TypeScript, JavaScript, Python, SQL (PostgreSQL), HTML/CSS, Bash',
          tailoredSnippet: 'Languages: TypeScript, SQL (PostgreSQL), JavaScript, Python, HTML/CSS, Bash',
          reasoning: 'Elevated SQL (PostgreSQL) directly alongside TypeScript to highlight database competence required by Vanguard Pay.',
        },
        {
          id: 'ch-2',
          section: 'Technical Skills (Concepts)',
          changeType: 'skill_emphasis',
          originalSnippet: 'Concepts: RESTful APIs, Microservices, CI/CD, Agile/Scrum, Distributed Caching',
          tailoredSnippet: 'Concepts: High-Throughput APIs, Event-Driven Architecture, Microservices, CI/CD, Distributed Caching',
          reasoning: 'Sharpened conceptual keywords using truthful evidence from the candidate\'s distributed task queue project and latency reduction achievements.',
        },
        {
          id: 'ch-3',
          section: 'Experience (CloudPulse)',
          changeType: 'rephrase',
          originalSnippet: 'Architected and delivered real-time analytics dashboard in React and TypeScript serving 45,000+ daily active users.',
          tailoredSnippet: 'Architected high-throughput client dashboard using React and TypeScript, delivering real-time telemetry for 45,000+ daily active users with sub-second responsiveness.',
          reasoning: 'Strengthened alignment with Vanguard Pay’s emphasis on high-throughput frontend performance without inventing any unverified stats.',
        },
        {
          id: 'ch-4',
          section: 'Experience (Apex Financial)',
          changeType: 'reorder',
          originalSnippet: 'Developed secure customer-facing payment checkout flow using React and Stripe API, processing $14M+ in annual transaction volume.',
          tailoredSnippet: 'Engineered mission-critical payment checkout flow with React and Stripe API, processing \\$14M+ in annual financial transactions under zero-tolerance data integrity standards.',
          reasoning: 'Emphasized financial mission-criticality to match Vanguard Pay’s core banking focus while retaining the original $14M verified metric.',
        },
      ],
      tailoredTex: `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\resumeSubHeadingListEnd{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Alex Morgan} \\\\ \\vspace{1pt}
    \\small 415-555-0192 $|$ \\href{mailto:alex.morgan@email.com}{\\underline{alex.morgan@email.com}} $|$ 
    \\href{https://linkedin.com/in/alexmorgan-dev}{\\underline{linkedin.com/in/alexmorgan-dev}} $|$
    \\href{https://github.com/alexmorgan-code}{\\underline{github.com/alexmorgan-code}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {University of Washington}{Seattle, WA}
      {Bachelor of Science in Computer Science}{Sept. 2017 -- June 2021}
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: TypeScript, SQL (PostgreSQL), JavaScript, Python, HTML/CSS, Bash} \\\\
     \\textbf{Frameworks}{: React, Node.js, Next.js, Express, Tailwind CSS, Jest, React Testing Library} \\\\
     \\textbf{Developer Tools}{: Git, Docker, AWS (ECS, RDS, S3), GitHub Actions, Redis, Postman} \\\\
     \\textbf{Architectural Concepts}{: High-Throughput APIs, Event-Driven Architecture, Microservices, CI/CD, Distributed Caching}
    }}
 \\end{itemize}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {Senior Software Engineer}{July 2023 -- Present}
      {CloudPulse Technologies}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Engineered Node.js backend microservices handling 12,000 requests per minute with Redis distributed caching layer, slashing p99 latency by 38\\%.}
        \\resumeItem{Architected high-throughput client dashboard using React and TypeScript, delivering real-time telemetry for 45,000+ daily active users with sub-second responsiveness.}
        \\resumeItem{Refactored PostgreSQL queries and implemented connection pooling, decreasing database memory load by 24\\% across high-concurrency production workloads.}
        \\resumeItem{Mentored 3 junior software engineers through bi-weekly 1:1s, rigorous code reviews, and distributed system design walkthroughs.}
      \\resumeItemListEnd

    \\resumeSubheading
      {Software Engineer}{June 2021 -- June 2023}
      {Apex Financial Solutions}{Seattle, WA}
      \\resumeItemListStart
        \\resumeItem{Engineered mission-critical payment checkout flow with React and Stripe API, processing \\$14M+ in annual financial transactions under zero-tolerance data integrity standards.}
        \\resumeItem{Constructed automated CI/CD deployment pipelines utilizing GitHub Actions and AWS ECS, reducing deployment lead time from 4 hours to 18 minutes.}
        \\resumeItem{Authored comprehensive automated test suites with Jest and Cypress achieving 88\\% test coverage across core financial processing paths.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      \\resumeSubheading
        {Distributed Task Queue}{TypeScript, Node.js, Redis, Docker}
        {Personal Project $|$ \\href{https://github.com/alexmorgan-code/task-queue}{\\underline{Code}}}{2023}
        \\resumeItemListStart
          \\resumeItem{Constructed an asynchronous task processing engine with prioritized scheduling, exponential backoff retry policies, and dead-letter queues.}
          \\resumeItem{Benchmarked performance under simulated heavy loads of 100,000 concurrent jobs with zero message loss.}
        \\resumeItemListEnd
    \\resumeSubHeadingListEnd

\\end{document}`,
      modelUsed: 'Demo Mode (Simulation)',
      generatedAt: '2026-10-10T12:00:00Z',
    },
  },
  {
    id: 'sample-ai-platform',
    name: 'Elena Chen — AI Platform & Infrastructure',
    role: 'Lead AI Platform Engineer',
    company: 'Nexus AI Systems',
    masterResumeTex: `\\documentclass[10pt,letterpaper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\titleformat{\\section}{\\large\\bfseries\\scshape}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{8pt}{4pt}

\\begin{document}
\\begin{center}
{\\LARGE \\textbf{Elena Chen}} \\\\
Seattle, WA $|$ elena.chen@ai-systems.io $|$ github.com/elenachen-ml
\\end{center}

\\section{Summary}
Infrastructure and MLOps engineer with 5+ years building distributed model training pipelines and GPU cluster workloads.

\\section{Skills}
\\textbf{Core}{: Python, C++, CUDA basics, PyTorch, Kubernetes, Docker, Terraform, MLflow, AWS, GCP}

\\section{Experience}
\\textbf{Senior ML Infrastructure Engineer} \\hfill 2022 -- Present \\\\
\\textit{DeepStream Labs}
\\begin{itemize}[noitemsep,topsep=0pt]
\\item Orchestrated multi-node PyTorch training workloads across 64 NVIDIA A100 GPUs using Slurm and Kubernetes.
\\item Cut model artifact sync latency by 45\\% using distributed S3 multipart streaming and NVMe caching.
\\item Implemented automated canary deployment for LLM inference microservices serving 2.5M daily queries.
\\end{itemize}

\\textbf{DevOps & Systems Engineer} \\hfill 2019 -- 2022 \\\\
\\textit{DataForge Cloud}
\\begin{itemize}[noitemsep,topsep=0pt]
\\item Provisioned hybrid Kubernetes clusters with Terraform and Helm across AWS and on-premise hardware.
\\item Maintained 99.98\\% uptime for mission-critical Redis and PostgreSQL state stores.
\\end{itemize}

\\section{Education}
\\textbf{B.S. in Electrical Engineering and Computer Science}, UC Berkeley (2019)
\\end{document}`,
    jobDescription: `Job: Lead AI Platform Engineer
Company: Nexus AI Systems
Requirements:
- Deep expertise in Kubernetes GPU scheduling, PyTorch DDP, and high-performance inference serving.
- Hands-on experience with Ray Core and Ray Train for distributed reinforcement learning.
- Triton Inference Server production optimization experience.
- Track record of driving 99.99% inference reliability at enterprise scale.`,
    demoResult: {
      matchScore: 78,
      scoreBreakdown: {
        skillsAlignment: 76,
        experienceRelevance: 82,
        keywordOptimization: 74,
        templateIntegrity: 98,
      },
      summary: "Elena Chen has strong infrastructure foundation across 64x A100 Kubernetes GPU orchestration and PyTorch multi-node training (DeepStream Labs). However, two explicit core requirements (Ray distributed training and Triton Inference Server) are not present in the master resume and have been highlighted as honest gaps.",
      matchedRequirements: [
        {
          id: 'mr-ai-1',
          requirement: 'Kubernetes GPU Scheduling & Cluster Orchestration',
          sourceEvidence: "DeepStream Labs: Multi-node PyTorch training workloads across 64 NVIDIA A100 GPUs using Kubernetes and Slurm.",
          category: 'core_skill',
          confidence: 0.97,
        },
        {
          id: 'mr-ai-2',
          requirement: 'Distributed PyTorch Training (Multi-Node)',
          sourceEvidence: "DeepStream Labs: Orchestrated training across 64 A100 GPUs with NVMe caching.",
          category: 'experience',
          confidence: 0.95,
        },
      ],
      missingRequirements: [
        {
          id: 'miss-ai-1',
          requirement: 'Ray Core and Ray Train for distributed execution',
          severity: 'critical',
          recommendation: "Ray is not present in the source resume. Frame your deep knowledge of Kubernetes job scheduling and Slurm as equivalent orchestration primitives while preparing to discuss Ray architectures.",
          sourceCheck: 'Source resume verified: Contains Kubernetes, Slurm, Terraform; Ray is absent.',
        },
        {
          id: 'miss-ai-2',
          requirement: 'Triton Inference Server optimization',
          severity: 'preferred',
          recommendation: "Do not fabricate Triton experience. Highlight LLM inference microservice deployments (2.5M daily queries) and latency reduction techniques truthfully.",
          sourceCheck: 'Source resume verified: Lists LLM inference microservices but not Triton Inference Server specifically.',
        },
      ],
      tailoringRecommendations: [
        {
          id: 'rec-ai-1',
          area: 'Summary Repositioning',
          suggestion: 'Refine summary to explicitly spotlight distributed GPU clusters and high-throughput LLM serving.',
          reason: 'Aligns directly with Nexus AI Systems while strictly respecting verified tenure.',
        },
      ],
      changesApplied: [
        {
          id: 'ch-ai-1',
          section: 'Summary',
          changeType: 'summary_tailored',
          originalSnippet: 'Infrastructure and MLOps engineer with 5+ years building distributed model training pipelines and GPU cluster workloads.',
          tailoredSnippet: 'AI Platform & Infrastructure Engineer with 5+ years scaling distributed PyTorch GPU clusters (64x A100) and enterprise LLM inference microservices under strict SLA uptime standards.',
          reasoning: 'Synthesized existing verified bullet details into the opening summary for maximum recruiter resonance.',
        },
      ],
      tailoredTex: `\\documentclass[10pt,letterpaper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\titleformat{\\section}{\\large\\bfseries\\scshape}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{8pt}{4pt}

\\begin{document}
\\begin{center}
{\\LARGE \\textbf{Elena Chen}} \\\\
Seattle, WA $|$ elena.chen@ai-systems.io $|$ github.com/elenachen-ml
\\end{center}

\\section{Professional Summary}
AI Platform and Infrastructure Engineer with 5+ years scaling distributed PyTorch GPU clusters (64x A100) and enterprise LLM inference microservices under strict SLA uptime standards.

\\section{Technical Skills}
\\textbf{Distributed Systems & AI}{: PyTorch, Multi-Node DDP, Slurm, Kubernetes (GPU operator), Docker, CUDA fundamentals} \\\\
\\textbf{Cloud & Infrastructure}{: Terraform, Helm, AWS, GCP, MLflow, NVMe Cache Streaming, S3} \\\\
\\textbf{Reliability & Storage}{: High-Availability PostgreSQL, Redis Cluster, Linux/Bash, CI/CD}

\\section{Experience}
\\textbf{Senior ML Infrastructure Engineer} \\hfill 2022 -- Present \\\\
\\textit{DeepStream Labs}
\\begin{itemize}[noitemsep,topsep=0pt]
\\item Orchestrated multi-node PyTorch training workloads across 64 NVIDIA A100 GPUs using Slurm and Kubernetes GPU scheduling.
\\item Implemented automated canary deployment for enterprise LLM inference microservices serving 2.5M daily queries with zero-downtime rollouts.
\\item Cut model artifact sync latency by 45\\% using distributed S3 multipart streaming and NVMe caching under heavy training loads.
\\end{itemize}

\\textbf{DevOps & Systems Engineer} \\hfill 2019 -- 2022 \\\\
\\textit{DataForge Cloud}
\\begin{itemize}[noitemsep,topsep=0pt]
\\item Provisioned hybrid Kubernetes clusters with Terraform and Helm across AWS and on-premise hardware.
\\item Maintained 99.98\\% uptime for mission-critical Redis and PostgreSQL state stores handling enterprise telemetry.
\\end{itemize}

\\section{Education}
\\textbf{B.S. in Electrical Engineering and Computer Science}, UC Berkeley (2019)
\\end{document}`,
      modelUsed: 'Demo Mode (Simulation)',
      generatedAt: '2026-10-10T12:00:00Z',
    },
  },
];
