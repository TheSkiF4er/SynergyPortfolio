"""Command-line interface (argparse) with batch processing and history."""

from __future__ import annotations

import argparse
import csv
import json
import logging
import cProfile
import pstats
from dataclasses import asdict
from pathlib import Path
from typing import Any

from .core import analyze_birthdate
from .history import add_entry, list_entries, DEFAULT_DB_PATH
from .logging_config import configure_logging
from .strings import t
from .validation import (
    BirthdateValidationError,
    ValidationPolicy,
    prompt_birthdate_forever,
    validate_birthdate,
    parse_int,
)

log = logging.getLogger(__name__)


def _print_result(result, lang: str) -> None:
    print(f"\n{t(lang,'results')}:")
    print(f"{t(lang,'birth_date')}: {result.birth_date.isoformat()}")
    print(f"{t(lang,'weekday')}: {result.weekday}")
    print(f"{t(lang,'leap')}: {t(lang,'yes') if result.is_leap_year else t(lang,'no')}")
    print(f"{t(lang,'age')}: {result.age_years} {t(lang,'years')}")
    print(f"\n{t(lang,'styled')}:")
    print(result.styled_date)


def _load_batch(path: Path) -> list[dict[str, Any]]:
    if path.suffix.lower() == ".json":
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, list):
            raise ValueError("JSON должен быть списком объектов.")
        return [dict(x) for x in data]
    if path.suffix.lower() == ".csv":
        with path.open("r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            return [dict(r) for r in reader]
    raise ValueError("Поддерживаются только .csv и .json для пакетной обработки.")


def _batch_process(
    records: list[dict[str, Any]],
    policy: ValidationPolicy,
    save_user: str | None,
    db_path: Path,
    *,
    lang: str,
) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for idx, rec in enumerate(records, start=1):
        try:
            day = parse_int(str(rec.get("day", "")), "day")
            month = parse_int(str(rec.get("month", "")), "month")
            year = parse_int(str(rec.get("year", "")), "year")
            birth_date = validate_birthdate(day, month, year, policy=policy)
            res = analyze_birthdate(birth_date, lang=lang)
            payload = {
                "index": idx,
                "user": str(rec.get("user") or save_user or "anonymous"),
                **asdict(res),
            }
            payload["birth_date"] = res.birth_date.isoformat()
            out.append(payload)
            if save_user:
                add_entry(save_user, birth_date, db_path=db_path)
        except Exception as e:
            log.exception("Batch record failed (index=%s): %s", idx, e)
            out.append({"index": idx, "error": str(e), "raw": rec})
    return out


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="birthdate", description="Birthdate utility (CLI/GUI/Web).")
    p.add_argument("--lang", default="ru", choices=["ru", "en"], help="Language (ru/en)")

    sub = p.add_subparsers(dest="cmd", required=False)

    run = sub.add_parser("run", help="Run interactively or from arguments")
    run.add_argument("--day", type=int, help="Day of month (1-31)")
    run.add_argument("--month", type=int, help="Month (1-12)")
    run.add_argument("--year", type=int, help="Year (e.g. 1990)")
    run.add_argument("--user", default="anonymous", help="User identifier for history")
    run.add_argument("--save-history", action="store_true", help="Save query to SQLite history")
    run.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to history DB")
    run.add_argument("--log-level", default="INFO", help="Logging level (DEBUG/INFO/WARNING/ERROR)")
    run.add_argument("--profile", action="store_true", help="Run with cProfile (prints top stats)")

    batch = sub.add_parser("batch", help="Batch process input CSV/JSON")
    batch.add_argument("path", type=Path, help="Input .csv or .json with fields day,month,year,(user)")
    batch.add_argument("--out", type=Path, help="Output file (.json). If omitted prints to stdout")
    batch.add_argument("--user", default=None, help="Fallback user value")
    batch.add_argument("--save-history", action="store_true", help="Save each record to history (uses --user)")
    batch.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to history DB")
    batch.add_argument("--log-level", default="INFO", help="Logging level")
    batch.add_argument("--profile", action="store_true", help="Run with cProfile (prints top stats)")

    hist = sub.add_parser("history", help="Show saved history")
    hist.add_argument("--user", default=None, help="Filter by user")
    hist.add_argument("--limit", type=int, default=20, help="Number of entries")
    hist.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to history DB")
    hist.add_argument("--log-level", default="INFO", help="Logging level")

    sub.add_parser("gui", help="Launch GUI (Tkinter)")
    sub.add_parser("web", help="Run Django dev server")

    return p


