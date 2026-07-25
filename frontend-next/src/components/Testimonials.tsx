"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I've worn hats for 20 years on the job site. This is the first one that actually holds up through summer heat and winter rain without falling apart.",
    name: "Marcus R.",
    location: "Houston, TX",
    rating: 5,
  },
  {
    quote:
      "Bought the Rustler on a whim. Wore it every single day for six months straight. Still looks brand new. Won't buy anywhere else now.",
    name: "Jake T.",
    location: "Oklahoma City, OK",
    rating: 5,
  },
  {
    quote:
      "My old man said it was the best-fitting hat he's ever had. Got him another one for his birthday. Now we're both customers for life.",
    name: "Colby M.",
    location: "Boise, ID",
    rating: 5,
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#3A1808] py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,120,50,0.06)_0%,transparent_60%)]" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-[#C89A4A] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
            Real Reviews
          </span>
          <h2
            className="text-[#E4D6A9] text-3xl sm:text-4xl lg:text-6xl mt-2 tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            WHAT THEY&apos;RE SAYING
          </h2>
          <div className="w-16 h-[2px] bg-[#C89A4A] mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-[#3A1808] border border-[#C89A4A]/10 rounded-xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-5 hover:border-[#C89A4A]/20 transition-colors duration-500"
            >
              <Quote size={24} className="text-[#C89A4A]/30" />

              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star
                    key={s}
                    size={14}
                    className="fill-[#995F2F] text-[#C89A4A]"
                  />
                ))}
              </div>

              <p
                className="text-[#E4D6A9]/75 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-auto pt-4 border-t border-[#C89A4A]/10">
                <p
                  className="text-[#E4D6A9] font-semibold text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {t.name}
                </p>
                <p
                  className="text-[#E4D6A9]/40 text-xs mt-0.5"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {t.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
