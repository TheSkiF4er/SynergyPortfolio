#!/usr/bin/env bash
set -euo pipefail

work="${TMPDIR:-/tmp}/synergy-git-practice-$$"
trap 'rm -rf "$work"' EXIT
mkdir -p "$work"

printf '== init bare remote ==\n'
git init --bare -q "$work/remote.git"

printf '== create source repo and connect remote ==\n'
git init -q "$work/source"
cd "$work/source"
git config user.name "Synergy Practice"
git config user.email "practice@example.invalid"
printf 'Git practice\n' > README.md
git add README.md
git commit -q -m "Initial commit"
git branch -M main
git remote add origin "$work/remote.git"
git remote -v
git push -q -u origin main
git --git-dir="$work/remote.git" symbolic-ref HEAD refs/heads/main

printf '== clone remote ==\n'
cd "$work"
git clone -q remote.git clone
cd clone
git config user.name "Synergy Practice"
git config user.email "practice@example.invalid"
git remote -v

printf '== create branch ==\n'
git switch -q -c docs/software-documentation-practice
printf 'branch=%s\n' "$(git branch --show-current)"
printf 'head=%s\n' "$(git rev-parse --short HEAD)"
printf 'status=%s\n' "$(git status --porcelain | wc -l | tr -d ' ') changes"
