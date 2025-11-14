import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'recommendation',
  title: 'Recommendation Articles',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., "15 Best Movies Like Inception" or "Shows Like Breaking Bad"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version',
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
          {title: 'Movies', value: 'movie'},
          {title: 'TV Series', value: 'tvSeries'},
          {title: 'Mixed', value: 'mixed'},
        ],
      },
      validation: Rule => Rule.required(),
      initialValue: 'movie',
    }),
    defineField({
      name: 'sourceContent',
      title: 'Source Movie/Show',
      type: 'reference',
      description: 'The content people are looking for recommendations based on',
      to: [{type: 'movie'}, {type: 'tvSeries'}],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 5,
      description: '150-250 words explaining what makes the source movie great',
      validation: Rule => Rule.required().min(150).max(300),
    }),
    defineField({
      name: 'recommendations',
      title: 'Recommendations',
      type: 'array',
      description: '15-20 recommendations',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'content',
            title: 'Movie or TV Series',
            type: 'reference',
            to: [{type: 'movie'}, {type: 'tvSeries'}],
          },
          {
            name: 'explanation',
            title: 'Why It\'s Similar',
            type: 'text',
            rows: 4,
            description: '250-350 words explaining the connection',
          },
          {
            name: 'order',
            title: 'Order',
            type: 'number',
            description: 'Position in the list (1-20)',
          },
        ],
        preview: {
          select: {
            title: 'content.title',
            order: 'order',
            media: 'content.poster',
          },
          prepare({title, order, media}) {
            return {
              title: `${order}. ${title || 'Untitled'}`,
              media,
            }
          },
        },
      }],
      validation: Rule => Rule.required().min(10).max(20),
    }),
    defineField({
      name: 'conclusion',
      title: 'Conclusion',
      type: 'text',
      rows: 3,
      description: 'Closing paragraph wrapping up the recommendations',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'string',
      description: 'SEO description (150-155 characters)',
      validation: Rule => Rule.max(155),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display on homepage',
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
      description: 'Update this when refreshing content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      sourceTitle: 'sourceContent.title',
      media: 'sourceContent.poster',
      contentType: 'contentType',
    },
    prepare({title, sourceTitle, media, contentType}) {
      const typeLabel = contentType === 'tvSeries' ? 'TV Series' : contentType === 'movie' ? 'Movie' : 'Mixed'
      return {
        title,
        subtitle: sourceTitle ? `${typeLabel} - Based on: ${sourceTitle}` : `${typeLabel} list`,
        media,
      }
    },
  },
})
