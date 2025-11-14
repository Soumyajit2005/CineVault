import { type SchemaTypeDefinition } from 'sanity'
import movie from './movie'
import tvSeries from './tvSeries'
import review from './review'
import category from './category'
import author from './author'
import recommendation from './movieRecommendation'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [movie, tvSeries, review, category, author, recommendation],
}
