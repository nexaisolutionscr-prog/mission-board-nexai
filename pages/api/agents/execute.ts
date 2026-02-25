// API endpoint: Queue tasks for agent execution (using Firestore client)
import type { NextApiRequest, NextApiResponse } from 'next';

interface ExecuteRequest {
  taskId: string;
  agentId: 'backend' | 'frontend' | 'uiux' | 'orbit';
  model: string;
  prompt: string;
  thinking?: boolean;
}

// In-memory queue (will use Firestore in production)
const taskQueue = new Map();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { taskId, agentId, model, prompt, thinking } = req.body as ExecuteRequest;

  if (!taskId || !agentId || !prompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const taskData = {
      id: taskId,
      agentId,
      model: model === 'codex' ? 'codex' : 'kimi',
      prompt,
      thinking: thinking || false,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      result: null,
      error: null,
    };
    
    // Store task (in production this goes to Firestore)
    taskQueue.set(taskId, taskData);
    
    // Log the task for the main agent to process
    console.log(`\n🤖 NEW TASK QUEUED`);
    console.log(`Task ID: ${taskId}`);
    console.log(`Agent: ${agentId}`);
    console.log(`Model: ${taskData.model}`);
    console.log(`Prompt: ${prompt.substring(0, 150)}...`);
    console.log(`\n⚠️  MAIN AGENT: Execute this task via sessions_spawn`);
    console.log(`Label: ${agentId}-task`);
    console.log(`\n`);

    return res.status(200).json({
      success: true,
      taskId,
      agentId,
      status: 'QUEUED',
      message: `Task queued for ${agentId}. Processing...`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Agent execution error:', error);
    return res.status(500).json({
      success: false,
      taskId,
      agentId,
      error: error instanceof Error ? error.message : 'Execution failed',
      status: 'FAILED',
    });
  }
}

// Export for polling
export { taskQueue };
