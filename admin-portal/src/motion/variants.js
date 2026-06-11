// Shared Framer Motion variants — executive dashboard motion.

export const easeOut   = [0.22, 1, 0.36, 1]
export const easeInOut = [0.65, 0, 0.35, 1]

// Full-page enter / exit (used with AnimatePresence + location key).
export const pageVariants = {
  initial: { opacity: 0, y: 14 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.38, ease: easeOut } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.24, ease: easeInOut } },
}

// Stagger container for card/row groups.
export const staggerContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
}

// Individual items: fade + subtle slide-up.
export const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
}

// Slower stagger for dashboard sections (after header/stats).
export const sectionStagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

// Button press / hover micro-interaction.
export const buttonMotion = {
  whileHover:  { scale: 1.02, y: -1 },
  whileTap:    { scale: 0.97 },
  transition:  { type: 'spring', stiffness: 420, damping: 26 },
}

// Slide-in error (height-animated).
export const errorVariants = {
  hidden: { opacity: 0, height: 0, y: -6, marginBottom: 0 },
  show:   { opacity: 1, height: 'auto', y: 0, marginBottom: 20,
            transition: { duration: 0.3, ease: easeOut } },
  exit:   { opacity: 0, height: 0, y: -4, marginBottom: 0,
            transition: { duration: 0.2 } },
}
