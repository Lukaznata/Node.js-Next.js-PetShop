#!/bin/bash

HOST=$1
PORT=$2
CMD="${@:3}"

echo "Aguardando $HOST:$PORT..."

while ! bash -c ">/dev/tcp/$HOST/$PORT" 2>/dev/null; do
  sleep 1
  echo "Aguardando $HOST:$PORT..."
done

echo "$HOST:$PORT está disponível. Iniciando o serviço..."
exec $CMD
