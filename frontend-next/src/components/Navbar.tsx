"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { LOGO_URL } from "@/lib/api";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Hats", href: "/shop?category=Hats" },
  { label: "Apparel", href: "/shop?category=Apparel" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const { count, setOpen } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#3A1808]/98 shadow-[0_1px_12px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            : "bg-[#3A1808]/90 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto max-w-[1400px] px-5 lg:px-8 h-16 lg:h-[70px] flex items-center justify-between gap-4">
          <button
            className="lg:hidden p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#E4D6A9]/80 hover:text-[#C89A4A] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="flex-shrink-0">
            <img
              src={LOGO_URL}
              alt="Workin' Man Hat Co."
              className="h-7 w-auto max-w-[100px] sm:max-w-none sm:h-8 lg:h-9 rounded"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8 ml-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#E4D6A9]/70 hover:text-[#C89A4A] transition-colors duration-300 relative group py-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C89A4A] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden lg:block flex-1" />

          <div className="flex items-center gap-0.5">
            <button
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#E4D6A9]/80 hover:text-[#C89A4A] transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              href={user ? "/account" : "/auth/signin"}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#E4D6A9]/80 hover:text-[#C89A4A] transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            <button
              className="p-2 relative min-w-[44px] min-h-[44px] flex items-center justify-center text-[#E4D6A9]/80 hover:text-[#C89A4A] transition-colors"
              onClick={() => setOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 bg-[#C89A4A] text-[#3A1808] text-[0.55rem] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-x-0 top-[4rem] bottom-0 z-40 bg-[#3A1808]/98 backdrop-blur-xl lg:hidden overflow-y-auto"
          >
            <div className="p-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3.5 px-4 text-lg font-bold tracking-wider uppercase text-[#E4D6A9]/80 hover:text-[#C89A4A] hover:bg-white/5 rounded-lg transition-colors min-h-[44px] flex items-center"
                  style={{ fontFamily: "var(--font-body)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={user ? "/account" : "/auth/signin"}
                className="flex items-center gap-3 py-3.5 px-4 text-lg font-bold tracking-wider uppercase text-[#E4D6A9]/80 hover:text-[#C89A4A] hover:bg-white/5 rounded-lg transition-colors min-h-[44px]"
                style={{ fontFamily: "var(--font-body)" }}
                onClick={() => setMobileOpen(false)}
              >
                <User size={18} />
                Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
