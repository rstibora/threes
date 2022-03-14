#!/bin/bash

# possibly useful flags:
# - --project threes
# - --address 0.0.0.0 (for hasura console)

docker run --rm -p 9695:9695 -p 9693:9693 --network threes_threes-network --name threes-hasura-cli-service \
           --mount type=bind,source="$(cd $(dirname $0) && pwd)"/threes,target=/threes threes_threes-hasura-cli-service \
           "$@"
