"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LOGO_URL } from "@/lib/api";

export default function BrandStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-[#E4D6A9] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(0,0,0,0.2)]">
              <img
                src="https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/f4c02976-3f0a-4d66-975f-c6eee8ed8a36/F16BBA54-AF60-4D50-9739-4A570BD208D5.png"
                alt="Workin' Man collection"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-[#995F2F]/8 rounded-xl -z-10" />
            <div className="absolute -top-5 -left-5 w-24 h-24 border-2 border-[#995F2F]/15 rounded-xl -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[#995F2F] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
              Since Day One
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-5xl mt-2 mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FORGED IN TEXAS
            </h2>
            <p className="text-[#978F66] text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
              Workin&apos; Man Hat Co. was born from a simple belief: the everyday workin&apos; man
              deserves quality gear that matches his work ethic. Founded by Skyler Smithson
              in the heart of Texas.
            </p>
            <p className="text-[#978F66] text-sm sm:text-base leading-relaxed mb-8 sm:mb-10">
              Every stitch, every cut, every detail is designed with purpose. We&apos;re not just
              making hats &mdash; we&apos;re building a community of hardworking people who take
              pride in what they do.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {[
                { value: "25+", label: "Products" },
                { value: "100%", label: "Quality" },
                { value: "Texas", label: "Made In" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 sm:p-5 bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
                  <p
                    className="text-xl sm:text-2xl lg:text-3xl text-[#995F2F] font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[0.65rem] text-[#978F66] tracking-[0.1em] uppercase mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2.5 px-7 sm:px-10 py-3 sm:py-4 bg-[#622B14] text-[#E4D6A9] text-[0.65rem] sm:text-[0.7rem] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase rounded-md hover:bg-[#622B14] transition-all duration-300"
            >
              Learn More
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
