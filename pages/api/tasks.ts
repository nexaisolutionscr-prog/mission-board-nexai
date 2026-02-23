import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

const TASKS_KEY = 'mission-board:tasks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const tasks = await kv.get(TASKS_KEY) || [];
      return res.status(200).json({ tasks });
    }

    if (req.method === 'POST') {
      const { task } = req.body;
      if (!task || !task.title) {
        return res.status(400).json({ error: 'Task data required' });
      }

      const tasks: any[] = await kv.get(TASKS_KEY) || [];
      const newTask = {
        ...task,
        id: task.id || Date.now().toString(),
        assignee: task.assignee || 'none',
        priority: task.priority || 'Low',
        status: task.status || 'To Do',
      };
      tasks.push(newTask);
      await kv.set(TASKS_KEY, tasks);
      return res.status(201).json({ task: newTask });
    }

    if (req.method === 'PUT') {
      const { task, tasks: bulkTasks } = req.body;
      
      // Bulk update (set all tasks)
      if (bulkTasks && Array.isArray(bulkTasks)) {
        await kv.set(TASKS_KEY, bulkTasks);
        return res.status(200).json({ tasks: bulkTasks });
      }
      
      // Single task update
      if (!task || !task.id) {
        return res.status(400).json({ error: 'Task ID required' });
      }

      const tasks: any[] = await kv.get(TASKS_KEY) || [];
      const index = tasks.findIndex((t) => t.id === task.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }
      tasks[index] = { ...tasks[index], ...task };
      await kv.set(TASKS_KEY, tasks);
      return res.status(200).json({ task: tasks[index] });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Task ID required' });
      }

      const tasks: any[] = await kv.get(TASKS_KEY) || [];
      const filtered = tasks.filter((t) => t.id !== id);
      await kv.set(TASKS_KEY, filtered);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
