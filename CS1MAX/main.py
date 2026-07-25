#!/usr/bin/env python3
"""Project entry point requested by spec.

Prefer running:
- `python -m birthdate_app`
- or installed console script: `birthdate`
"""

from birthdate_app.cli import main

if __name__ == "__main__":
    raise SystemExit(main())
