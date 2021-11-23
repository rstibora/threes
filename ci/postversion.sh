#!/bin/bash
set -e

git push && git push --tags

export PIPENV_PIPFILE=../backend/Pipfile
export DJANGO_DEBUG=true

# Remove development build as it can't exist during static file collection in production build.
rm -rf /media/ramdisk/dist

pipenv run python ../backend/threes/manage.py collectstatic

rsync -e "ssh -t -i $HOME/.ssh/id_rsa" -rP ../backend/static_root threes@164.90.218.235:/home/threes/threes/backend

echo "Logging into the production server..."
ssh -i $HOME/.ssh/id_rsa threes@164.90.218.235 <<-EOF
    cd /home/threes/threes
    git pull
    echo "Restarting gunicorn..."
    sudo systemctl restart gunicorn
    exit
EOF 

rm -rf ../backend/static_root
rm -rf ../frontend/dist
