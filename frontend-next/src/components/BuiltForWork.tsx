"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { LOGO_URL } from "@/lib/api";

const bullets = [
  "Premium materials sourced for durability",
  "Designed for comfort during long work days",
  "Tested by real workers in real conditions",
  "Free shipping on orders over $75",
];

export default function BuiltForWork() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#3A1808] w-full">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[550px]">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[350px] lg:h-auto lg:min-h-[550px] overflow-hidden"
        >
          <img
            src={LOGO_URL}
            alt="Workin Man Hat Co."
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#622B14]/40 hidden lg:block" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center gap-6 sm:gap-8 p-6 sm:p-10 md:p-14 lg:p-20"
        >
          <div>
            <span className="text-[#C89A4A] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
              Why Us
            </span>
            <h2
              className="text-[#E4D6A9] text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-wide leading-[0.95] mt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GEAR THAT WORKS
              <br />
              AS HARD AS YOU DO
            </h2>
          </div>

          <ul className="flex flex-col gap-3 sm:gap-4">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#C89A4A]/15 flex items-center justify-center mt-0.5 shrink-0">
                  <Check size={12} className="text-[#C89A4A] sm:hidden" />
                  <Check size={14} className="text-[#C89A4A] hidden sm:block" />
                </div>
                <span
                  className="text-[#E4D6A9]/70 text-xs sm:text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2.5 bg-[#C89A4A] text-[#3A1808] font-bold text-[0.65rem] sm:text-[0.7rem] tracking-[0.12em] sm:tracking-[0.15em] uppercase px-7 sm:px-10 py-3 sm:py-4 rounded-md transition-all duration-300 hover:bg-[#D4A854] hover:shadow-[0_0_30px_-6px_rgba(196,120,50,0.4)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Shop the Collection
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
