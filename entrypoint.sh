#!/bin/bash
set -e

if [[ -f "/home/chrome/testcases/$1.js" ]]; then
    set -- lighthouse-puppeteer "/home/chrome/testcases/$1.js" "${@:2}"
elif [ "${1#-}" != "$1" ]; then
    set -- lighthouse-puppeteer "$@"
fi

exec "$@"

