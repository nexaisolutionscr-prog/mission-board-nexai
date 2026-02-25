// Agent Task Service - Conecta agentes visuales a trabajo REAL via sessions_spawn
import { AgentId, AgentStatus, CurrentTask } from '../components/orbot/types';

export interface TaskRequest {
  id: string;
  agentId: AgentId;
  type: 'CODE' | 'DESIGN' | 'RESEARCH' | 'ARCHITECTURE';
  description: string;
  prompt: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: string;
  error?: string;
}

// Central Task Queue
let taskQueue: TaskRequest[] = [];
let activeTasks: Map<AgentId, TaskRequest> = new Map();

// Agent to Model mapping
const AGENT_MODELS: Record<AgentId, string> = {
  backend: 'codex',      // OpenAI Codex para código
  frontend: 'codex',    // OpenAI Codex para React/frontend
  uiux: 'kimi',         // Kimi para diseño y UI/UX
  orbit: 'kimi',        // Kimi para orquestación
  ceo: 'kimi',
};

// Execute task via gateway sessions_spawn (real work)
export async function executeTask(task: TaskRequest): Promise<void> {
  const startTime = new Date();
  task.startedAt = startTime;
  task.status = 'RUNNING';
  activeTasks.set(task.agentId, task);

  try {
    // Enviar tarea a subagente real via gateway API
    const response = await fetch('/api/agents/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: task.id,
        agentId: task.agentId,
        model: AGENT_MODELS[task.agentId],
        prompt: task.prompt,
        thinking: task.agentId === 'uiux' || task.agentId === 'orbit',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    
    task.status = 'COMPLETED';
    task.completedAt = new Date();
    task.result = result.output || result.result || 'Tarea completada';
    
  } catch (error) {
    task.status = 'FAILED';
    task.completedAt = new Date();
    task.error = error instanceof Error ? error.message : 'Unknown error';
  } finally {
    activeTasks.delete(task.agentId);
    updateTaskInQueue(task);
  }
}

export function createTask(
  agentId: AgentId,
  type: TaskRequest['type'],
  description: string,
  prompt: string
): TaskRequest {
  const task: TaskRequest = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    agentId,
    type,
    description,
    prompt,
    status: 'PENDING',
    createdAt: new Date(),
  };
  
  taskQueue.push(task);
  return task;
}

export function getNextTaskForAgent(agentId: AgentId): TaskRequest | undefined {
  return taskQueue.find(t => t.agentId === agentId && t.status === 'PENDING');
}

export function getAgentTask(agentId: AgentId): TaskRequest | undefined {
  return activeTasks.get(agentId);
}

export function updateTaskInQueue(updatedTask: TaskRequest): void {
  const index = taskQueue.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    taskQueue[index] = updatedTask;
  }
}

export function getAllTasks(): TaskRequest[] {
  return [...taskQueue];
}

export function getTasksForAgent(agentId: AgentId): TaskRequest[] {
  return taskQueue.filter(t => t.agentId === agentId);
}

// Convert task to CurrentTask for UI display
export function taskToCurrentTask(task: TaskRequest): CurrentTask {
  const progress = calculateProgress(task);
  return {
    description: task.description,
    progress,
    startedAt: task.startedAt || task.createdAt,
  };
}

function calculateProgress(task: TaskRequest): number {
  if (task.status === 'COMPLETED') return 100;
  if (task.status === 'FAILED') return 0;
  if (task.status === 'PENDING') return 0;
  
  // RUNNING: estimate based on time (assume 2 min average)
  if (task.startedAt) {
    const elapsed = Date.now() - task.startedAt.getTime();
    const estimated = 2 * 60 * 1000; // 2 minutes
    return Math.min(95, Math.round((elapsed / estimated) * 100));
  }
  
  return 50;
}

// Start task processor loop
export function startTaskProcessor(): void {
  setInterval(async () => {
    // Check each agent for pending tasks
    const agents: AgentId[] = ['backend', 'frontend', 'uiux'];
    
    for (const agentId of agents) {
      const activeTask = activeTasks.get(agentId);
      if (activeTask) continue; // Agent busy
      
      const nextTask = getNextTaskForAgent(agentId);
      if (nextTask) {
        await executeTask(nextTask);
      }
    }
  }, 5000); // Check every 5 seconds
}
