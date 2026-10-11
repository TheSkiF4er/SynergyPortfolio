"""Core domain logic.

This module contains pure functions/classes for:
- weekday name lookup (RU/EN)
- leap year detection
- age calculation
- ASCII-art digit rendering for dates

No I/O in this module.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Final

WEEKDAYS: Final[dict[str, list[str]]] = {
    "ru": [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье",
    ],
    "en": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ],
}


def is_leap_year(year: int) -> bool:
    """Return True if *year* is a leap year in the Gregorian calendar."""
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


def weekday_name(d: date, lang: str = "ru") -> str:
    """Return weekday name for a given date in the requested language.

    Supported languages:
    - "ru"
    - "en"

    Falls back to "ru" for unknown languages.
    """
    names = WEEKDAYS.get(lang, WEEKDAYS["ru"])
    return names[d.weekday()]


def weekday_ru(d: date) -> str:
    """Backward compatible helper: weekday name in Russian."""
    return weekday_name(d, lang="ru")


def get_weekday(day: int, month: int, year: int, lang: str = "ru") -> str:
    """Возвращает день недели для указанной даты.

    Parameters
    ----------
    day, month, year:
        Components of the date.
    lang:
        Language code ("ru" or "en").

    Notes
    -----
    This function intentionally performs explicit range checks before
    constructing :class:`datetime.date` to provide clearer errors.
    """
    if not (1 <= month <= 12):
        raise ValueError("month must be in 1..12")
    if not (1 <= day <= 31):
        raise ValueError("day must be in 1..31")
    # date(...) will validate the concrete day/month combination (e.g. 31 April)
    d = date(year, month, day)
    return weekday_name(d, lang=lang)


def calculate_age(birth_date: date, today: date | None = None) -> int:
    """Calculate full years since *birth_date* as of *today* (defaults to current date)."""
    if today is None:
        today = date.today()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age


def digit_patterns() -> dict[str, list[str]]:
    """Return 5-row ASCII patterns for digits and space."""
    return {
        "0": [" *** ", "*   *", "*   *", "*   *", " *** "],
        "1": ["  *  ", " **  ", "  *  ", "  *  ", " *** "],
        "2": [" *** ", "*   *", "   * ", "  *  ", "*****"],
        "3": [" *** ", "    *", " *** ", "    *", " *** "],
        "4": ["*   *", "*   *", "*****", "    *", "    *"],
        "5": ["*****", "*    ", "**** ", "    *", "**** "],
        "6": [" *** ", "*    ", "**** ", "*   *", " *** "],
        "7": ["*****", "    *", "   * ", "  *  ", " *   "],
        "8": [" *** ", "*   *", " *** ", "*   *", " *** "],
        "9": [" *** ", "*   *", " ****", "    *", " *** "],
        " ": ["     ", "     ", "     ", "     ", "     "],
    }


def render_styled_date(d: date) -> str:
    """Render date as a multi-line string in ASCII-art.

    Format: 'DD MM YYYY' (spaces between parts) using 5-row patterns.
    """
    date_str = f"{d.day:02d} {d.month:02d} {d.year}"
    patterns = digit_patterns()
    lines: list[str] = []
    for row in range(5):
        line = ""
        for ch in date_str:
            if ch not in patterns:
                raise ValueError(f"Unsupported character in date string: {ch!r}")
            line += patterns[ch][row] + "  "
        lines.append(line.rstrip())
    return "\n".join(lines)


@dataclass(frozen=True, slots=True)
class BirthdateResult:
    """Computed information about a birthdate."""

    birth_date: date
    weekday: str
    weekday_ru: str
    is_leap_year: bool
    age_years: int
    styled_date: str
    lang: str = "ru"


def analyze_birthdate(birth_date: date, today: date | None = None, *, lang: str = "ru") -> BirthdateResult:
    """Compute weekday, leap-year flag, age, and ASCII-art for *birth_date*."""
    wd = weekday_name(birth_date, lang=lang)
    wd_ru = weekday_ru(birth_date)
    leap = is_leap_year(birth_date.year)
    age = calculate_age(birth_date, today=today)
    styled = render_styled_date(birth_date)
    return BirthdateResult(
        birth_date=birth_date,
        weekday=wd,
        weekday_ru=wd_ru,
        is_leap_year=leap,
        age_years=age,
        styled_date=styled,
        lang=lang,
    )
