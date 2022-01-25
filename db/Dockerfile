# syntax=docker/dockerfile:1
FROM postgres:14.1

ARG git_hash=undefined
ARG git_tag=undefined
ARG image_tag=latest
ENV GIT_HASH=${git_hash}
ENV GIT_TAG=${git_tag}

COPY ./docker-entrypoint-initdb.d/create_tables.sh /docker-entrypoint-initdb.d
