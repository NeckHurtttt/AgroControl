@echo off
rem Levanta AgroControl completo (base de datos + web + API) con Docker y abre el navegador.
rem Uso: doble clic en este archivo.
cd /d "%~dp0"

where docker >nul 2>nul || (
  echo Falta Docker Desktop. Instalalo desde https://www.docker.com/products/docker-desktop/
  pause
  exit /b 1
)
docker info >nul 2>nul || (
  echo Docker Desktop no esta abierto. Abrelo, espera a que diga "running" y vuelve a intentar.
  pause
  exit /b 1
)

echo Preparando AgroControl (la primera vez tarda unos minutos)...
docker compose up -d --build || (
  pause
  exit /b 1
)

echo Esperando a que arranque...
for /l %%i in (1,1,90) do (
  curl -fs http://localhost:8080/api/health >nul 2>nul && goto listo
  timeout /t 2 /nobreak >nul
)
echo No respondio a tiempo. Revisa con: docker compose logs app
pause
exit /b 1

:listo
echo.
echo Listo: http://localhost:8080
echo Entra con sergio@agrocontrol.com / agro123 (los demas usuarios estan en la pantalla de login).
echo Para apagarlo: doble clic en detener.cmd
start http://localhost:8080
pause
