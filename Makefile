.PHONY=install install-npm publish publish-npm

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
install-npm:
	npm pack
publish-npm: install-npm
	npm login && npm publish
