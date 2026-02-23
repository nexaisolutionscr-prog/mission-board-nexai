import React from 'react';

const MemoryTimeline: React.FC = () => {
  return (
    <div className='timeline-container'>
      {/* Timeline items will be generated here based on data */}
      <div className='timeline-item'>
        <div className='timeline-marker'></div>
        <div className='timeline-content'>
          <p className='timeline-time'>January 1, 2025</p>
          <p>Event description here...</p>
        </div>
      </div>
    </div>
  );
};

export default MemoryTimeline;
