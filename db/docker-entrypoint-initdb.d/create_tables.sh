#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username="$POSTGRES_USER"<<-EOSQL
     CREATE DATABASE threes;

     CREATE USER threes WITH PASSWORD '${THREES_DB_PASSWORD}';
     ALTER ROLE threes SET client_encoding TO 'utf8';
     ALTER ROLE threes SET default_transaction_isolation TO 'read committed';
     ALTER ROLE threes SET timezone TO 'UTC';
     GRANT ALL PRIVILEGES ON DATABASE threes TO threes;

     CREATE USER keycloak WITH PASSWORD '${KEYCLOAK_DB_PASSWORD}';
     ALTER ROLE keycloak SET client_encoding TO 'utf8';
     ALTER ROLE keycloak SET default_transaction_isolation TO 'read committed';
     ALTER ROLE keycloak SET timezone TO 'UTC';

     CREATE SCHEMA AUTHORIZATION keycloak;
     ALTER ROLE keycloak IN DATABASE threes SET search_path = keycloak,public;
     ALTER DEFAULT PRIVILEGES IN SCHEMA keycloak GRANT REFERENCES ON TABLES TO threes;
EOSQL
