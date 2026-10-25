#!/usr/bin/env bash
# Levanta AgroControl completo (base de datos + web + API) con Docker y abre el navegador.
# Uso: ./iniciar.sh   (en Windows: doble clic en iniciar.cmd)
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v docker >/dev/null 2>&1; then
  echo "Falta Docker. Instálalo desde https://docs.docker.com/get-docker/ y vuelve a intentar."
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "Docker está instalado pero no está corriendo. Ábrelo (o: sudo systemctl start docker) y vuelve a intentar."
  exit 1
fi

echo "Preparando AgroControl (la primera vez tarda unos minutos)..."
docker compose up -d --build

printf "Esperando a que arranque"
for _ in $(seq 1 90); do
  if curl -fs http://localhost:8080/api/health >/dev/null 2>&1; then
    echo
    echo "Listo: http://localhost:8080"
    echo "Entra con sergio@agrocontrol.com / agro123 (los demás usuarios están en la pantalla de login)."
    echo "Para apagarlo: ./detener.sh"
    (xdg-open http://localhost:8080 || open http://localhost:8080) >/dev/null 2>&1 || true
    exit 0
  fi
  printf "."
  sleep 2
done
echo
echo "No respondió a tiempo. Mira qué pasó con: docker compose logs app"
exit 1
