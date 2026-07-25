"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Heart, Shield, Star, Users } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const VALUES = [
  {
    icon: Heart,
    title: "Quality First",
    description: "Every product is crafted with premium materials and meticulous attention to detail.",
  },
  {
    icon: Shield,
    title: "Built to Last",
    description: "Our gear is made for the long haul — just like the workin' men who wear it.",
  },
  {
    icon: Star,
    title: "Texas Proud",
    description: "Designed and shipped from the heart of Texas. American quality, American grit.",
  },
  {
    icon: Users,
    title: "Community",
    description: "More than a brand — we're a community of hardworking people supporting each other.",
  },
];

const TIMELINE = [
  { year: "2025", title: "The Idea", description: "Skyler Smithson starts Workin' Man Hat Co. from a garage in Texas." },
  { year: "2025", title: "First Drop", description: "Our first collection launches — selling out within weeks." },
  { year: "2026", title: "Growing Strong", description: "Expanding our line with premium hats, apparel, and accessories." },
];

export default function AboutPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-[#E4D6A9]">
        {/* Hero */}
        <section className="bg-[#3A1808] py-14 sm:py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(196,120,50,0.06)_0%,transparent_60%)]" />
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#995F2F] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-semibold mb-3 sm:mb-4 inline-block">
                Our Story
              </span>
              <h1
                className="text-3xl sm:text-5xl lg:text-7xl text-[#E4D6A9] mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                BUILT ON HARD WORK
              </h1>
              <div className="w-16 h-[2px] bg-[#995F2F] mx-auto mb-6" />
              <p className="text-[#E4D6A9]/40 text-sm lg:text-base max-w-xl mx-auto">
                For your every day workin&apos;man. Born in Texas, built on grit, and designed
                for those who put in the work.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section ref={ref} className="py-14 sm:py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7 }}
                className="relative overflow-hidden"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(0,0,0,0.2)]">
                  <img
                    src="https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/f4c02976-3f0a-4d66-975f-c6eee8ed8a36/F16BBA54-AF60-4D50-9739-4A570BD208D5.png"
                    alt="Workin' Man collection"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-[#995F2F]/8 rounded-xl -z-10" />
                <div className="absolute -top-5 -left-5 w-24 h-24 border-2 border-[#995F2F]/15 rounded-xl -z-10" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15, duration: 0.7 }}
              >
                <span className="text-[#995F2F] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
                  Meet the Founder
                </span>
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl mt-2 mb-4 sm:mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  SKYLER SMITHSON
                </h2>
                <p className="text-[#978F66] text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                  Hey, I&apos;m Skyler — the founder and one-man show behind Workin&apos; Man Hat Co.
                  I started this company with one simple belief: the everyday workin&apos; man
                  deserves quality gear that matches his work ethic.
                </p>
                <p className="text-[#978F66] text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                  Growing up in Texas, I saw too many brands cutting corners and charging premium
                  prices for average products. I wanted to change that. Every hat, every tee,
                  every piece of gear we make is built with the same care I&apos;d put into
                  something for myself.
                </p>
                <p className="text-[#978F66] text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                  This isn&apos;t just a business to me — it&apos;s a mission to build a community
                  of hardworking people who take pride in what they do. Welcome to the family.
                </p>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {[
                    { value: "100%", label: "Quality" },
                    { value: "Texas", label: "Made In" },
                    { value: "2025", label: "Founded" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 sm:p-5 bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
                      <p className="text-lg sm:text-xl lg:text-2xl text-[#995F2F] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        {stat.value}
                      </p>
                      <p className="text-[0.65rem] text-[#978F66] tracking-[0.1em] uppercase mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-14 sm:py-20 lg:py-28 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-[#995F2F] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
                What We Stand For
              </span>
              <h2
                className="text-2xl sm:text-3xl lg:text-5xl mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                OUR VALUES
              </h2>
              <div className="w-16 h-[2px] bg-[#995F2F] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group text-center p-7 bg-[#E4D6A9] rounded-xl border border-transparent hover:border-[#995F2F]/20 hover:shadow-lg transition-all duration-500 cursor-default hover:bg-[#622B14]"
                >
                  <div className="w-14 h-14 bg-[#995F2F]/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-[#622B14]/20 transition-colors duration-500">
                    <value.icon size={24} className="text-[#995F2F]" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide uppercase mb-2 group-hover:text-[#E4D6A9] transition-colors duration-500">{value.title}</h3>
                  <p className="text-[#978F66] text-sm leading-relaxed group-hover:text-[#E4D6A9]/60 transition-colors duration-500">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-14 sm:py-20 lg:py-28 bg-[#622B14] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(196,120,50,0.06)_0%,transparent_60%)]" />
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-[#995F2F] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
                The Journey
              </span>
              <h2
                className="text-2xl sm:text-3xl lg:text-5xl text-[#E4D6A9] mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                HOW IT STARTED
              </h2>
              <div className="w-16 h-[2px] bg-[#995F2F] mx-auto mt-4" />
            </div>
            <div className="max-w-2xl mx-auto">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex gap-6 mb-10 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#995F2F]/20 border-2 border-[#995F2F] flex items-center justify-center text-[#995F2F] text-xs font-bold">
                      {item.year.slice(-2)}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-0.5 flex-1 bg-white/8 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-[#995F2F] text-xs tracking-wider uppercase font-semibold mb-1">{item.year}</p>
                    <h3 className="text-[#E4D6A9] text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-[#E4D6A9]/40 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 text-center">
            <h2
              className="text-2xl sm:text-3xl lg:text-5xl mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              JOIN THE FAMILY
            </h2>
            <div className="w-16 h-[2px] bg-[#995F2F] mx-auto mb-6" />
            <p className="text-[#978F66] text-sm max-w-md mx-auto mb-8 sm:mb-10">
              Browse our collection and find gear that matches your work ethic.
            </p>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2.5 px-7 sm:px-10 py-3 sm:py-4 bg-[#622B14] text-[#E4D6A9] text-[0.65rem] sm:text-[0.7rem] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase rounded-md hover:bg-[#622B14] transition-all duration-300"
            >
              Shop Now
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
