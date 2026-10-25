#!/usr/bin/env bash
# Apaga AgroControl. Los datos quedan guardados para la próxima vez.
# Para empezar de cero (borra la base de datos): docker compose down -v
cd "$(dirname "$0")" && docker compose down && echo "AgroControl apagado. Los datos siguen guardados."
