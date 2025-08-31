import './globals.css';

export const metadata = {
  title: 'Конструктор модульных домов',
  description: 'Интерактивный конструктор модульных домов',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}