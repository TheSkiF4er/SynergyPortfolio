# Completion report

## Что добавлено

- `CA-OS` — Bash/C: загрузка/очистка файлов, потоки ввода-вывода, Unix/TCP sockets, процессы, zombie process, pthreads.
- `CA-NET` — 10 сетевых лабораторных (3–12) с адресацией, Cisco IOS-конфигурациями и командами верификации.
- `CA-JS` — 20 домашних заданий JavaScript, включая browser APIs, async, storage, OOP, modules, regexp и code principles.
- `CA-REACT` — 9 отдельных React-заданий по условиям курса.
- `CA-UIUX` — 13 промежуточных практик, SVG-макеты, brief/testing/handoff материалы.
- `CA-ARCH` — единый MarketHub case: стек, C4/UML/ER, frontend architecture, REST/GraphQL/gRPC, 12 паттернов, ТЗ, SDLC и итоговая архитектура.
- корневые `.gitignore`, `CONTRIBUTING.md`, `SECURITY.md`, CI, навигация и статус выполнения.

## Исправлено в существующих работах

- `CS1PLUS` / `CS1MAX`: deprecated `datetime.utcnow()` заменён на timezone-aware UTC.
- `CS3MAX`: единая API-валидация, корректная обработка `limit`, инвалидация кэша после CRUD.
- `CS4MAX`: десятичная запятая больше не конфликтует с batch-разделителем; массивы разделяются пробелом/`;`.
- `CA-JSTS1MAX`: ID только с цифрами 1–9, capacity учитывает размер команды, импорт получает runtime shape validation, добавлен `typecheck`.

## Выполненные локальные проверки

- `CA-OS`: GCC `-Wall -Wextra -Wpedantic` + smoke — **OK**.
- `CA-JS`: Node test — **3/3 OK**.
- `CS1PLUS`: pytest — **9/9 OK**.
- `CS1MAX`: pytest — **12/12 OK**.
- `CS4MAX`: core smoke — **OK**.
- `CA-ARCH/patterns`: TypeScript compile + Node tests — **3/3 OK**.
- `CA-ARCH REST`: CRUD smoke — **OK**.
- `CA-ARCH gRPC`: Create/Get/List/Update/Delete — **OK**.
- Python source compilation — **OK**.

## Что не удалось выполнить в текущем окружении

- `CS3MAX` runtime tests: Django/DRF отсутствуют в окружении, а сеть для установки зависимостей недоступна. Исходники компилируются; зависимости перечислены в проекте.
- `CA-ARCH GraphQL` runtime test: `graphql-core` отсутствует, сеть для установки недоступна. Реализация, SDL и dependency manifest приложены.
- React production builds не запускались без `node_modules`; package manifests и исходники проверены на структуру/JSON.

См. `ASSIGNMENT_STATUS.md` для внешних Figma/GNS3/Google Forms/video шагов.
