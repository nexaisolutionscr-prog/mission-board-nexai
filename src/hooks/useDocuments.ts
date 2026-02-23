import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';

export type DocumentType = 'news' | 'reports' | 'content' | 'proposals' | 'memory' | 'other';

export interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  category: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateDocumentData {
  title: string;
  content: string;
  type: DocumentType;
  category: string;
  tags: string[];
}

export interface UpdateDocumentData {
  title?: string;
  content?: string;
  type?: DocumentType;
  category?: string;
  tags?: string[];
}

export interface UseDocumentsReturn {
  documents: Document[];
  loading: boolean;
  error: string | null;
  createDocument: (data: CreateDocumentData) => Promise<Document>;
  updateDocument: (id: string, data: UpdateDocumentData) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentById: (id: string) => Promise<Document | null>;
  refreshDocuments: () => Promise<void>;
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents from Firestore
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      setDocuments(docs);
      setError(null);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time subscription
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Document[];
        setDocuments(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError('Failed to subscribe to documents');
        setLoading(false);
        console.error('Firestore subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Create document
  const createDocument = async (data: CreateDocumentData): Promise<Document> => {
    const docData = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'documents'), docData);
    return { id: docRef.id, ...docData };
  };

  // Update document
  const updateDocument = async (id: string, data: UpdateDocumentData): Promise<void> => {
    const docRef = doc(db, 'documents', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  };

  // Delete document
  const deleteDocument = async (id: string): Promise<void> => {
    const docRef = doc(db, 'documents', id);
    await deleteDoc(docRef);
  };

  // Get document by ID
  const getDocumentById = async (id: string): Promise<Document | null> => {
    const docRef = doc(db, 'documents', id);
    const docSnap = await getDoc(docRef);
    return docSnap ? ({ id: docSnap.id, ...docSnap.data() } as Document) : null;
  };

  // Refresh documents
  const refreshDocuments = async (): Promise<void> => {
    await fetchDocuments();
  };

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    refreshDocuments
  };
}

export default useDocuments;
