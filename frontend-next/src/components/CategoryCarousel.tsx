"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORY_IMAGES } from "@/lib/api";

const CATEGORIES = [
  { name: "Hats", slug: "Hats" },
  { name: "Apparel", slug: "Apparel" },
  { name: "Accessories", slug: "Accessories" },
  { name: "New Arrivals", slug: "newest" },
  { name: "Best Sellers", slug: "featured" },
];

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 240, behavior: "smooth" });
    }
  };

  return (
    <section ref={ref} className="py-14 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[#C89A4A] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
              Browse
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-5xl mt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SHOP BY CATEGORY
            </h2>
          </motion.div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full border border-[#C8C2B0]/60 flex items-center justify-center hover:bg-[#3A1808] hover:text-[#E4D6A9] hover:border-[#622B14] transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full border border-[#C8C2B0]/60 flex items-center justify-center hover:bg-[#3A1808] hover:text-[#E4D6A9] hover:border-[#622B14] transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 lg:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.08,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="snap-center flex-shrink-0"
            >
              <Link
                href={cat.slug === "newest" || cat.slug === "featured" ? `/shop?sort=${cat.slug}` : `/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-[3px] border-[#D4CBA8] group-hover:border-[#C89A4A]/50 transition-all duration-500 shadow-md group-hover:shadow-xl group-hover:shadow-[#995F2F]/10 group-hover:scale-105">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES.Accessories})`,
                    }}
                  />
                </div>
                <span
                  className="text-[0.7rem] lg:text-sm font-semibold tracking-[0.08em] uppercase text-[#3A1808]/60 group-hover:text-[#C89A4A] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
