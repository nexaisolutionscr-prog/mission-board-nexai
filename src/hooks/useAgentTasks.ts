// React hook: Connect agents to real task execution
import { useState, useCallback, useEffect } from 'react';
import { AgentId } from '../components/orbot/types';
import { 
  TaskRequest, 
  createTask, 
  getTasksForAgent,
  getAgentTask,
  taskToCurrentTask,
  startTaskProcessor 
} from '../services/agentTaskService';

interface UseAgentTasksReturn {
  tasks: TaskRequest[];
  activeTask: TaskRequest | undefined;
  createNewTask: (type: TaskRequest['type'], description: string, prompt: string) => TaskRequest;
  refreshTasks: () => void;
}

export function useAgentTasks(agentId: AgentId): UseAgentTasksReturn {
  const [tasks, setTasks] = useState<TaskRequest[]>([]);
  const [activeTask, setActiveTask] = useState<TaskRequest | undefined>();

  const refreshTasks = useCallback(() => {
    const agentTasks = getTasksForAgent(agentId);
    setTasks(agentTasks);
    setActiveTask(getAgentTask(agentId));
  }, [agentId]);

  const createNewTask = useCallback((
    type: TaskRequest['type'],
    description: string,
    prompt: string
  ): TaskRequest => {
    const task = createTask(agentId, type, description, prompt);
    refreshTasks();
    return task;
  }, [agentId, refreshTasks]);

  // Poll for updates every 2 seconds
  useEffect(() => {
    refreshTasks();
    const interval = setInterval(refreshTasks, 2000);
    return () => clearInterval(interval);
  }, [refreshTasks]);

  // Start task processor once (globally)
  useEffect(() => {
    startTaskProcessor();
  }, []);

  return {
    tasks,
    activeTask,
    createNewTask,
    refreshTasks,
  };
}

// Global task queue hook
export function useGlobalTasks(): {
  allTasks: TaskRequest[];
  pendingCount: number;
  completedCount: number;
  failedCount: number;
  refreshGlobal: () => void;
} {
  const [allTasks, setAllTasks] = useState<TaskRequest[]>([]);

  const refreshGlobal = useCallback(() => {
    // In real implementation, fetch from API
    setAllTasks([]); // Placeholder
  }, []);

  useEffect(() => {
    refreshGlobal();
    const interval = setInterval(refreshGlobal, 5000);
    return () => clearInterval(interval);
  }, [refreshGlobal]);

  const pendingCount = allTasks.filter(t => t.status === 'PENDING').length;
  const completedCount = allTasks.filter(t => t.status === 'COMPLETED').length;
  const failedCount = allTasks.filter(t => t.status === 'FAILED').length;

  return {
    allTasks,
    pendingCount,
    completedCount,
    failedCount,
    refreshGlobal,
  };
}
