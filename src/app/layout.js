export const metadata = {
  title: 'Easy House - Модульные дома нового поколения',
  description: 'Создайте дом своей мечты с помощью современных технологий и качественных материалов. Быстрое строительство, доступные цены, экологичность.',
  keywords: 'модульные дома, строительство домов, каркасные дома, быстровозводимые дома',
  viewport: 'width=device-width, initial-scale=1',
}

import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}