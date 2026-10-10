import type { Metadata } from 'next'
import { Geist, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { Providers } from '@/app/providers'
import { env } from '@/lib/env'
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

export const metadata: Metadata = {
  title: { default: env.appName, template: `%s | ${env.appName}` },
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
