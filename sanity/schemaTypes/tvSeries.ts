import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tvSeries',
  title: 'TV Series',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'backdrop',
      title: 'Backdrop Image',
      type: 'image',
      description: 'Wide banner image for detail pages',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'firstAirDate',
      title: 'First Air Date',
      type: 'date',
    }),
    defineField({
      name: 'lastAirDate',
      title: 'Last Air Date',
      type: 'date',
      description: 'Leave empty if still airing',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Airing', value: 'airing'},
          {title: 'Ended', value: 'ended'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Upcoming', value: 'upcoming'},
        ],
      },
    }),
    defineField({
      name: 'creator',
      title: 'Creator(s)',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'cast',
      title: 'Main Cast',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'numberOfSeasons',
      title: 'Number of Seasons',
      type: 'number',
    }),
    defineField({
      name: 'numberOfEpisodes',
      title: 'Total Episodes',
      type: 'number',
    }),
    defineField({
      name: 'episodeRuntime',
      title: 'Episode Runtime (minutes)',
      type: 'number',
      description: 'Average episode length',
    }),
    defineField({
      name: 'categories',
      title: 'Categories/Genres',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'synopsis',
      title: 'Synopsis',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'trailerUrl',
      title: 'Trailer URL',
      type: 'url',
      description: 'YouTube or Vimeo URL',
    }),
    defineField({
      name: 'network',
      title: 'Network/Platform',
      type: 'string',
      description: 'e.g., HBO, Netflix, BBC',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'poster',
      creator: 'creator',
      firstAirDate: 'firstAirDate',
      status: 'status',
    },
    prepare(selection) {
      const {title, media, creator, firstAirDate, status} = selection
      const year = firstAirDate ? new Date(firstAirDate).getFullYear() : ''
      const creatorText = creator && creator.length > 0 ? creator[0] : ''
      return {
        title,
        subtitle: `${creatorText}${year ? ` (${year})` : ''}${status ? ` - ${status}` : ''}`,
        media,
      }
    },
  },
})
