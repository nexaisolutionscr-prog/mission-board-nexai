import { useState, useEffect } from 'react';

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'active' | 'paused' | 'failed';
  description: string;
}

export interface Execution {
  id: string;
  jobId: string;
  jobName: string;
  startedAt: string;
  finishedAt: string;
  status: 'success' | 'failed' | 'running';
  output: string;
}

export interface CronJobsData {
  jobs: CronJob[];
  executions: Execution[];
  loading: boolean;
  error: string | null;
}

// Mock data para el módulo Asistente
const mockJobs: CronJob[] = [
  {
    id: '1',
    name: 'Heartbeat Check',
    schedule: '0 */6 * * *',
    lastRun: '2026-02-21T20:00:00Z',
    nextRun: '2026-02-22T02:00:00Z',
    status: 'active',
    description: 'Verifica estado del sistema cada 6 horas'
  },
  {
    id: '2',
    name: 'Cost Reporter',
    schedule: '0 9 * * *',
    lastRun: '2026-02-21T09:00:00Z',
    nextRun: '2026-02-22T09:00:00Z',
    status: 'active',
    description: 'Genera reporte diario de costos API'
  },
  {
    id: '3',
    name: 'Memory Cleanup',
    schedule: '0 0 * * 0',
    lastRun: '2026-02-16T00:00:00Z',
    nextRun: '2026-02-23T00:00:00Z',
    status: 'active',
    description: 'Limpieza semanal de archivos temporales'
  },
  {
    id: '4',
    name: 'News Digest',
    schedule: '30 8 * * *',
    lastRun: '2026-02-21T08:30:00Z',
    nextRun: '2026-02-22T08:30:00Z',
    status: 'paused',
    description: 'Compila noticias de IA'
  }
];

const mockExecutions: Execution[] = [
  {
    id: 'e1',
    jobId: '1',
    jobName: 'Heartbeat Check',
    startedAt: '2026-02-21T20:00:00Z',
    finishedAt: '2026-02-21T20:00:05Z',
    status: 'success',
    output: 'All systems operational'
  },
  {
    id: 'e2',
    jobId: '2',
    jobName: 'Cost Reporter',
    startedAt: '2026-02-21T09:00:00Z',
    finishedAt: '2026-02-21T09:00:02Z',
    status: 'success',
    output: 'Report generated successfully'
  },
  {
    id: 'e3',
    jobId: '1',
    jobName: 'Heartbeat Check',
    startedAt: '2026-02-21T14:00:00Z',
    finishedAt: '2026-02-21T14:00:04Z',
    status: 'success',
    output: 'All systems operational'
  }
];

export function useCronJobs(): CronJobsData {
  const [data, setData] = useState<CronJobsData>({
    jobs: [],
    executions: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/cron-jobs');
        if (!response.ok) throw new Error('Failed to fetch cron jobs');
        const result = await response.json();
        setData({
          jobs: result.jobs || mockJobs,
          executions: result.executions || mockExecutions,
          loading: false,
          error: null
        });
      } catch (err) {
        console.log('Using mock data for cron jobs');
        setData({
          jobs: mockJobs,
          executions: mockExecutions,
          loading: false,
          error: null
        });
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 60000);
    return () => clearInterval(interval);
  }, []);

  return data;
}
