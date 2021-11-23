#!/bin/bash
set -e

export PIPENV_PIPFILE=../backend/Pipfile
export DJANGO_DEBUG=true

pipenv run python ../backend/threes/manage.py collectstatic

rsync -e "ssh -t -i $HOME/.ssh/id_rsa" -rP ../backend/threes/static_root threes@164.90.218.235:/home/threes/threes/backend/

git push && git push --tags

echo "Logging into the production server..."
# Assumes no password for the private key (git pull) and passwordless sudo for the service restart.
ssh -i $HOME/.ssh/id_rsa threes@164.90.218.235 <<EOF
cd /home/threes/threes
git fetch --tags
git reset origin/master --hard
echo "Restarting gunicorn..."
sudo systemctl restart gunicorn
exit
EOF 

rm -rf ../backend/static_root
rm -rf ../frontend/dist
