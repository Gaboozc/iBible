'use client';

import { BookOpen, Zap, Brain, Link2, MessageSquare, FileText } from 'lucide-react';

type TabId = 'context' | 'text' | 'analysis' | 'etymology' | 'connections' | 'questions';

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  {
    id: 'context' as TabId,
    label: 'Contexto',
    icon: BookOpen,
  },
  {
    id: 'text' as TabId,
    label: 'Texto',
    icon: FileText,
  },
  {
    id: 'analysis' as TabId,
    label: 'Análisis',
    icon: Brain,
  },
  {
    id: 'etymology' as TabId,
    label: 'Etimología',
    icon: Zap,
  },
  {
    id: 'connections' as TabId,
    label: 'Conexiones',
    icon: Link2,
  },
  {
    id: 'questions' as TabId,
    label: 'Reflexión',
    icon: MessageSquare,
  },
];

export function StudyTabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b sticky top-0 z-10" style={{ borderColor: '#B08D57', backgroundColor: '#FFFFFF' }}>
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex items-center gap-2 px-4 py-4 font-medium transition-all whitespace-nowrap border-b-2"
                style={{
                  borderBottomColor: isActive ? '#B08D57' : 'transparent',
                  color: isActive ? '#3D2644' : '#4A908F',
                  backgroundColor: isActive ? '#F2E9D4' : 'transparent',
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
