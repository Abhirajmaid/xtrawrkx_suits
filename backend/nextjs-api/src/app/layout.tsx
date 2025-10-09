import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Xtrawrkx API',
  description: 'Xtrawrkx Backend API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}