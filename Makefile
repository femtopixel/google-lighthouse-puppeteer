.PHONY=install install-npm publish publish-npm

install:
	docker run --rm -v `pwd`:/app -ti -w /app node make install-npm
publish:
	docker run --rm -v `pwd`:/app -ti -w /app node make publish-npm
install-npm:
	npm pack
publish-npm: install-npm
	npm login && npm publish
