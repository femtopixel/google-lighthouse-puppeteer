#!/bin/bash
set -e

if [[ -f "testcases/$1.js" ]]; then
    node lighthouse-puppeteer.js $1
else
    exec "$@"
fi

