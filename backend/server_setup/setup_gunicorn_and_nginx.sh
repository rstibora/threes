#!/bin/bash

set -e

echo "Copying gunicorn socket and service units to /etc/systemd/system..."
sudo cp ./gunicorn.service /etc/systemd/system/
sudo cp ./gunicorn.socket /etc/systemd/system/

echo "Starting the the socket..."
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket

echo "Setting environment overrides..."
overrides_file=/etc/systemd/system/gunicorn.service.d/override.conf
echo "[Service]" >> $overrides_file
echo 'Environment="DJANGO_DEBUG="' >> $overrides_file
echo 'Environment="DJANGO_HOST="' >> $overrides_file
echo 'Environment="DJANGO_SECRET_KEY="' >> $overrides_file
echo 'Environment="DJANGO_IS_PRODUCTION="' >> $overrides_file
sudo systemctl edit gunicorn.service

echo "Setting up nginx..."
sudo cp ./threes /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/threes /etc/nginx/sites-enabled
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'

# Requied for CI scripts.
echo "$USER ALL=NOPASSWD:/usr/bin/systemctl restart gunicorn" | (sudo su -c 'EDITOR="tee" visudo -f /etc/sudoers.d/threes')