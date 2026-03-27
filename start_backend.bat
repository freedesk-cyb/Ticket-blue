@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd backend
echo Cleaning and Starting Backend in Watch Mode...
if exist dist rmdir /s /q dist
call "C:\Program Files\nodejs\npx.cmd" nest start --watch
