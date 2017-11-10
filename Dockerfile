FROM femtopixel/google-lighthouse

MAINTAINER Jay MOULIN <jaymoulin@gmail.com> <https://twitter.com/moulinjay>

RUN mkdir -p /home/chrome/testcases && cd /home/chrome && yarn add puppeteer lighthouse-batch
COPY entrypoint.sh /usr/bin/entrypoint
COPY lighthouse-puppeteer.js /home/chrome/lighthouse-puppeteer.js
WORKDIR /home/chrome
VOLUME /home/chrome/testcases

ENTRYPOINT ["entrypoint"]
