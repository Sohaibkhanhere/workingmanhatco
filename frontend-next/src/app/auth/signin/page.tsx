"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-[#E4D6A9]">
        <section className="bg-[#3A1808] py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(196,120,50,0.06)_0%,transparent_60%)]" />
          <div className="relative max-w-[1400px] mx-auto px-5 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="text-5xl lg:text-7xl text-[#E4D6A9]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SIGN IN
              </h1>
              <div className="w-16 h-[2px] bg-[#995F2F] mx-auto mt-4" />
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-md mx-auto px-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#978F66]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white border border-[#D4CBA8] rounded-lg text-sm text-[#622B14] placeholder:text-[#978F66]/50 focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#978F66]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-11 py-3 bg-white border border-[#D4CBA8] rounded-lg text-sm text-[#622B14] placeholder:text-[#978F66]/50 focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#978F66] hover:text-[#995F2F] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#622B14] text-[#E4D6A9] text-[0.7rem] font-bold tracking-[0.15em] uppercase rounded-lg hover:bg-[#622B14] transition-all duration-300 disabled:opacity-50 min-h-[44px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <p className="text-center text-sm text-[#978F66] mt-8" style={{ fontFamily: "var(--font-body)" }}>
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-[#995F2F] font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
