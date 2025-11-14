import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'movie',
  title: 'Movies',
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
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
    }),
    defineField({
      name: 'director',
      title: 'Director',
      type: 'string',
    }),
    defineField({
      name: 'cast',
      title: 'Cast',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
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
      name: 'runtime',
      title: 'Runtime (minutes)',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'poster',
      director: 'director',
      releaseDate: 'releaseDate',
    },
    prepare(selection) {
      const {title, media, director, releaseDate} = selection
      const year = releaseDate ? new Date(releaseDate).getFullYear() : ''
      return {
        title,
        subtitle: director ? `${director}${year ? ` (${year})` : ''}` : year,
        media,
      }
    },
  },
})
