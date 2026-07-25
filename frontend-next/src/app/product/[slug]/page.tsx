"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Heart, ChevronRight, Minus, Plus,
  Truck, RotateCcw, Shield, Star, Check,
} from "lucide-react";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        if (p?.sizes?.length) setSelectedSize(p.sizes[0].name);
        if (p?.colors?.length) setSelectedColor(p.colors[0]);
        if (p?.category) {
          fetchProducts({ category: p.category, limit: 4 }).then((d) => {
            setRelated((d.products || []).filter((rp: Product) => rp._id !== p._id).slice(0, 4));
          });
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        _id: product._id,
        title: product.title,
        price: product.sizes?.find((s) => s.name === selectedSize)?.price || product.price,
        images: product.images,
        slug: product.slug,
        size: selectedSize || "One Size",
      },
      qty
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="min-h-screen bg-[#E4D6A9]">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="aspect-square bg-[#D4CBA8] rounded-xl animate-pulse" />
              <div className="space-y-4 py-8">
                <div className="h-4 bg-[#D4CBA8] rounded w-1/4 animate-pulse" />
                <div className="h-8 bg-[#D4CBA8] rounded w-2/3 animate-pulse" />
                <div className="h-6 bg-[#D4CBA8] rounded w-1/5 animate-pulse" />
                <div className="h-20 bg-[#D4CBA8] rounded animate-pulse" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="min-h-screen bg-[#E4D6A9] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl mb-4" style={{ fontFamily: "var(--font-display)" }}>PRODUCT NOT FOUND</h1>
            <Link href="/shop" className="text-[#995F2F] underline underline-offset-4">Back to Shop</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const price = product.sizes?.find((s) => s.name === selectedSize)?.price || product.price;
  const currentSize = product.sizes?.find((s) => s.name === selectedSize);
  const inStock = currentSize ? currentSize.stock > 0 : true;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-[#E4D6A9]">
        {/* Breadcrumbs */}
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-[#B0A892]">
            <Link href="/" className="hover:text-[#622B14] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/shop" className="hover:text-[#622B14] transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <Link href={`/shop?category=${product.category}`} className="hover:text-[#622B14] transition-colors">{product.category}</Link>
            <ChevronRight size={12} />
            <span className="text-[#622B14] font-medium truncate">{product.title}</span>
          </nav>
        </div>

        {/* Product */}
        <section className="max-w-[1400px] mx-auto px-5 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#D4CBA8] mb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={product.images?.[activeImage] || product.images?.[0] || ""}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {product.featured && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#995F2F] text-white text-[0.65rem] font-semibold tracking-wider uppercase rounded">
                    Featured
                  </span>
                )}

                <button
                  onClick={() => setLiked(!liked)}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    liked ? "bg-red-500 text-white shadow-lg" : "bg-white/80 backdrop-blur-sm text-[#3A1808]/60 hover:bg-white hover:text-red-500"
                  }`}
                  aria-label="Favorite"
                >
                  <Heart size={18} fill={liked ? "currentColor" : "none"} />
                </button>
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === i ? "border-[#995F2F]" : "border-transparent hover:border-[#C8C2B0]"
                      }`}
                    >
                      <Image src={img} alt="" width={80} height={80} className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="lg:py-4"
            >
              <p className="text-xs text-[#B0A892] tracking-[0.15em] uppercase font-semibold mb-2">
                {product.category}
              </p>
              <h1
                className="text-3xl lg:text-4xl mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.title.toUpperCase()}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-[#995F2F] fill-[#995F2F]" />
                  ))}
                </div>
                <span className="text-sm text-[#B0A892]">(4.8) &middot; 127 reviews</span>
              </div>

              <p className="text-2xl font-bold text-[#622B14] mb-6">${price.toFixed(2)}</p>

              <p className="text-[#978F66] text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold tracking-[0.08em] uppercase mb-3">
                    Size &mdash; <span className="text-[#B0A892] font-normal">{selectedSize}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        disabled={size.stock === 0}
                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all min-w-[44px] min-h-[44px] ${
                          selectedSize === size.name
                            ? "bg-[#622B14] text-[#E4D6A9] border-[#622B14]"
                            : size.stock === 0
                            ? "border-[#C8C2B0]/40 text-[#C8C2B0] cursor-not-allowed"
                            : "border-[#C8C2B0]/60 hover:border-[#995F2F]/40"
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold tracking-[0.08em] uppercase mb-3">
                    Color &mdash; <span className="text-[#B0A892] font-normal">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all min-w-[44px] min-h-[44px] ${
                          selectedColor === color
                            ? "bg-[#622B14] text-[#E4D6A9] border-[#622B14]"
                            : "border-[#C8C2B0]/60 hover:border-[#995F2F]/40"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-[#C8C2B0]/60 rounded-lg">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-[#D4CBA8] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-11 text-center text-sm font-semibold text-[#622B14]">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-[#D4CBA8] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-[0.75rem] tracking-[0.1em] uppercase transition-all duration-300 min-h-[44px] ${
                    addedToCart
                      ? "bg-emerald-500 text-white"
                      : inStock
                      ? "bg-[#622B14] text-[#E4D6A9] hover:bg-[#622B14] hover:shadow-lg"
                      : "bg-[#C8C2B0] text-[#B0A892] cursor-not-allowed"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {addedToCart ? (
                    <>
                      <Check size={16} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      {inStock ? "Add to Cart" : "Out of Stock"}
                    </>
                  )}
                </button>
              </div>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-3 py-5 border-t border-[#C8C2B0]/50">
                {[
                  { icon: Truck, label: "Free Shipping", sub: "Orders $75+" },
                  { icon: RotateCcw, label: "30-Day Returns", sub: "Easy & fast" },
                  { icon: Shield, label: "Secure Checkout", sub: "SSL encrypted" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <item.icon size={18} className="mx-auto text-[#995F2F] mb-1.5" />
                    <p className="text-[0.65rem] font-semibold text-[#622B14]">{item.label}</p>
                    <p className="text-[0.6rem] text-[#B0A892]">{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* SKU */}
              <p className="text-[0.65rem] text-[#C8C2B0] mt-4">
                SKU: {product.sku}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-5 lg:px-8 pb-16">
            <h2
              className="text-2xl lg:text-3xl mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
