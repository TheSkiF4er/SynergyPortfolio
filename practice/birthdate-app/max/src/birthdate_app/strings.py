"""String constants and simple i18n helpers."""

from __future__ import annotations

from typing import Final

STRINGS: Final[dict[str, dict[str, str]]] = {
    "ru": {
        "results": "Результаты",
        "birth_date": "Дата рождения",
        "weekday": "День недели",
        "leap": "Високосный год",
        "age": "Возраст",
        "yes": "Да",
        "no": "Нет",
        "years": "лет",
        "styled": "Дата рождения в стилизованном виде",
        "interactive": "Интерактивный режим (повтор ввода до корректной даты).",
        "menu_title": "Меню",
        "menu_run": "1) Ввести дату и получить результат",
        "menu_batch": "2) Пакетная обработка (CSV/JSON)",
        "menu_history": "3) Показать историю",
        "menu_gui": "4) Запустить GUI (Tkinter)",
        "menu_web": "5) Запустить Web (Django devserver)",
        "menu_exit": "0) Выход",
        "choose": "Выберите пункт: ",
    },
    "en": {
        "results": "Results",
        "birth_date": "Birth date",
        "weekday": "Weekday",
        "leap": "Leap year",
        "age": "Age",
        "yes": "Yes",
        "no": "No",
        "years": "years",
        "styled": "Styled birth date",
        "interactive": "Interactive mode (repeat until a valid date is provided).",
        "menu_title": "Menu",
        "menu_run": "1) Enter a date and show result",
        "menu_batch": "2) Batch processing (CSV/JSON)",
        "menu_history": "3) Show history",
        "menu_gui": "4) Launch GUI (Tkinter)",
        "menu_web": "5) Run Web (Django devserver)",
        "menu_exit": "0) Exit",
        "choose": "Choose: ",
    },
}


def t(lang: str, key: str) -> str:
    """Translate *key* for *lang*, falling back to Russian."""
    return STRINGS.get(lang, STRINGS["ru"]).get(key, STRINGS["ru"].get(key, key))
