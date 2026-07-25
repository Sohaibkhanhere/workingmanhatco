"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin-context";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, loading } = useAdmin();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, isLoggedIn, isLoginPage]);

  if (!isLoginPage && (!isLoggedIn || loading)) {
    return (
      <div className="min-h-screen bg-[#E4D6A9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#622B14]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E4D6A9]">
      {!isLoginPage && <AdminSidebar />}
      <main className={isLoginPage ? "min-h-screen" : "lg:ml-64 min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 bg-[#E4D6A9]"}>
        {children}
      </main>
    </div>
  );
}
