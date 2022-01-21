#!/bin/bash

POSTGRES_HOST=threes-db-service
POSTGRES_PORT=5432

echo "Waiting for postgres..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
    sleep 0.5
done
echo "PostgreSQL started"

exec "$@"