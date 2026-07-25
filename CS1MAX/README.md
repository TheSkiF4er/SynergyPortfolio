# Birthdate App (CLI / GUI / Web)

Набор утилит для работы с датой рождения:
- строгая валидация ввода
- повторный ввод (interactive CLI)
- расчёт дня недели (RU), признака високосности, возраста
- ASCII-art вывод даты
- логирование
- история пользователей (SQLite для CLI/GUI, и отдельная история в Django для веб-версии)
- пакетная обработка (CSV/JSON)
- GUI (Tkinter)
- Web (Django)
- Docker + пример docker-compose
- CI (GitHub Actions)

## Быстрый старт (CLI)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
python -m birthdate_app run
```

Также можно передать аргументы:

```bash
birthdate run --day 1 --month 1 --year 2000 --save-history --user dima
```

Показать историю:

```bash
birthdate history --user dima --limit 20
```

## Пакетная обработка

Поддерживается входной CSV или JSON.

### CSV

Файл `input.csv`:

```csv
day,month,year,user
1,1,2000,dima
29,2,2004,olga
```

Запуск:

```bash
birthdate batch input.csv --out output.json
```

### JSON

`input.json`:

```json
[
  {"day": 1, "month": 1, "year": 2000, "user": "dima"},
  {"day": 29, "month": 2, "year": 2004}
]
```

## GUI (Tkinter)

```bash
birthdate gui
```

## Web (Django)

Установка зависимостей:

```bash
pip install -e .
pip install -r requirements.txt
```

Миграции и запуск:

```bash
cd web
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Откройте в браузере `http://localhost:8000/`.

## Docker

Сборка и запуск CLI:

```bash
docker build -t birthdate-app .
docker run --rm -it birthdate-app birthdate run --day 1 --month 1 --year 2000
```

Запуск веб-версии через docker-compose:

```bash
docker compose up --build
```

После этого веб будет доступен на `http://localhost:8000/`.

## Тесты

```bash
python -m unittest discover -v
```

## Примечания по архитектуре

- `birthdate_app/core.py` — чистая доменная логика
- `birthdate_app/validation.py` — строгая валидация и retry
- `birthdate_app/history.py` — SQLite история для CLI/GUI
- `birthdate_app/cli.py` — argparse + batch + команды
- `birthdate_app/gui.py` — Tkinter UI
- `web/` — Django проект + хранение истории в БД Django


## Структура проекта

- `src/birthdate_app/` — основная реализация (логика, CLI, GUI, история, валидация).
- `web/` — Django веб-версия.
- `tests/` — unit-тесты (unittest).
- `logic.py`, `display.py`, `main.py` — совместимость со структурой из ТЗ (обёртки над пакетом).
- `.github/workflows/ci.yml` — CI (запуск тестов/линтера).
- `Dockerfile`, `docker-compose.yml` — контейнеризация.
