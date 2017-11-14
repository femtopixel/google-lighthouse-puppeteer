FROM femtopixel/google-lighthouse

MAINTAINER Jay MOULIN <jaymoulin@gmail.com> <https://twitter.com/moulinjay>

RUN mkdir -p /home/chrome/testcases && cd /home/chrome && yarn add google-lighthouse-puppeteer
COPY entrypoint.sh /usr/bin/entrypoint
WORKDIR /home/chrome
VOLUME /home/chrome/testcases

ENTRYPOINT ["entrypoint"]
