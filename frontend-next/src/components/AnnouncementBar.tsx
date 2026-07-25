"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROMOS = [
  "FREE SHIPPING on orders over $75 — Shop now",
  "Handmade in Texas — Quality you can feel",
  "New Drop Alert — Limited editions selling fast",
];

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % PROMOS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#995F2F] text-[#E4D6A9] text-[0.65rem] tracking-[0.15em] uppercase relative overflow-hidden h-9 flex items-center justify-center font-semibold">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {PROMOS[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
