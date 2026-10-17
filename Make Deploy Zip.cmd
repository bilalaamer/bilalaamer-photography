@echo off
setlocal
title Make deploy zip - Bilal Aamer Photography
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
echo [3/3] Creating deploy zip...
powershell -NoProfile -Command "Compress-Archive -Path '%~dp0app\dist\*' -DestinationPath '%~dp0bilalaamer-site.zip' -Force"
if errorlevel 1 goto :error
echo.
echo Done - bilalaamer-site.zip is ready in this folder.
echo.
echo To publish: drag the zip file onto https://app.netlify.com/drop
echo (or upload it in Cloudflare Pages / your hosting dashboard).
pause
exit /b 0

:error
echo.
echo Something went wrong - please scroll up for the error messages.
pause
exit /b 1
