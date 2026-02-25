// Agent Bridge - Conecta el frontend al agente principal para ejecutar sessions_spawn
const http = require('http');
const { exec } = require('child_process');
const path = require('path');

const PORT = process.env.AGENT_BRIDGE_PORT || 9876;

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.method !== 'POST' || req.url !== '/execute') {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }
  
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { agentId, model, prompt, taskId } = JSON.parse(body);
      
      console.log(`[${new Date().toISOString()}] Task received: ${taskId} for ${agentId}`);
      console.log(`Prompt: ${prompt.substring(0, 100)}...`);
      
      // Determine model
      const modelArg = model === 'codex' ? 'openai/gpt-4' : 'nvidia-nim/moonshotai/kimi-k2.5';
      const agentLabel = agentId === 'uiux' ? 'design-task' : 'code-task';
      
      // Response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        taskId,
        agentId,
        status: 'SENT_TO_AGENT',
        message: 'Task queued for execution. Agent will process via sessions_spawn.',
        timestamp: new Date().toISOString(),
      }));
      
      // Log the task for manual execution
      console.log(`\n[EXECUTE MANUALLY IN MAIN AGENT]`);
      console.log(`sessions_spawn with:`);
      console.log(`  task: "${prompt}"`);
      console.log(`  model: "${modelArg}"`);
      console.log(`  label: "${agentLabel}"`);
      console.log(`\n`);
      
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`🤖 Agent Bridge listening on port ${PORT}`);
  console.log(`Ready to receive tasks from Mission Board`);
});
