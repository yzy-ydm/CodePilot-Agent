export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  project_type: 'graduation' | 'course' | 'personal' | 'other';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  task_count: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string | null;
  user_id: string;
  agent_type: 'planner' | 'coder' | 'debug' | 'report';
  title: string | null;
  input: string;
  output: string | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error_message: string | null;
  tokens_used: number;
  created_at: string;
  updated_at: string;
}

export interface AgentLog {
  id: string;
  task_id: string;
  agent_name: string;
  action: string;
  input: string | null;
  output: string | null;
  tokens_used: number;
  created_at: string;
}
