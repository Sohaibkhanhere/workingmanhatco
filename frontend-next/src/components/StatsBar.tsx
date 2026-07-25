"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Flame, Clock, Award } from "lucide-react";

const stats = [
  { icon: Flame, value: "25+", label: "Products" },
  { icon: Clock, value: "2025", label: "Founded" },
  { icon: Award, value: "100%", label: "Quality" },
];

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-[#3A1808] border-y border-[#C89A4A]/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#C89A4A]/15 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <stat.icon size={16} className="text-[#C89A4A] sm:hidden" />
                <stat.icon size={18} className="text-[#C89A4A] hidden sm:block" />
              </div>
              <p className="text-lg sm:text-2xl lg:text-3xl text-[#F0E8D0] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {stat.value}
              </p>
              <p className="text-[0.5rem] sm:text-[0.6rem] text-[#E4D6A9]/40 tracking-[0.1em] sm:tracking-[0.15em] uppercase mt-0.5 sm:mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
