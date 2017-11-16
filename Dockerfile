FROM femtopixel/google-lighthouse

MAINTAINER Jay MOULIN <jaymoulin@gmail.com> <https://twitter.com/moulinjay>

#https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
RUN mkdir -p /home/chrome/testcases && cd /home/chrome && yarn add google-lighthouse-puppeteer
COPY entrypoint.sh /usr/bin/entrypoint
COPY ./bin/lighthouse-puppeteer.js /home/chrome/bin/lighthouse-puppeteer
COPY ./lighthouse-puppeteer.js /home/chrome/lighthouse-puppeteer.js
WORKDIR /home/chrome
VOLUME /home/chrome/testcases
ENV PATH="/home/chrome/bin:${PATH}"
ENTRYPOINT ["entrypoint"]
