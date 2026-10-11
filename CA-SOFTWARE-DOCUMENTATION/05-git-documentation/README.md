# Тема 5 — Git, GitHub и Bitbucket

## Цель
Освоить создание удалённых репозиториев, подключение remote, клонирование и работу с ветвями.

## Выполнение пяти заданий

### 1. Пустой репозиторий GitHub
Текущий `SynergyPortfolio` предназначен для размещения на GitHub и может использоваться как основной репозиторий учебных решений. Для буквального подтверждения задания требуется URL фактически созданного GitHub-репозитория; URL не выдумывается внутри исходников.

### 2. Пустой репозиторий Bitbucket
Создание выполняется в личном Bitbucket-аккаунте: **Create repository → Repository name → Private/Public → Create repository**. После создания настоящий URL следует зафиксировать в `evidence/README.md`. Локальный архив не может достоверно создать внешний объект от имени владельца аккаунта.

### 3. Подключение к удалённому репозиторию
```bash
git init
git remote add origin <REAL_REMOTE_URL>
git remote -v
```

Для SSH:
```bash
ssh-keygen -t ed25519 -C "student@example.com"
ssh -T git@github.com
```

### 4. Клонирование
```bash
git clone <REAL_REMOTE_URL>
cd <repository>
git status
```

### 5. Новая ветвь
```bash
git switch -c docs/software-documentation
git status
git branch --show-current
```

После коммита:
```bash
git add .
git commit -m "Add software documentation assignments"
git push -u origin docs/software-documentation
```

## Дополнительные изученные операции
Сводка команд приведена в [`commands.md`](commands.md), пример исключений — в [`gitignore.example`](gitignore.example).

## Локальная воспроизводимая проверка

`run-local-demo.sh` фактически выполняет задания 3–5 на временном bare remote: подключает `origin`, выполняет push/clone и создаёт новую ветвь. Последний реальный результат сохранён в `evidence/local-git-transcript.txt`.

```bash
CA-SOFTWARE-DOCUMENTATION/05-git-documentation/run-local-demo.sh
```

## Статус
Задания 3–5 воспроизводимо выполнены локально с настоящими Git-операциями. Для буквального подтверждения заданий 1–2 остаётся создать отдельные репозитории в личных GitHub и Bitbucket аккаунтах и добавить реальные URL; они намеренно не подменяются фиктивными ссылками.
