#!/bin/bash

sudo apt update
# Install PostgreSQL 13 (by hand, not handled here).
# Also make sure Python 3.9 with pip (for 3.9) and dev headers (python-dev) is installed.
sudo apt install postgresql postgresql-contrib nginx curl

# Required for building psycogp (it is adviced to build psycogp in production environment).
sudo apt install build-essential libpq-dev
