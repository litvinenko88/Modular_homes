@echo off
echo Stopping any running Next.js processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Clearing cache...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul

echo Starting development server...
npm run dev