// Agent Command Center - Real Types

export type AgentId = 'backend' | 'frontend' | 'uiux' | 'orbit';
export type AgentStatus = 'IDLE' | 'WORKING' | 'MOVING_TO_MEETING' | 'IN_MEETING' | 'RETURNING';
export type MissionStatus = 'DRAFT' | 'PLANNING' | 'PENDING_APPROVAL' | 'EXECUTING' | 'COMPLETED' | 'CANCELLED';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED';
export type QuestionUrgency = 'LOW' | 'MEDIUM' | 'HIGH';
export type QuestionStatus = 'PENDING' | 'ANSWERED';

export interface Position {
  x: number;
  y: number;
}

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
  position: Position;
  workstationPosition: Position;
  avatarColor: string;
  symbol: string;
  glowColor: string;
  currentTask?: string; // taskId
  isExecuting?: boolean;
}

export interface MissionPlan {
  tasks: Task[];
  estimatedTime: number;
  techStack: string;
  architecture: string;
  dependencies: string[];
  risks: string[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: MissionStatus;
  createdBy: 'CEO';
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvalNotes?: string;
  plan?: MissionPlan;
}

export interface Task {
  id: string;
  missionId: string;
  agentId: AgentId;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  artifacts: string[];
  code?: string;
  logs: string[];
}

export interface Question {
  id: string;
  missionId: string;
  taskId: string;
  agentId: AgentId;
  question: string;
  context: string;
  options?: string[];
  urgency: QuestionUrgency;
  status: QuestionStatus;
  ceoAnswer?: string;
  createdAt: Date;
  answeredAt?: Date;
}

export interface AgentExecution {
  id: string;
  taskId: string;
  agentId: AgentId;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  output: string;
  artifacts: string[];
  startedAt: Date;
  completedAt?: Date;
}

export interface MeetingMessage {
  id: string;
  timestamp: Date;
  agentId: AgentId;
  message: string;
  type: 'CHAT' | 'PROPOSAL' | 'QUESTION' | 'APPROVAL';
}

// Initial agent configurations
export const AGENT_CONFIGS: Omit<Agent, 'status' | 'position' | 'currentTask' | 'isExecuting'>[] = [
  {
    id: 'backend',
    name: 'Backend Expert',
    role: 'Backend Specialist',
    workstationPosition: { x: 15, y: 70 },
    avatarColor: '#8B5CF6',
    symbol: '⚙️',
    glowColor: 'rgba(139, 92, 246, 0.4)',
  },
  {
    id: 'frontend',
    name: 'Frontend Expert',
    role: 'Frontend Specialist',
    workstationPosition: { x: 85, y: 70 },
    avatarColor: '#06B6D4',
    symbol: '⚛️',
    glowColor: 'rgba(6, 182, 212, 0.4)',
  },
  {
    id: 'uiux',
    name: 'UI/UX Expert',
    role: 'UI/UX Specialist',
    workstationPosition: { x: 50, y: 85 },
    avatarColor: '#F59E0B',
    symbol: '🎨',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'orbit',
    name: 'ORBIT',
    role: 'Orchestrator',
    workstationPosition: { x: 50, y: 25 },
    avatarColor: '#EC4899',
    symbol: '🛰️',
    glowColor: 'rgba(236, 72, 153, 0.4)',
  },
];

// Round table center position
export const ROUND_TABLE_POSITION: Position = { x: 50, y: 50 };

// Meeting positions for each agent
export const MEETING_POSITIONS: Record<AgentId, Position> = {
  backend: { x: 35, y: 40 },
  frontend: { x: 65, y: 40 },
  uiux: { x: 50, y: 65 },
  orbit: { x: 50, y: 35 },
};
