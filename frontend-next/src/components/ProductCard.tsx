"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const price = product.sizes?.[0]?.price || product.price;
  const tags = product.tags || [];
  const isBestSeller =
    tags.includes("best-seller") || tags.includes("Best Seller");
  const isNew = tags.includes("new") || tags.includes("New");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      _id: product._id,
      title: product.title,
      price,
      images: product.images,
      slug: product.slug,
      size: product.sizes?.[0]?.name || "One Size",
    });
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !token) {
      router.push("/auth/signin");
      return;
    }
    try {
      const res = await fetch(`/api/favorites/${product._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.favorited ?? !liked);
      }
    } catch {
      setLiked(!liked);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.06,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="group block bg-white rounded-xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] transition-all duration-500"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#D4CBA8]">
          {/* Loading skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4CBA8] to-[#D4B896]/30 animate-pulse" />
          )}

          {/* Image with hover zoom */}
          <img
            src={product.images?.[0] || ""}
            alt={product.title}
            loading={index < 4 ? "eager" : "lazy"}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge */}
          {isBestSeller && (
            <span
              className="absolute top-3 left-3 px-3 py-1.5 bg-[#995F2F] text-white text-[0.6rem] font-bold tracking-[0.15em] uppercase rounded"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Best Seller
            </span>
          )}
          {isNew && !isBestSeller && (
            <span
              className="absolute top-3 left-3 px-3 py-1.5 bg-[#622B14] text-[#E4D6A9] text-[0.6rem] font-bold tracking-[0.15em] uppercase rounded"
              style={{ fontFamily: "var(--font-body)" }}
            >
              New
            </span>
          )}

          {/* Favorite button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
              liked
                ? "bg-[#995F2F] text-white shadow-lg shadow-[#995F2F]/20"
                : "bg-white/80 backdrop-blur-sm text-[#3A1808]/50 hover:bg-white hover:text-[#995F2F]"
            }`}
            aria-label="Favorite"
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
          </button>

          {/* Quick Add - always visible on mobile, hover on desktop */}
          <div className="absolute bottom-0 inset-x-0 md:translate-y-full md:group-hover:translate-y-0 md:transition-transform md:duration-300 md:ease-out">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#622B14]/90 backdrop-blur-sm text-[#E4D6A9] text-[0.65rem] font-bold tracking-[0.18em] uppercase hover:bg-[#622B14] transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <ShoppingBag size={13} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="p-4">
          <h3
            className="text-[0.8rem] font-semibold text-[#622B14] truncate group-hover:text-[#995F2F] transition-colors duration-300"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {product.title}
          </h3>
          <p
            className="text-[0.6rem] text-[#3A1808]/40 tracking-[0.12em] uppercase mt-1"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Workin&apos; Man Hat Co.
          </p>
          <div className="flex items-center justify-between mt-2.5">
            <p
              className="text-[0.95rem] font-bold text-[#622B14]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              ${price.toFixed(2)}
            </p>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className="fill-[#995F2F] text-[#995F2F]" />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
