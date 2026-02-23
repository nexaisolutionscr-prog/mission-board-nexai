import React from 'react';

interface CronJobCardProps {
  data: any; // Adjust type based on actual data structure
}

const CronJobCard: React.FC<CronJobCardProps> = ({ data }) => {
  return (
    <div className='bg-white shadow-md rounded-lg p-4'>
      <h3 className='text-lg font-bold'>{data.name}</h3>
      <p className='text-sm'>{data.description}</p>
      <div className='mt-2'>
        <span className='text-xs bg-green-500 text-white rounded-full px-2 py-1'>{data.status}</span>
      </div>
    </div>
  );
};

export default CronJobCard;
