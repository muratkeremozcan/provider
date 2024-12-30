import type { Movie } from '@prisma/client'
import { test as baseApiRequestFixture } from './api-request-fixture'
import type { ApiRequestResponse } from './api-request-fixture'
import type {
  DeleteMovieResponse,
  CreateMovieResponse,
  GetMovieResponse,
  UpdateMovieResponse
} from '../../../src/@types'

// Common headers function
const commonHeaders = (token: string) => ({
  Authorization: token
})

// --- Define Each Function Signature as a Type ---
type AddMovieFn = (
  token: string,
  body: Omit<Movie, 'id'>,
  baseUrl?: string
) => Promise<ApiRequestResponse<CreateMovieResponse>>

type GetAllMoviesFn = (
  token: string,
  baseUrl?: string
) => Promise<ApiRequestResponse<GetMovieResponse>>

type GetMovieByIdFn = (
  token: string,
  id: number,
  baseUrl?: string
) => Promise<ApiRequestResponse<GetMovieResponse>>

type GetMovieByNameFn = (
  token: string,
  name: string,
  baseUrl?: string
) => Promise<ApiRequestResponse<GetMovieResponse>>

type UpdateMovieFn = (
  token: string,
  id: number,
  body: Partial<Movie>,
  baseUrl?: string
) => Promise<ApiRequestResponse<UpdateMovieResponse>>

type DeleteMovieFn = (
  token: string,
  id: number,
  baseUrl?: string
) => Promise<ApiRequestResponse<DeleteMovieResponse>>

// --- Group Them All Together ---
type MovieApiMethods = {
  addMovie: AddMovieFn
  getAllMovies: GetAllMoviesFn
  getMovieById: GetMovieByIdFn
  getMovieByName: GetMovieByNameFn
  updateMovie: UpdateMovieFn
  deleteMovie: DeleteMovieFn
}

// --- Generic Type Extension ---
export const test = baseApiRequestFixture.extend<MovieApiMethods>({
  addMovie: async ({ apiRequest }, use) => {
    const addMovieFn: AddMovieFn = async (token, body, baseUrl) =>
      apiRequest<CreateMovieResponse>({
        method: 'POST',
        url: '/movies',
        baseUrl,
        body,
        headers: commonHeaders(token)
      })

    await use(addMovieFn)
  },

  getAllMovies: async ({ apiRequest }, use) => {
    const getAllMoviesFn: GetAllMoviesFn = async (token, baseUrl) =>
      apiRequest<GetMovieResponse>({
        method: 'GET',
        url: '/movies',
        baseUrl,
        headers: commonHeaders(token)
      })

    await use(getAllMoviesFn)
  },

  getMovieById: async ({ apiRequest }, use) => {
    const getMovieByIdFn: GetMovieByIdFn = async (token, id, baseUrl) =>
      apiRequest<GetMovieResponse>({
        method: 'GET',
        url: `/movies/${id}`,
        baseUrl,
        headers: commonHeaders(token)
      })

    await use(getMovieByIdFn)
  },

  // getMovieByName
  getMovieByName: async ({ apiRequest }, use) => {
    const getMovieByNameFn: GetMovieByNameFn = async (token, name, baseUrl) => {
      const queryParams = new URLSearchParams({ name }).toString()
      const url = `/movies?${queryParams}`

      return apiRequest<GetMovieResponse>({
        method: 'GET',
        url,
        baseUrl,
        headers: commonHeaders(token)
      })
    }

    await use(getMovieByNameFn)
  },

  updateMovie: async ({ apiRequest }, use) => {
    const updateMovieFn: UpdateMovieFn = async (token, id, body, baseUrl) =>
      apiRequest<UpdateMovieResponse>({
        method: 'PUT',
        url: `/movies/${id}`,
        baseUrl,
        body,
        headers: commonHeaders(token)
      })

    await use(updateMovieFn)
  },

  // deleteMovie
  deleteMovie: async ({ apiRequest }, use) => {
    const deleteMovieFn: DeleteMovieFn = async (token, id, baseUrl) =>
      apiRequest<DeleteMovieResponse>({
        method: 'DELETE',
        url: `/movies/${id}`,
        baseUrl,
        headers: commonHeaders(token)
      })

    await use(deleteMovieFn)
  }
})
