import React, { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { DidsPage } from './pages/DidsPage';

export type Page = 'dashboard' | 'dids' | 'trunks' | 'calls' | 'agents' | 'insights';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dids');

  const renderPage = () => {
    switch (currentPage) {
      case 'dids':
        return <DidsPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 bg-gray-800 rounded-lg">
              <h1 className="text-2xl font-bold text-teal-400">Página en Construcción</h1>
              <p className="text-gray-400 mt-2">La funcionalidad para "{currentPage}" estará disponible pronto.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  );
}
