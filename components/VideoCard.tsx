import Link from 'next/link'
import Image from 'next/image'
import { VideoContent } from '@/lib/types'
import { urlFor } from '@/lib/sanity'
import { PlayCircleIcon, EyeIcon } from '@heroicons/react/24/solid'

interface VideoCardProps {
  video: VideoContent
}

export default function VideoCard({ video }: VideoCardProps) {
  const imageUrl = urlFor(video.thumbnail).width(600).height(400).url()

  return (
    <article className="group">
      <Link href={`/videos/${video.slug.current}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
          <Image
            src={imageUrl}
            alt={video.thumbnail.alt || video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <PlayCircleIcon className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
          </div>

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs font-semibold rounded">
              {video.duration}
            </div>
          )}

          {/* Video Category Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
              {video.videoCategory.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {video.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              {video.host && (
                <span className="font-medium">{video.host.name}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {video.viewCount > 0 && (
                <div className="flex items-center gap-1">
                  <EyeIcon className="h-3 w-3" />
                  <span>{video.viewCount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
