"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Flame, Clock, Award, Truck, ShieldCheck, MapPin, Star } from "lucide-react";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LOGO_URL, HERO_BG, CATEGORY_IMAGES } from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const FEATURES = [
  { icon: Flame, title: "Built Tough", desc: "Premium materials made to endure the harshest work days." },
  { icon: Clock, title: "Lasting Quality", desc: "Designed for comfort from sunrise to sunset." },
  { icon: Award, title: "Trusted Brand", desc: "Worn by thousands of hardworking Americans." },
  { icon: Truck, title: "Free Shipping", desc: "On all orders over $75 across the USA." },
];

const CATEGORIES = [
  { name: "Trucker Hats", img: CATEGORY_IMAGES.Hats, href: "/shop?category=Hats" },
  { name: "Premium Apparel", img: CATEGORY_IMAGES.Apparel, href: "/shop?category=Apparel" },
  { name: "Accessories", img: CATEGORY_IMAGES.Accessories, href: "/shop?category=Accessories" },
];

const TESTIMONIALS = [
  { name: "Jake R.", text: "Best hat I've ever owned. Period. The quality is unreal for the price.", rating: 5 },
  { name: "Maria L.", text: "Bought one for my husband and he wears it every single day. Already ordering another!", rating: 5 },
  { name: "Cody M.", text: "This is real American craftsmanship. You can feel the difference the moment you put it on.", rating: 5 },
];

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[85vh] min-h-[550px] max-h-[900px] flex items-center justify-center overflow-hidden bg-[#3A1808]">
          <div className="absolute inset-0">
            <Image src={HERO_BG} alt="" fill className="object-cover opacity-50" style={{ animation: "heroZoom 20s ease-in-out infinite alternate" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#622B14]/70 via-[#622B14]/30 to-[#622B14]/80" />
          </div>
          <div className="relative z-10 w-full max-w-5xl mx-auto px-5 text-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="mb-4">
                <span className="text-[#C89A4A] text-[0.65rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                  Est. 2025 &mdash; Texas, USA
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-[#E4D6A9] leading-[0.88] mb-5" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 11vw, 8.5rem)", letterSpacing: "0.02em" }}>
                WELCOME TO<br /><span className="text-[#C89A4A]">WORKIN&apos; MAN</span>
              </motion.h1>
              <motion.div variants={fadeUp} className="w-16 h-[2px] bg-[#C89A4A] mx-auto mb-5" />
              <motion.p variants={fadeUp} className="text-[#E4D6A9]/50 text-sm lg:text-base max-w-lg mx-auto mb-10 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                For your every day workin&apos;man. Hats and apparel built on hard work, American pride, and quality craftsmanship.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/shop" className="group flex items-center gap-2.5 px-10 py-4 bg-[#C89A4A] text-[#3A1808] text-xs font-bold tracking-[0.2em] uppercase rounded-md hover:bg-[#D4A854] transition-all duration-300" style={{ fontFamily: "var(--font-body)" }}>
                  Shop Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about" className="px-10 py-4 border border-[#E4D6A9]/25 text-[#E4D6A9]/70 text-xs font-bold tracking-[0.2em] uppercase rounded-md hover:bg-[#E4D6A9]/5 transition-all duration-300" style={{ fontFamily: "var(--font-body)" }}>
                  Our Story
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features strip */}
        <section className="bg-[#3A1808] border-t border-[#C89A4A]/10">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => (
                <div key={f.title} className={`flex items-center gap-4 py-7 ${i < 3 ? "border-r border-[#C89A4A]/10" : ""} ${i < 2 ? "lg:border-r lg:border-[#C89A4A]/10" : ""} ${i === 0 || i === 2 ? "border-b lg:border-b-0 border-[#C89A4A]/10" : ""} ${i === 2 ? "lg:border-r lg:border-[#C89A4A]/10" : ""}`}>
                  <div className="w-10 h-10 rounded-lg bg-[#C89A4A]/15 flex items-center justify-center shrink-0">
                    <f.icon size={18} className="text-[#C89A4A]" />
                  </div>
                  <div>
                    <h3 className="text-[#E4D6A9] text-xs font-bold tracking-wider uppercase" style={{ fontFamily: "var(--font-body)" }}>{f.title}</h3>
                    <p className="text-[#E4D6A9]/35 text-[0.65rem] mt-0.5 hidden sm:block" style={{ fontFamily: "var(--font-body)" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="bg-[#E4D6A9] py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#C89A4A] text-[0.65rem] tracking-[0.2em] uppercase font-semibold" style={{ fontFamily: "var(--font-body)" }}>Collections</span>
              <h2 className="text-[#622B14] text-4xl lg:text-5xl mt-2 tracking-wide" style={{ fontFamily: "var(--font-display)" }}>SHOP BY CATEGORY</h2>
              <div className="w-16 h-[2px] bg-[#C89A4A] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {CATEGORIES.map((cat) => (
                <Link key={cat.name} href={cat.href} className="group relative h-[350px] lg:h-[420px] rounded-xl overflow-hidden">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#622B14]/70 via-[#622B14]/20 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <h3 className="text-[#E4D6A9] text-lg font-bold tracking-wider uppercase" style={{ fontFamily: "var(--font-body)" }}>{cat.name}</h3>
                    <span className="flex items-center gap-2 text-[#C89A4A] text-xs font-bold tracking-wider uppercase mt-2 group-hover:gap-3 transition-all duration-300" style={{ fontFamily: "var(--font-body)" }}>
                      Shop Now <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Promise */}
        <section className="bg-[#3A1808] py-20 lg:py-28">
          <div className="max-w-[1100px] mx-auto px-5 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="w-10 h-[1px] bg-[#C89A4A]" />
                <ShieldCheck size={20} className="text-[#C89A4A]" />
                <span className="w-10 h-[1px] bg-[#C89A4A]" />
              </div>
              <h2 className="text-[#E4D6A9] text-3xl lg:text-5xl leading-[1.1] tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                OUR PROMISE TO YOU
              </h2>
              <p className="text-[#E4D6A9]/40 text-sm lg:text-base max-w-2xl mx-auto mt-6 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Every product we sell is built with intention. No shortcuts, no compromises.
                We source the best materials, partner with skilled craftspeople, and stand behind
                every stitch. If it doesn&apos;t meet our standard, it doesn&apos;t leave Texas.
              </p>
              <Link href="/shop" className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-[#C89A4A] text-[#3A1808] text-xs font-bold tracking-[0.15em] uppercase rounded-md hover:bg-[#D4A854] transition-all duration-300" style={{ fontFamily: "var(--font-body)" }}>
                See the Difference <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-[#E4D6A9] py-20 lg:py-28">
          <div className="max-w-[1100px] mx-auto px-5 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#C89A4A] text-[0.65rem] tracking-[0.2em] uppercase font-semibold" style={{ fontFamily: "var(--font-body)" }}>Reviews</span>
              <h2 className="text-[#622B14] text-4xl lg:text-5xl mt-2 tracking-wide" style={{ fontFamily: "var(--font-display)" }}>WHAT PEOPLE SAY</h2>
              <div className="w-16 h-[2px] bg-[#C89A4A] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="bg-white rounded-xl p-7 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)]">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} className="fill-[#995F2F] text-[#C89A4A]" />
                    ))}
                  </div>
                  <p className="text-[#622B14]/80 text-sm leading-relaxed mb-5" style={{ fontFamily: "var(--font-body)" }}>&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#C89A4A] flex items-center justify-center">
                      <span className="text-[#E4D6A9] text-xs font-bold" style={{ fontFamily: "var(--font-body)" }}>{t.name[0]}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#622B14]" style={{ fontFamily: "var(--font-body)" }}>{t.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Texas Pride Banner */}
        <section className="bg-[#C89A4A] py-16">
          <div className="max-w-[1100px] mx-auto px-5 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin size={18} className="text-[#E4D6A9]/60" />
              <span className="text-[#E4D6A9]/60 text-[0.65rem] tracking-[0.25em] uppercase font-semibold" style={{ fontFamily: "var(--font-body)" }}>Proudly Made In</span>
            </div>
            <h2 className="text-[#E4D6A9] text-3xl lg:text-4xl tracking-wide" style={{ fontFamily: "var(--font-display)" }}>TEXAS, USA</h2>
            <p className="text-[#E4D6A9]/40 text-sm mt-3 max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Every Workin&apos; Man product is designed, crafted, and shipped from the Lone Star State.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
