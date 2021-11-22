#!/bin/bash

git push && git push --tags

export PIPENV_PIPFILE=../backend/Pipfile
pipenv run python ../backend/threes/manage.py collectstatic

rsync -e "ssh -i $HOME/.ssh/id_rsa" -rP ../backend/static_root threes@164.90.218.235:/home/threes/threes/backend

echo "Logging into the production server..."
ssh -i $HOME/.ssh/id_rsa threes@164.90.218.235

cd /home/threes/threes
git pull

echo "Restarting gunicorn..."
sudo -u threes systemctl restart gunicorn
exit

rm -rf ./backend/static_root
