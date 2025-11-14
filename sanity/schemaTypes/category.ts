import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Categories',
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
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Hex color code for category badges',
      validation: Rule => Rule.regex(/^#[0-9A-F]{6}$/i, {
        name: 'hex',
        invert: false,
      }).error('Please enter a valid hex color code'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      color: 'color',
    },
    prepare(selection) {
      const {title, color} = selection
      return {
        title,
        subtitle: color || 'No color set',
      }
    },
  },
})
