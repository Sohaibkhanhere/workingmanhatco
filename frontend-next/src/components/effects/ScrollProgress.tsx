"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #B8935A, #D4B478)",
        zIndex: 99999,
      }}
    />
  )
}
