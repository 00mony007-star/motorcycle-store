import React from 'react'
import { motion } from 'framer-motion'
import { Check, ShoppingCart, CreditCard, Truck, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CheckoutStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface CheckoutProgressProps {
  currentStep: number
  className?: string
}

export function CheckoutProgress({ currentStep, className = '' }: CheckoutProgressProps) {
  const { t } = useTranslation()

  const steps: CheckoutStep[] = [
    {
      id: 'cart',
      title: t('checkout.steps.cart.title', 'Cart Review'),
      description: t('checkout.steps.cart.description', 'Review your items'),
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      id: 'shipping',
      title: t('checkout.steps.shipping.title', 'Shipping'),
      description: t('checkout.steps.shipping.description', 'Delivery information'),
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'payment',
      title: t('checkout.steps.payment.title', 'Payment'),
      description: t('checkout.steps.payment.description', 'Secure payment'),
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 'confirmation',
      title: t('checkout.steps.confirmation.title', 'Complete'),
      description: t('checkout.steps.confirmation.description', 'Order confirmed'),
      icon: <CheckCircle className="w-5 h-5" />
    }
  ]

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep

            return (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground shadow-glow-orange'
                      : isCurrent
                      ? 'bg-background border-primary text-primary animate-pulse'
                      : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {step.icon}
                    </motion.div>
                  )}
                </motion.div>

                {/* Step Info */}
                <div className="mt-3 text-center max-w-24">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className={`text-sm font-medium transition-colors ${
                      isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="text-xs text-muted-foreground mt-1 hidden sm:block"
                  >
                    {step.description}
                  </motion.p>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-12 w-full h-0.5 bg-muted-foreground/20 -z-10 hidden sm:block">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="mt-6 sm:hidden">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-medium">
            {t('checkout.progress', 'Progress')}
          </span>
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-primary h-2 rounded-full shadow-glow-orange"
          />
        </div>
      </div>
    </div>
  )
}

// Trust badges component for checkout
export function TrustBadges({ className = '' }: { className?: string }) {
  const { t } = useTranslation()

  const badges = [
    {
      icon: '🔒',
      title: t('trust.secure', 'Secure Payment'),
      description: t('trust.secureDesc', 'SSL encrypted')
    },
    {
      icon: '🚚',
      title: t('trust.shipping', 'Free Shipping'),
      description: t('trust.shippingDesc', 'Orders over $100')
    },
    {
      icon: '↩️',
      title: t('trust.returns', '30-Day Returns'),
      description: t('trust.returnsDesc', 'Easy returns')
    },
    {
      icon: '🏆',
      title: t('trust.warranty', '2-Year Warranty'),
      description: t('trust.warrantyDesc', 'Quality guaranteed')
    }
  ]

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="text-2xl mb-2">{badge.icon}</div>
            <h4 className="font-semibold text-sm">{badge.title}</h4>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Security indicators for payment section
export function SecurityIndicators({ className = '' }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <div className={`flex items-center justify-center space-x-6 py-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2 text-sm text-muted-foreground"
      >
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
        <span>{t('security.ssl', 'SSL Secured')}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center space-x-2 text-sm text-muted-foreground"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
        <span>{t('security.verified', 'Verified Merchant')}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center space-x-2 text-sm text-muted-foreground"
      >
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
        <span>{t('security.pci', 'PCI Compliant')}</span>
      </motion.div>
    </div>
  )
}