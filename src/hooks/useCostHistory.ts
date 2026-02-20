import { useState, useEffect } from 'react';

export interface CostData {
  date: string;
  total: number;
  inputTokens: number;
  outputTokens: number;
  model: string;
}

export interface CostSummary {
  daily: CostData[];
  monthlyTotal: number;
  dailyAverage: number;
  projection: number;
  trend: 'up' | 'down' | 'stable';
  loading: boolean;
  error: string | null;
}

export function useCostHistory(): CostSummary {
  const [costData, setCostData] = useState<CostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCostData = async () => {
      try {
        // Fetch from the public JSON file
        const response = await fetch('/cost-history.json');
        if (!response.ok) {
          throw new Error('Failed to load cost data');
        }
        const data: CostData[] = await response.json();
        
        // Sort by date
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setCostData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };
    
    fetchCostData();
  }, []);
  
  const monthlyTotal = costData.reduce((sum, day) => sum + day.total, 0);
  const dailyAverage = costData.length > 0 ? monthlyTotal / costData.length : 0;
  const projection = dailyAverage * 30;
  
  // Calculate trend based on last 3 days vs previous 3 days
  const recentDays = costData.slice(-3);
  const previousDays = costData.slice(-6, -3);
  
  const recent = recentDays.length > 0 
    ? recentDays.reduce((s, d) => s + d.total, 0) / recentDays.length 
    : 0;
  const previous = previousDays.length > 0 
    ? previousDays.reduce((s, d) => s + d.total, 0) / previousDays.length 
    : 0;
    
  const trend = previous === 0 
    ? 'stable' 
    : recent > previous * 1.15 
      ? 'up' 
      : recent < previous * 0.85 
        ? 'down' 
        : 'stable';
  
  return {
    daily: costData,
    monthlyTotal,
    dailyAverage,
    projection,
    trend,
    loading,
    error
  };
}

export function exportCostData(costData: CostData[]): string {
  return JSON.stringify(costData, null, 2);
}

export function downloadCostData(costData: CostData[]): void {
  const dataStr = exportCostData(costData);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `cost-history-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
