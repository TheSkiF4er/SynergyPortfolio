# ДЗ 1 — Краткий обзор необходимых инструментов

## Контекст
MarketHub — marketplace с каталогом, корзиной, заказами, оплатой, кабинетами продавца/покупателя и поиском.

## Выбор
- Frontend: **React + TypeScript + Vite** — компонентная модель, типизация, развитая экосистема.
- Backend: **Node.js + NestJS** — DI/modules/OpenAPI, удобно разделять bounded contexts.
- Primary DB: **PostgreSQL** — транзакции, constraints, JSONB, FTS baseline.
- Cache/session: **Redis**.
- Async: **RabbitMQ** для domain events и тяжёлых задач.
- Search: PostgreSQL FTS на старте, **OpenSearch** при росте каталога.
- Object storage: S3-compatible.
- Observability: OpenTelemetry + Prometheus + Grafana.
- Containerization: Docker Compose → Kubernetes при необходимости.

## Альтернативы
Django/FastAPI сильны, но единый TypeScript-stack уменьшает переключение контекста команды. MongoDB не выбран primary DB из-за транзакционной природы order/payment. Kafka избыточен на ранней стадии — RabbitMQ проще для command/event workflow.
