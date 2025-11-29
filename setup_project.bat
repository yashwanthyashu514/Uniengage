@echo off
echo Creating project structure...
mkdir UniEngage
cd UniEngage
mkdir backend
mkdir frontend

echo Setting up Backend...
cd backend
call npm init -y
call npm install express mongoose dotenv cors bcryptjs jsonwebtoken qrcode

echo Setting up Frontend...
cd ..
call npm create vite@latest frontend --template react
cd frontend
call npm install
call npm install axios react-router-dom html5-qrcode
call npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
call npx tailwindcss init -p

echo Setup Complete!
echo To start backend: cd backend && npm start
echo To start frontend: cd frontend && npm run dev
