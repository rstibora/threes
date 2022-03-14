#!/bin/bash

# Until https://github.com/hasura/graphql-engine/pull/3570 is resolved. Dockerized hasura-cli
# tries to connect to docker network as well as host network at the same time.

socat TCP-LISTEN:8080,fork TCP:threes-hasura-service:8080 & \
socat TCP-LISTEN:9695,fork,reuseaddr,bind=threes-hasura-cli-service TCP:127.0.0.1:9695 & \
socat TCP-LISTEN:9693,fork,reuseaddr,bind=threes-hasura-cli-service TCP:127.0.0.1:9693 & \
/hasuracli/hasura "$@"
