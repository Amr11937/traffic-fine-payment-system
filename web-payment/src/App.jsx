import { useState } from 'react'
import LookupForm from './components/LookupForm'
import FineDetails from './components/FineDetails'
import PaymentConfirmation from './components/PaymentConfirmation'

export default function App() {
  const [screen, setScreen] = useState('lookup')
  const [fine, setFine] = useState(null)
  const [payment, setPayment] = useState(null)

  function handleFineFound(fineData) {
    setFine(fineData)
    setScreen('fine-found')
  }

  function handlePaymentSuccess(paymentData) {
    setPayment(paymentData)
    setScreen('payment-success')
  }

  function handleStartOver() {
    setScreen('lookup')
    setFine(null)
    setPayment(null)
  }

  return (
    <div className="app-wrapper">
      <header className="site-header">
        <div className="header-inner">
          <span className="header-badge">SL Police</span>
          <h1 className="header-title">Traffic Fine Payment Portal</h1>
        </div>
      </header>

      <main className="main-content">
        {screen === 'lookup' && (
          <LookupForm onFineFound={handleFineFound} />
        )}
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
      </main>

      <footer className="site-footer">
        <p>Sri Lanka Police — Traffic Fine Payment System</p>
      </footer>
    </div>
  )
}
