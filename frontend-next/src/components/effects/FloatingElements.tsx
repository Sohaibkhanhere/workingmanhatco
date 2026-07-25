"use client"

import { motion } from "framer-motion"

interface FloatingShape {
  id: number
  size: number
  color: string
  x: string
  y: string
  shape: "circle" | "square"
  duration: number
  delay: number
  rotate: number
}

const shapes: FloatingShape[] = [
  {
    id: 1,
    size: 120,
    color: "rgba(184, 147, 90, 0.06)",
    x: "10%",
    y: "20%",
    shape: "circle",
    duration: 8,
    delay: 0,
    rotate: 0,
  },
  {
    id: 2,
    size: 80,
    color: "rgba(184, 147, 90, 0.08)",
    x: "75%",
    y: "15%",
    shape: "square",
    duration: 12,
    delay: 2,
    rotate: 45,
  },
  {
    id: 3,
    size: 60,
    color: "rgba(184, 147, 90, 0.05)",
    x: "85%",
    y: "60%",
    shape: "circle",
    duration: 10,
    delay: 4,
    rotate: 0,
  },
  {
    id: 4,
    size: 100,
    color: "rgba(184, 147, 90, 0.07)",
    x: "20%",
    y: "70%",
    shape: "square",
    duration: 14,
    delay: 1,
    rotate: 30,
  },
]

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            backgroundColor: shape.color,
            borderRadius: shape.shape === "circle" ? "50%" : "16%",
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [shape.rotate, shape.rotate + 180, shape.rotate + 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  )
}
