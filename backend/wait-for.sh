#!/bin/sh
# wait-for.sh

HOST=$1
PORT=$2
shift 2
CMD="$@"

echo "Esperando por $HOST:$PORT..."

while ! echo > /dev/tcp/$HOST/$PORT 2>/dev/null; do
  echo "Aguardando $HOST:$PORT..."
  sleep 2
done

echo "$HOST:$PORT está disponível. Iniciando comando..."
exec $CMD
