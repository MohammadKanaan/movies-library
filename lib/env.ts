export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Movie Library',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1',
} as const
