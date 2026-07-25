"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, X, Check, Lock } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

const STEPS = ["Cart", "Information", "Payment"];

export default function CheckoutPage() {
  const { items, total, updateQty, removeItem, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = total >= 75 ? 0 : 8.99;
  const tax = total * 0.0825;
  const grandTotal = total + shipping + tax;

  if (orderPlaced) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="min-h-screen bg-[#E4D6A9] flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center px-5 py-16">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-emerald-500" />
            </div>
            <h1 className="text-4xl lg:text-5xl mb-3" style={{ fontFamily: "var(--font-display)" }}>ORDER CONFIRMED</h1>
            <p className="text-[#978F66] text-sm mb-2">Thanks for your order! We&apos;ll send you a confirmation email shortly.</p>
            <p className="text-[0.65rem] text-[#B0A892] mb-8">Order #WMC-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#622B14] text-[#E4D6A9] text-[0.7rem] font-bold tracking-[0.15em] uppercase rounded-md hover:bg-[#622B14] transition-all duration-300">Continue Shopping</Link>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="min-h-screen bg-[#E4D6A9] flex items-center justify-center">
          <div className="text-center px-5">
            <h1 className="text-4xl mb-4" style={{ fontFamily: "var(--font-display)" }}>YOUR CART IS EMPTY</h1>
            <p className="text-[#978F66] text-sm mb-6">Add some gear before checking out.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#622B14] text-[#E4D6A9] text-[0.7rem] font-bold tracking-[0.15em] uppercase rounded-md hover:bg-[#622B14] transition-all">Shop Now</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-[#E4D6A9]">
        <div className="bg-white border-b border-[#D4CBA8]">
          <div className="max-w-5xl mx-auto px-5 py-4">
            <div className="flex items-center justify-center gap-4">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-[#622B14] text-[#E4D6A9]" : "bg-[#D4CBA8] text-[#B0A892]"}`}>
                      {step > i + 1 ? <Check size={14} /> : i + 1}
                    </div>
                    <span className={`text-xs font-semibold tracking-wide uppercase ${step === i + 1 ? "text-[#622B14]" : "text-[#B0A892]"}`}>{label}</span>
                  </div>
                  {i < 2 && <div className={`w-8 h-0.5 ${step > i + 1 ? "bg-emerald-500" : "bg-[#D4CBA8]"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-bold text-[#622B14] mb-6">Your Cart</h2>
                  <div className="space-y-4">
                    {items.map((item, i) => (
                      <div key={`${item._id}-${item.size}`} className="flex gap-4 p-4 bg-white rounded-xl border border-[#D4CBA8]">
                        <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#D4CBA8] flex-shrink-0">
                          <Image src={item.images?.[0] || ""} alt={item.title} width={80} height={96} className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#622B14] truncate">{item.title}</p>
                          <p className="text-xs text-[#B0A892] mt-0.5">{item.size}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-[#C8C2B0]/60 rounded-md">
                              <button onClick={() => updateQty(i, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#D4CBA8] transition-colors" aria-label="Decrease"><Minus size={12} /></button>
                              <span className="w-8 text-center text-xs font-semibold text-[#622B14]">{item.quantity}</span>
                              <button onClick={() => updateQty(i, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#D4CBA8] transition-colors" aria-label="Increase"><Plus size={12} /></button>
                            </div>
                            <span className="text-sm font-semibold text-[#622B14]">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                        <button onClick={() => removeItem(i)} className="text-[#C8C2B0] hover:text-red-500 transition-colors self-start p-1" aria-label="Remove"><X size={16} /></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setStep(2)} className="w-full mt-6 py-3.5 bg-[#622B14] text-[#E4D6A9] rounded-lg font-bold text-[0.75rem] tracking-[0.1em] uppercase hover:bg-[#622B14] transition-colors min-h-[44px]" style={{ fontFamily: "var(--font-body)" }}>Continue to Information</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-bold text-[#622B14] mb-6">Shipping Information</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">First Name</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-white focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Last Name</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-white focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Email</label>
                      <input type="email" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-white focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" placeholder="you@email.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Phone</label>
                      <input type="tel" className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-white focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" placeholder="(555) 000-0000" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Address</label>
                      <input type="text" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-white focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" placeholder="123 Main St" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">City</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-white focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">State</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-white focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Zip</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-white focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 border border-[#C8C2B0]/60 rounded-lg text-sm font-semibold text-[#622B14] hover:bg-[#D4CBA8] transition-colors">Back</button>
                      <button type="submit" className="flex-1 py-3.5 bg-[#622B14] text-[#E4D6A9] rounded-lg font-bold text-[0.75rem] tracking-[0.1em] uppercase hover:bg-[#622B14] transition-colors min-h-[44px]" style={{ fontFamily: "var(--font-body)" }}>Continue to Payment</button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-bold text-[#622B14] mb-6">Payment</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setOrderPlaced(true); clearCart(); }} className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-[#D4CBA8]">
                      <div className="flex items-center gap-2 mb-4">
                        <Lock size={14} className="text-[#995F2F]" />
                        <span className="text-xs font-semibold text-[#B0A892]">Secure & Encrypted</span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Card Number</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-[#E4D6A9] focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Expiry</label>
                          <input type="text" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-[#E4D6A9] focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" placeholder="MM/YY" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">CVC</label>
                          <input type="text" required className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-[#E4D6A9] focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]" placeholder="123" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setStep(2)} className="px-6 py-3.5 border border-[#C8C2B0]/60 rounded-lg text-sm font-semibold text-[#622B14] hover:bg-[#D4CBA8] transition-colors">Back</button>
                      <button type="submit" className="flex-1 py-3.5 bg-[#622B14] text-[#E4D6A9] rounded-lg font-bold text-[0.75rem] tracking-[0.1em] uppercase hover:bg-[#3A1808] transition-colors min-h-[44px]" style={{ fontFamily: "var(--font-body)" }}>Place Order &mdash; ${grandTotal.toFixed(2)}</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-[#D4CBA8] p-6 sticky top-24 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-bold tracking-wide uppercase mb-4 text-[#622B14]">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item, i) => (
                    <div key={`${item._id}-${item.size}`} className="flex gap-3">
                      <div className="w-14 h-16 rounded-lg overflow-hidden bg-[#D4CBA8] flex-shrink-0">
                        <img src={item.images?.[0] || ""} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#622B14] truncate">{item.title}</p>
                        <p className="text-[0.65rem] text-[#B0A892]">{item.size} x {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#622B14]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#D4CBA8] pt-3 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[#B0A892]">Subtotal</span><span className="font-semibold text-[#622B14]">${total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#B0A892]">Shipping</span><span className="font-semibold text-[#622B14]">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#B0A892]">Tax (8.25%)</span><span className="font-semibold text-[#622B14]">${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-base font-bold border-t border-[#D4CBA8] pt-2 mt-2 text-[#622B14]"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
                </div>
                {total < 75 && (
                  <div className="mt-3 p-2.5 bg-[#995F2F]/5 rounded-lg">
                    <p className="text-[0.65rem] text-[#978F66] text-center">Add <span className="font-semibold text-[#622B14]">${(75 - total).toFixed(2)}</span> more for free shipping</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
