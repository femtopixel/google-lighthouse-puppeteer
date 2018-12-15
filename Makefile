VERSION ?= 0.4.0
CACHE ?= --no-cache=1
FULLVERSION ?= 0.4.0
.PHONY: install install-npm publish-npm docker build-docker publish-docker latest version
all: install publish
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
