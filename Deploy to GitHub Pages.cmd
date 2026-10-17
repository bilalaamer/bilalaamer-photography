@echo off
setlocal
title Deploy to GitHub Pages - Bilal Aamer Photography
echo [1/4] Processing photos from the photos folder...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"
if errorlevel 1 goto :error
echo.
echo [2/4] Building the website (React)...
set "PATH=E:\tools\node;%PATH%"
pushd "%~dp0app"
call "E:\tools\node\npm.cmd" run build
popd
if errorlevel 1 goto :error
echo.
echo [3/4] Staging the built site...
set "STAGE=%TEMP%\bilalaamer-ghpages"
if exist "%STAGE%" rmdir /s /q "%STAGE%"
mkdir "%STAGE%"
robocopy "%~dp0app\dist" "%STAGE%" /E /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 goto :error
echo.
echo [4/4] Publishing to GitHub Pages...
pushd "%STAGE%"
git init -b gh-pages
git config user.name "Bilal Aamer"
git config user.email "bilalaamer90@gmail.com"
git add -A
git commit -m "Deploy site"
git push -f git@github.com:bilalaamer/bilalaamer-photography.git gh-pages
if errorlevel 1 goto :error
popd
echo.
echo Done - the live site updates in about a minute:
echo https://bilalaamer.github.io/bilalaamer-photography/
pause
exit /b 0

:error
echo.
echo Something went wrong - please scroll up for the error messages.
pause
exit /b 1
