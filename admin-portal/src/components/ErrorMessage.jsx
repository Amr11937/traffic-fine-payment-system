import { motion } from 'framer-motion'
import { errorVariants } from '../motion/variants'

export default function ErrorMessage({ message }) {
  return (
    <motion.div
      className="error-message"
      role="alert"
      variants={errorVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ overflow: 'hidden' }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1.1" fill="currentColor" />
      </svg>
      <span>{message}</span>
    </motion.div>
  )
}
