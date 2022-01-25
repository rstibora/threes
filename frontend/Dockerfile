# syntax=docker/dockerfile:1
FROM node:17.3

ARG git_hash=undefined
ARG git_tag=undefined
ARG image_tag=latest
ENV GIT_HASH=${git_hash}
ENV GIT_TAG=${git_tag}

WORKDIR /code
COPY . /code/

RUN npm version ${git_tag}
RUN npm install
RUN npm run productionBuild
