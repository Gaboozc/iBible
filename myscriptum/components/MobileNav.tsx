'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/home', icon: Home, label: t('nav.home') },
    { href: '/library', icon: Library, label: t('nav.library') },
    { href: '/progress', icon: BarChart3, label: t('nav.progress') },
  ];

  // Hide on certain pages where it might conflict
  if (pathname?.startsWith('/study/')) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[72px] ${
                isActive
                  ? 'text-[#7A5B3A] bg-[#F4EFE6]'
                  : 'text-gray-500 active:bg-gray-100'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
