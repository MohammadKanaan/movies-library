'use server'

import { refresh } from 'next/cache'
import { toActionFailure } from '@/lib/data/errors'
import { createPerson, deletePerson, updatePerson } from '@/lib/data/people'
import type { PersonDetail, PersonInput, UpdatePersonInput } from '@/lib/dto/people'
import type { ActionResult } from '@/types/api'

export const createPersonAction = async (
  input: PersonInput,
): Promise<ActionResult<PersonDetail>> => {
  try {
    const person = await createPerson(input)
    refresh()
    return { ok: true, data: person }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const updatePersonAction = async (
  input: UpdatePersonInput,
): Promise<ActionResult<PersonDetail>> => {
  try {
    const person = await updatePerson(input)
    refresh()
    return { ok: true, data: person }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const deletePersonAction = async (id: string): Promise<ActionResult<void>> => {
  try {
    await deletePerson(id)
    refresh()
    return { ok: true, data: undefined }
  } catch (error) {
    return toActionFailure(error)
  }
}