def cmd_run(args: argparse.Namespace) -> int:
    configure_logging(args.log_level)
    policy = ValidationPolicy()
    lang = args.lang

    def _run() -> int:
        try:
            if args.day is None or args.month is None or args.year is None:
                print(f"{t(lang,'interactive')}\n")
                birth_date = prompt_birthdate_forever(policy=policy)
            else:
                birth_date = validate_birthdate(args.day, args.month, args.year, policy=policy)

            res = analyze_birthdate(birth_date, lang=lang)
            _print_result(res, lang)

            if args.save_history:
                add_entry(args.user, birth_date, db_path=args.db)
                print(f"\nSaved to history: {args.db}")
            return 0
        except BirthdateValidationError as e:
            log.error("Validation error: %s", e)
            print(f"Ошибка: {e}")
            return 2

    if args.profile:
        prof = cProfile.Profile()
        prof.enable()
        code = _run()
        prof.disable()
        ps = pstats.Stats(prof).sort_stats("cumulative")
        ps.print_stats(20)
        return code
    return _run()


def cmd_batch(args: argparse.Namespace) -> int:
    configure_logging(args.log_level)
    policy = ValidationPolicy()

    def _run() -> int:
        records = _load_batch(args.path)
        out = _batch_process(records, policy, args.user if args.save_history else None, args.db, lang=args.lang)
        payload = json.dumps(out, ensure_ascii=False, indent=2)
        if args.out:
            args.out.write_text(payload, encoding="utf-8")
            print(f"Wrote: {args.out}")
        else:
            print(payload)
        return 0

    if args.profile:
        prof = cProfile.Profile()
        prof.enable()
        code = _run()
        prof.disable()
        pstats.Stats(prof).sort_stats("cumulative").print_stats(20)
        return code
    return _run()


def cmd_history(args: argparse.Namespace) -> int:
    configure_logging(args.log_level)
    entries = list_entries(user=args.user, limit=args.limit, db_path=args.db)
    if not entries:
        print("No history.")
        return 0
    for e in entries:
        print(f"[{e.created_at.isoformat(timespec='seconds')}] {e.user}: {e.birth_date.isoformat()}")
    return 0


def cmd_gui(args: argparse.Namespace) -> int:
    from .gui import launch_gui
    from .logging_config import configure_logging

    configure_logging("INFO")
    launch_gui(lang=args.lang)
    return 0


def cmd_web(args: argparse.Namespace) -> int:
    import os
    import subprocess

    env = os.environ.copy()
    env.setdefault("DJANGO_SETTINGS_MODULE", "birthdate_web.settings")
    cmd = ["python", "web/manage.py", "runserver"]
    return subprocess.call(cmd, env=env)


def interactive_menu(lang: str) -> int:
    parser = build_parser()
    while True:
        print(f"\n{t(lang,'menu_title')}:")
        print(t(lang,'menu_run'))
        print(t(lang,'menu_batch'))
        print(t(lang,'menu_history'))
        print(t(lang,'menu_gui'))
        print(t(lang,'menu_web'))
        print(t(lang,'menu_exit'))
        choice = input(t(lang,'choose')).strip()
        if choice == "0":
            return 0
        if choice == "1":
            ns = parser.parse_args(["--lang", lang, "run"])
            return cmd_run(ns)
        if choice == "2":
            path = input("Path to .csv/.json: ").strip()
            if not path:
                continue
            ns = parser.parse_args(["--lang", lang, "batch", path])
            return cmd_batch(ns)
        if choice == "3":
            ns = parser.parse_args(["history"])
            return cmd_history(ns)
        if choice == "4":
            ns = parser.parse_args(["--lang", lang, "gui"])
            return cmd_gui(ns)
        if choice == "5":
            ns = parser.parse_args(["web"])
            return cmd_web(ns)
        print("Unknown option.")


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    # If no subcommand was provided -> show a simple interactive menu.
    if args.cmd is None:
        return interactive_menu(args.lang)

    if args.cmd == "run":
        return cmd_run(args)
    if args.cmd == "batch":
        return cmd_batch(args)
    if args.cmd == "history":
        return cmd_history(args)
    if args.cmd == "gui":
        return cmd_gui(args)
    if args.cmd == "web":
        return cmd_web(args)
    parser.print_help()
    return 0
