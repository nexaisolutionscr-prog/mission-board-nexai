import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';

const TASKS_COLLECTION = 'tasks';

export function useFirebaseTasks() {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Real-time sync with Firestore
  useEffect(() => {
    setLoading(true);
    const tasksQuery = query(
      collection(db, TASKS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasksData: Task[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          tasksData.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            priority: data.priority,
            status: data.status,
            assignee: data.assignee || 'none',
            
          });
        });
        setTasksState(tasksData);
        setLoading(false);
        setError(null);
        setInitialized(true);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Error de conexión. Usando modo offline.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const setTasks = useCallback(async (update: Task[] | ((prev: Task[]) => Task[])) => {
    const newTasks = update instanceof Function ? update(tasks) : update;
    setTasksState(newTasks);

    // Sync to Firestore (batch update)
    try {
      const batch = writeBatch(db);
      const tasksRef = collection(db, TASKS_COLLECTION);
      
      // Delete all existing
      const existing = await getDocs(tasksRef);
      existing.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Add new tasks
      newTasks.forEach((task) => {
        const taskRef = doc(tasksRef, task.id);
        batch.set(taskRef, {
          ...task,
          createdAt: Timestamp.now(),
        });
      });

      await batch.commit();
    } catch (err) {
      console.error('Sync error:', err);
    }
  }, [tasks]);

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      assignee: newTask.assignee || 'none',
      priority: newTask.priority || 'Low',
      status: newTask.status || 'To Do',
    };

    try {
      await setDoc(doc(db, TASKS_COLLECTION, task.id), {
        ...task,
        createdAt: Timestamp.now(),
      });
      return task;
    } catch (err) {
      console.error('Add task error:', err);
      // Fallback: add locally
      setTasksState((prev) => [...prev, task]);
      return task;
    }
  };

  const updateTask = async (task: Task) => {
    try {
      await setDoc(doc(db, TASKS_COLLECTION, task.id), {
        ...task,
        updatedAt: Timestamp.now(),
      }, { merge: true });
      return task;
    } catch (err) {
      console.error('Update task error:', err);
      // Fallback: update locally
      setTasksState((prev) =>
        prev.map((t) => (t.id === task.id ? task : t))
      );
      return task;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, TASKS_COLLECTION, id));
    } catch (err) {
      console.error('Delete task error:', err);
      // Fallback: delete locally
      setTasksState((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return {
    tasks,
    loading,
    error,
    initialized,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
  };
}
