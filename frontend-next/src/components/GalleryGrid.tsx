"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Camera } from "lucide-react";

const images = [
  "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1782667569729-3KH00YRK70BMIYQ0WX96/C6807D21-9765-4674-9A45-5402349A9011.jpeg",
  "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/6577b43c-4483-4d19-bbd8-e42816dbec0f/IMG_0339.jpeg",
  "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1754520881053-GITP2B476NHFI441CJ5Y/IMG_3617.jpeg?format=800w",
  "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/f4c02976-3f0a-4d66-975f-c6eee8ed8a36/F16BBA54-AF60-4D50-9739-4A570BD208D5.png",
];

export default function GalleryGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-14 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-[#C89A4A] text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
            @workinmanhatco
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-5xl text-[#622B14] mt-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            FROM THE FIELD
          </h2>
          <div className="w-16 h-[2px] bg-[#C89A4A] mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/workinmanhatco/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={img}
                alt="Workin' Man lifestyle"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#3A1808]/0 group-hover:bg-[#3A1808]/40 transition-all duration-500 flex items-center justify-center">
                <Camera
                  size={24}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
