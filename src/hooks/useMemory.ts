import { useState, useEffect } from 'react';

export interface MemoryEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'conversation' | 'decision' | 'milestone' | 'learning';
  importance: 'low' | 'medium' | 'high';
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  value: number;
  status: 'new' | 'in_progress' | 'closed_won' | 'closed_lost';
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileSummary {
  name: string;
  role: string;
  company: string;
  mission: string;
  goals: string[];
  achievements: string[];
}

export interface MemoryData {
  events: MemoryEvent[];
  opportunities: Opportunity[];
  profile: ProfileSummary;
  loading: boolean;
  error: string | null;
}

// Mock data para el módulo Memoria
const mockEvents: MemoryEvent[] = [
  {
    id: '1',
    date: '2026-02-22T07:44:00Z',
    title: 'Desarrollo Mission Board',
    description: 'Jose aprobó integrar 3 nuevos módulos al Mission Board',
    category: 'milestone',
    importance: 'high'
  },
  {
    id: '2',
    date: '2026-02-21T22:00:00Z',
    title: 'Review de casos de éxito',
    description: 'Análisis de casos de éxito para propuesta comercial',
    category: 'decision',
    importance: 'medium'
  },
  {
    id: '3',
    date: '2026-02-20T17:00:00Z',
    title: 'Leads afternoon',
    description: 'Seguimiento de leads potenciales',
    category: 'conversation',
    importance: 'medium'
  },
  {
    id: '4',
    date: '2026-02-19T19:00:00Z',
    title: 'Configuración Suno API',
    description: 'Integración exitosa de API de música',
    category: 'milestone',
    importance: 'high'
  },
  {
    id: '5',
    date: '2026-02-18T23:00:00Z',
    title: 'Documentación TOOLS.md',
    description: 'Creación de documentación de herramientas',
    category: 'learning',
    importance: 'high'
  }
];

const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Automatización Procesos',
    company: 'Constructora Del Sur',
    value: 8500,
    status: 'in_progress',
    source: 'Referido',
    notes: 'Interés en automatizar reportes y alertas',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-21T16:00:00Z'
  },
  {
    id: 'opp-2',
    title: 'Consultoría IA',
    company: 'Grupo Amplit',
    value: 12000,
    status: 'new',
    source: 'LinkedIn',
    notes: 'Necesitan asesoría en implementación de IA',
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-02-20T14:00:00Z'
  },
  {
    id: 'opp-3',
    title: 'Portal Clientes',
    company: 'Financiera Centroamericana',
    value: 25000,
    status: 'closed_won',
    source: 'Website',
    notes: 'Proyecto entregado exitosamente',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-02-10T17:00:00Z'
  },
  {
    id: 'opp-4',
    title: 'Chatbot WhatsApp',
    company: 'Distribuidora Nacional',
    value: 4500,
    status: 'new',
    source: 'WhatsApp',
    notes: 'Solicitud presupuesto inicial',
    createdAt: '2026-02-21T11:00:00Z',
    updatedAt: '2026-02-21T11:00:00Z'
  }
];

const mockProfile: ProfileSummary = {
  name: 'José Barrantes',
  role: 'Founder & CEO',
  company: 'NexAI Solutions',
  mission: 'Democratizar el acceso a la IA para PYMES en Costa Rica y Centroamérica',
  goals: [
    'Alcanzar $50K ARR para febrero 2027',
    'Generar 10 casos de éxito documentados',
    'Crear portafolio de productos IA reutilizables',
    'Establecer alianzas estratégicas'
  ],
  achievements: [
    'Sistema Mission Board operativo',
    'Integración múltiples APIs (OpenAI, Suno, WhatsApp)',
    'Primeros clientes recurrentes',
    'Pipeline actives de +$45K'
  ]
};

export function useMemory(): MemoryData {
  const [data, setData] = useState<MemoryData>({
    events: [],
    opportunities: [],
    profile: mockProfile,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchMemoryData = async () => {
      try {
        const response = await fetch('/api/memory');
        if (!response.ok) throw new Error('Failed to fetch memory data');
        const result = await response.json();
        setData({
          events: result.events || mockEvents,
          opportunities: result.opportunities || mockOpportunities,
          profile: result.profile || mockProfile,
          loading: false,
          error: null
        });
      } catch (err) {
        console.log('Using mock data for memory');
        setData({
          events: mockEvents,
          opportunities: mockOpportunities,
          profile: mockProfile,
          loading: false,
          error: null
        });
      }
    };

    fetchMemoryData();
  }, []);

  return data;
}
