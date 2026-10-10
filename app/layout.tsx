import type { Metadata } from 'next'
import { Geist, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { Providers } from '@/app/providers'
import { siteUrl } from '@/lib/data/site'
import { env } from '@/lib/env'
import { SITE_DESCRIPTION, SITE_OPEN_GRAPH } from '@/lib/seo'
import { cn } from '@/lib/utils'
import '@/styles/global.css'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

// Pages inherit these unless they set their own: Open Graph and Twitter titles and descriptions
// follow each page's `title` and `description`, and a page's relative URLs resolve on `metadataBase`.
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: env.appName, template: `%s | ${env.appName}` },
  description: SITE_DESCRIPTION,
  applicationName: env.appName,
  openGraph: { ...SITE_OPEN_GRAPH, type: 'website' },
  twitter: { card: 'summary' },
}

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html
      lang="en"
      className={cn(geist.variable, spaceGrotesk.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      {/* `suppressHydrationWarning` also covers attributes browser extensions inject
          into <body> (e.g. `cz-shortcut-listen`) before React hydrates. */}
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
