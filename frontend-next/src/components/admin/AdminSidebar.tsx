"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings, Tag, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

const NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Promotions", href: "/admin/promotions", icon: Tag },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

function NavItem({ href, icon: Icon, label, active }: {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-[#995F2F]/20 text-[#995F2F]"
          : "text-[#B0A892] hover:text-[#E4D6A9] hover:bg-white/5"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
    setMobileOpen(false);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="block">
          <h1 className="text-2xl tracking-wide text-[#E4D6A9]" style={{ fontFamily: "var(--font-display)" }}>
            WORKIN&apos; MAN
          </h1>
          <p className="text-xs text-[#B0A892] mt-0.5 tracking-widest uppercase" style={{ fontFamily: "var(--font-body)" }}>Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_LINKS.map(({ label, href, icon }) => (
          <NavItem
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={isActive(href)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#B0A892] hover:text-[#995F2F] hover:bg-[#622B14]/10 transition-colors"
        >
          <ExternalLink size={18} />
          Visit Website
        </Link>
        {user && (
          <div className="px-4 py-2">
            <p className="text-[0.6rem] text-[#B0A892] uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>Signed in as</p>
            <p className="text-sm text-[#E4D6A9] truncate" style={{ fontFamily: "var(--font-body)" }}>{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#B0A892] hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#622B14] text-[#E4D6A9] shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-[#3A1808] border-r border-white/10 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-[#3A1808] border-r border-white/10 z-50 flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
