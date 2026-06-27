import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileNav from '../components/layout/MobileNav';
import BackgroundOrbs from '../components/shared/BackgroundOrbs';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50">
      <BackgroundOrbs />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 relative z-10">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
