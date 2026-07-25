"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Send, Mail, MapPin, Clock, MessageSquare, Check } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "workinmanhatco@gmail.com", href: "mailto:workinmanhatco@gmail.com" },
  { icon: MapPin, label: "Location", value: "Texas, USA", href: null },
  { icon: Clock, label: "Hours", value: "Mon-Fri, 9am-5pm CST", href: null },
];

const FAQ_ITEMS = [
  { q: "How long does shipping take?", a: "Standard shipping takes 3-7 business days. Free shipping on orders over $75." },
  { q: "What is your return policy?", a: "We offer 30-day returns on unworn items with tags attached. Contact us to initiate a return." },
  { q: "Do you ship internationally?", a: "Currently we ship within the United States. International shipping coming soon." },
  { q: "How do I track my order?", a: "You'll receive a tracking number via email once your order ships." },
];

export default function ContactPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-[#E4D6A9]">
        {/* Hero */}
        <section className="bg-[#3A1808] py-12 sm:py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(196,120,50,0.06)_0%,transparent_60%)]" />
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#995F2F] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-semibold mb-3 sm:mb-4 inline-block">
                Get in Touch
              </span>
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl text-[#E4D6A9]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                CONTACT US
              </h1>
              <div className="w-16 h-[2px] bg-[#995F2F] mx-auto mt-4 mb-4" />
              <p className="text-[#E4D6A9]/40 text-sm mt-3 max-w-md mx-auto">
                Questions, feedback, or just want to say hey? We&apos;d love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section ref={ref} className="py-8 sm:py-12 lg:py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3"
              >
                <div className="bg-white rounded-xl border border-[#D4CBA8] p-6 lg:p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#995F2F]/10 rounded-xl flex items-center justify-center">
                      <MessageSquare size={20} className="text-[#995F2F]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#622B14]">Send a Message</h2>
                      <p className="text-xs text-[#B0A892]">We&apos;ll get back to you within 24 hours</p>
                    </div>
                  </div>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} className="text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold text-[#622B14] mb-2">Message Sent!</h3>
                      <p className="text-[#B0A892] text-sm mb-6">
                        Thanks for reaching out. We&apos;ll get back to you soon.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2.5 bg-[#622B14] text-[#E4D6A9] rounded-lg text-sm font-semibold hover:bg-[#622B14] transition-colors"
                      >
                        Send Another
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Name</label>
                          <input
                            type="text"
                            required
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-[#E4D6A9] focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Email</label>
                          <input
                            type="email"
                            required
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-[#E4D6A9] focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all min-h-[44px]"
                            placeholder="you@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Subject</label>
                        <select
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-[#E4D6A9] focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all cursor-pointer min-h-[44px]"
                        >
                          <option value="">Select a topic</option>
                          <option value="order">Order Inquiry</option>
                          <option value="return">Return / Exchange</option>
                          <option value="product">Product Question</option>
                          <option value="wholesale">Wholesale</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-[#622B14]">Message</label>
                        <textarea
                          required
                          rows={5}
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-[#C8C2B0]/60 text-sm bg-[#E4D6A9] focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F]/20 outline-none transition-all resize-none min-h-[44px]"
                          placeholder="How can we help?"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#622B14] text-[#E4D6A9] rounded-lg font-bold text-[0.75rem] tracking-[0.1em] uppercase hover:bg-[#622B14] transition-all duration-300 min-h-[44px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <Send size={14} />
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="lg:col-span-2 space-y-5"
              >
                {CONTACT_INFO.map((info) => (
                  <div key={info.label} className="bg-white rounded-xl border border-[#D4CBA8] p-5 flex items-start gap-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
                    <div className="w-10 h-10 bg-[#995F2F]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon size={18} className="text-[#995F2F]" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] text-[#B0A892] tracking-[0.1em] uppercase font-semibold mb-0.5">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-sm font-medium text-[#622B14] hover:text-[#995F2F] transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-[#622B14]">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Social */}
                <div className="bg-white rounded-xl border border-[#D4CBA8] p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
                  <p className="text-[0.65rem] text-[#B0A892] tracking-[0.1em] uppercase font-semibold mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    {[
                      { label: "Instagram", href: "https://www.instagram.com/workinmanhatco/" },
                      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61578779784429" },
                      { label: "TikTok", href: "https://www.tiktok.com/@workinmanhatco/" },
                      { label: "Email", href: "mailto:workinmanhatco@gmail.com" },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#E4D6A9] rounded-lg text-xs font-semibold hover:bg-[#622B14]/10 hover:text-[#995F2F] transition-colors"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 sm:py-12 lg:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-5 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-[#995F2F] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
                Got Questions?
              </span>
              <h2
                className="text-2xl sm:text-3xl lg:text-5xl mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                FREQUENTLY ASKED
              </h2>
              <div className="w-16 h-[2px] bg-[#995F2F] mx-auto mt-4" />
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, i) => (
                <div key={i} className="border border-[#D4CBA8] rounded-xl overflow-hidden hover:border-[#995F2F]/20 transition-colors">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[#622B14] hover:bg-[#E4D6A9] transition-colors min-h-[44px]"
                  >
                    <span>{faq.q}</span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      className="text-[#B0A892] text-lg flex-shrink-0 ml-4"
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-[#978F66] leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
