// Get current status of all agents
import type { NextApiRequest, NextApiResponse } from 'next';
import { taskQueue } from './execute';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all tasks from queue
    const tasks = Array.from(taskQueue.values());
    
    // Aggregate by agent
    const agentStatus: Record<string, any> = {};
    
    ['backend', 'frontend', 'uiux', 'orbit'].forEach(agentId => {
      const agentTasks = tasks.filter(t => t.agentId === agentId);
      const activeTask = agentTasks.find(t => t.status === 'RUNNING');
      const queuedTasks = agentTasks.filter(t => t.status === 'QUEUED');
      
      agentStatus[agentId] = {
        status: activeTask ? 'WORKING' : queuedTasks.length > 0 ? 'PENDING' : 'IDLE',
        currentTask: activeTask || null,
        queuedCount: queuedTasks.length,
        completedCount: agentTasks.filter(t => t.status === 'COMPLETED').length,
      };
    });

    return res.status(200).json({
      agents: agentStatus,
      totalTasks: tasks.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Status error:', error);
    return res.status(500).json({ error: 'Failed to get status' });
  }
}
