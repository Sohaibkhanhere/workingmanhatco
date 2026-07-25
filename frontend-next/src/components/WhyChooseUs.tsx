"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Hammer, Shield, MapPin, Users } from "lucide-react";

const features = [
  {
    icon: Hammer,
    title: "Handmade Quality",
    desc: "Every piece crafted with care in Texas",
  },
  {
    icon: Shield,
    title: "Built to Last",
    desc: "Premium materials that stand up to real work",
  },
  {
    icon: MapPin,
    title: "Texas Proud",
    desc: "Designed and shipped from the Lone Star State",
  },
  {
    icon: Users,
    title: "Real Community",
    desc: "Join thousands of hardworking Americans",
  },
];

export default function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-[#C89A4A] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
            The Difference
          </span>
          <h2
            className="text-[#622B14] text-3xl sm:text-4xl lg:text-6xl mt-2 tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BUILT DIFFERENT
          </h2>
          <div className="w-16 h-[2px] bg-[#C89A4A] mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-[#E4D6A9] rounded-xl p-8 flex flex-col gap-5 hover:bg-[#3A1808] transition-all duration-500 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-[#C89A4A]/10 flex items-center justify-center group-hover:bg-[#C89A4A]/30 transition-colors duration-500">
                <f.icon size={24} className="text-[#C89A4A] group-hover:text-[#E4D6A9] transition-colors duration-500" />
              </div>
              <div>
                <h3
                  className="text-[#622B14] text-lg font-bold group-hover:text-[#E4D6A9] transition-colors duration-500"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-[#978F66] text-sm leading-relaxed mt-2 group-hover:text-[#E4D6A9]/60 transition-colors duration-500"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
