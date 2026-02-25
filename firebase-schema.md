# Firebase Database Schema for Agent Command Center

## Collections Structure

### 1. missions
```
missions/{missionId}
  - id: string
  - title: string
  - description: string
  - status: 'DRAFT' | 'PLANNING' | 'PENDING_APPROVAL' | 'EXECUTING' | 'COMPLETED' | 'CANCELLED'
  - createdBy: 'CEO'
  - createdAt: timestamp
  - updatedAt: timestamp
  - approvedAt: timestamp | null
  - approvalNotes: string | null
  - plan: {
      tasks: Task[]
      estimatedTime: number (hours)
      techStack: string
      architecture: string
    } | null
```

### 2. tasks
```
tasks/{taskId}
  - id: string
  - missionId: string (reference)
  - agentId: 'backend' | 'frontend' | 'uiux' | 'orbit'
  - title: string
  - description: string
  - status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED'
  - progress: number (0-100)
  - startedAt: timestamp | null
  - completedAt: timestamp | null
  - artifacts: string[] (file paths)
  - code: string | null (generated code)
  - logs: string[] (agent execution logs)
```

### 3. questions (CEO Queue)
```
questions/{questionId}
  - id: string
  - missionId: string
  - taskId: string
  - agentId: string
  - question: string
  - context: string
  - options: string[] | null
  - urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  - status: 'PENDING' | 'ANSWERED'
  - ceoAnswer: string | null
  - createdAt: timestamp
  - answeredAt: timestamp | null
```

### 4. agentExecutions
```
executions/{executionId}
  - id: string
  - taskId: string
  - agentId: string
  - status: 'RUNNING' | 'COMPLETED' | 'FAILED'
  - output: string (console output)
  - artifacts: string[]
  - startedAt: timestamp
  - completedAt: timestamp | null
```

## Security Rules
- Only authenticated users can read/write
- CEO role has full access
- ORBIT system has service account access
