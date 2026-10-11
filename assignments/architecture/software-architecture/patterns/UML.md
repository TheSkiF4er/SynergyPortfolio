# UML для 12 шаблонов

## 1 — Factory + Builder
```mermaid
classDiagram
ProductFactory ..> Product
OrderBuilder ..> Order
```
## 2 — Singleton + Repository
```mermaid
classDiagram
AppConfig : +instance
Repository~T~ <|.. MemoryRepository~T~
```
## 3 — Adapter + Decorator
```mermaid
classDiagram
PaymentGateway <|.. LegacyPaymentAdapter
PaymentGateway <|.. LoggingPaymentDecorator
LoggingPaymentDecorator --> PaymentGateway
LegacyPaymentAdapter --> LegacyPSP
```
## 4 — Facade + Strategy
```mermaid
classDiagram
CheckoutFacade --> PaymentGateway
PricingStrategy <|.. RegularPricing
PricingStrategy <|.. PremiumPricing
```
## 5 — Observer + Command
```mermaid
classDiagram
EventBus : +on() +emit()
ChangeStatusCommand --> Product
ChangeStatusCommand : +execute() +undo()
```
## 6 — Specification + UnitOfWork
```mermaid
classDiagram
Specification~T~ <|.. PriceAtMost
PriceAtMost --> Product
UnitOfWork : +register() +commit() +rollback()
```
