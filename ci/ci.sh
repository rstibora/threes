#!/bin/bash

# Configuration variables.
# REPOSITORY=git@github.com:rstibora/threes.git
# PRODUCTION_HOST=164.90.218.235
# PRODUCTION_FOLDER=/home/threes/

# Find out version and increment it.
# git clone git@github.com:rstibora/threes.git
# BUILD_NUMBER=`echo git describe --tags | awk '{split($0,a,"-"); print a[3]}'`
# BUILD_NUMBER=$((BUILD_NUMBER+1))
# VERSION="0.0.$BUILD_NUMBER"

eval $(ssh-agent)
ssh-add

# Workaround for https://github.com/npm/npm/issues/9111.
mkdir ../frontend/.git
npm --prefix ../frontend version patch
rm -rf ../frontend/.git
