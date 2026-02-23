import { useState, useEffect } from 'react';
import { Task } from '../types';

function migrateTasks(tasks: Task[]): Task[] {
  return tasks.map(task => ({
    ...task,
    assignee: task.assignee || 'none'
  }));
}

function useLocalStorageWithMigration(key: string, initialValue: Task[]) {
  const [storedValue, setStoredValue] = useState<Task[]>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Migrate old tasks that don't have assignee
        const migrated = migrateTasks(parsed);
        return migrated;
      }
      return initialValue;
    } catch (error) {
      console.error('Error reading localStorage key ' + key, error);
      return initialValue;
    }
  });

  const setValue = (value: Task[] | ((prev: Task[]) => Task[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage key ' + key, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorageWithMigration;
