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
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Hex color code for category badges (e.g., #ef4444)',
      validation: Rule => Rule.regex(/^#[0-9A-F]{6}$/i).error('Please enter a valid hex color code like #ef4444'),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji for category (e.g., 🎬, 📰, ⭐)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      color: 'color',
      icon: 'icon',
    },
    prepare(selection) {
      const {title, color, icon} = selection
      return {
        title: icon ? `${icon} ${title}` : title,
        subtitle: color || 'No color',
      }
    },
  },
})
