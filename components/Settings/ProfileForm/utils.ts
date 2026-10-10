import type { CurrentUser, UpdateProfileInput } from '@/lib/dto/users'

export const PROFILE_FORM_FIELDS = ['name', 'username'] as const

export const hydrateProfileForm = (user: CurrentUser): UpdateProfileInput => {
  return { name: user.name, username: user.username }
}
