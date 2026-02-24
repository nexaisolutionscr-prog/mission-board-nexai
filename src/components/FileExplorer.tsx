import React, { useState, useMemo } from 'react';
import { useDocuments, Document } from '../hooks/useDocuments';
import { ChevronDown, ChevronRight, FileText, Calendar } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface FileExplorerProps {
  onSelectDocument: (id: string) => void;
  selectedDocumentId?: string;
}

interface DocumentGroup {
  label: string;
  date: Date;
  documents: Document[];
}

const getDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
  
  if (isSameDay(date, today)) return 'Hoy';
  if (isSameDay(date, yesterday)) return 'Ayer';
  
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
};

const formatDate = (timestamp: Timestamp | Date | string): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return timestamp as Date;
};

const FileExplorer: React.FC<FileExplorerProps> = ({ onSelectDocument, selectedDocumentId }) => {
  const { documents, error, loading } = useDocuments();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Hoy', 'Ayer']));
  const [searchTerm, setSearchTerm] = useState('');

  const groupedDocuments = useMemo(() => {
    const filtered = searchTerm
      ? documents.filter(doc => 
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : documents;

    const groups = new Map<string, DocumentGroup>();
    
    filtered.forEach(doc => {
      const date = formatDate(doc.createdAt);
      const label = getDateLabel(date);
      
      if (!groups.has(label)) {
        groups.set(label, { label, date, documents: [] });
      }
      groups.get(label)!.documents.push(doc);
    });
    
    return Array.from(groups.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [documents, searchTerm]);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400 text-sm">Error cargando documentos: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Documentos ({documents.length})
        </h2>
        
        {/* Search */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Document Groups */}
      <div className="max-h-[600px] overflow-y-auto">
        {groupedDocuments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No hay documentos</p>
          </div>
        ) : (
          groupedDocuments.map((group) => (
            <div key={group.label} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {group.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {group.documents.length}
                  </span>
                </div>
                {expandedGroups.has(group.label) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Documents in Group */}
              {expandedGroups.has(group.label) && (
                <div className="pb-2">
                  {group.documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => onSelectDocument(doc.id)}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors border-l-2 ${
                        selectedDocumentId === doc.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                          : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="font-medium truncate">{doc.title}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 mt-0.5">
                        <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                          {doc.type}
                        </span>
                        <span>{doc.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
