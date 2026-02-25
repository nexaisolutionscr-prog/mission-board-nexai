import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Mission, Task, Question } from '../types/orbot';

// Hook para escuchar misiones en tiempo real
export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'missions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const missionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Mission[];
        setMissions(missionsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { missions, loading, error };
}

// Hook para una misión específica
export function useMission(missionId: string | null) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!missionId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'missions', missionId),
      (doc) => {
        if (doc.exists()) {
          setMission({ id: doc.id, ...doc.data() } as Mission);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [missionId]);

  return { mission, loading };
}

// Hook para tareas de una misión
export function useMissionTasks(missionId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!missionId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('missionId', '==', missionId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        setTasks(tasksData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [missionId]);

  return { tasks, loading };
}

// Hook para preguntas pendientes del CEO
export function usePendingQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'questions'),
      where('status', '==', 'PENDING'),
      orderBy('urgency', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const questionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Question[];
        setQuestions(questionsData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { questions, loading };
}

// Crear nueva misión
export async function createMission(title: string, description: string) {
  const missionData = {
    title,
    description,
    status: 'DRAFT',
    createdBy: 'CEO',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    plan: null,
    approvedAt: null,
    approvalNotes: null
  };

  return await addDoc(collection(db, 'missions'), missionData);
}

// Actualizar plan de misión
export async function updateMissionPlan(
  missionId: string, 
  plan: Mission['plan']
) {
  await updateDoc(doc(db, 'missions', missionId), {
    plan,
    status: 'PENDING_APPROVAL',
    updatedAt: Timestamp.now()
  });
}

// Aprobar misión
export async function approveMission(
  missionId: string, 
  notes?: string
) {
  await updateDoc(doc(db, 'missions', missionId), {
    status: 'EXECUTING',
    approvedAt: Timestamp.now(),
    approvalNotes: notes || null,
    updatedAt: Timestamp.now()
  });
}

// Crear tarea
export async function createTask(
  missionId: string,
  agentId: string,
  title: string,
  description: string
) {
  const taskData = {
    missionId,
    agentId,
    title,
    description,
    status: 'PENDING',
    progress: 0,
    startedAt: null,
    completedAt: null,
    artifacts: [],
    code: null,
    logs: [],
    createdAt: Timestamp.now()
  };

  return await addDoc(collection(db, 'tasks'), taskData);
}

// Actualizar progreso de tarea
export async function updateTaskProgress(
  taskId: string,
  progress: number,
  log?: string
) {
  const updates: any = {
    progress,
    updatedAt: Timestamp.now()
  };

  if (log) {
    updates.logs = arrayUnion(log);
  }

  if (progress === 0) {
    updates.status = 'IN_PROGRESS';
    updates.startedAt = Timestamp.now();
  }

  if (progress === 100) {
    updates.status = 'DONE';
    updates.completedAt = Timestamp.now();
  }

  await updateDoc(doc(db, 'tasks', taskId), updates);
}

// Guardar código generado
export async function saveTaskCode(
  taskId: string,
  code: string,
  filename: string
) {
  // Subir a Storage
  const codeRef = ref(storage, `code/${taskId}/${filename}`);
  await uploadString(codeRef, code, 'raw');
  const url = await getDownloadURL(codeRef);

  // Actualizar tarea
  await updateDoc(doc(db, 'tasks', taskId), {
    code,
    artifacts: arrayUnion(url),
    updatedAt: Timestamp.now()
  });
}

// Crear pregunta para CEO
export async function createQuestion(
  missionId: string,
  taskId: string,
  agentId: string,
  question: string,
  context: string,
  options?: string[],
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM'
) {
  const questionData = {
    missionId,
    taskId,
    agentId,
    question,
    context,
    options: options || null,
    urgency,
    status: 'PENDING',
    ceoAnswer: null,
    createdAt: Timestamp.now(),
    answeredAt: null
  };

  return await addDoc(collection(db, 'questions'), questionData);
}

// Responder pregunta del CEO
export async function answerQuestion(
  questionId: string,
  answer: string
) {
  await updateDoc(doc(db, 'questions', questionId), {
    status: 'ANSWERED',
    ceoAnswer: answer,
    answeredAt: Timestamp.now()
  });
}

import { arrayUnion } from 'firebase/firestore';
