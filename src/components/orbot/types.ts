// Agent Command Center - Types

export type AgentId = 'backend' | 'frontend' | 'uiux' | 'orbit' | 'ceo';
export type AgentStatus = 'IDLE' | 'WORKING' | 'MOVING_TO_MEETING' | 'IN_MEETING' | 'RETURNING';

export interface Position {
  x: number;
  y: number;
}

export interface CurrentTask {
  description: string;
  progress: number; // 0-100
  startedAt: Date;
}

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
  position: Position;
  workstationPosition: Position;
  currentTask?: CurrentTask;
  avatarColor: string;
  symbol: string;
  glowColor: string;
}

export interface MeetingMessage {
  timestamp: Date;
  agentId: AgentId;
  message: string;
}

export interface MeetingSession {
  id: string;
  status: 'ACTIVE' | 'ENDED';
  participants: AgentId[];
  topic: string;
  messages: MeetingMessage[];
  startTime: Date;
  endTime?: Date;
  conclusion?: string;
}

export type CommandType = 'CONVOKE_MEETING' | 'DISMISS_MEETING' | 'ASSIGN_TASK' | 'CANCEL_TASK';

export interface CommandEvent {
  type: CommandType;
  timestamp: Date;
  payload: any;
  triggeredBy: 'CEO' | 'ORBIT';
}

// Full agent data with initial state
export const agentsData: Agent[] = [
  {
    id: 'backend',
    name: 'Backend Expert',
    role: 'Backend Specialist',
    status: 'IDLE',
    position: { x: 15, y: 70 },
    workstationPosition: { x: 15, y: 70 },
    avatarColor: '#8B5CF6',
    symbol: '⚙️',
    glowColor: 'rgba(139, 92, 246, 0.4)',
  },
  {
    id: 'frontend',
    name: 'Frontend Expert',
    role: 'Frontend Specialist',
    status: 'IDLE',
    position: { x: 85, y: 70 },
    workstationPosition: { x: 85, y: 70 },
    avatarColor: '#06B6D4',
    symbol: '⚛️',
    glowColor: 'rgba(6, 182, 212, 0.4)',
  },
  {
    id: 'uiux',
    name: 'UI/UX Expert',
    role: 'UI/UX Specialist',
    status: 'IDLE',
    position: { x: 50, y: 85 },
    workstationPosition: { x: 50, y: 85 },
    avatarColor: '#F59E0B',
    symbol: '🎨',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'orbit',
    name: 'ORBIT',
    role: 'Orchestrator',
    status: 'IDLE',
    position: { x: 50, y: 25 },
    workstationPosition: { x: 50, y: 25 },
    avatarColor: '#EC4899',
    symbol: '🛰️',
    glowColor: 'rgba(236, 72, 153, 0.4)',
  },
];

// Initial agent configurations
export const AGENT_CONFIGS: Omit<Agent, 'status' | 'position' | 'currentTask'>[] = [
  {
    id: 'backend',
    name: 'Backend Expert',
    role: 'Backend Specialist',
    workstationPosition: { x: 15, y: 70 },
    avatarColor: '#8B5CF6', // Violet
    symbol: '⚙️',
    glowColor: 'rgba(139, 92, 246, 0.4)',
  },
  {
    id: 'frontend',
    name: 'Frontend Expert',
    role: 'Frontend Specialist',
    workstationPosition: { x: 85, y: 70 },
    avatarColor: '#06B6D4', // Cyan
    symbol: '⚛️',
    glowColor: 'rgba(6, 182, 212, 0.4)',
  },
  {
    id: 'uiux',
    name: 'UI/UX Expert',
    role: 'UI/UX Specialist',
    workstationPosition: { x: 50, y: 85 },
    avatarColor: '#F59E0B', // Amber
    symbol: '🎨',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'orbit',
    name: 'ORBIT',
    role: 'Orchestrator',
    workstationPosition: { x: 50, y: 25 },
    avatarColor: '#EC4899', // Pink
    symbol: '🛰️',
    glowColor: 'rgba(236, 72, 153, 0.4)',
  },
];

// Round table center position (percentage)
export const ROUND_TABLE_POSITION: Position = { x: 50, y: 50 };

// Positions for agents around the round table (when in meeting)
export const MEETING_POSITIONS: Record<AgentId, Position> = {
  backend: { x: 35, y: 40 },
  frontend: { x: 65, y: 40 },
  uiux: { x: 50, y: 65 },
  orbit: { x: 50, y: 35 },
  ceo: { x: 50, y: 20 },
};
