"use client";

import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const isReaderPage = pathname?.includes('/read');

  return (
    <ProtectedRoute>
      <PageLoader>
        <div className="flex min-h-screen">
          {!isReaderPage && <Sidebar />}

          <div className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-slate-950 min-w-0">
            {!isReaderPage && <Header />}

            <main className={`${isReaderPage ? 'p-0' : 'p-4 sm:p-6 pb-24 lg:pb-6'} overflow-x-hidden`}>
              {children}
            </main>
          </div>
        </div>

        {!isReaderPage && <NavigationMobile />}
      </PageLoader>
    </ProtectedRoute>
  );
}