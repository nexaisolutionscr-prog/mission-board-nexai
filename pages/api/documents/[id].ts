import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../src/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const docSnap = await getDoc(doc(db, 'documents', id as string));
      if (!docSnap.exists()) return res.status(404).json({ error: 'Document not found' });
      res.status(200).json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch document' });
    }
  } else if (req.method === 'PUT') {
    try {
      await updateDoc(doc(db, 'documents', id as string), {
        ...req.body,
        updatedAt: Timestamp.now()
      });
      res.status(200).json({ id, ...req.body });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update document' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteDoc(doc(db, 'documents', id as string));
      res.status(200).json({ message: 'Document deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete document' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
