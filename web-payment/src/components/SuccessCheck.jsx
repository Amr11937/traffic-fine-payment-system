import { motion } from 'framer-motion'
import { easeOut } from '../motion/variants'

const CONFETTI = [
  { x: -70, c: '#1a4f8a', r: -40, d: 0 },
  { x: -42, c: '#f0b429', r: 25, d: 0.05 },
  { x: -16, c: '#047857', r: -15, d: 0.12 },
  { x: 16, c: '#d4a017', r: 30, d: 0.08 },
  { x: 42, c: '#1a4f8a', r: -28, d: 0.02 },
  { x: 70, c: '#f0b429', r: 18, d: 0.1 },
]

// Animated success indicator: pulsing ring, a checkmark that draws itself,
// and a subtle confetti burst. Formal and restrained.
export default function SuccessCheck() {
  return (
    <div className="success-ring">
      {/* Expanding pulse ring */}
      <motion.span
        className="pulse"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{
          scale: [0.4, 1, 1.18, 1],
          opacity: [0, 1, 0.6, 1],
        }}
        transition={{ duration: 0.9, ease: easeOut, times: [0, 0.4, 0.7, 1] }}
      />

      {/* Confetti burst */}
      {CONFETTI.map((p, i) => (
        <motion.span
          key={i}
          className="confetti-piece"
          style={{ left: '50%', backgroundColor: p.c }}
          initial={{ opacity: 0, x: 0, y: 36, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: p.x,
            y: [-4, -54, -30],
            rotate: p.r * 4,
          }}
          transition={{
            duration: 1.1,
            delay: 0.55 + p.d,
            ease: easeOut,
            times: [0, 0.25, 0.7, 1],
          }}
        />
      ))}

      {/* Drawn checkmark */}
      <svg className="check-svg" viewBox="0 0 92 92" fill="none">
        <motion.circle
          cx="46"
          cy="46"
          r="40"
          stroke="#047857"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
        />
        <motion.path
          d="M30 47.5 L41.5 59 L63 36"
          stroke="#047857"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.45, ease: easeOut }}
        />
      </svg>
    </div>
  )
}
