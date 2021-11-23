#!/bin/sh

set -e

export DJANGO_DEBUG=true
cd "${0%/*}"/..
pipenv run python ./threes/manage.py migrate
echo "Setting up Django superuser... "
pipenv run python ./threes/manage.py createsuperuser
cd -

echo "Filling the database with configuration data... "
sudo -u postgres -- psql -c "\c threes" \
                         -c "INSERT INTO reviews_reviewconfiguration VALUES (1, 'Weekly')" \
                         -c "INSERT INTO reviews_reviewconfiguration VALUES (2, 'Monthly')" \
                         -c "INSERT INTO reviews_reviewconfiguration VALUES (3, 'Quarterly')" \
                         -c "INSERT INTO reviews_reviewconfiguration VALUES (4, 'Yearly')"
