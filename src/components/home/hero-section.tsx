'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-moto-900 via-moto-800 to-black">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&h=1080&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-sm font-medium">
              Premium Motorcycle Gear
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
          >
            <span className="block text-gradient bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              Ride with
            </span>
            <span className="block text-white/90">
              Confidence
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Discover premium motorcycle helmets, jackets, gloves, and accessories. 
            Safety meets style in our curated collection of professional gear.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              asChild 
              size="lg" 
              className="btn-premium text-lg px-8 py-4 shadow-glow-orange hover:shadow-glow-orange hover:scale-105 transition-all duration-300"
            >
              <Link href="/catalog">
                Shop Now
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Link href="/catalog">
                View Collection
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 z-10 hidden lg:block">
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 1, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full flex items-center justify-center"
        >
          <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
        </motion.div>
      </div>
    </section>
  )
}