@echo off
echo ===============================================
echo  Starting Weather Forecast Web Application
echo ===============================================
echo.

:: Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Python not found! Please install Python 3.7 or newer.
  goto :error
)

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Node.js not found! Please install Node.js and npm.
  goto :error
)

echo Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
  echo Failed to install Python dependencies!
  goto :error
)

echo.
echo Starting Flask backend server...
start cmd /k "python app.py"
echo Backend server starting...

echo.
echo Installing Node.js dependencies (this might take a few minutes on first run)...
cd ..\frontend
call npm install
if %ERRORLEVEL% neq 0 (
  echo Failed to install Node.js dependencies!
  goto :error
)

echo.
echo Starting React frontend...
echo When the React server starts, a browser window should open automatically.
echo If it doesn't, please open http://localhost:3000 in your browser.
echo.
echo Press Ctrl+C in both command windows when you want to stop the application.
echo.
call npm start

goto :end

:error
echo.
echo ===============================================
echo Application failed to start. See error above.
echo ===============================================
pause
exit /b 1

:end
