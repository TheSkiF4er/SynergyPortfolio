# Synergy Portfolio — SkiF4er

Учебный репозиторий с практикой и заданиями института. Репозиторий организован по двум префиксам:

- **`CS*` — учебная практика** (самостоятельные практические проекты и их расширенные версии `PLUS` / `MAX`).
- **`CA-*` — учебные задания** по отдельным дисциплинам.

> Исходные методические PDF института намеренно не публикуются в репозитории. В папках находятся только выполненные решения, собственные отчёты и воспроизводимые материалы.

## Навигация

| Раздел | Назначение | Технологии |
|---|---|---|
| `CS1` / `PLUS` / `MAX` | Работа с датой рождения | Python, CLI, Django, tests, Docker |
| `CS2` / `PLUS` / `MAX` | Web counter | JavaScript, state/reducer, Playwright/Jest |
| `CS3` / `PLUS` / `MAX` | Greeting web app | Django, DRF, cache, Docker |
| `CS4` / `PLUS` / `MAX` | Calculator | JavaScript, Web Worker, tests |
| `CS5` / `PLUS` / `MAX` | Анализ предыдущих работ | Technical review / product analysis |
| `CA-JS` | 20 заданий курса JavaScript | JavaScript, Browser APIs, IndexedDB |
| `CA-REACT` | 9 заданий курса React | React 18, CRA/Vite, Router, hooks, forms/API |
| `CA-JSTS1*` | Итоговый React-проект SprintNova | React, TypeScript |
| `CA-OS` | Архитектуры ОС | Bash, C, processes, pthreads, sockets |
| `CA-NET` | Компьютерные сети | Cisco IOS configs, GNS3 lab guides |
| `CA-ARCH` | Архитектура ПО | C4, UML, ER, REST, GraphQL, gRPC, patterns |
| `CA-UIUX` | Промежуточные UI/UX-практики | UX research, UI kit, testing, handoff |
| `CA-DSGN1*` | Финальный UI/UX-кейс CHANGEBODY | UX/UI, prototype/handoff |
| `CA-DSGN2*` | Финальный UI/UX-кейс банка | UX/UI, responsive redesign |

## Быстрые проверки

```bash
# Системные задания
make -C CA-OS test

# JavaScript
node --test CA-JS/tests/*.test.mjs

# Архитектурные паттерны
npm --prefix CA-ARCH/patterns test
```

React-задания запускаются отдельно. Для `CA-REACT/02-environment` (Create React App) — `npm install && npm start`; для остальных — `npm install && npm run dev`.

Полное покрытие заданий и список внешних действий: [`ASSIGNMENT_STATUS.md`](ASSIGNMENT_STATUS.md). Результаты локальных проверок: [`COMPLETION_REPORT.md`](COMPLETION_REPORT.md).

## Ограничения воспроизводимости лабораторных

Для сетевых лабораторных приложены адресные планы, готовые Cisco IOS-конфигурации и команды проверки. Сам образ Cisco IOS не распространяется. GNS3-проект необходимо собрать на локальной установке с легально полученным образом, после чего вставить соответствующие конфигурации.

Для UI/UX приложены собственные артефакты, design tokens, HTML/SVG-прототипы и handoff-документация. Если преподаватель требует именно ссылку Figma, соответствующие экраны следует импортировать/пересобрать в личном Figma-проекте и добавить URL в указанное место — фиктивная ссылка в репозитории не создаётся.

## Лицензия

Код репозитория — см. `LICENSE`. Сторонние бренды и товарные знаки принадлежат их правообладателям.
