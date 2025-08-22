import React from 'react'
import { ShieldCheck, Truck, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function TrustBadges() {
  const { t } = useTranslation()
  
  const badges = [
    { 
      icon: <Truck className="h-6 w-6 text-primary" />, 
      title: t('home.trustBadges.freeShipping.title'),
      subtitle: t('home.trustBadges.freeShipping.subtitle')
    },
    { 
      icon: <ShieldCheck className="h-6 w-6 text-primary" />, 
      title: t('home.trustBadges.rideWithConfidence.title'),
      subtitle: t('home.trustBadges.rideWithConfidence.subtitle')
    },
    { 
      icon: <Lock className="h-6 w-6 text-primary" />, 
      title: t('home.trustBadges.secureCheckout.title'),
      subtitle: t('home.trustBadges.secureCheckout.subtitle')
    },
  ]

  return (
    <section className="py-12 border-y border-white/10"> 
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-start">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
                {badge.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
