import { User, Job, Application } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-1',
    email: 'admin@jobportal.com',
    name: 'Sarah Connor',
    role: 'Admin',
    bio: 'System Administrator and Platform Moderator.',
    joinedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'u-rec-1',
    email: 'recruiter1@stripe.com',
    name: 'Marcus Aurelius',
    role: 'Recruiter',
    bio: 'Senior Technical Recruiter at Stripe. Looking for exceptional UI/UX developers.',
    joinedAt: '2026-02-10T10:30:00Z',
  },
  {
    id: 'u-rec-2',
    email: 'recruiter2@linear.app',
    name: 'Karla Garcia',
    role: 'Recruiter',
    bio: 'Product Recruiting Lead at Linear. We build the future of project management.',
    joinedAt: '2026-03-01T14:20:00Z',
  },
  {
    id: 'u-cand-1',
    email: 'alex@gmail.com',
    name: 'Alex Rivera',
    role: 'Candidate',
    bio: 'Passionate Full Stack Developer with 3+ years of experience in React, TypeScript, and Node.js.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    joinedAt: '2026-05-12T08:15:00Z',
  },
  {
    id: 'u-cand-2',
    email: 'priya@gmail.com',
    name: 'Priya Sharma',
    role: 'Candidate',
    bio: 'Recent Computer Science graduate with strong fundamentals in algorithms and front-end development.',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Figma', 'Python'],
    joinedAt: '2026-06-01T11:45:00Z',
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    salary: '$140k - $180k',
    description: 'We are looking for a Senior Frontend Engineer to build and scale beautiful interfaces for our developer billing tools. You will work closely with product designers and backend engineers to craft robust, accessible, and ultra-performant Web applications.',
    requirements: [
      '5+ years of software development experience',
      'Strong mastery of React, TypeScript, and Tailwind CSS',
      'Experience optimizing rendering performance and network footprint',
      'A keen eye for layout, typography, and microscopic detailing'
    ],
    recruiterId: 'u-rec-1',
    recruiterName: 'Marcus Aurelius',
    postedAt: '2026-06-25T10:00:00Z',
  },
  {
    id: 'job-2',
    title: 'Product Designer (Figma Core)',
    company: 'Stripe',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$120k - $150k',
    description: 'Join our Core Design team to redefine how developers interact with finances globally. You will design, build, and test next-generation dashboard components, widgets, and user onboarding flows.',
    requirements: [
      '3+ years of professional UX/UI product design experience',
      'Extensive portfolio demonstrating complex system design',
      'Proficiency in Figma, design tokens, and components systems',
      'Basic knowledge of frontend technologies (HTML/CSS/React) is a plus'
    ],
    recruiterId: 'u-rec-1',
    recruiterName: 'Marcus Aurelius',
    postedAt: '2026-06-27T15:30:00Z',
  },
  {
    id: 'job-3',
    title: 'Software Engineer - Systems & API',
    company: 'Linear',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$130k - $170k',
    description: 'Linear is looking for a Systems & API Engineer to lead our client-server synchronization layers. You will be designing the ultra-fast sync protocols that power our smooth offline-first collaborative workspace.',
    requirements: [
      'Deep knowledge of Node.js, TypeScript, and WebSockets',
      'Experience with relational databases and high-concurrency architectures',
      'Strong commitment to minimal latencies and clean API contracts',
      'Self-driven work ethic suited for a fully distributed team'
    ],
    recruiterId: 'u-rec-2',
    recruiterName: 'Karla Garcia',
    postedAt: '2026-06-28T09:12:00Z',
  },
  {
    id: 'job-4',
    title: 'Frontend Intern',
    company: 'Linear',
    location: 'Paris, France (Onsite)',
    type: 'Internship',
    salary: '€2.5k / month',
    description: 'We are seeking an enthusiastic Frontend Intern to join our web team for 6 months. You will work on real user features, fix high-impact design bugs, and learn modern software engineering practices in a highly collaborative setting.',
    requirements: [
      'Enrolled in or recently graduated from a Computer Science degree or equivalent bootcamp',
      'Strong knowledge of modern JavaScript/TypeScript and CSS',
      'Excitement about building high-fidelity client interfaces',
      'Familiarity with Git and React basics'
    ],
    recruiterId: 'u-rec-2',
    recruiterName: 'Karla Garcia',
    postedAt: '2026-06-29T16:00:00Z',
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Stripe',
    candidateId: 'u-cand-1',
    candidateName: 'Alex Rivera',
    candidateEmail: 'alex@gmail.com',
    status: 'Shortlisted',
    coverLetter: 'I am highly passionate about Stripe\'s design standards and have spent the last 3 years perfecting my TypeScript and Tailwind craftsmanship. I would love to contribute to Stripe Billing.',
    appliedAt: '2026-06-26T14:30:00Z',
  },
  {
    id: 'app-2',
    jobId: 'job-4',
    jobTitle: 'Frontend Intern',
    company: 'Linear',
    candidateId: 'u-cand-2',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya@gmail.com',
    status: 'Pending',
    coverLetter: 'I am a huge fan of Linear\'s speed and offline-first philosophy! Building highly interactive interfaces with React and CSS is my specialty, and I would love to learn from your team.',
    appliedAt: '2026-06-30T10:00:00Z',
  }
];
