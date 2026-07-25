"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { LOGO_URL } from "@/lib/api";

const FOOTER_SECTIONS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Hats", href: "/shop?category=Hats" },
      { label: "Apparel", href: "/shop?category=Apparel" },
      { label: "Accessories", href: "/shop?category=Accessories" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping Info", href: "/contact" },
      { label: "Returns & Exchanges", href: "/contact" },
      { label: "FAQ", href: "/contact" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/workinmanhatco/", icon: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61578779784429", icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { label: "TikTok", href: "https://www.tiktok.com/@workinmanhatco/", icon: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" },
  { label: "Email", href: "mailto:workinmanhatco@gmail.com", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" },
];

function FooterSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/8 lg:border-0">
      {/* Mobile: collapsible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 lg:cursor-default"
      >
        <h3
          className="text-[#E4D6A9] text-[0.7rem] font-bold tracking-[0.14em] uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <ChevronDown
          size={16}
          className={`text-[#E4D6A9]/30 transition-transform duration-300 lg:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>
      <ul className={`space-y-3 pb-4 lg:pb-0 ${open ? "block" : "hidden lg:block"}`}>
        {links.map((link) => (
          <li key={link.label + link.href}>
            <Link
              href={link.href}
              className="text-sm text-[#E4D6A9]/50 hover:text-[#C89A4A] transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#3A1808] text-[#E4D6A9]/60">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-8 pt-16 pb-12 border-b border-white/8">
          {/* Brand */}
          <div className="lg:col-span-2 pb-8 lg:pb-0 border-b border-white/8 lg:border-0 mb-6 lg:mb-0">
            <img
              src={LOGO_URL}
              alt="Workin' Man Hat Co."
              className="h-10 w-auto rounded mb-5"
            />
            <p className="text-sm leading-relaxed max-w-xs mb-5 text-[#E4D6A9]/45" style={{ fontFamily: "var(--font-body)" }}>
              For your every day workin&apos;man. Premium hats and apparel built on hard work,
              American pride, and quality craftsmanship.
            </p>
            <p className="text-xs text-[#E4D6A9]/30" style={{ fontFamily: "var(--font-body)" }}>
              Founded by <span className="text-[#E4D6A9]/50 font-medium">Skyler Smithson</span>
            </p>
            <div className="flex items-center gap-3 mt-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-[#C89A4A] hover:border-[#C89A4A] transition-all duration-300"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link sections - accordion on mobile, grid on desktop */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-0">
              {FOOTER_SECTIONS.map((section) => (
                <FooterSection key={section.title} title={section.title} links={section.links} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-xs text-[#E4D6A9]/20" style={{ fontFamily: "var(--font-body)" }}>
          <p>&copy; 2025-2026 Workin&apos; Man Hat Co. All rights reserved.</p>
          <p>Handmade in Texas, USA</p>
        </div>
      </div>
    </footer>
  );
}
