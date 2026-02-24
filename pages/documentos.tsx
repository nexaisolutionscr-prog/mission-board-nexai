import React, { useState } from 'react';
import Layout from '../src/components/Layout';
import FileExplorer from '../src/components/FileExplorer';
import DocumentViewer from '../src/components/DocumentViewer';
import NewDocumentModal from '../src/components/NewDocumentModal';
import { FileText, Plus, LayoutGrid, List } from 'lucide-react';

const Documentos = () => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'focus'>('split');

  return (
    <Layout activeModule="documentos">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-100/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  Documentos & Reportes
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Gestiona, organiza y visualiza todos tus documentos empresariales
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setViewMode('split')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'split'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title="Vista dividida"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('focus')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'focus'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title="Vista enfocada"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nuevo Documento</span>
                  <span className="sm:hidden">Nuevo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`grid gap-6 ${
            viewMode === 'split' 
              ? 'grid-cols-1 lg:grid-cols-12' 
              : 'grid-cols-1'
          }`}>
            {/* Sidebar - FileExplorer */}
            <div className={viewMode === 'split' ? 'lg:col-span-4 xl:col-span-3' : 'hidden'}>
              <FileExplorer 
                onSelectDocument={setSelectedDocumentId}
                selectedDocumentId={selectedDocumentId}
              />
            </div>

            {/* Main - Document Viewer */}
            <div className={viewMode === 'split' ? 'lg:col-span-8 xl:col-span-9' : 'col-span-1'}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Viewer Card */}
                <DocumentViewer selectedDocumentId={selectedDocumentId} />
                
                {/* Empty State */}
                {!selectedDocumentId && (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Selecciona un documento
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                      Elige un documento de la lista lateral para visualizarlo, editarlo o descargarlo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile View Toggle */}
          {viewMode === 'focus' && (
            <div className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    Explorador de Documentos
                  </h3>
                </div>
                <FileExplorer 
                  onSelectDocument={setSelectedDocumentId}
                  selectedDocumentId={selectedDocumentId}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <NewDocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
};

export default Documentos;
