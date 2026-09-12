# ДЗ 7 — Техническое задание на создание АИС «MarketHub»

Документ оформлен как учебное ТЗ на автоматизированную систему. ГОСТ 34.201-2020 задаёт виды, комплектность и обозначение документов; структура содержания ТЗ сопоставлена с ГОСТ 34.602-2020 «Техническое задание на создание автоматизированной системы».

## 1. Общие сведения

- Полное наименование: автоматизированная информационная система электронной торговли «MarketHub».
- Условное обозначение: **MH**.
- Заказчик/исполнитель: учебный проект; роли уточняются в листе согласования при реальном внедрении.
- Основание: учебное задание по дисциплине «Принципы проектирования и развития архитектуры программного обеспечения».
- Плановый результат: MVP web-marketplace и комплект проектной документации.
- Порядок оформления результатов: Git, C4/UML/ER, OpenAPI, GraphQL SDL, Protocol Buffers, инструкции запуска и приёмки.

## 2. Назначение и цели создания системы

### 2.1 Назначение
Автоматизация публикации товаров, поиска, корзины, оформления и оплаты заказов, работы продавцов и модерации.

### 2.2 Цели и измеримые показатели
- медиана пути «поиск → checkout» — не более 5 пользовательских шагов после выбора товара;
- доступность MVP в рабочее окно — не менее 99.5% (целевой показатель, исключая согласованные окна обслуживания);
- p95 чтения каталога ≤ 500 ms, записи ≤ 800 ms при согласованном профиле нагрузки;
- отсутствие критических дефектов уровня blocker/critical к приёмке;
- восстановление после резервной копии: RPO ≤ 24 h, RTO ≤ 4 h для MVP.

## 3. Характеристика объекта автоматизации

Marketplace работает 24/7. Роли: `visitor`, `buyer`, `seller`, `moderator`, `admin`. Основные объекты: User, Seller, Product, Category, Cart, Order, OrderItem, Payment, Shipment, Review. Внешние системы: payment provider, delivery provider, e-mail/SMS/push provider. Ограничение MVP: платёжные реквизиты банковских карт в MarketHub не сохраняются.

## 4. Требования к автоматизированной системе

### 4.1 Требования к структуре и функционированию
- архитектурный стиль: modular monolith с документированными bounded modules;
- stateless HTTP API; PostgreSQL — source of truth;
- Redis — cache/session/rate-limit use cases;
- интеграционные события через transactional outbox, затем broker при необходимости;
- модули: Identity, Catalog, Search, Cart, Orders, Payments, Delivery, Notifications, Moderation;
- отказы внешних провайдеров не должны нарушать сохранённое состояние заказа.

### 4.2 Требования к персоналу и режиму работы
- пользовательская часть — круглосуточно;
- административные операции доступны ролям moderator/admin;
- эксплуатация требует доступа к логам, метрикам, backup/restore runbook;
- минимум две роли сопровождения: application operator и system administrator (в малом проекте могут совмещаться).

### 4.3 Показатели назначения
- каталог поддерживает pagination, filter/sort и стабильные identifiers;
- checkout идемпотентен по client request key;
- повтор webhook не создаёт дубль оплаты/заказа;
- поиск сохраняет базовую работоспособность без OpenSearch через PostgreSQL fallback в MVP.

### 4.4 Надёжность
- health/readiness checks;
- graceful shutdown;
- ежедневное резервное копирование БД с периодической restore-проверкой;
- retry только для идемпотентных операций;
- transactional outbox для событий;
- журналирование ошибок с correlation/request ID.

### 4.5 Безопасность
- TLS для внешних соединений;
- парольные хэши Argon2id/bcrypt;
- secrets вне Git;
- RBAC и deny-by-default для административных действий;
- rate limiting login/checkout/webhooks;
- audit log модерации и изменения привилегий;
- webhook signatures и replay protection;
- валидация входных DTO; parameterized SQL/ORM;
- хранение только provider payment identifiers, без card PAN/CVV.

### 4.6 Эргономика и accessibility
Semantic HTML, keyboard navigation, visible focus, связанные labels/errors, touch target не менее 44×44 px для ключевых действий. Ориентир — WCAG 2.1 AA.

### 4.7 Транспортабельность и эксплуатация
Компоненты поставляются Linux containers. Конфигурация — environment variables/secrets. Миграции БД версионированы и выполняются до переключения трафика либо backward-compatible способом.

