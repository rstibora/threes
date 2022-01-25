# syntax=docker/dockerfile:1
FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update
RUN apt install -y netcat

RUN pip install pipenv

WORKDIR /setup
COPY ./Pipfile.lock .
COPY ./Pipfile .
RUN pipenv install --system --deploy --ignore-pipfile --dev

RUN mkdir -p /var/log/threes
RUN chmod 700 /var/log/threes

COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /setup/entrypoint.sh
RUN chmod +x /setup/entrypoint.sh

WORKDIR /code
# COPY ./threes/ /code/

ENTRYPOINT [ "/setup/entrypoint.sh" ]
