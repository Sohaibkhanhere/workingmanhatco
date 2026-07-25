"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

const TABS = ["All", "Featured", "New", "Best Sellers"] as const;

export default function FeaturedProducts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit: 12 })
      .then((d) => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    activeTab === "Featured"
      ? products.filter((p) => p.featured)
      : activeTab === "New"
      ? products.filter((p) => p.tags?.includes("new")).slice(0, 8)
      : activeTab === "Best Sellers"
      ? products.filter((p) => p.tags?.includes("best-seller")).slice(0, 8)
      : products;

  return (
    <section ref={ref} className="py-14 sm:py-20 lg:py-28 bg-[#E4D6A9]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="text-[#995F2F] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
            Handpicked for You
          </span>
          <h2
            className="text-[#622B14] text-3xl sm:text-4xl lg:text-6xl mt-2 tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            OUR GEAR
          </h2>
          <div className="w-16 h-[2px] bg-[#995F2F] mx-auto mt-4" />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex items-center justify-center gap-1 sm:gap-1.5 mb-10 sm:mb-14 flex-wrap"
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 text-[0.6rem] sm:text-[0.7rem] font-semibold tracking-[0.12em] uppercase transition-all duration-300 rounded-md ${
                activeTab === tab
                  ? "bg-[#622B14] text-[#E4D6A9] shadow-lg shadow-[#622B14]/10"
                  : "text-[#3A1808]/50 hover:text-[#622B14] hover:bg-[#D4B896]/20"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-[#D4CBA8] rounded-xl mb-3" />
                <div className="h-3 bg-[#D4CBA8] rounded w-1/3 mb-2" />
                <div className="h-3 bg-[#D4CBA8] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* View all */}
        {!loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2.5 px-7 sm:px-10 py-3 sm:py-4 border-2 border-[#622B14] text-[#622B14] text-[0.65rem] sm:text-[0.7rem] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase rounded-md hover:bg-[#622B14] hover:text-[#E4D6A9] transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              View All Products
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
