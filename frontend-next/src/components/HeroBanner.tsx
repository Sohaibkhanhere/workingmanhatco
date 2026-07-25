"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { HERO_BG } from "@/lib/api";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.4 },
  },
};

export default function HeroBanner() {
  return (
    <section className="relative min-h-[520px] h-[80vh] sm:h-[88vh] lg:h-[100svh] max-h-[1000px] flex items-center justify-center overflow-hidden bg-[#2a1406]">
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: "heroZoom 25s ease-in-out infinite alternate" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f05]/50 via-[#1a0f05]/10 to-[#1a0f05]/60" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 text-center">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="mb-4 sm:mb-5">
            <span className="inline-flex items-center gap-2 sm:gap-3 text-[#D4A854] text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-semibold">
              <span className="w-5 sm:w-8 h-[1px] bg-[#D4A854]/70" />
              Est. 2025 &mdash; Texas, USA
              <span className="w-5 sm:w-8 h-[1px] bg-[#D4A854]/70" />
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-white leading-[0.9] mb-4 sm:mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 13vw, 9rem)",
              letterSpacing: "0.02em",
              textShadow: "0 2px 30px rgba(0,0,0,0.6), 0 0px 60px rgba(0,0,0,0.3)",
            }}
          >
            BUILT FOR
            <br />
            <span className="text-[#D4A854]">REAL WORK</span>
          </motion.h1>

          <motion.div variants={lineReveal} className="w-16 sm:w-20 h-[2px] bg-[#D4A854] mx-auto mb-4 sm:mb-5 origin-left" />

          <motion.p
            variants={fadeUp}
            className="text-white/90 text-sm sm:text-base max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
            style={{ fontFamily: "var(--font-body)", textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
          >
            Premium hats &amp; apparel crafted for the everyday workin&apos; man.
            Handmade in Texas. Built to last.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 sm:mb-20">
            <Link
              href="/shop"
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#D4A854] text-[#1a0f05] text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-md hover:bg-[#e0b85e] transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Shop Now
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-white/40 text-white text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-md hover:bg-white/10 hover:border-white/60 transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Our Story
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-2 text-white/70 text-[0.55rem] sm:text-[0.65rem] tracking-[0.12em] sm:tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: "var(--font-body)", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#D4A854]" />
              Free Shipping $75+
            </span>
            <span className="hidden sm:block w-[1px] h-3 bg-white/30" />
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#D4A854]" />
              Made in USA
            </span>
            <span className="hidden sm:block w-[1px] h-3 bg-white/30" />
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#D4A854]" />
              30-Day Returns
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-[0.5rem] sm:text-[0.55rem] tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
            Scroll
          </span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={16} className="text-[#D4A854]/80" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
