import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

export function Progress({ 
  value, 
  max = 100, 
  className = '', 
  showLabel = false,
  color = 'primary',
  size = 'md'
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const colorClasses = {
    primary: 'bg-primary shadow-glow-orange',
    success: 'bg-green-500 shadow-glow-blue',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Progress</span>
          <span className="text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn(
        'relative overflow-hidden rounded-full bg-muted',
        sizeClasses[size]
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            'h-full rounded-full transition-all duration-300',
            colorClasses[color]
          )}
        />
        
        {/* Shimmer effect for active progress */}
        {percentage > 0 && percentage < 100 && (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </div>
        )}
      </div>
    </div>
  )
}