.PHONY: lint test

lint:
	@find . -name '*.php' -type f -print0 | xargs -0 -n1 php -l >/dev/null
	@echo "PHP syntax: OK"

test: lint
	@php tests/run.php
