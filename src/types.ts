export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface Column {
  title: 'To Do' | 'In Progress' | 'Done';
  tasks: Task[];
}
