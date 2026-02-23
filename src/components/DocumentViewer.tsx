import React from 'react';
import { useDocuments } from '../hooks/useDocuments';
import ReactMarkdown from 'react-markdown';

interface DocumentViewerProps {
  selectedDocumentId: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ selectedDocumentId }) => {
  const { documents } = useDocuments();
  const document = documents.find(doc => doc.id === selectedDocumentId);

  if (!document) {
    return <div>Select a document to view its content.</div>;
  }

  return (
    <div className='bg-white rounded-xl p-6 shadow-lg'>
      <h3 className='text-lg font-semibold mb-4'>{document.title}</h3>
      <ReactMarkdown>{document.content}</ReactMarkdown>
    </div>
  );
};

export default DocumentViewer;
