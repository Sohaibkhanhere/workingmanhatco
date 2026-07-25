"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQty, total, count } = useCart();
  const freeShippingThreshold = 75;
  const shippingRemaining = Math.max(0, freeShippingThreshold - total);
  const shippingPct = Math.min((total / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-[70] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-[#3A1808]">
              <h2
                className="text-sm font-semibold tracking-[0.1em] uppercase text-[#E4D6A9]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cart ({count})
              </h2>
              <button onClick={() => setOpen(false)} className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#E4D6A9]/70 hover:text-[#C89A4A] transition-colors" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {items.length > 0 && (
              <div className="px-6 pt-4">
                <div className="h-1.5 bg-[#D4CBA8] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingPct}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full transition-colors duration-300 ${
                      shippingRemaining === 0
                        ? "bg-emerald-500"
                        : "bg-gradient-to-r from-[#995F2F] to-[#D4944A]"
                    }`}
                  />
                </div>
                <p className="text-xs text-[#978F66] mt-2 text-center">
                  {shippingRemaining === 0 ? (
                    <span className="text-emerald-600 font-medium">
                      You&apos;ve unlocked FREE shipping!
                    </span>
                  ) : (
                    <>
                      Add <span className="font-semibold text-[#622B14]">${shippingRemaining.toFixed(2)}</span> more for free shipping
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={40} className="text-[#C8C2B0]/50 mb-4" strokeWidth={1.5} />
                  <p className="text-[#978F66] font-medium mb-1">Your cart is empty</p>
                  <p className="text-sm text-[#B0A892] mb-5">
                    Add some gear to get started
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="text-xs font-semibold text-[#C89A4A] hover:text-[#3A1808] underline underline-offset-4 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item._id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-4 pb-4 border-b border-[#D4CBA8] last:border-0"
                    >
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#D4CBA8] flex-shrink-0">
                        <img
                          src={item.images?.[0] || ""}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#622B14] truncate">{item.title}</p>
                        <p className="text-xs text-[#B0A892] mt-0.5">{item.size || "One Size"}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[#C8C2B0]/60 rounded-md">
                            <button
                              onClick={() => updateQty(i, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#E4D6A9] transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-[#622B14]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(i, 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#E4D6A9] transition-colors"
                              aria-label="Increase"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-[#622B14]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(i)}
                        className="text-xs text-[#C8C2B0] hover:text-red-500 self-start transition-colors p-1"
                        aria-label="Remove"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#D4CBA8] px-6 py-4 space-y-3">
                <div className="flex justify-between text-sm font-semibold text-[#622B14]">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="block w-full py-3.5 bg-[#C89A4A] text-[#3A1808] rounded-md font-bold text-[0.7rem] tracking-[0.12em] uppercase text-center hover:bg-[#B08040] transition-colors min-h-[44px] flex items-center justify-center"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Checkout — ${total.toFixed(2)}
                </Link>
                <div className="flex items-center justify-center gap-5 pt-1">
                  <span className="flex items-center gap-1.5 text-[0.65rem] text-[#B0A892]">
                    <Shield size={11} /> Secure
                  </span>
                  <span className="flex items-center gap-1.5 text-[0.65rem] text-[#B0A892]">
                    <RotateCcw size={11} /> 30-day returns
                  </span>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
