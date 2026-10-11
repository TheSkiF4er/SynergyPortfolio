#!/usr/bin/env python3
"""Compatibility layer requested by spec.

This file exposes "logic" functions while real implementation lives in
`src/birthdate_app/`.
"""

from birthdate_app.core import (  # noqa: F401
    is_leap_year,
    calculate_age,
    weekday_name,
    weekday_ru,
    get_weekday,
    render_styled_date,
    analyze_birthdate,
    BirthdateResult,
)
