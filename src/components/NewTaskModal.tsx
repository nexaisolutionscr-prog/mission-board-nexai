import React, { useState } from 'react';
import { Task } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  saveTask: (task: Task) => void;
  initialTask?: Task;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, closeModal, saveTask, initialTask }) => {
  const [task, setTask] = useState<Task>(initialTask || { id: '', title: '', description: '', priority: 'Low', status: 'To Do' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setTask({ ...task, [name]: value });
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} onClick={closeModal}>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        <h2>{initialTask ? 'Edit Task' : 'New Task'}</h2>
        <input type='text' name='title' value={task.title} onChange={handleChange} placeholder='Title' />
        <textarea name='description' value={task.description} onChange={handleChange} placeholder='Description'></textarea>
        <select name='priority' value={task.priority} onChange={handleChange}>
          <option value='High'>High</option>
          <option value='Medium'>Medium</option>
          <option value='Low'>Low</option>
        </select>
        <button onClick={() => saveTask(task)}>Save</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default NewTaskModal;