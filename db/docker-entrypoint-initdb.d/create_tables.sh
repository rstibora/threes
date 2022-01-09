#!/bin/bash

# Creates a new database called 'threes' and a new user with the same name.
set -e

psql -v ON_ERROR_STOP=1 --username="$POSTGRES_USER"<<-EOSQL
     CREATE DATABASE threes;
     CREATE USER threes WITH PASSWORD '${THREES_DB_PASSWORD}';
     ALTER ROLE threes SET client_encoding TO 'utf8';
     ALTER ROLE threes SET default_transaction_isolation TO 'read committed';
     ALTER ROLE threes SET timezone TO 'UTC';
     GRANT ALL PRIVILEGES ON DATABASE threes TO threes;
EOSQL
