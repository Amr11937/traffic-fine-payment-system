import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { lookupFine } from '../api/fineApi'
import ErrorMessage from './ErrorMessage'
import LoadingSpinner from './LoadingSpinner'
import AnimatedField from './AnimatedField'
import { staggerContainer, fadeUpItem, buttonMotion } from '../motion/variants'

export default function LookupForm({ onFineFound }) {
  const [referenceNumber, setReferenceNumber] = useState('')
  const [categoryCode, setCategoryCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const fine = await lookupFine(referenceNumber.trim(), categoryCode.trim().toUpperCase())
      onFineFound(fine)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const disabled = loading || !referenceNumber.trim() || !categoryCode.trim()

  return (
    <motion.div
      className="card"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.h2 className="card-title" variants={fadeUpItem}>
        Look Up Your Fine
      </motion.h2>
      <motion.p className="card-subtitle" variants={fadeUpItem}>
        Enter the reference number and category code printed on your traffic fine notice.
      </motion.p>

      <form onSubmit={handleSubmit} noValidate>
        <motion.div variants={fadeUpItem}>
          <AnimatedField
            id="refNum"
            label="Fine Reference Number"
            placeholder="TF-20260610-001"
            value={referenceNumber}
            onChange={e => setReferenceNumber(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </motion.div>

        <motion.div variants={fadeUpItem}>
          <AnimatedField
            id="catCode"
            label="Category Code"
            placeholder="SPD"
            value={categoryCode}
            onChange={e => setCategoryCode(e.target.value)}
            disabled={loading}
            hint="The short code for the offence, e.g. SPD for speeding."
          />
        </motion.div>

        <AnimatePresence>
          {error && <ErrorMessage key="err" message={error} />}
        </AnimatePresence>

        <motion.button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={disabled}
          variants={fadeUpItem}
          whileHover={!disabled ? buttonMotion.whileHover : undefined}
          whileTap={!disabled ? buttonMotion.whileTap : undefined}
          transition={buttonMotion.transition}
        >
          {loading ? (
            <>
              <LoadingSpinner /> Looking up…
            </>
          ) : (
            'Look Up Fine'
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
