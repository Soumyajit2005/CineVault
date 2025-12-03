'use client'

import { PlusIcon } from '@heroicons/react/24/outline'

interface AddButtonProps {
  type: 'recommendation' | 'review' | 'news' | 'simpleReview' | 'simpleNews'
}

export default function AddButton({ type }: AddButtonProps) {
  // Normalize type for display
  const displayType = type === 'simpleReview' ? 'Review' :
                      type === 'simpleNews' ? 'News' :
                      type.charAt(0).toUpperCase() + type.slice(1)

  const handleClick = () => {
    // Open Sanity Studio in a new tab
    window.open('/studio', '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-all hover:shadow-xl"
      aria-label={`Add ${displayType}`}
    >
      <PlusIcon className="h-5 w-5" />
      Add {displayType}
    </button>
  )
}
