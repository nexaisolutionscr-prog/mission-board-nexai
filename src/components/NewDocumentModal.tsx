import React, { useState } from 'react';
import { useDocuments, DocumentType } from '../hooks/useDocuments';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewDocumentModal: React.FC<NewDocumentModalProps> = ({ isOpen, onClose }) => {
  const { createDocument } = useDocuments();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<DocumentType>('news');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const documentData = {
      title,
      content,
      type,
      category,
      tags: tags.split(',').map(tag => tag.trim())
    };
    await createDocument(documentData);
    onClose(); // Close the modal on success
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> {/* Prevent modal from closing when clicking inside the content */}
        <h2>Create New Document</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label htmlFor="content">Content:</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />

          <label htmlFor="type">Type:</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value as DocumentType)}>
            <option value="news">News</option>
            <option value="reports">Reports</option>
            <option value="content">Content</option>
            <option value="proposals">Proposals</option>
            <option value="other">Other</option>
          </select>

          <label htmlFor="category">Category:</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />

          <label htmlFor="tags">Tags (comma-separated):</label>
          <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />

          <button type="submit">Create Document</button>
        </form>
      </div>
    </div>
  );
};

export default NewDocumentModal;
