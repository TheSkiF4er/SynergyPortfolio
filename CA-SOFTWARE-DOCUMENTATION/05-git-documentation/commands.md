# Справочник Git-команд

| Команда | Назначение |
|---|---|
| `git init` | Инициализация локального репозитория |
| `git clone URL` | Клонирование удалённого репозитория |
| `git status` | Состояние рабочего дерева и индекса |
| `git add PATH` | Добавление изменений в индекс |
| `git commit -m "..."` | Создание коммита |
| `git remote -v` | Просмотр remote |
| `git remote add origin URL` | Добавление remote |
| `git push -u origin BRANCH` | Первичная публикация ветви |
| `git pull --ff-only` | Получение изменений без неявного merge-коммита |
| `git log --oneline --graph --decorate --all` | Компактная история |
| `git show COMMIT` | Просмотр коммита |
| `git diff` | Незакоммиченные изменения |
| `git diff --cached` | Изменения в индексе |
| `git switch -c NAME` | Создание и переключение на ветвь |
| `git merge NAME` | Слияние ветви |
| `git revert COMMIT` | Безопасная отмена опубликованного коммита новым коммитом |
| `git reset --soft HEAD~1` | Перемещение HEAD с сохранением изменений в индексе |
| `git restore PATH` | Отмена локальных изменений файла |

## Типовой сценарий

```bash
git clone git@github.com:OWNER/REPO.git
cd REPO
git switch -c feature/example
# изменить файлы
git add .
git commit -m "Implement example"
git push -u origin feature/example
```

## Разрешение конфликта

1. Выполнить `git status` и определить конфликтующие файлы.
2. Открыть файл и выбрать корректное содержимое вместо маркеров `<<<<<<<`, `=======`, `>>>>>>>`.
3. Проверить приложение/документацию.
4. `git add <file>`.
5. `git commit` или `git merge --continue`.

## SSH

```bash
ssh-keygen -t ed25519 -C "student@example.com"
cat ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

Приватный ключ никогда не добавляется в Git.
