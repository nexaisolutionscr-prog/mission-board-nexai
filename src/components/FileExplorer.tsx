import React from 'react';
import { useDocuments } from '../hooks/useDocuments';

interface FileExplorerProps {
  onSelectDocument: (id: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onSelectDocument }) => {
  const { documents, error, loading } = useDocuments();

  if (loading) {
    return <div>Loading documents...</div>;
  }

  if (error) {
    return <div>Error loading documents: {error}</div>;
  }

  return (
    <div className='p-4 bg-white shadow-md rounded-lg'>
      <h2 className='text-lg font-bold mb-3'>Document Explorer</h2>
      <ul>
        {documents.map(doc => (
          <li key={doc.id} onClick={() => console.log(`Selected document ID: ${doc.id}`)}>
            {doc.title} - {doc.type} - {doc.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
