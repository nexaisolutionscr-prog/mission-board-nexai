// Tipos básicos para la aplicación Mission Board

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface Column {
  title: string;
  tasks: Task[];
}

// Configuraciones de usuario para temas
export interface UserSettings {
  darkMode: boolean;
}