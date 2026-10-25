@echo off
rem Apaga AgroControl. Los datos quedan guardados para la proxima vez.
rem Para empezar de cero (borra la base de datos): docker compose down -v
cd /d "%~dp0"
docker compose down && echo AgroControl apagado. Los datos siguen guardados.
pause
