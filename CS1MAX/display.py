#!/usr/bin/env python3
"""Display helpers requested by spec.

The project already contains a full CLI/GUI/Web. This module keeps a small,
testable console formatting layer.
"""

from __future__ import annotations

from birthdate_app.strings import t
from birthdate_app.core import BirthdateResult


def format_result(result: BirthdateResult, *, lang: str = "ru") -> str:
    lines = [
        f"{t(lang,'birth_date')}: {result.birth_date.isoformat()}",
        f"{t(lang,'weekday')}: {result.weekday}",
        f"{t(lang,'leap')}: {t(lang,'yes') if result.is_leap_year else t(lang,'no')}",
        f"{t(lang,'age')}: {result.age_years} {t(lang,'years')}",
        "",
        t(lang,'styled') + ":",
        result.styled_date,
    ]
    return "\n".join(lines)
