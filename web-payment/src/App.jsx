import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LookupForm from './components/LookupForm'
import FineDetails from './components/FineDetails'
import PaymentConfirmation from './components/PaymentConfirmation'
import { screenVariants } from './motion/variants'

// Order screens so we can derive slide direction for transitions.
const ORDER = { lookup: 0, 'fine-found': 1, 'payment-success': 2 }

export default function App() {
  const [screen, setScreen] = useState('lookup')
  const [prevScreen, setPrevScreen] = useState('lookup')
  const [fine, setFine] = useState(null)
  const [payment, setPayment] = useState(null)

  function go(next) {
    setPrevScreen(screen)
    setScreen(next)
  }

  function handleFineFound(fineData) {
    setFine(fineData)
    go('fine-found')
  }

  function handlePaymentSuccess(paymentData) {
    setPayment(paymentData)
    go('payment-success')
  }

  function handleStartOver() {
    go('lookup')
    setFine(null)
    setPayment(null)
  }

  const direction = ORDER[screen] >= ORDER[prevScreen] ? 1 : -1

  return (
    <div className="app-wrapper">
      <header className="site-header">
        <div className="header-inner">
          <span className="header-emblem" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.5 19 5.2v6c0 4.6-3 7.9-7 9.3-4-1.4-7-4.7-7-9.3v-6L12 2.5Z"
                fill="rgba(255,255,255,0.16)"
                stroke="#f0b429"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M8.6 12.2 11 14.6l4.4-4.6"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="header-text">
            <span className="header-eyebrow">Sri Lanka Police</span>
            <h1 className="header-title">Traffic Fine Payment Portal</h1>
          </div>
        </div>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={screen}
            custom={direction}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {screen === 'lookup' && <LookupForm onFineFound={handleFineFound} />}
            {screen === 'fine-found' && (
              <FineDetails
                fine={fine}
                onPaymentSuccess={handlePaymentSuccess}
                onStartOver={handleStartOver}
              />
            )}
            {screen === 'payment-success' && (
              <PaymentConfirmation
                payment={payment}
                fine={fine}
                onStartOver={handleStartOver}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <span className="footer-lock">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
          </svg>
          Secure payment · Sri Lanka Police Traffic Division
        </span>
      </footer>
    </div>
  )
}
