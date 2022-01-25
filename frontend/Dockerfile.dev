# syntax=docker/dockerfile:1
FROM node:17.3

RUN apt update
RUN apt install git

WORKDIR /code
COPY . /code/

RUN npm install
