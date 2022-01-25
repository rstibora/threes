#!/bin/bash

set -e

GIT_CHANGES=$(git status . --untracked-files=no --porcelain)

if [ -n "$GIT_CHANGES" ]
then
    echo "Git is not clean."
    exit 1
fi

GIT_HASH=$(git rev-parse --short HEAD)
GIT_TAG=$(git tag --points-at HEAD)
IMAGE_TAG=$GIT_TAG

if [ -z "$GIT_TAG" ]
then
    echo "Git tag is empty, image will be tagged as 'latest'."
    IMAGE_TAG="latest"
fi

docker build -t "rstibora/threes-$(basename $1):$IMAGE_TAG" --build-arg git_hash=$GIT_HASH --build-arg git_tag=$GIT_TAG --build-arg image_tag=$IMAGE_TAG $1
