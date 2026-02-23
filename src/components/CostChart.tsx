import React from 'react';

const CostChart: React.FC = () => {
  // Datos de ejemplo - en producción vendrían de una API
  const data = [
    { date: 'Lun', costo: 0.08 },
    { date: 'Mar', costo: 0.12 },
    { date: 'Mie', costo: 0.09 },
    { date: 'Jue', costo: 0.15 },
    { date: 'Vie', costo: 0.11 },
    { date: 'Sab', costo: 0.07 },
    { date: 'Dom', costo: 0.09 },
  ];
  
  const maxCost = Math.max(...data.map(d => d.costo));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        💰 Costos Diarios (API)
      </h3>
      <div className="flex items-end space-x-2 h-48">
        {data.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-500 rounded-t transition-all duration-500"
              style={{ height: `${(day.costo / maxCost) * 100}%` }}
            />
            <span className="text-xs text-gray-500 mt-1">{day.date}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Promedio: ${(data.reduce((a, b) => a + b.costo, 0) / data.length).toFixed(2)} USD/día
      </div>
    </div>
  );
};

export default CostChart;
