@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Initializing Backend...
echo y | call "C:\Program Files\nodejs\npx.cmd" -y @nestjs/cli new backend --directory backend --package-manager npm --skip-git
echo Installing Frontend Dependencies...
cd frontend
echo y | call "C:\Program Files\nodejs\npm.cmd" install
echo Done.
