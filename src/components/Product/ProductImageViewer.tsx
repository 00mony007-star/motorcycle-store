import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Maximize2, X } from 'lucide-react'
import { Button } from '../ui/Button'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface ProductImageViewerProps {
  images: string[]
  title: string
  className?: string
}

export function ProductImageViewer({ images, title, className = '' }: ProductImageViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [is360Mode, setIs360Mode] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)

  const currentImage = images[currentImageIndex] || ''

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // 360° view drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!is360Mode) return
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !is360Mode) return
    const deltaX = e.clientX - dragStart
    const rotationDelta = deltaX * 0.5
    setRotation(prev => (prev + rotationDelta) % 360)
    setDragStart(e.clientX)
  }, [isDragging, dragStart, is360Mode])

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!is360Mode) return
    setIsDragging(true)
    setDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !is360Mode) return
    const deltaX = e.touches[0].clientX - dragStart
    const rotationDelta = deltaX * 0.5
    setRotation(prev => (prev + rotationDelta) % 360)
    setDragStart(e.touches[0].clientX)
  }, [isDragging, dragStart, is360Mode])

  const ImageComponent = ({ src, alt, className: imgClassName = '' }: { src: string, alt: string, className?: string }) => (
    <motion.img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover transition-transform duration-300 ${imgClassName}`}
      style={{
        transform: is360Mode ? `rotateY(${rotation}deg)` : undefined,
        cursor: is360Mode ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      whileHover={!is360Mode ? { scale: 1.05 } : {}}
      transition={{ duration: 0.3 }}
    />
  )

  return (
    <>
      <div className={`relative group ${className}`}>
        {/* Main Image Container */}
        <div 
          ref={imageRef}
          className="relative aspect-square overflow-hidden rounded-lg bg-muted product-image-container"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {is360Mode ? (
                <ImageComponent
                  src={currentImage}
                  alt={`${title} - 360° view`}
                  className="select-none"
                />
              ) : (
                <Zoom>
                  <ImageComponent
                    src={currentImage}
                    alt={`${title} - Image ${currentImageIndex + 1}`}
                  />
                </Zoom>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Image Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Controls Overlay */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIs360Mode(!is360Mode)}
              className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
              aria-label={is360Mode ? 'Exit 360° view' : 'Enter 360° view'}
            >
              <RotateCw className={`w-4 h-4 ${is360Mode ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
              aria-label="View fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* 360° Mode Indicator */}
          {is360Mode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm"
            >
              Drag to rotate • 360° View
            </motion.div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'border-primary shadow-glow-orange' 
                    : 'border-border hover:border-primary/50'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage}
                alt={`${title} - Fullscreen view`}
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{
                  transform: is360Mode ? `rotateY(${rotation}deg)` : undefined,
                }}
              />

              {/* Fullscreen Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIs360Mode(!is360Mode)}
                  className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
                >
                  <RotateCw className={`w-4 h-4 ${is360Mode ? 'animate-spin' : ''}`} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(false)}
                  className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Fullscreen Navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}