import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Reviews',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Review Title',
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
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          {title: 'Movie', value: 'movie'},
          {title: 'TV Series', value: 'tvSeries'},
        ],
      },
      validation: Rule => Rule.required(),
      initialValue: 'movie',
    }),
    defineField({
      name: 'movie',
      title: 'Movie',
      type: 'reference',
      to: {type: 'movie'},
      hidden: ({parent}) => parent?.contentType !== 'movie',
    }),
    defineField({
      name: 'tvSeries',
      title: 'TV Series',
      type: 'reference',
      to: {type: 'tvSeries'},
      hidden: ({parent}) => parent?.contentType !== 'tvSeries',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-10)',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'content',
      title: 'Review Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Numbered', value: 'number'}],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }
          ]
        },
      ],
    }),
    defineField({
      name: 'pros',
      title: 'Pros',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'verdict',
      title: 'Verdict',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Review',
      type: 'boolean',
      description: 'Display this review on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      description: 'Update this date when refreshing the review content',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'string',
      description: 'SEO meta description (150-155 characters)',
      validation: Rule => Rule.max(155),
    }),
    defineField({
      name: 'wordCount',
      title: 'Word Count',
      type: 'number',
      description: 'Approximate word count (aim for 2000-2500 for reviews)',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      movieTitle: 'movie.title',
      rating: 'rating',
      media: 'movie.poster',
    },
    prepare(selection) {
      const {title, movieTitle, rating, media} = selection
      return {
        title,
        subtitle: movieTitle && rating ? `${movieTitle} - ${rating}/10` : 'No movie selected',
        media,
      }
    },
  },
})
