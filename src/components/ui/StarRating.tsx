import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StarRatingProps {
  rating: number
  totalStars?: number
  className?: string
  starClassName?: string
}

export function StarRating({ rating, totalStars = 5, className, starClassName }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const partialStarPercentage = Math.round((rating - fullStars) * 100)
  const emptyStars = totalStars - Math.ceil(rating)

  return (
    <div className={cn('flex items-center', className)} aria-label={`Rating: ${rating} out of ${totalStars} stars.`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn('h-4 w-4 text-yellow-400 fill-yellow-400', starClassName)} role="img" aria-label="full star" />
      ))}
      {partialStarPercentage > 0 && (
        <div className="relative" role="img" aria-label="partial star">
          <Star className={cn('h-4 w-4 text-gray-300', starClassName)} />
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${partialStarPercentage}%` }}
          >
            <Star className={cn('h-4 w-4 text-yellow-400 fill-yellow-400', starClassName)} />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn('h-4 w-4 text-gray-300', starClassName)} role="img" aria-label="empty star" />
      ))}
    </div>
  )
}
