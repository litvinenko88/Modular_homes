import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon-house.ico" />
        <link rel="icon" type="image/svg+xml" href="/house-icon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/house-icon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/house-icon.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/house-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#007bff" />
        <meta name="msapplication-TileColor" content="#007bff" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Easy House" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Easy House" />
        <meta name="application-name" content="Easy House" />
        <meta name="msapplication-tooltip" content="Модульные дома под ключ" />
        <meta name="msapplication-starturl" content="/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//mc.yandex.ru" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}