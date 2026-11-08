@echo off
title Food Rocket Kitchen Runner
echo ==============================================================
echo        FOOD ROCKET PREMIUM CLOUD KITCHEN PLATFORM
echo ==============================================================
echo Starting Backend (Node.js/Express on port 5000)...
start "Food Rocket Backend API" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend (Vite/React on port 5173)...
start "Food Rocket Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo ==============================================================
echo  Platform is launching!
echo  Storefront URL : http://localhost:5173
echo  Backend API URL: http://localhost:5000/api/health
echo.
echo  Demo Admin Account:
echo    Email   : admin@foodrocket.com
echo    Password: admin123
echo.
echo  Demo Customer Account:
echo    Email   : customer@gmail.com
echo    Password: customer123
echo ==============================================================
echo Both services are now running in their respective windows.
echo Press any key to exit this launcher window...
pause >nul

