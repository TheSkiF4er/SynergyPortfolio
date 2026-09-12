# Итоговый проект — архитектура MarketHub

## Предметная область
Marketplace цифровых товаров и услуг. Пользователи регистрируются, просматривают товары, добавляют их в корзину, оформляют/оплачивают заказы и могут размещать собственные предложения. Архитектура учитывает рост транзакций, безопасность, fraud-controls, payment/delivery integrations и наблюдаемость.

## C4 Context
```mermaid
flowchart LR
Buyer[Buyer] --> M[MarketHub]
Seller[Seller] --> M
Admin[Admin] --> M
M --> PSP[Payment provider]
M --> Delivery[Delivery provider]
M --> Notify[Email/SMS]
```
## C4 Containers
```mermaid
flowchart TB
SPA[React SPA]-->API[Application API]
API-->PG[(PostgreSQL)]
API-->Redis[(Redis)]
API-->MQ[(RabbitMQ)]
Worker[Worker]-->MQ
Worker-->PG
API-->Search[(OpenSearch)]
API-->S3[(S3)]
```
## C4 Components
```mermaid
flowchart LR
Transport --> Identity
Transport --> Catalog
Transport --> Cart
Transport --> Orders
Orders --> PaymentPort
Catalog --> ProductRepo
Orders --> OrderRepo
Identity --> UserRepo
PaymentPort --> PSP[PSP Adapter]
```

## ER
```mermaid
erDiagram
USERS ||--o{ PRODUCTS : sells
USERS ||--o{ ORDERS : places
USERS ||--|| CARTS : owns
CARTS ||--|{ CART_ITEMS : contains
PRODUCTS ||--o{ CART_ITEMS : referenced
ORDERS ||--|{ ORDER_ITEMS : contains
PRODUCTS ||--o{ ORDER_ITEMS : referenced
ORDERS ||--o| PAYMENTS : paid_by
ORDERS ||--o| SHIPMENTS : delivered_by
```

# UML тип 1 — Sequence (3)
## Sequence 1: Checkout
```mermaid
sequenceDiagram
actor B as Buyer
B->>API: POST /checkout
API->>Orders: create pending
Orders->>PSP: authorize
PSP-->>Orders: success
Orders-->>B: paid order
```
## Sequence 2: Product publish
```mermaid
sequenceDiagram
actor S as Seller
S->>API: POST /products
API->>Catalog: validate/create
Catalog->>DB: INSERT
Catalog->>MQ: ProductChanged
MQ-->>Search: reindex
API-->>S: 201
```
## Sequence 3: Refund
```mermaid
sequenceDiagram
actor A as Admin/Seller
A->>API: refund request
API->>Orders: validate refundable
Orders->>PSP: refund
PSP-->>Orders: refunded
Orders->>MQ: OrderRefunded
API-->>A: updated order
```

# UML тип 2 — State (3)
## State 1: Order
```mermaid
stateDiagram-v2
[*]-->Pending
Pending-->Paid
Pending-->Cancelled
Paid-->Fulfilled
Paid-->Refunded
Fulfilled-->Refunded
```
## State 2: Product
```mermaid
stateDiagram-v2
[*]-->Draft
Draft-->Active: publish
Active-->Paused
Paused-->Active
Active-->Archived
Paused-->Archived
```
## State 3: Payment
```mermaid
stateDiagram-v2
[*]-->Created
Created-->Authorized
Created-->Failed
Authorized-->Captured
Authorized-->Cancelled
Captured-->Refunded
```

# UML тип 3 — Class (3)
## Class 1: Catalog
```mermaid
classDiagram
Product "*" --> "1" Seller
Product *-- Money
ProductRepository ..> Product
CatalogService --> ProductRepository
```
## Class 2: Orders
```mermaid
classDiagram
Order "1" *-- "1..*" OrderItem
Order --> Money
OrderService --> OrderRepository
OrderService --> PaymentGateway
```
## Class 3: Identity
```mermaid
classDiagram
User --> Role
IdentityService --> UserRepository
PasswordHasher <|.. ArgonPasswordHasher
IdentityService --> PasswordHasher
```

## Анализ схем и узких мест
- **PostgreSQL** — возможная write bottleneck. Сначала query/index tuning и read replicas; затем partitioning/извлечение bounded contexts при подтверждённой необходимости.
- **Search** — derived model, допустима eventual consistency; нужен reindex workflow.
- **Payments** — idempotency keys, webhook signature validation, reconciliation job.
- **RabbitMQ/Worker** — DLQ, retry policy, метрики backlog.
- **Security/fraud** — RBAC, rate limits, audit log, PSP antifraud signals, moderation hooks.
- **Media** — S3+CDN снимают binary load с API.

Плюс modular monolith — низкая operational complexity и сильная consistency. Минус — central deployment/shared DB. Microservice extraction выполняется только при фактической нагрузке, отдельном жизненном цикле или ownership boundary.
