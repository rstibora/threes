#!/bin/bash

set -e


Help()
{
    echo "Basic CI script that is able to update the production server with the latest version."
    echo
    echo "Syntax: ci [-hp]"
    echo "options:"
    echo "h    Print this help."
    echo "p    Bump patch version."
}

Patch()
{
    # Workaround for https://github.com/npm/npm/issues/9111.
    mkdir ../frontend/.git
    ./preversion.sh
    npm --prefix ../frontend test
    npm --prefix ../frontend version patch
    ./version.sh
    ./postversion.sh
    rm -rf ../frontend/.git
}

Run()
{
    ./preversion.sh
    ./version.sh
    ./postversion.sh
}

while getopts "hp" option; do
   case $option in
      h) # display Help
         Help
         exit;;
      p) # bump version patch
        Patch
        exit;;
     \?) # incorrect option
         Help
         exit;;
   esac
done

if (( $OPTIND == 1 )); then
    Run
fi