### 4.8 Информационное обеспечение
- PostgreSQL migrations;
- UUID/ULID либо другой документированный stable ID;
- timestamps в UTC;
- уникальные ограничения SKU/seller scope согласно бизнес-правилам;
- деньги — decimal/minor units, не IEEE floating point в production domain;
- retention и очистка технических логов задаются эксплуатационной политикой.

### 4.9 Программное обеспечение
Frontend: React + TypeScript. Backend: NestJS + TypeScript. PostgreSQL, Redis, S3-compatible storage; RabbitMQ и OpenSearch подключаются при подтверждённой необходимости. Контракты: REST/OpenAPI, GraphQL и gRPC/Protocol Buffers для учебного сравнения транспортов.

### 4.10 Техническое обеспечение
Dev baseline: 4 vCPU, 8 GB RAM, 20 GB свободного диска. Production sizing определяется нагрузочными испытаниями. Должны быть предусмотрены TLS termination, persistent DB/storage, резервное хранилище и централизованный monitoring.

## 5. Состав и содержание работ по созданию системы

1. Discovery и уточнение требований.
2. Архитектура и ADR.
3. Data model/API contracts.
4. MVP: Identity, Catalog, Cart, Orders.
5. Payment/Delivery/Notification adapters.
6. Moderation и audit.
7. Hardening: security, observability, backup/restore.
8. Acceptance testing.
9. Deployment/runbook и передача в эксплуатацию.

Для каждого этапа результатом является проверяемый artifact: документ, контракт, код, test report или runbook.

## 6. Порядок разработки и организации работ

Git feature branches/PR review. Definition of Done: код review, unit/integration tests, актуальные контракты, migration notes, отсутствие secrets. Breaking API changes требуют versioning/migration plan. Архитектурно значимые решения фиксируются ADR.

## 7. Порядок контроля и приёмки

### 7.1 Виды проверок
Unit, integration, e2e, API contract, migration, security baseline, backup/restore smoke, load smoke.

### 7.2 Приёмочные сценарии
1. Регистрация и вход пользователя.
2. Seller создаёт и публикует товар.
3. Buyer выполняет поиск/фильтр и открывает карточку.
4. Добавление в cart и checkout.
5. Payment success и payment failure/retry.
6. Просмотр истории заказа.
7. Seller видит заказ.
8. Moderator скрывает нарушающий товар; событие попадает в audit log.
9. Повторный payment webhook не создаёт дубликат.
10. Восстановление БД из тестовой backup-копии.

### 7.3 Критерии приёмки
Все обязательные сценарии пройдены; critical/blocker defects отсутствуют; контракты соответствуют реализации; migrations выполняются на чистой и предыдущей поддерживаемой версии БД; эксплуатационная документация доступна.

## 8. Требования к подготовке объекта автоматизации к вводу

Подготовить production environment, DNS/TLS, secrets, database/storage, migrations, backup schedule, dashboards/alerts, initial admin, provider credentials и runbook. Провести smoke test после deployment и контроль восстановления backup в изолированном окружении.

## 9. Требования к документированию

Комплект проекта: README, ТЗ, C4 Context/Container/Component, UML, ER, OpenAPI, GraphQL SDL, `.proto`, ADR, deployment/runbook, migration/backup instructions, user/admin notes. ГОСТ 34.201-2020 используется как ориентир по видам и комплектности документов, ГОСТ 34.602-2020 — по ТЗ.

## 10. Источники разработки

- материалы учебной дисциплины;
- ГОСТ 34.201-2020;
- ГОСТ 34.602-2020;
- C4 Model, UML;
- официальная документация выбранных технологий.

## Приложение А — трассировка требований

| ID | Требование | Компонент | Проверка |
|---|---|---|---|
| ID-01 | регистрация/RBAC | Identity | auth integration + authorization tests |
| CAT-01 | Product CRUD | Catalog | REST/GraphQL/gRPC integration tests |
| SRCH-01 | поиск/фильтр | Catalog/Search | acceptance + performance smoke |
| ORD-01 | cart/checkout | Cart/Orders | e2e checkout |
| PAY-01 | payment idempotency | Payment adapter | repeated webhook contract test |
| MOD-01 | moderation/audit | Moderation | authorization + audit integration test |
| OPS-01 | backup/restore | PostgreSQL/Runbook | restore smoke |
| NFR-01 | p95 targets | API | load smoke |

## Приложение Б — связанный комплект

`03-system-modeling.md`, `05-api.md`, `api/`, `09-final-project.md`, ER/UML/C4 и runbook requirements составляют связанный учебный комплект проектной документации.
