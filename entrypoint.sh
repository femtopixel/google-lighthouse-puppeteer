#!/bin/bash
set -e

if [[ -f "/home/chrome/testcases/$1.js" ]]; then
    lighthouse-puppeteer "/home/chrome/testcases/$1.js" $2
else
    exec "$@"
fi

