# ДЗ 2 — Обзор архитектурных стилей ИС

Для MarketHub выбран **модульный монолит + отдельные инфраструктурные контейнеры**. Такой старт сохраняет транзакционную целостность core-домена и не вводит раннюю распределённую сложность. При росте Search, Notifications, Media и Payments могут быть извлечены в отдельные сервисы.

## C4 Context
```mermaid
flowchart LR
Buyer[Покупатель] --> MH[MarketHub]
Seller[Продавец] --> MH
Admin[Администратор] --> MH
MH --> PSP[Платёжный провайдер]
MH --> Delivery[Служба доставки]
MH --> Mail[Email/SMS provider]
```

## C4 Containers
На диаграмме больше пяти контейнеров, как требует критерий задания.
```mermaid
flowchart TB
Web[1. Web SPA / React] --> API[2. Application API / NestJS]
API --> PG[(3. PostgreSQL)]
API --> Redis[(4. Redis)]
API --> MQ[(5. RabbitMQ)]
Worker[6. Background Worker] --> MQ
Worker --> PG
API --> Search[(7. OpenSearch)]
API --> S3[(8. S3 object storage)]
API --> PSP[External PSP]
Worker --> Mail[External notifications]
```

## Components: Web SPA
```mermaid
flowchart LR
Router --> Pages
Pages --> Features
Features --> Entities
Features --> ApiClient
ApiClient --> API[Application API]
```
Компоненты: Router, Pages, Feature modules, Entity model, API client.

## Components: Application API
```mermaid
flowchart LR
Controllers --> UseCases
UseCases --> Domain
UseCases --> Repositories
UseCases --> EventOutbox
Repositories --> PG[(PostgreSQL)]
EventOutbox --> MQ[(RabbitMQ)]
```

## Components: PostgreSQL
```mermaid
flowchart LR
Schemas --> Tables
Tables --> Constraints
Tables --> Indexes
Tables --> Outbox[Outbox table]
```

## Components: Redis
```mermaid
flowchart LR
Keyspace --> Cache
Keyspace --> RateLimit
Keyspace --> Sessions
```

## Components: RabbitMQ
```mermaid
flowchart LR
Exchange --> OrderQ[order.events]
Exchange --> NotifyQ[notifications]
Exchange --> SearchQ[search.index]
```

## Components: Background Worker
```mermaid
flowchart LR
Consumer --> NotificationHandler
Consumer --> SearchIndexer
Consumer --> CleanupJobs
```

## Components: OpenSearch
```mermaid
flowchart LR
ProductsIndex --> Analyzer
ProductsIndex --> Filters
ProductsIndex --> Suggest
```

## Components: S3
```mermaid
flowchart LR
UploadPolicy --> ProductMedia
UploadPolicy --> Avatars
UploadPolicy --> Lifecycle
```

## Взаимодействия и обоснование
Синхронные пользовательские команды идут Web → API. Транзакционные данные записываются в PostgreSQL; доменные события сначала фиксируются в transactional outbox, затем отправляются в RabbitMQ. Worker обрабатывает уведомления и поисковую индексацию. Redis — ускоритель и не является единственным источником критичных данных. OpenSearch — производная поисковая модель с eventual consistency. S3 хранит бинарные объекты, PostgreSQL — их метаданные и права владения.

Минусы выбранного стиля: API и shared DB поначалу масштабируются крупнее целиком. Компенсации: строгие module boundaries, read replicas, query/index tuning и заранее определённые seams для извлечения сервисов только по фактической нагрузке или организационным границам.
