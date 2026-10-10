import type { Role, UserStatus } from '@/lib/dto/users'

/** The role picker's options; also lets a Select trigger show the label instead of the value. */
export const ROLE_LABELS: Record<Role, string> = {
  viewer: 'Viewer',
  editor: 'Editor',
  admin: 'Admin',
}

/** How the confirmation toast names each role. */
export const ROLE_PHRASES: Record<Role, string> = {
  viewer: 'a viewer',
  editor: 'an editor',
  admin: 'an admin',
}

/** The list filters: `''` is "any" (the URL default, so it is left out of the query string). */
export const ROLE_FILTER_LABELS: Record<Role | '', string> = {
  '': 'All roles',
  viewer: 'Viewers',
  editor: 'Editors',
  admin: 'Admins',
}

export const STATUS_FILTER_LABELS: Record<UserStatus | '', string> = {
  '': 'Any status',
  active: 'Active',
  banned: 'Banned',
}
