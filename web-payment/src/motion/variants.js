// Shared Framer Motion variants — premium, intentional, formal motion.

// Smooth easing curves
export const easeOut = [0.22, 1, 0.36, 1]
export const easeInOut = [0.65, 0, 0.35, 1]

// Screen-level slide + fade transitions (used with AnimatePresence).
// `custom` is the direction: 1 = moving forward, -1 = moving back.
export const screenVariants = {
  enter: (dir = 1) => ({
    opacity: 0,
    x: dir * 36,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: easeOut },
  },
  exit: (dir = 1) => ({
    opacity: 0,
    x: dir * -36,
    transition: { duration: 0.28, ease: easeInOut },
  }),
}

// Stagger container — children animate in sequence on mount.
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
}

// Item: fade + subtle slide up.
export const fadeUpItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
}

// Button micro-interactions.
export const buttonMotion = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 420, damping: 26 },
}

// Error message slide-in.
export const errorVariants = {
  hidden: { opacity: 0, height: 0, y: -6, marginTop: 0, marginBottom: 0 },
  show: {
    opacity: 1,
    height: 'auto',
    y: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -6,
    transition: { duration: 0.22, ease: easeInOut },
  },
}
