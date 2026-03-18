// ── User ──────────────────────────────────────────────────
export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDATE' | 'RECRUITER';
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

// ── Job ───────────────────────────────────────────────────
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  contractType: string;
  description: string;
  requirements?: string;
  salary?: string;
  status: string;
  recruiterName: string;
  applicationCount: number;
  createdAt: string;
}

export interface CreateJobRequest {
  title: string;
  company: string;
  location: string;
  contractType: string;
  description: string;
  requirements?: string;
  salary?: string;
}

// ── Application ───────────────────────────────────────────
export interface Application {
  id: number;
  jobTitle: string;
  company: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
}

export interface ApplyRequest {
  jobId: number;
  coverLetter: string;
}
