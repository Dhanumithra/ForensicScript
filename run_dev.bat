@echo off
echo ===================================================
echo   Starting ForensicScript Development Environment
echo ===================================================
echo Starting Django REST Framework Backend on port 8000...
start "ForensicScript Backend" cmd /k "cd backend && python manage.py runserver 8000"
echo Starting Vite React Frontend on port 5173...
start "ForensicScript Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Both services launched!
echo Access the game in your browser at: http://localhost:5173
echo Backend API active at: http://127.0.0.1:8000/api/
echo ===================================================
