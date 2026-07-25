"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, TrendingUp } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TRENDING = ["Cowboy Hat", "Trucker Cap", "Hoodie", "Dad Hat", "Tee"];

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await fetchProducts({ search: q, limit: 6 });
      setResults(data.products || []);
    } catch { setResults([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-[90] bg-white shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto px-5 py-6">
              {/* Search input */}
              <div className="flex items-center gap-3 mb-6">
                <Search size={20} className="text-warm-gray-light flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for hats, apparel, accessories..."
                  className="flex-1 text-lg font-light bg-transparent outline-none placeholder:text-warm-gray-light"
                />
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-cream-dark transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Results or trending */}
              {query.length < 2 ? (
                <div>
                  <p className="text-xs font-semibold tracking-[0.1em] uppercase text-warm-gray mb-3 flex items-center gap-2">
                    <TrendingUp size={13} /> Trending
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => setQuery(t)}
                        className="px-4 py-2 rounded-full bg-cream-dark text-sm font-medium hover:bg-gold/10 hover:text-gold hover:border-gold/30 border border-transparent transition-all"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : loading ? (
                <div className="space-y-3 py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-14 h-14 rounded-lg bg-cream-dark" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-cream-dark rounded w-3/4" />
                        <div className="h-3 bg-cream-dark rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((p) => (
                    <Link
                      key={p._id}
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-dark transition-colors group"
                    >
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-cream-dark flex-shrink-0">
                        <img
                          src={p.images?.[0] || ""}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-gold transition-colors">
                          {p.title}
                        </p>
                        <p className="text-xs text-warm-gray">
                          {p.category} · ${(p.sizes?.[0]?.price || p.price).toFixed(2)}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-warm-gray-light opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-warm-gray py-8 text-sm">
                  No results found for &ldquo;{query}&rdquo;
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
