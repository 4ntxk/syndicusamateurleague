import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies, headers } from 'next/headers'
import '../styles/globals.css'
import { ClientLayout } from './ClientLayout'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })
const supportedLocales = new Set(['pl', 'en'])

export const metadata: Metadata = {
  title: 'Syndicus Amateur League',
  description: 'Join the ultimate e-sports tournament experience. Register now for online and offline competitions.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerStore = await headers()
  const cookieStore = await cookies()
  const localeHeader = headerStore.get('x-locale')
  const localeCookie = cookieStore.get('locale')?.value
  const localeSource = localeHeader ?? localeCookie ?? 'pl'
  const locale = supportedLocales.has(localeSource) ? localeSource : 'pl'

  return (
    <html lang={locale}>
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
