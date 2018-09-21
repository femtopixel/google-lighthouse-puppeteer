VERSION ?= v3.1.1-v1.7.0-0.3.4
CACHE ?= --no-cache=1
FULLVERSION ?= v3.1.1-v1.7.0-0.3.4
archs ?= amd64 i386 arm32v7
.PHONY: install install-npm publish-npm docker build-docker publish-docker latest version
all: install publish docker
	CACHE= make latest
docker: build-docker publish-docker
	CACHE= make latest
install:
	docker run --rm -v `pwd`:/app -ti -w /app node make install-npm
publish:
	docker run --rm -v `pwd`:/app -ti -w /app node make publish-npm
major:
	docker run --rm -v $$HOME:/root -v `pwd`:/app -ti -w /app node npm version major
minor:
	docker run --rm -v $$HOME:/root -v `pwd`:/app -ti -w /app node npm version minor
patch:
	docker run --rm -v $$HOME:/root -v `pwd`:/app -ti -w /app node npm version patch
clean:
	touch t.tgz
	rm *.tgz
	rm -Rf node_modules
install-npm: clean
	npm pack
publish-npm: install-npm
	npm login && npm publish
build-docker:
	$(foreach arch,$(archs), \
		cat Dockerfile | sed -E "s/FROM femtopixel\/google-lighthouse:(.+)/FROM femtopixel\/google-lighthouse:\1-$(arch)/g" > .build; \
		if [ $(arch) = arm32v7 ]; then \
			docker build -t femtopixel/google-lighthouse-puppeteer:${VERSION}-$(arch) --build-arg ARM=1 -f .build ${CACHE} .;\
		else \
			docker build -t femtopixel/google-lighthouse-puppeteer:${VERSION}-$(arch) --build-arg ARM=0 -f .build ${CACHE} .;\
		fi;\
	)
publish-docker:
	docker push femtopixel/google-lighthouse-puppeteer
	cat manifest.yml | sed "s/\$$VERSION/${VERSION}/g" > manifest2.yaml
	cat manifest2.yaml | sed "s/\$$FULLVERSION/${FULLVERSION}/g" > manifest.yaml
	manifest-tool push from-spec manifest.yaml
latest: build-docker
	cat manifest.yml | sed "s/\$$VERSION/${VERSION}/g" > manifest2.yaml
	cat manifest2.yaml | sed "s/\$$FULLVERSION/latest/g" > manifest.yaml
	manifest-tool push from-spec manifest.yaml
