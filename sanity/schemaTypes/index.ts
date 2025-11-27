import { type SchemaTypeDefinition } from 'sanity'

// Main content types
import recommendation from './recommendation'
import simpleReview from './simpleReview'
import simpleNews from './simpleNews'

// Supporting types
import author from './author'
import category from './category'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Main content types
    recommendation,
    simpleReview,
    simpleNews,

    // Supporting types
    author,
    category,
  ],
}
