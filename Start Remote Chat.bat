@echo off
rem Starts the chat server and a Cloudflare quick tunnel, so you can open the chat from anywhere.
rem The tunnel prints a public https://....trycloudflare.com address in the second window: open that on your phone.
rem The address is new every time and stops working when you close these windows. There is NO PASSWORD on it.
cd /d "%~dp0"
if not exist node_modules (
  echo Installing once...
  call npm install
)
if not exist web\dist\index.html call npm run build
if not exist tools\cloudflared\cloudflared.exe (
  echo Downloading the Cloudflare tunnel program once...
  mkdir tools\cloudflared 2>nul
  curl -L -o tools\cloudflared\cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
)
rem TRUST_PROXY=1 makes the question limit count each visitor separately behind the tunnel.
start "Sanctuary chat server" cmd /k "set TRUST_PROXY=1&& npm run serve"
timeout /t 4 >nul
start "Sanctuary chat tunnel (look for the trycloudflare.com address)" cmd /k "tools\cloudflared\cloudflared.exe tunnel --url http://127.0.0.1:3000 --no-autoupdate"
echo.
echo Two windows opened. Copy the https://...trycloudflare.com address from the tunnel window.
echo Close both windows to stop sharing.
pause
