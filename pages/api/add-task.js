import fs from 'fs';
import path from 'path';

const TASKS_FILE = path.join(process.cwd(), 'data', 'tasks.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize tasks file if not exists
if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify([]));
}

export default function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for auth token (simple security)
  const authToken = req.headers['x-auth-token'];
  const expectedToken = process.env.API_SECRET || 'orbit-secret-token';
  
  if (authToken !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { title, description, priority = 'Low', status = 'To Do', source = 'Orbit' } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Read existing tasks
    let tasks = [];
    try {
      const data = fs.readFileSync(TASKS_FILE, 'utf8');
      tasks = JSON.parse(data);
    } catch {
      tasks = [];
    }

    // Create new task
    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || '',
      priority,
      status,
      source,
      createdBy: 'Orbit',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to tasks
    tasks.push(newTask);

    // Save tasks
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));

    return res.status(200).json({
      success: true,
      task: newTask,
      totalTasks: tasks.length
    });

  } catch (error) {
    console.error('Error adding task:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
