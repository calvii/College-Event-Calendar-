import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { UserRoleProvider } from '../lib/UserRoleContext' // add this import
import './globals.css'

<img src="/art.png" alt="Art" />  // (keep this if needed)

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Wrap children in UserRoleProvider */}
        <UserRoleProvider>
          {children}
        </UserRoleProvider>

        <Analytics />
      </body>
    </html>
  )
}
