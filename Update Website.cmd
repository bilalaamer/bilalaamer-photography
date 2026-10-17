@echo off
setlocal
title Rebuild Bilal Aamer Photography website
echo [1/3] Processing photos from the photos folder...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"
if errorlevel 1 goto :error
echo.
echo [2/3] Building the website (React)...
set "PATH=E:\tools\node;%PATH%"
pushd "%~dp0app"
call "E:\tools\node\npm.cmd" run build
popd
if errorlevel 1 goto :error
echo.
echo [3/3] Opening the website...
start "" "%~dp0app\dist\index.html"
exit /b 0

:error
echo.
echo Something went wrong - please scroll up for the error messages.
pause
exit /b 1
