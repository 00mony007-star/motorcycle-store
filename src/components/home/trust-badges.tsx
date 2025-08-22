'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, RotateCcw, Award } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'SSL encrypted checkout'
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Orders over $100'
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Easy return policy'
  },
  {
    icon: Award,
    title: '2-Year Warranty',
    description: 'Quality guaranteed'
  }
]

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <badge.icon className="w-8 h-8 text-primary mb-3" />
          <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
          <p className="text-xs text-muted-foreground">{badge.description}</p>
        </motion.div>
      ))}
    </div>
  )
}