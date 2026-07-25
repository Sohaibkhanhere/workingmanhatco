"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Grid3X3, LayoutGrid, X } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";

const CATEGORIES = ["All", "Hats", "Apparel", "Accessories"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSort = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSort, setActiveSort] = useState(initialSort);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { limit: 50 };
    if (activeCategory !== "All") params.category = activeCategory;
    if (activeSort) params.sort = activeSort;
    fetchProducts(params)
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, activeSort]);

  const displayedProducts = useMemo(() => {
    return products;
  }, [products]);

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-[#E4D6A9]">
        {/* Hero */}
        <section className="bg-[#3A1808] py-14 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(196,120,50,0.08)_0%,transparent_60%)]" />
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#995F2F] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
                Our Collection
              </span>
              <h1
                className="text-3xl sm:text-4xl lg:text-6xl text-[#E4D6A9] mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {activeCategory === "All" ? "SHOP ALL" : activeCategory.toUpperCase()}
              </h1>
              <p className="text-[#E4D6A9]/40 text-sm mt-2 max-w-md">
                Premium hats & apparel built for the everyday workin&apos; man
              </p>
            </motion.div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="border-b border-[#C8C2B0]/50 bg-white sticky top-16 lg:top-[70px] z-30">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-5 py-2 rounded-md text-[0.6rem] sm:text-[0.7rem] font-semibold tracking-[0.08em] uppercase transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-[#622B14] text-[#E4D6A9] shadow-md"
                      : "text-[#978F66] hover:text-[#622B14] hover:bg-[#E4D6A9]"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Grid toggle */}
              <div className="hidden lg:flex items-center border border-[#C8C2B0]/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 ${gridCols === 4 ? "bg-[#622B14] text-[#E4D6A9]" : "text-[#B0A892] hover:bg-[#E4D6A9]"}`}
                  aria-label="4 column grid"
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 ${gridCols === 3 ? "bg-[#622B14] text-[#E4D6A9]" : "text-[#B0A892] hover:bg-[#E4D6A9]"}`}
                  aria-label="3 column grid"
                >
                  <LayoutGrid size={15} />
                </button>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="appearance-none bg-[#E4D6A9] border border-[#C8C2B0]/50 rounded-lg px-4 py-2 pr-8 text-[0.7rem] font-semibold tracking-wide uppercase text-[#622B14] cursor-pointer hover:border-[#995F2F]/40 transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0A892] pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-8 lg:py-12">
          {loading ? (
            <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 lg:gap-6`}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-[#D4CBA8] rounded-xl mb-3" />
                  <div className="h-3 bg-[#D4CBA8] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[#D4CBA8] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#978F66] text-lg font-medium mb-2">No products found</p>
              <p className="text-[#B0A892] text-sm">Try a different category or filter</p>
            </div>
          ) : (
            <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 lg:gap-6`}>
              {displayedProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}

          {!loading && displayedProducts.length > 0 && (
            <div className="text-center mt-12 text-sm text-[#B0A892]">
              Showing {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function ShopSkeleton() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-[#E4D6A9]">
        <div className="bg-[#3A1808] py-14 lg:py-20">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
            <div className="h-4 bg-white/10 rounded w-32 mb-3 animate-pulse" />
            <div className="h-10 bg-white/10 rounded w-64 animate-pulse" />
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-[#D4CBA8] rounded-xl mb-3" />
                <div className="h-3 bg-[#D4CBA8] rounded w-1/3 mb-2" />
                <div className="h-3 bg-[#D4CBA8] rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
