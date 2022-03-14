# postgres 14 currently not supported by hasura https://github.com/hasura/graphql-engine/issues/7676.
FROM hasura/graphql-engine:v2.0.10.cli-migrations-v3

RUN apt-get install -y curl gnupg2 socat \
    && echo "deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && curl -s https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt-get update \
    && apt-get install -y postgresql-client-14

RUN curl -L curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | INSTALL_PATH=/hasuracli bash


COPY ./workaround.sh /workaround.sh

ENTRYPOINT ["/workaround.sh"]
CMD ["-?"]
