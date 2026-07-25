"use client";

import { useAdmin } from "@/lib/admin-context";
import { ChevronRight, User } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function AdminHeader({ title, breadcrumbs = [] }: AdminHeaderProps) {
  const { user } = useAdmin();

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left: Title & Breadcrumbs */}
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-2">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: "#78716C" }} />
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-xs hover:underline"
                    style={{ color: "#78716C", fontFamily: "var(--font-body)" }}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span
                    className="text-xs"
                    style={{ color: "#0F172A", fontFamily: "var(--font-body)" }}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "#0F172A" }}
        >
          {title.toUpperCase()}
        </h1>
      </div>

      {/* Right: User Info */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p
              className="text-sm font-medium"
              style={{ color: "#0F172A", fontFamily: "var(--font-body)" }}
            >
              {user.name || "Admin"}
            </p>
            <p
              className="text-xs"
              style={{ color: "#78716C", fontFamily: "var(--font-body)" }}
            >
              {user.email}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#B8935A" }}
          >
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}