#!/bin/bash
set -e

if [[ -f "testcases/$1.js" ]]; then
    lighthouse-puppeteer $1
else
    exec "$@"
fi

