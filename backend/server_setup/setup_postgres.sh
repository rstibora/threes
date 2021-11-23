#!/bin/bash

# Creates a new database called 'threes' and a new user with the same name.
set -e

read -p "Password for 'threes' database user account: " password

sudo -u postgres -- psql -c "CREATE DATABASE threes;" \
                         -c "CREATE USER threes WITH PASSWORD '${password}';" \
                         -c "ALTER ROLE threes SET client_encoding TO 'utf8';" \
                         -c "ALTER ROLE threes SET default_transaction_isolation TO 'read committed';" \
                         -c "ALTER ROLE threes SET timezone TO 'UTC';" \
                         -c "GRANT ALL PRIVILEGES ON DATABASE threes TO threes;"
