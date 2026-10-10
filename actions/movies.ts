'use server'

import { refresh } from 'next/cache'
import { toActionFailure } from '@/lib/data/errors'
import {
  attachPoster,
  createMovie,
  deleteMovie,
  removePoster,
  updateMovie,
} from '@/lib/data/movies'
import type { AttachPosterInput, MovieDetail, MovieInput, UpdateMovieInput } from '@/lib/dto/movies'
import type { ActionResult } from '@/types/api'

export const createMovieAction = async (input: MovieInput): Promise<ActionResult<MovieDetail>> => {
  try {
    const movie = await createMovie(input)
    refresh()
    return { ok: true, data: movie }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const updateMovieAction = async (
  input: UpdateMovieInput,
): Promise<ActionResult<MovieDetail>> => {
  try {
    const movie = await updateMovie(input)
    refresh()
    return { ok: true, data: movie }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const deleteMovieAction = async (id: string): Promise<ActionResult<void>> => {
  try {
    await deleteMovie(id)
    refresh()
    return { ok: true, data: undefined }
  } catch (error) {
    return toActionFailure(error)
  }
}

/** The poster is uploaded first (`createUploadAction` with purpose `poster`), then attached here. */
export const attachPosterAction = async (
  input: AttachPosterInput,
): Promise<ActionResult<MovieDetail>> => {
  try {
    const movie = await attachPoster(input)
    refresh()
    return { ok: true, data: movie }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const removePosterAction = async (id: string): Promise<ActionResult<MovieDetail>> => {
  try {
    const movie = await removePoster(id)
    refresh()
    return { ok: true, data: movie }
  } catch (error) {
    return toActionFailure(error)
  }
}
