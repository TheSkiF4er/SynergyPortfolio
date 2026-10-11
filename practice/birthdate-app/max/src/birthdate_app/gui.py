"""Tkinter GUI."""

from __future__ import annotations

import logging
import tkinter as tk
from tkinter import messagebox, ttk
from datetime import date
from pathlib import Path

from .core import analyze_birthdate
from .history import add_entry, DEFAULT_DB_PATH
from .strings import t
from .validation import BirthdateValidationError, validate_birthdate, ValidationPolicy

log = logging.getLogger(__name__)


def launch_gui(*, lang: str = "ru") -> None:
    policy = ValidationPolicy()

    root = tk.Tk()
    root.title("Birthdate App")

    frm = ttk.Frame(root, padding=12)
    frm.grid(row=0, column=0, sticky="nsew")

    ttk.Label(frm, text="Day").grid(row=0, column=0, sticky="w")
    day_var = tk.StringVar()
    ttk.Entry(frm, textvariable=day_var, width=10).grid(row=0, column=1, sticky="w")

    ttk.Label(frm, text="Month").grid(row=1, column=0, sticky="w")
    month_var = tk.StringVar()
    ttk.Entry(frm, textvariable=month_var, width=10).grid(row=1, column=1, sticky="w")

    ttk.Label(frm, text="Year").grid(row=2, column=0, sticky="w")
    year_var = tk.StringVar()
    ttk.Entry(frm, textvariable=year_var, width=10).grid(row=2, column=1, sticky="w")

    ttk.Label(frm, text="User").grid(row=3, column=0, sticky="w")
    user_var = tk.StringVar(value="anonymous")
    ttk.Entry(frm, textvariable=user_var, width=20).grid(row=3, column=1, sticky="w")

    save_var = tk.BooleanVar(value=False)
    ttk.Checkbutton(frm, text="Save to history (SQLite)", variable=save_var).grid(
        row=4, column=0, columnspan=2, sticky="w", pady=(8, 0)
    )

    db_path = DEFAULT_DB_PATH

    result_txt = tk.Text(frm, width=60, height=12)
    result_txt.grid(row=6, column=0, columnspan=2, pady=(10, 0))

    def on_calc() -> None:
        try:
            day = int(day_var.get().strip())
            month = int(month_var.get().strip())
            year = int(year_var.get().strip())
            user = (user_var.get().strip() or "anonymous")
            birth_date = validate_birthdate(day, month, year, policy=policy)
            res = analyze_birthdate(birth_date, lang=lang)

            if save_var.get():
                add_entry(user, birth_date, db_path=db_path)

            lines = [
                f"{t(lang,'birth_date')}: {res.birth_date.isoformat()}",
                f"{t(lang,'weekday')}: {res.weekday}",
                f"{t(lang,'leap')}: {t(lang,'yes') if res.is_leap_year else t(lang,'no')}",
                f"{t(lang,'age')}: {res.age_years} {t(lang,'years')}",
                "",
                t(lang,'styled') + ":",
                res.styled_date,
            ]
            result_txt.delete("1.0", tk.END)
            result_txt.insert(tk.END, "\n".join(lines))
        except (ValueError, BirthdateValidationError) as e:
            log.error("GUI input error: %s", e)
            messagebox.showerror("Error", str(e))

    ttk.Button(frm, text="Calculate", command=on_calc).grid(row=5, column=0, pady=(10, 0), sticky="w")
    ttk.Button(frm, text="Quit", command=root.destroy).grid(row=5, column=1, pady=(10, 0), sticky="e")

    root.mainloop()
