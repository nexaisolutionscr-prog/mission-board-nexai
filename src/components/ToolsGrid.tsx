import React from 'react';

const tools = [
  { name: 'Tool 1', description: 'Description 1' },
  { name: 'Tool 2', description: 'Description 2' },
  { name: 'Tool 3', description: 'Description 3' }
];

const ToolsGrid: React.FC = () => {
  return (
    <div className='grid grid-cols-3 gap-4'>
      {tools.map(tool => (
        <div key={tool.name} className='bg-white shadow-md rounded-lg p-4'>
          <h3 className='text-lg font-bold'>{tool.name}</h3>
          <p className='text-sm'>{tool.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ToolsGrid;
