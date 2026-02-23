import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { useCostHistory, CostSummary } from '../hooks/useCostHistory';

interface CostBarProps {
  day: { date: string; total: number; model: string };
  maxCost: number;
  index: number;
}

const CostBar: React.FC<CostBarProps> = ({ day, maxCost, index }) => {
  const height = maxCost > 0 ? (day.total / maxCost) * 100 : 5;
  const dateLabel = new Date(day.date).toLocaleDateString('es-CR', { 
    weekday: 'short', 
    day: 'numeric' 
  });
  
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: `${Math.max(height, 8)}%`, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="flex flex-col items-center gap-1 flex-1 group"
    >
      <div className="relative w-full flex-1 flex items-end justify-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`w-full max-w-[24px] rounded-t-lg cursor-pointer transition-all duration-300 ${
            day.total > 0.15 
              ? 'bg-gradient-to-t from-rose-500 to-rose-400' 
              : day.total > 0.08 
                ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                : 'bg-gradient-to-t from-emerald-500 to-emerald-400'
          } group-hover:shadow-lg group-hover:shadow-blue-500/20`}
          style={{ height: `${Math.max(height, 8)}%` }}
        >
          {/* Tooltip */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
            <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
              <p className="font-semibold">${day.total.toFixed(3)}</p>
              <p className="text-gray-400 text-[10px]">{day.model}</p>
            </div>
            <div className="w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 -mt-1 mx-auto" />
          </div>
        </motion.div>
      </div>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium rotate-0">
        {dateLabel}
      </span>
    </motion.div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  gradient: string;
}> = ({ title, value, subtitle, icon, trend, gradient }) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`${gradient} rounded-xl p-4 border border-white/20 dark:border-gray-700/50 shadow-lg backdrop-blur-sm`}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
          {title}
        </p>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <TrendIcon className={`w-4 h-4 ${
            trend === 'up' ? 'text-rose-500' : 
            trend === 'down' ? 'text-emerald-500' : 
            'text-gray-400'
          }`} />
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {subtitle}
      </p>
    </motion.div>
  );
};

const CostTracker: React.FC = () => {
  const costSummary: CostSummary = useCostHistory();
  const maxCost = Math.max(...costSummary.daily.map(d => d.total), 0.2);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            💰 Control de Costos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tracking diario de uso de APIs
          </p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Hoy"
          value={`$${costSummary.daily[costSummary.daily.length - 1]?.total.toFixed(3) || '0.000'}`}
          subtitle="Costo del día"
          icon={<Calendar className="w-4 h-4" />}
          gradient="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30"
        />
        <StatCard
          title="Promedio"
          value={`$${costSummary.dailyAverage.toFixed(3)}`}
          subtitle="Por día"
          icon={<Minus className="w-4 h-4" />}
          gradient="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30"
        />
        <StatCard
          title="Acumulado"
          value={`$${costSummary.monthlyTotal.toFixed(2)}`}
          subtitle="Este mes"
          icon={<TrendingUp className="w-4 h-4" />}
          trend={costSummary.trend}
          gradient="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30"
        />
        <StatCard
          title="Proyección"
          value={`$${costSummary.projection.toFixed(2)}`}
          subtitle="Fin de mes"
          icon={<TrendingUp className="w-4 h-4" />}
          gradient="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30"
        />
      </div>
      
      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Últimos 10 días
          </h3>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Bajo
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Medio
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Alto
            </span>
          </div>
        </div>
        
        {/* Bars */}
        <div className="h-48 flex items-end gap-2">
          {costSummary.daily.map((day, index) => (
            <CostBar key={day.date} day={day} maxCost={maxCost} index={index} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CostTracker;
