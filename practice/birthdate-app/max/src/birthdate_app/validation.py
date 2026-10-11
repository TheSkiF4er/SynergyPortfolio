"""Input parsing and strict validation."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True, slots=True)
class ValidationPolicy:
    """Rules for birthdate validation."""

    min_year: int = 1900
    max_year: int | None = None  # defaults to current year
    allow_future_dates: bool = False


class BirthdateValidationError(ValueError):
    """Raised when user input cannot be parsed or does not satisfy validation rules."""


def parse_int(value: str, field: str) -> int:
    """Parse integer with clear error message."""
    value = value.strip()
    if value == "":
        raise BirthdateValidationError(f"Поле '{field}' не должно быть пустым.")
    try:
        return int(value)
    except ValueError as e:
        raise BirthdateValidationError(f"Поле '{field}' должно быть целым числом.") from e


def validate_birthdate(day: int, month: int, year: int, policy: ValidationPolicy | None = None) -> date:
    """Validate a (day, month, year) tuple and return a :class:`datetime.date`.

    Improvements (per requirements):
    - explicit range checks BEFORE constructing ``date(...)``
    - ``birth_date <= today`` enforcement by default
    - strict error messages for each field
    """
    if policy is None:
        policy = ValidationPolicy()

    today = date.today()
    max_year = policy.max_year if policy.max_year is not None else today.year

    if year < policy.min_year or year > max_year:
        raise BirthdateValidationError(f"Год должен быть в диапазоне {policy.min_year}..{max_year}.")

    if month < 1 or month > 12:
        raise BirthdateValidationError("Месяц должен быть в диапазоне 1..12.")

    if day < 1 or day > 31:
        raise BirthdateValidationError("День должен быть в диапазоне 1..31.")

    # datetime.date validates day/month combinations (e.g., 31 April)
    try:
        d = date(year, month, day)
    except ValueError as e:
        raise BirthdateValidationError("Некорректная дата.") from e

    if not policy.allow_future_dates and d > today:
        raise BirthdateValidationError("Дата рождения не может быть в будущем.")
    return d


def prompt_int_forever(prompt: str, field: str) -> int:
    """Prompt user for an integer until a valid value is provided."""
    while True:
        raw = input(prompt)
        try:
            return parse_int(raw, field)
        except BirthdateValidationError as e:
            print(f"Ошибка: {e}")


def prompt_birthdate_forever(*, policy: ValidationPolicy | None = None) -> date:
    """Interactive prompt loop that repeats until a correct date is entered."""
    if policy is None:
        policy = ValidationPolicy()

    print("Формат: DD.MM.YYYY  (например: 05.11.1994)")
    while True:
        day = prompt_int_forever("Введите день рождения (1-31): ", "day")
        month = prompt_int_forever("Введите месяц рождения (1-12): ", "month")
        year = prompt_int_forever(f"Введите год рождения ({policy.min_year}..): ", "year")
        try:
            return validate_birthdate(day, month, year, policy=policy)
        except BirthdateValidationError as e:
            print(f"Ошибка: {e}\nПопробуйте ещё раз.\n")
