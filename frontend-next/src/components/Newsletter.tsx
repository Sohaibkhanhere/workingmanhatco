"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send, Check } from "lucide-react";

export default function Newsletter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section ref={ref} className="py-14 sm:py-20 lg:py-24 bg-[#3A1808] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(196,120,50,0.08)_0%,transparent_60%)]" />

      <div className="relative max-w-xl mx-auto text-center px-4 sm:px-5">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[#C89A4A] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
            Stay Connected
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-5xl text-[#E4D6A9] mt-2 mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            STAY IN THE LOOP
          </h2>
          <p className="text-[#E4D6A9]/40 text-sm mb-10">
            Get exclusive drops, discounts, and behind-the-scenes content.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#C89A4A]/20 flex items-center justify-center">
                <Check size={16} className="text-[#C89A4A]" />
              </div>
              <p className="text-[#C89A4A] font-medium text-sm">Thanks for subscribing!</p>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="flex gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-5 py-3.5 rounded-md bg-white/5 border border-white/10 text-[#E4D6A9] text-sm placeholder:text-[#E4D6A9]/25 outline-none focus:border-[#C89A4A]/50 transition-colors min-h-[44px]"
                style={{ fontFamily: "var(--font-body)" }}
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#C89A4A] text-[#3A1808] rounded-md font-bold text-[0.7rem] tracking-[0.12em] uppercase hover:bg-[#B08040] transition-colors flex items-center gap-2 min-h-[44px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Send size={13} />
                <span className="hidden sm:inline">Join</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
