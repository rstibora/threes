# syntax=docker/dockerfile:1
ARG git_hash=undefined
ARG git_tag=undefined
ARG image_tag=latest

FROM rstibora/threes-frontend:${image_tag} as frontend-image

FROM python:3.10 as builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update
RUN apt install -y netcat

RUN pip install pipenv

WORKDIR /usr/src/app
COPY Pipfile .
COPY Pipfile.lock .
RUN pipenv install
RUN pipenv lock -r > requirements.txt
RUN pip wheel --no-cache-dir --no-deps --wheel-dir ../wheels -r requirements.txt
COPY . .

RUN mkdir -p /var/log/threes
RUN mkdir /static
RUN pipenv run python ./threes/manage.py collectstatic

FROM python:3.10

ENV GIT_HASH=${git_hash}
ENV GIT_TAG=${git_tag}

RUN apt-get update
RUN apt install -y netcat

RUN mkdir -p /home/threes
RUN addgroup threes
RUN adduser threes --ingroup threes

RUN mkdir -p /var/log/threes
RUN chmod 700 /var/log/threes

ENV HOME=/home/threes
ENV APP_HOME=/home/threes/web
WORKDIR ${APP_HOME}

COPY --from=builder /usr/src/wheels/ /wheels
RUN pip install --no-cache /wheels/*

COPY --from=builder /static /static
COPY --from=frontend-image /output /static_frontend

COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

COPY ./threes/ $APP_HOME
RUN chown -R threes:threes $APP_HOME
RUN chown -R threes:threes /var/log/threes

USER threes

ENTRYPOINT [ "./entrypoint.sh" ]
