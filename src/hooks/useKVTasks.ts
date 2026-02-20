import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';

export function useKVTasks() {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      // Migrate tasks without assignee
      const migrated = (data.tasks || []).map((t: Task) => ({
        ...t,
        assignee: t.assignee || 'none',
      }));
      setTasksState(migrated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const setTasks = useCallback(async (update: Task[] | ((prev: Task[]) => Task[])) => {
    const newTasks = update instanceof Function ? update(tasks) : update;
    setTasksState(newTasks);
    // Sync to KV
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: { id: 'bulk-update', tasks: newTasks } }),
      });
    } catch (err) {
      console.error('Sync error:', err);
    }
  }, [tasks]);

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: {
            ...newTask,
            assignee: newTask.assignee || 'none',
          },
        }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const data = await res.json();
      setTasksState((prev) => [...prev, data.task]);
      return data.task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const data = await res.json();
      setTasksState((prev) =>
        prev.map((t) => (t.id === task.id ? data.task : t))
      );
      return data.task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasksState((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
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
