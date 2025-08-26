export const metadata = {
  title: 'Modular Homes',
  description: 'Модульные дома - современные решения для комфортного проживания',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}