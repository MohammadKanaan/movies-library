import type { NextConfig } from 'next'
import { BREAKPOINTS } from './lib/constants-breakpoints'
import { ROUTE_HOME, ROUTE_MOVIES } from './lib/constants-routes'

const scssBreakpoints = Object.entries(BREAKPOINTS)
  .map(([name, value]) => `$breakpoint-${name}: ${value};`)
  .join('\n')

export const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  sassOptions: {
    additionalData: scssBreakpoints,
  },
  headers: async () => [{ source: '/(.*)', headers: SECURITY_HEADERS }],
  // The catalog is the home page. Temporary (307), so browsers do not cache it if `/` gets a page.
  redirects: async () => [{ source: ROUTE_HOME, destination: ROUTE_MOVIES, permanent: false }],
}

export default nextConfig
