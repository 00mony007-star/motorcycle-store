import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  backgroundVideo?: string
  backgroundImage: string
  overlayColor?: string
}

const heroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Premium Racing Helmets',
    subtitle: 'Safety Meets Performance',
    description: 'Experience the ultimate protection with our carbon fiber racing helmets. Engineered for speed, designed for champions.',
    ctaText: 'Shop Helmets',
    ctaLink: '/category/helmets',
    backgroundVideo: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=139&oauth2_token_id=57447761',
    backgroundImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&h=1080&fit=crop',
    overlayColor: 'from-black/60 via-black/40 to-transparent'
  },
  {
    id: '2', 
    title: 'Leather Racing Jackets',
    subtitle: 'Crafted for the Road',
    description: 'Premium leather jackets with advanced protection technology. Style and safety combined in perfect harmony.',
    ctaText: 'Explore Jackets',
    ctaLink: '/category/jackets',
    backgroundImage: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=1920&h=1080&fit=crop',
    overlayColor: 'from-moto-900/70 via-moto-800/50 to-transparent'
  },
  {
    id: '3',
    title: 'Performance Boots',
    subtitle: 'Every Mile Matters',
    description: 'Professional-grade motorcycle boots designed for comfort, durability, and maximum protection on every journey.',
    ctaText: 'Shop Boots',
    ctaLink: '/category/boots',
    backgroundImage: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=1920&h=1080&fit=crop',
    overlayColor: 'from-orange-900/60 via-orange-800/40 to-transparent'
  }
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const { t } = useTranslation()

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    if (!isPlaying) return
    
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [isPlaying])

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="relative h-screen w-full overflow-hidden bg-moto-900">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {currentSlideData.backgroundVideo && currentSlide === 0 ? (
              <video
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
                onLoadedData={() => setIsVideoLoaded(true)}
                poster={currentSlideData.backgroundImage}
              >
                <source src={currentSlideData.backgroundVideo} type="video/mp4" />
                <img 
                  src={currentSlideData.backgroundImage} 
                  alt="Fallback" 
                  className="w-full h-full object-cover"
                />
              </video>
            ) : (
              <img
                src={currentSlideData.backgroundImage}
                alt={currentSlideData.title}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.overlayColor || 'from-black/60 via-black/40 to-transparent'}`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-white"
              >
                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block mb-4"
                >
                  <span className="px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-sm font-medium text-primary-foreground">
                    {currentSlideData.subtitle}
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-6xl md:text-8xl font-display font-bold mb-6 leading-tight"
                >
                  <span className="block text-gradient bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
                    {currentSlideData.title.split(' ')[0]}
                  </span>
                  <span className="block text-white/90">
                    {currentSlideData.title.split(' ').slice(1).join(' ')}
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl leading-relaxed"
                >
                  {currentSlideData.description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button 
                    asChild 
                    size="lg" 
                    className="btn-premium text-lg px-8 py-4 shadow-glow-orange hover:shadow-glow-orange hover:scale-105 transition-all duration-300"
                  >
                    <Link to={currentSlideData.ctaLink}>
                      {currentSlideData.ctaText}
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Link to="/category/all">
                      {t('hero.viewAll', 'View All Products')}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary scale-125 shadow-glow-orange' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Control */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
          </button>

          {/* Video Controls (only show for video slides) */}
          {currentSlideData.backgroundVideo && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Floating Elements for Premium Feel */}
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

      <div className="absolute bottom-20 left-20 z-10 hidden lg:block">
        <motion.div
          animate={{ 
            x: [0, 10, 0],
            rotate: [0, -1, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-orange-500 rounded-sm animate-glow" />
        </motion.div>
      </div>

      {/* Progressive Enhancement - 3D Elements */}
      <div className="absolute top-1/2 right-10 transform -translate-y-1/2 z-10 hidden xl:block">
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-32 h-32 chrome-effect rounded-xl flex items-center justify-center"
        >
          <div className="text-4xl font-display font-bold text-primary">
            M
          </div>
        </motion.div>
      </div>
    </section>
  )
}
