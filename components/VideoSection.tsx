import Link from 'next/link'
import { VideoContent } from '@/lib/types'
import VideoCard from './VideoCard'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'

interface VideoSectionProps {
  videos: VideoContent[]
}

export default function VideoSection({ videos }: VideoSectionProps) {
  if (!videos || videos.length === 0) return null

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <PlayIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Videos
            </h2>
          </div>
          <Link
            href="/videos"
            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:gap-3 transition-all font-semibold"
          >
            <span>View All</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    </section>
  )
}
