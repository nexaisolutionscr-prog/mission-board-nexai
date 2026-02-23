import React from 'react';
import Layout from '../src/components/Layout';
import CostChart from '../src/components/CostChart';
import GoalProgress from '../src/components/GoalProgress';
import { CronJob, useCronJobs } from '../src/hooks/useCronJobs';

const Asistente = () => {
  const { jobs, executions, loading, error } = useCronJobs();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout activeModule="asistente">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            🤖 Asistente ORBIT
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <GoalProgress progress={15} />
            </div>
            <div className="lg:col-span-2">
              <CostChart />
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Cron Jobs Activos
            </h2>
            {loading ? (
              <p>Cargando...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job: CronJob) => (
                  <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{job.name}</h3>
                      <span className={`text-xs text-white rounded-full px-2 py-1 ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{job.description}</p>
                    <div className="text-xs text-gray-500">
                      <p>Última ejecución: {new Date(job.lastRun).toLocaleString()}</p>
                      <p>Próxima: {new Date(job.nextRun).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Ejecuciones Recientes
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              {executions.slice(0, 5).map((exec) => (
                <div key={exec.id} className="border-b border-gray-200 dark:border-gray-700 p-4 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{exec.jobName}</span>
                    <span className={`text-xs px-2 py-1 rounded ${exec.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {exec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Asistente;
