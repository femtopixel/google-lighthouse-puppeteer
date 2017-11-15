FROM femtopixel/google-lighthouse

MAINTAINER Jay MOULIN <jaymoulin@gmail.com> <https://twitter.com/moulinjay>

USER root
#https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install -g google-lighthouse-puppeteer --unsafe-perm=true
USER chrome
RUN mkdir -p /home/chrome/testcases && cd /home/chrome
COPY entrypoint.sh /usr/bin/entrypoint
WORKDIR /home/chrome
VOLUME /home/chrome/testcases

ENTRYPOINT ["entrypoint"]
