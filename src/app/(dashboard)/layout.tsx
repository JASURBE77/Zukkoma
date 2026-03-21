"use client";

import Header from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NavigationMobile from '@/components/layout/NavigationMobile';
import ProtectedRoute from '@/guard/ProtectedRoute';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex  gap-5 min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950">
          <Header />

          <main className="p-6 pb-24 lg:pb-6">
            {children}
          </main>
        </div>
      </div>
      <NavigationMobile />
    </ProtectedRoute>
  );
}
