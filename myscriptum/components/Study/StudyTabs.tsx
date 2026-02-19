'use client';

import { BookOpen, Zap, Brain, Link2, MessageSquare, FileText, BookMarked } from 'lucide-react';
import { useTheme, getColors } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

type TabId = 'context' | 'text' | 'analysis' | 'etymology' | 'lexicon' | 'connections' | 'questions';

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  {
    id: 'context' as TabId,
    labelKey: 'tab.context',
    icon: BookOpen,
  },
  {
    id: 'text' as TabId,
    labelKey: 'tab.text',
    icon: FileText,
  },
  {
    id: 'analysis' as TabId,
    labelKey: 'tab.analysis',
    icon: Brain,
  },
  {
    id: 'etymology' as TabId,
    labelKey: 'tab.etymology',
    icon: Zap,
  },
  {
    id: 'lexicon' as TabId,
    labelKey: 'tab.lexicon',
    icon: BookMarked,
  },
  {
    id: 'connections' as TabId,
    labelKey: 'tab.connections',
    icon: Link2,
  },
  {
    id: 'questions' as TabId,
    labelKey: 'tab.reflection',
    icon: MessageSquare,
  },
];

export function StudyTabs({ activeTab, onTabChange }: TabsProps) {
  const { mode } = useTheme();
  const { t } = useLanguage();
  const palette = getColors(mode);

  return (
    <div className="border-b sticky top-0 z-10" style={{ borderColor: palette.accent.primary, backgroundColor: palette.bg.secondary }}>
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all whitespace-nowrap border-b-2"
                style={{
                  borderBottomColor: isActive ? palette.accent.primary : 'transparent',
                  color: isActive ? palette.text.secondary : palette.accent.secondary,
                  backgroundColor: isActive ? palette.bg.primary : 'transparent',
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t(tab.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
