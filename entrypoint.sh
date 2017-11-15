#!/bin/bash
set -e

if [[ -f "/home/chrome/testcases/$1.js" ]]; then
    lighthouse-puppeteer "/home/chrome/testcases/$1.js" "{puppeteer:{executablePath: 'google-chrome'}}"
else
    exec "$@"
fi

