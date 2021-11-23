#!/bin/bash

set -e

echo "Copying gunicorn socket and service units to /etc/systemd/system..."
sudo cp ./gunicorn.service /etc/systemd/system/
sudo cp ./gunicorn.socket /etc/systemd/system/

echo "Starting the the socket..."
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket

echo "Set environment variables:"
# [Service]
# Environment="SECRET=123"
sudo systemctl edit gunicorn.service

echo "Setting up nginx..."
sudo cp ./threes /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/threes /etc/nginx/sites-enabled
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'

# Requied for CI scripts.
echo "$USER ALL=NOPASSWD:/usr/bin/systemctl restart gunicorn" | (sudo su -c 'EDITOR="tee" visudo -f /etc/sudoers.d/threes')