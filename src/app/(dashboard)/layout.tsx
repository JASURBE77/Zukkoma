"use client";

import Header from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NavigationMobile from '@/components/layout/NavigationMobile';
import ProtectedRoute from '@/guard/ProtectedRoute';
import PageLoader from '@/components/layout/PageLoader';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <PageLoader>
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950 min-w-0">
            <Header />

            <main className="p-4 sm:p-6 pb-24 lg:pb-6 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
        <NavigationMobile />
      </PageLoader>
    </ProtectedRoute>
  );
}
