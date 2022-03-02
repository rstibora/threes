#!/bin/bash

# Run as './db/run_liquibase.sh update --defaults-file=/liquibase/changelog/liquibase.properties --password=<password>

docker run --network=host --mount type=bind,source="$(cd $(dirname $0) && pwd)"/liquibase,target=/liquibase/changelog liquibase/liquibase "$@"
