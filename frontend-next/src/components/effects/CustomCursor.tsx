"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

const DOT_SIZE = 8
const CIRCLE_SIZE = 36
const HOVER_CIRCLE_SIZE = 60

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [isOverImage, setIsOverImage] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const circleX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 })
  const circleY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    window.addEventListener("mousemove", handleMouseMove)

    const style = document.createElement("style")
    style.id = "custom-cursor-style"
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `
    document.head.appendChild(style)

    const handleOverInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest("label")
      ) {
        setIsHovering(true)
        setIsOverImage(false)
      } else if (target.closest("img")) {
        setIsOverImage(true)
        setIsHovering(false)
      } else {
        setIsHovering(false)
        setIsOverImage(false)
      }
    }

    document.addEventListener("mouseover", handleOverInteractive)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handleOverInteractive)
      const existingStyle = document.getElementById("custom-cursor-style")
      if (existingStyle) existingStyle.remove()
    }
  }, [isMobile, handleMouseMove])

  if (isMobile) return null

  const circleSize = isHovering ? HOVER_CIRCLE_SIZE : CIRCLE_SIZE

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "#FAFAF8",
          zIndex: 9999,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          width: circleSize,
          height: circleSize,
          x: circleX,
          y: circleY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9999,
          transition: "width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
          backgroundColor: isOverImage
            ? "transparent"
            : isHovering
              ? "rgba(184, 147, 90, 0.2)"
              : "transparent",
          border: isOverImage ? "2px solid rgba(184, 147, 90, 0.5)" : isHovering ? "2px solid rgba(184, 147, 90, 0.3)" : "1.5px solid rgba(184, 147, 90, 0.25)",
        }}
      />
    </>
  )
}
