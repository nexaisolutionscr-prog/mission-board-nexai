import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';

const LOCAL_STORAGE_KEY = 'mission-board-tasks-backup';

export function useKVTasks() {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  // Load from localStorage on mount (fallback mode)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const migrated = (parsed || []).map((t: Task) => ({
            ...t,
            assignee: t.assignee || 'none',
          }));
          setTasksState(migrated);
        } catch (e) {
          console.error('Failed to parse localStorage:', e);
        }
      }
    }
    // Try KV first
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      const migrated = (data.tasks || []).map((t: Task) => ({
        ...t,
        assignee: t.assignee || 'none',
      }));
      setTasksState(migrated);
      setUseLocalFallback(false);
      setError(null);
    } catch (err) {
      console.error('KV fetch failed, using localStorage:', err);
      setUseLocalFallback(true);
      // Keep localStorage data (already loaded in useEffect)
      setError('Modo offline: usando almacenamiento local');
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (tasksToSave: Task[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasksToSave));
    }
  };

  const setTasks = useCallback(async (update: Task[] | ((prev: Task[]) => Task[])) => {
    const newTasks = update instanceof Function ? update(tasks) : update;
    setTasksState(newTasks);
    saveToLocalStorage(newTasks);

    // Try sync to KV (don't block if fails)
    if (!useLocalFallback) {
      try {
        await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tasks: newTasks }),
        });
      } catch (err) {
        console.error('KV sync error:', err);
      }
    }
  }, [tasks, useLocalFallback]);

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      assignee: newTask.assignee || 'none',
      priority: newTask.priority || 'Low',
      status: newTask.status || 'To Do',
    };
    
    const newTasks = [...tasks, task];
    setTasksState(newTasks);
    saveToLocalStorage(newTasks);

    if (!useLocalFallback) {
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task }),
        });
        if (!res.ok) throw new Error('Failed to add task');
        const data = await res.json();
        return data.task;
      } catch (err) {
        console.error('KV add error:', err);
      }
    }
    return task;
  };

  const updateTask = async (task: Task) => {
    const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasksState(newTasks);
    saveToLocalStorage(newTasks);

    if (!useLocalFallback) {
      try {
        await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task }),
        });
      } catch (err) {
        console.error('KV update error:', err);
      }
    }
    return task;
  };

  const deleteTask = async (id: string) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasksState(newTasks);
    saveToLocalStorage(newTasks);

    if (!useLocalFallback) {
      try {
        await fetch('/api/tasks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      } catch (err) {
        console.error('KV delete error:', err);
      }
    }
  };

  return {
    tasks,
    loading,
    error,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
