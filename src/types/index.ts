// Tipos básicos para la aplicación Mission Board

// Configuración de asignados
export const ASSIGNEES = {
  jose: { id: 'jose', name: 'Jose', avatar: 'J', color: 'from-blue-400 to-blue-600' },
  orbit: { id: 'orbit', name: 'ORBIT', avatar: '🛰️', color: 'from-purple-400 to-purple-600' },
  none: { id: 'none', name: 'Sin asignar', avatar: '?', color: 'from-gray-400 to-gray-600' }
} as const;

export type AssigneeId = keyof typeof ASSIGNEES;

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
  assignee: 'jose' | 'orbit' | 'none';
  dueDate?: string;
  createdAt?: any;
}

export interface Column {
  title: string;
  tasks: Task[];
}

// Configuraciones de usuario para temas
export interface UserSettings {
  darkMode: boolean;
}