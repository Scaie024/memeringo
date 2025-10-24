import React from 'react';
import { Page } from '../App';
import { cn } from '../lib/utils';
import { SIDEBAR_LINKS } from '../lib/constants';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800/30 border-r border-gray-700/50 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-700/50">
        <h1 className="text-xl font-bold text-white tracking-wider">VoiceWoot</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = currentPage === link.href;
          return (
            <a
              key={link.href}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(link.href as Page);
              }}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal-500/10 text-teal-300'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </a>
          );
        })}
      </nav>
      {/* Footer or user profile can go here */}
    </aside>
  );
};
