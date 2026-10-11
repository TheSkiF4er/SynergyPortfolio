from pathlib import Path

ROOT = Path(__file__).resolve().parent
systems = ["warehouse", "clients", "suppliers", "accounting", "sales"]
operational = ["user-manual.md", "output-data-array.md", "database-catalog.md", "output-data-composition.md"]
specs = ["hr", "warehouse", "accounting", "clients", "applicants"]
expected = [ROOT / "README.md"]
for system in systems:
    expected += [ROOT / "03-operational-documentation" / system / f for f in operational]
expected += [
    ROOT / "03-operational-documentation" / "README.md",
    ROOT / "05-git-documentation" / "README.md",
    ROOT / "05-git-documentation" / "commands.md",
    ROOT / "05-git-documentation" / "gitignore.example",
    ROOT / "05-git-documentation" / "evidence" / "README.md",
    ROOT / "05-git-documentation" / "evidence" / "local-git-transcript.txt",
    ROOT / "05-git-documentation" / "run-local-demo.sh",
    ROOT / "06-technical-specifications" / "README.md",
]
expected += [ROOT / "06-technical-specifications" / s / "technical-specification.md" for s in specs]
missing = [str(p.relative_to(ROOT)) for p in expected if not p.is_file() or p.stat().st_size < (40 if p.name in {'gitignore.example','local-git-transcript.txt'} else 120 if p.name == 'run-local-demo.sh' else 300)]
if missing:
    raise SystemExit("Missing/too small documents:\n" + "\n".join(missing))
print(f"OK: {len(expected)} required documentation files present")
