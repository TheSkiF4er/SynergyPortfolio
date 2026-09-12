# ДЗ 7 — Техническое задание MarketHub

Учебное ТЗ структурировано по логике ГОСТ 34.201-2020 и содержит основные разделы без искусственного наполнения.

## 1. Общие сведения
Наименование: автоматизированная информационная система «MarketHub». Условное обозначение: MH. Результат — MVP web-marketplace.

## 2. Назначение и цели
Автоматизация публикации, поиска, покупки, оплаты и управления заказами. Цели: сократить путь покупки, дать продавцу self-service кабинет и обеспечить управляемые платежи/модерацию.

## 3. Характеристика объекта автоматизации
Электронная торговая площадка 24/7. Роли: visitor, buyer, seller, moderator/admin. Внешние зависимости: payment, delivery и notification providers.

## 4. Требования к системе
### 4.1 Система в целом
Modular monolith с документированными boundaries; stateless API; PostgreSQL — source of truth.

### 4.2 Функции
Регистрация/authentication; RBAC; seller CRUD продукта; поиск/фильтры; корзина; checkout; payment status; история заказов; seller orders; moderation; notifications.

### 4.3 Информационное обеспечение
Версионируемые migrations, stable IDs, timestamps, ограничения целостности, money representation без floating-point ошибок в production-модели.

### 4.4 Программное обеспечение
React/TypeScript; NestJS/TypeScript; PostgreSQL; Redis; RabbitMQ; S3; OpenSearch по мере необходимости.

### 4.5 Техническое обеспечение
Linux containers. Dev baseline: 4 CPU/8 GB RAM. Production sizing определяется нагрузочными тестами.

### 4.6 Надёжность
Health checks, graceful shutdown, DB backups, transactional outbox, idempotent retries. MVP target RPO ≤ 24h, RTO ≤ 4h.

### 4.7 Безопасность
TLS, Argon2/bcrypt, secret storage вне git, RBAC, rate limiting, audit log, webhook signatures, отсутствие хранения card data.

### 4.8 Производительность
Target p95: read ≤500 ms, write ≤800 ms при согласованном nominal profile; pagination; контроль N+1.

### 4.9 UX/Accessibility
Keyboard navigation, visible focus, semantic HTML, связанные form errors; ориентир WCAG 2.1 AA.

## 5. Состав работ
Discovery → architecture → MVP → integrations → hardening → acceptance → deployment docs.

## 6. Порядок разработки
Git branches/PR review. Definition of Done: тесты, документация публичных контрактов, migration notes.

## 7. Контроль и приёмка
Unit/integration/e2e, API contract, security checks, migration test, load smoke. Приёмочные сценарии: регистрация; публикация товара; поиск; cart/checkout; payment success/failure; moderation.

## 8. Подготовка к вводу
Production environment, secrets, TLS/DNS, migrations, backup policy, dashboards, runbook.

## 9. Документирование
README, C4/UML/ER, OpenAPI/GraphQL/proto, ADR, deployment/runbook, user/admin instructions.

## 10. Источники
Материалы курса, C4 Model, UML, ГОСТ 34.201-2020 и официальная документация технологий.

## Приложение А — трассировка
| Требование | Компонент | Проверка |
|---|---|---|
| PRODUCT-CRUD | Catalog | integration tests |
| CHECKOUT | Orders | e2e checkout |
| PAYMENT | Payment adapter | idempotency/contract test |
| RBAC | Identity/API guards | authorization tests |
| SEARCH | Catalog/Search | acceptance test |

## Приложение Б — дополнительная документация
`03-system-modeling.md`, `api/`, `09-final-project.md` и runbook requirements образуют сопутствующий комплект проектной документации.
