@echo off
title VeriPost Launcher
color 0A

echo.
echo  ==========================================
echo        VeriPost ^| Fake News Detector
echo  ==========================================
echo.

REM ── Check Python ──────────────────────────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python is not installed or not in PATH.
    echo  Download it from https://python.org and re-run this file.
    echo.
    pause
    exit /b 1
)

REM ── Check Node.js ─────────────────────────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js is not installed or not in PATH.
    echo  Download it from https://nodejs.org and re-run this file.
    echo.
    pause
    exit /b 1
)

REM ── Virtual environment ───────────────────────────────────────────────────
if not exist "venv\Scripts\activate.bat" (
    echo  [Setup] Creating Python virtual environment ...
    python -m venv venv
    if errorlevel 1 (
        echo  [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo  [Setup] Virtual environment created.
)

REM ── Python dependencies ───────────────────────────────────────────────────
if not exist "venv\Lib\site-packages\flask" (
    echo  [Setup] Installing Python dependencies ^(this may take a few minutes^) ...
    call venv\Scripts\activate.bat && pip install -r requirements.txt --quiet
    if errorlevel 1 (
        echo  [ERROR] Failed to install Python dependencies.
        pause
        exit /b 1
    )
    echo  [Setup] Python dependencies installed.
)

REM ── Node modules ──────────────────────────────────────────────────────────
if not exist "veripost-app\node_modules" (
    echo  [Setup] Installing Node modules ^(this may take a few minutes^) ...
    cd veripost-app
    npm install --silent
    if errorlevel 1 (
        echo  [ERROR] Failed to install Node modules.
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo  [Setup] Node modules installed.
)

REM ── Load .env variables ───────────────────────────────────────────────────
if exist ".env" (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        if not "%%a"=="" set "%%a=%%b"
    )
)
if "%PORT%"=="" set PORT=5000

echo.
echo  ==========================================
echo   All dependencies ready. Starting app ...
echo  ==========================================
echo.

REM ── Start Flask ───────────────────────────────────────────────────────────
echo  [1/3] Starting Flask backend on http://localhost:%PORT% ...
start "VeriPost - Flask Backend" cmd /k "call venv\Scripts\activate.bat && python app.py"

echo  [2/3] Waiting for Flask to initialize ...
timeout /t 5 /nobreak > nul

REM ── Start Next.js ─────────────────────────────────────────────────────────
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
