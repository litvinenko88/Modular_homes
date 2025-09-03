# Настройка шрифта InterTight

## Что сделано:
1. ✅ Заменен Google Fonts Raleway на локальный InterTight
2. ✅ Обновлены все CSS переменные
3. ✅ Создан файл `/public/fonts/inter-tight.css`
4. ✅ Созданы заглушки для файлов шрифтов

## Что нужно сделать:

### 1. Скачать файлы шрифта InterTight
Перейдите на https://fonts.google.com/specimen/Inter+Tight и скачайте:
- InterTight-Variable.woff2
- InterTight-VariableItalic.woff2  
- InterTight-Regular.woff2
- InterTight-Regular.woff
- InterTight-Bold.woff2
- InterTight-Bold.woff

### 2. Поместить файлы в папку
Скопируйте все файлы в `public/fonts/`

### 3. Перезапустить сервер разработки
```bash
npm run dev
```

## Результат:
- ❌ Исчезнут 404 ошибки для raleway-variable.woff2
- ❌ Прекратятся циклические перезагрузки Fast Refresh
- ✅ Шрифт будет загружаться локально, без обращения к Google Fonts
- ✅ Улучшится производительность сайта