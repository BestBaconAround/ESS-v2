@echo off
rem Builds the chat page, starts the server and opens it in the browser. Needs Node.js and one "npm install" first.
cd /d "%~dp0"
if not exist node_modules (
  echo Installing once...
  call npm install
)
call npm run build
if errorlevel 1 (
  echo The build failed. See the messages above.
  pause
  exit /b 1
)
start "" http://localhost:3000
call npm run serve
pause
