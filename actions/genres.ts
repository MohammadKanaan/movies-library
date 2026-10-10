'use server'

import { refresh } from 'next/cache'
import { toActionFailure } from '@/lib/data/errors'
import { createGenre, deleteGenre, updateGenre } from '@/lib/data/genres'
import type { GenreInput, GenreWithCount, UpdateGenreInput } from '@/lib/dto/genres'
import type { ActionResult } from '@/types/api'

export const createGenreAction = async (
  input: GenreInput,
): Promise<ActionResult<GenreWithCount>> => {
  try {
    const genre = await createGenre(input)
    refresh()
    return { ok: true, data: genre }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const updateGenreAction = async (
  input: UpdateGenreInput,
): Promise<ActionResult<GenreWithCount>> => {
  try {
    const genre = await updateGenre(input)
    refresh()
    return { ok: true, data: genre }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const deleteGenreAction = async (id: string): Promise<ActionResult<void>> => {
  try {
    await deleteGenre(id)
    refresh()
    return { ok: true, data: undefined }
  } catch (error) {
    return toActionFailure(error)
  }
}
