"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@workinmanhatco.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error || "Invalid email or password. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0F172A" }}>
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "#0F172A" }}
            >
              WORKIN&apos; MAN
            </h1>
            <p className="text-sm mt-1" style={{ color: "#78716C", fontFamily: "var(--font-body)" }}>
              Hat Co. Admin Panel
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#0F172A", fontFamily: "var(--font-body)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#78716C" }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@workinmanhatco.com"
                  required
                  className="w-full min-h-[44px] pl-11 pr-4 rounded-lg border border-stone-200 text-sm outline-none transition-all focus:ring-2 focus:border-transparent"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#0F172A",
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #B8935A")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#0F172A", fontFamily: "var(--font-body)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#78716C" }}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full min-h-[44px] pl-11 pr-4 rounded-lg border border-stone-200 text-sm outline-none transition-all focus:ring-2 focus:border-transparent"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#0F172A",
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #B8935A")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#B8935A",
                fontFamily: "var(--font-body)",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 p-3 rounded-lg text-center" style={{ backgroundColor: "#FAFAF8" }}>
            <p className="text-xs" style={{ color: "#78716C", fontFamily: "var(--font-body)" }}>
              Demo: admin@workinmanhatco.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}