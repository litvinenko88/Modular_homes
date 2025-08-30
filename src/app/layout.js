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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  )
}