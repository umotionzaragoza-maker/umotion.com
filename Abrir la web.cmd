@echo off
chcp 65001 >nul
title Web de Umotion - http://localhost:5201
cd /d "%~dp0"

rem Doble clic para ver la web en este ordenador. Cierra esta ventana para apagarla.

set "NODE=C:\HUGO\Claude\.tools\node-v24.21.0-win-x64\node.exe"
if not exist "%NODE%" set "NODE=node"

rem Si ya esta encendida, solo abre el navegador.
netstat -ano | findstr /r /c:":5201 .*LISTENING" >nul && (
  start "" http://localhost:5201
  exit /b 0
)

rem Recompila solo si hay cambios desde la ultima vez (o si nunca se compilo).
for /f %%i in ('powershell -NoProfile -Command "$b = Get-Item '.next\BUILD_ID' -ErrorAction SilentlyContinue; $s = (Get-ChildItem src, public -Recurse -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1).LastWriteTime; if (-not $b -or $s -gt $b.LastWriteTime) { 'si' } else { 'no' }"') do set "COMPILAR=%%i"
if "%COMPILAR%"=="si" (
  echo Preparando la web, tarda un minuto...
  "%NODE%" node_modules\next\dist\bin\next build
  if errorlevel 1 (
    echo.
    echo No se pudo compilar la web. Revisa el mensaje de arriba.
    pause
    exit /b 1
  )
)

echo.
echo   Web de Umotion encendida en http://localhost:5201
echo   Cierra esta ventana para apagarla.
echo.
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5201"
"%NODE%" node_modules\next\dist\bin\next start --port 5201
pause
