.PHONY: help test-core test-practice test-docs

PYTHON ?= python3

help:
	@printf '%s\n' \
	  'make test-core      # OS, JavaScript, PHP, Java algorithms' \
	  'make test-practice  # Python practice tests (requires pytest)' \
	  'make test-docs      # software-documentation completeness'

test-core:
	$(MAKE) -C assignments/systems/operating-systems test
	node --test assignments/programming/javascript/tests/solutions.test.mjs
	$(MAKE) -C assignments/programming/php test
	$(MAKE) -C assignments/programming/java-algorithms test

test-practice:
	$(PYTHON) -m pytest -q practice/birthdate-app/plus/tests
	$(PYTHON) -m pytest -q practice/birthdate-app/max/tests

test-docs:
	$(PYTHON) assignments/architecture/software-documentation/validate_docs.py
