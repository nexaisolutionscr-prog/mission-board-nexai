import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json({ documents });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  } else if (req.method === 'POST') {
    try {
      const docData = {
        ...req.body,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, 'documents'), docData);
      res.status(201).json({ id: docRef.id, ...docData });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create document' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
