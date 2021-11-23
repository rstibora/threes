#!/bin/bash

set -e

changes=`ssh -i $HOME/.ssh/id_rsa threes@164.90.218.235 "git -C /home/threes/threes status --untracked-files=no --porcelain"`
if [ -n "$changes" ]; then
    echo "Git repository on the production server is not clean."
    exit 1
fi

npm test
