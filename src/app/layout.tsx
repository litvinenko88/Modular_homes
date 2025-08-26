import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Modular Homes',
  description: 'Модульные дома - современные решения для комфортного проживания',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}