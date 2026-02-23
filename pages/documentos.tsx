import React, { useState } from 'react';
import Layout from '../src/components/Layout';
import FileExplorer from '../src/components/FileExplorer';
import DocumentViewer from '../src/components/DocumentViewer';
import NewDocumentModal from '../src/components/NewDocumentModal';

const Documentos = () => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout activeModule="documentos">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            
ddc1 Documentos & Reportes
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <FileExplorer onSelectDocument={setSelectedDocumentId} />
            </div>
            <div className="lg:col-span-2">
              <DocumentViewer selectedDocumentId={selectedDocumentId} />
              <button className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded shadow-lg" onClick={() => setIsModalOpen(true)}>
                Nuevo Documento
              </button>
              <NewDocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documentos;
