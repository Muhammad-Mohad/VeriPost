@echo off
title VeriPost Launcher
color 0A

echo.
echo  ==========================================
echo        VeriPost ^| Fake News Detector
echo  ==========================================
echo.

REM Check if venv exists
if not exist "venv\Scripts\activate.bat" (
    echo  [ERROR] Virtual environment not found.
    echo  Run: python -m venv venv ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "veripost-app\node_modules" (
    echo  [ERROR] Node modules not found.
    echo  Run: cd veripost-app ^&^& npm install
    echo.
    pause
    exit /b 1
)

REM Load .env variables
if exist ".env" (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        if not "%%a"=="" set "%%a=%%b"
    )
)

if "%PORT%"=="" set PORT=5000

echo  [1/3] Starting Flask backend on http://localhost:%PORT% ...
start "VeriPost - Flask Backend" cmd /k "call venv\Scripts\activate.bat && python app.py"

echo  [2/3] Waiting for Flask to initialize ...
timeout /t 5 /nobreak > nul

echo  [3/3] Starting Next.js frontend on http://localhost:3000 ...
start "VeriPost - Next.js Frontend" cmd /k "cd veripost-app && npm run dev"

echo.
echo  ==========================================
echo   Flask API  :  http://localhost:%PORT%
echo   App        :  http://localhost:3000
echo   Admin      :  http://localhost:3000/admin
echo  ==========================================
echo.
echo  Opening browser in 10 seconds ...
timeout /t 10 /nobreak > nul
start http://localhost:3000

echo.
echo  Both servers are running in separate windows.
echo  Close those windows to stop the servers.
echo.
pause
