import {
  OpenAPIRegistry,
  OpenApiGeneratorV31
} from '@asteasolutions/zod-to-openapi'
import {
  ConflictMovieResponseSchema,
  CreateMovieResponseSchema,
  CreateMovieSchema,
  DeleteMovieResponseSchema,
  MovieNotFoundResponseSchema,
  GetMovieResponseUnionSchema,
  UpdateMovieSchema,
  UpdateMovieResponseSchema
} from '../@types/schema'
import type { ParameterObject } from 'openapi3-ts/oas31'

// this file registers the schemas and generates the OpenAPI document.
// it’s the logic responsible for creating the OpenAPI structure
// based on the Zod schemas.

// 2) Register Schemas with the OpenAPI Registry
const registry = new OpenAPIRegistry()
registry.register('CreateMovieRequest', CreateMovieSchema)
registry.register('CreateMovieResponse', CreateMovieResponseSchema)
registry.register('GetMovieResponse', GetMovieResponseUnionSchema)
registry.register('MovieNotFound', MovieNotFoundResponseSchema)
registry.register('DeleteMovieMessage', DeleteMovieResponseSchema)
registry.register('ConflictMovieResponse', ConflictMovieResponseSchema)
registry.register('UpdateMovieRequest', UpdateMovieSchema)
registry.register('UpdateMovieResponse', UpdateMovieResponseSchema)

// Constants to avoid repetition
const MOVIE_ID_PARAM: ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'Movie ID'
}
const MOVIE_NAME_PARAM: ParameterObject = {
  name: 'name',
  in: 'query',
  required: false,
  schema: { type: 'string' },
  description: 'Movie name to search for'
}

// Register paths
// health check
registry.registerPath({
  method: 'get',
  path: '/',
  summary: 'Health check',
  responses: {
    200: {
      description: 'Server is running',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Server is running' }
            }
          }
        }
      }
    }
  }
})

// Register path for getting all movies or filtering by name via query parameter
registry.registerPath({
  method: 'get',
  path: '/movies',
  summary: 'Get all movies or filter by name',
  description:
    'Retrieve a list of all movies. Optionally, provide a query parameter "name" to filter by a specific movie name.',
  parameters: [MOVIE_NAME_PARAM], // Query param for filtering by name
  responses: {
    200: {
      description:
        'List of movies or a specific movie if the "name" query parameter is provided',
      content: { 'application/json': { schema: GetMovieResponseUnionSchema } }
    },
    404: {
      description:
        'Movie not found if the name is provided and does not match any movie',
      content: { 'application/json': { schema: MovieNotFoundResponseSchema } }
    }
  }
})

// Register path for getting a movie by ID
registry.registerPath({
  method: 'get',
  path: '/movies/{id}',
  summary: 'Get a movie by ID',
  description: 'Retrieve a single movie by its ID',
  parameters: [MOVIE_ID_PARAM], // This ensures {id} is documented as a path param
  responses: {
    200: {
      description: 'Movie found',
      content: { 'application/json': { schema: GetMovieResponseUnionSchema } }
    },
    404: {
      description: 'Movie not found',
      content: { 'application/json': { schema: MovieNotFoundResponseSchema } }
    }
  }
})

// add movie
registry.registerPath({
  method: 'post',
  path: '/movies',
  summary: 'Create a new movie',
  description: 'Create a new movie in the system',
  request: {
    body: {
      content: {
        'application/json': { schema: CreateMovieSchema }
      }
    }
  },
  responses: {
    200: {
      description: 'Movie created successfully',
      content: { 'application/json': { schema: CreateMovieResponseSchema } }
    },
    400: { description: 'Invalid request body or validation error' },
    409: {
      description: 'Movie already exists',
      content: {
        'application/json': { schema: ConflictMovieResponseSchema }
      }
    },
    500: { description: 'Unexpected error occurred' }
  }
})

// delete movie
registry.registerPath({
  method: 'delete',
  path: '/movies/{id}',
  summary: 'Delete a movie by ID',
  parameters: [MOVIE_ID_PARAM],
  responses: {
    200: {
      description: 'Movie {id} has been deleted',
      content: {
        'application/json': { schema: DeleteMovieResponseSchema }
      }
    },
    404: {
      description: 'Movie not found',
      content: { 'application/json': { schema: MovieNotFoundResponseSchema } }
    }
  }
})

// update movie
registry.registerPath({
  method: 'put',
  path: '/movies/{id}',
  summary: 'Update a movie by ID',
  description:
    'Update the details of an existing movie by providing a movie ID',
  parameters: [MOVIE_ID_PARAM], // Movie ID is required for update
  request: {
    body: {
      content: {
        'application/json': { schema: UpdateMovieSchema }
      }
    }
  },
  responses: {
    200: {
      description: 'Movie updated successfully',
      content: { 'application/json': { schema: UpdateMovieResponseSchema } }
    },
    404: {
      description: 'Movie not found',
      content: { 'application/json': { schema: MovieNotFoundResponseSchema } }
    },
    500: { description: 'Internal server error' }
  }
})

// 3) Generate the OpenAPI document
const generator = new OpenApiGeneratorV31(registry.definitions)
export const openApiDoc = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'Movies API',
    version: '0.0.1',
    description: 'API for managing movies'
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local development server'
    },
    {
      url: 'https://movies-api.example.com',
      description: 'Production server'
    }
  ]
})
