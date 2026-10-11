# Synergy Portfolio

Личный репозиторий учебных проектов, практических работ и инженерных кейсов. Структура ориентирована на публичный GitHub: названия каталогов описывают содержание проектов.

> Исходные методические материалы института не публикуются. В репозитории находятся только собственные решения, код, схемы, отчёты и воспроизводимые артефакты.

## Что посмотреть в первую очередь

| Проект | Что демонстрирует | Путь |
|---|---|---|
| **SprintNova Control** | React + TypeScript, управление спринтами, состояние, валидация, аналитика | [`assignments/programming/sprint-manager`](assignments/programming/sprint-manager) |
| **Software Architecture** | C4, UML, ER, REST, GraphQL, protobuf gRPC, design patterns | [`assignments/architecture/software-architecture`](assignments/architecture/software-architecture) |
| **PHP Authentication** | PHP, PDO, sessions, password hashing, access control | [`assignments/programming/php/17-authentication`](assignments/programming/php/17-authentication) |
| **Java Algorithms — Final Project** | Quick sort, binary search, collections, JSON processing | [`assignments/programming/java-algorithms/final-project`](assignments/programming/java-algorithms/final-project) |
| **CHANGEBODY** | UI/UX research, user flow, prototypes and handoff | [`assignments/design/changebody`](assignments/design/changebody) |

## Структура

```text
.
├── practice/                   # учебная практика
│   ├── birthdate-app/
│   ├── counter-app/
│   ├── greeting-app/
│   ├── calculator/
│   └── project-review/
│
├── assignments/                # учебные задания по дисциплинам
│   ├── programming/
│   ├── systems/
│   ├── architecture/
│   └── design/
│
├── docs/                       # карта репозитория, статусы и отчёты
└── .github/workflows/          # автоматические проверки
```

У проектов учебной практики и крупных итоговых кейсов могут быть уровни:

- `base` — исходное решение по условиям задания;
- `plus` — расширенная версия;
- `max` — наиболее полная инженерная версия.

Подробная карта: [`docs/REPOSITORY_MAP.md`](docs/REPOSITORY_MAP.md).

## Учебная практика

| Проект | Версии | Технологии |
|---|---|---|
| [Birthdate App](practice/birthdate-app) | base / plus / max | Python, CLI, Django, tests, Docker |
| [Counter App](practice/counter-app) | base / plus / max | JavaScript, reducer/store, Jest/Playwright |
| [Greeting App](practice/greeting-app) | base / plus / max | Django, DRF, cache, Docker |
| [Calculator](practice/calculator) | base / plus / max | JavaScript, Web Worker, tests |
| [Project Review](practice/project-review) | base / plus / max | technical and product analysis |

## Учебные задания

### Programming

- [JavaScript](assignments/programming/javascript) — 20 заданий;
- [PHP](assignments/programming/php) — 17 заданий;
- [Java: структуры и алгоритмы](assignments/programming/java-algorithms) — 10 заданий + итоговый проект;
- [Java: основы программирования](assignments/programming/java-fundamentals) — 12 тем + 3 итоговых проекта;
- [React](assignments/programming/react) — 9 заданий;
- [Sprint Manager](assignments/programming/sprint-manager) — итоговый React-проект.

### Systems

- [Operating Systems](assignments/systems/operating-systems) — Bash, C, процессы, потоки, sockets;
- [Networking](assignments/systems/networking) — Cisco IOS configurations, routing, ACL, VLAN, NAT, IPv6, RIP, OSPF, GRE.

### Architecture & Documentation

- [Software Architecture](assignments/architecture/software-architecture) — C4, UML, ER, API styles, patterns;
- [Software Documentation](assignments/architecture/software-documentation) — эксплуатационная документация, Git-практикум, технические задания.

### Design

- [UI/UX Exercises](assignments/design/ui-ux) — композиция, сетки, типографика, research, testing, handoff;
- [CHANGEBODY](assignments/design/changebody) — mobile UI/UX case study;
- [Bank Website Redesign](assignments/design/bank-website-redesign) — responsive banking website case study.

## Проверки

Основные локальные проверки объединены в корневом `Makefile`:

```bash
make test-core
make test-practice
make test-docs
```

Отдельные команды и требования окружения описаны в README соответствующих проектов. GitHub Actions выполняет Python, JavaScript, PHP, Java (алгоритмы и основы), архитектурные API/patterns и React build checks.

## Статус выполнения

- Сводка по дисциплинам: [`docs/ASSIGNMENT_STATUS.md`](docs/ASSIGNMENT_STATUS.md)
- Результаты и ограничения проверок: [`docs/COMPLETION_REPORT.md`](docs/COMPLETION_REPORT.md)
- Внешние действия, которые нельзя достоверно заменить локальными файлами: [`docs/EXTERNAL_DELIVERABLES.md`](docs/EXTERNAL_DELIVERABLES.md)

## Безопасность и лицензирование

Реальные секреты, персональные данные участников исследований, проприетарные сетевые образы и исходные методические PDF не должны попадать в Git.

Код и собственные материалы репозитория распространяются на условиях [`LICENSE`](LICENSE). Сторонние бренды и товарные знаки принадлежат соответствующим правообладателям.
