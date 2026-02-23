import React from 'react';

const ProgressBar = ({ progress }) => (
  <div className='w-full bg-gray-200 h-4 rounded-full'>
    <div className='bg-blue-500 h-4 rounded-full' style={{ width: `${progress}%` }}></div>
  </div>
);

export default ProgressBar;