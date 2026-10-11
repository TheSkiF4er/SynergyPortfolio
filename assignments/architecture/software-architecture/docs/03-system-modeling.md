# ДЗ 3 — Языки проектирования ИС

## C4 Context
```mermaid
flowchart LR
Buyer[Buyer] --> M[MarketHub]
Seller[Seller] --> M
Admin[Admin] --> M
M --> PSP[Payment provider]
M --> Delivery[Delivery provider]
```

## C4 Containers
```mermaid
flowchart TB
SPA[React SPA] --> API[NestJS API]
API --> PG[(PostgreSQL)]
API --> Redis[(Redis)]
API --> MQ[(RabbitMQ)]
Worker[Worker] --> MQ
Worker --> PG
API --> Search[(OpenSearch)]
API --> S3[(S3)]
```

## Контейнер 1: Application API → components
```mermaid
flowchart LR
HTTP[HTTP Controllers] --> Orders[Order Application Service]
Orders --> OrderDomain[Order Domain]
Orders --> OrderRepo[Order Repository]
Orders --> PaymentPort[Payment Port]
OrderRepo --> PG[(PostgreSQL)]
PaymentPort --> PSP[PSP adapter]
```

### UML classes: Order Domain
```mermaid
classDiagram
class Order {+UUID id;+OrderStatus status;+Money total;+place();+markPaid();+cancel()}
class OrderItem {+UUID productId;+int quantity;+Money unitPrice;+subtotal() Money}
class Money {+int minor;+String currency;+add(Money) Money}
class OrderPolicy {+canCancel(Order) bool}
Order "1" *-- "1..*" OrderItem
Order --> Money
OrderPolicy --> Order
```

## Контейнер 2: Web SPA → components
```mermaid
flowchart LR
AppRouter --> CatalogPage
AppRouter --> CheckoutPage
CatalogPage --> CatalogFeature
CheckoutPage --> CheckoutFeature
CatalogFeature --> ApiClient
CheckoutFeature --> ApiClient
```

### UML classes: Checkout Feature
```mermaid
classDiagram
class CheckoutController {+submit();+load();+retryPayment()}
class CheckoutState {+items;+address;+payment;+status}
class CheckoutApi {+createOrder();+payOrder()}
class CheckoutValidator {+validateAddress();+validateCart()}
CheckoutController --> CheckoutState
CheckoutController --> CheckoutApi
CheckoutController --> CheckoutValidator
```

## ER
```mermaid
erDiagram
USERS ||--o{ PRODUCTS : sells
USERS ||--o{ ORDERS : places
ORDERS ||--|{ ORDER_ITEMS : contains
PRODUCTS ||--o{ ORDER_ITEMS : referenced_by
ORDERS ||--o| PAYMENTS : has
USERS { uuid id PK string email string password_hash string role }
PRODUCTS { uuid id PK uuid seller_id FK string sku string title text description decimal price string currency string status int stock_qty datetime created_at }
ORDERS { uuid id PK uuid buyer_id FK string status decimal total string currency datetime created_at }
ORDER_ITEMS { uuid id PK uuid order_id FK uuid product_id FK int quantity decimal unit_price }
PAYMENTS { uuid id PK uuid order_id FK string provider_id string status decimal amount }
```
