import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Read-only client for fetching data (uses CDN for better performance)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

// Write client for mutations (requires auth token, doesn't use CDN)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
