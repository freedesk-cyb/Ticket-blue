@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd frontend
echo Starting Frontend...
call "C:\Program Files\nodejs\npx.cmd" vite --port 3000
