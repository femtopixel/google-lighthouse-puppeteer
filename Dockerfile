FROM femtopixel/google-lighthouse:v3.2.1

ARG VERSION="v3.2.1-v1.9.0-0.3.4"
LABEL maintainer="Jay MOULIN <jaymoulin@gmail.com> <https://twitter.com/MoulinJay>"
LABEL version="${VERSION}"

#https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
USER root
RUN apt-get update; apt-get install libgconf-2-4 -y && rm -Rf /var/lib/apt/lists/*
USER chrome
RUN mkdir -p /home/chrome/testcases && cd /home/chrome && yarn add google-lighthouse-puppeteer
COPY entrypoint.sh /usr/bin/entrypoint
COPY ./bin/lighthouse-puppeteer.js /home/chrome/bin/lighthouse-puppeteer
COPY ./lighthouse-puppeteer.js /home/chrome/lighthouse-puppeteer.js
WORKDIR /home/chrome
VOLUME /home/chrome/testcases
ENV PATH="/home/chrome/bin:${PATH}"
ENTRYPOINT ["entrypoint"]
