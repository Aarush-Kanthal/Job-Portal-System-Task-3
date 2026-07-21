export type UserRole = 'Admin' | 'Recruiter' | 'Candidate';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePhoto?: string; // base64 representation or URL
  resume?: string;       // base64 representation of resume content (PDF/text)
  resumeName?: string;
  bio?: string;
  skills?: string[];
  joinedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  salary: string;
  description: string;
  requirements: string[];
  recruiterId: string;
  recruiterName: string;
  postedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhoto?: string;
  resume?: string;
  resumeName?: string;
  coverLetter?: string;
  status: 'Pending' | 'Shortlisted' | 'Rejected' | 'Hired';
  appliedAt: string;
}
