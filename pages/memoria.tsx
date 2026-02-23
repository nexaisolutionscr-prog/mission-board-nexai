import React from 'react';
import Layout from '../src/components/Layout';
import MemoryTimeline from '../src/components/MemoryTimeline';
import OpportunitiesKanban from '../src/components/OpportunitiesKanban';

const Memoria = () => {
  return (
    <Layout activeModule="memoria">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            🧠 Memoria & Contexto
          </h1>
          
          <div className="mb-8">
            <MemoryTimeline />
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Oportunidades de Negocio
            </h2>
            <OpportunitiesKanban />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Memoria;
