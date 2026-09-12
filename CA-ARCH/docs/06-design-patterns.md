# ДЗ 6 — Шаблоны проектирования

В `../patterns/src/index.ts` реализованы 12 шаблонов на **TypeScript**, то есть на компилируемом языке с обязательным этапом `tsc`:

- порождающие: Factory, Builder, Singleton;
- структурные: Adapter, Decorator, Facade;
- поведенческие: Strategy, Observer, Command;
- дополнительные enterprise-паттерны: Repository, Specification, Unit of Work.

`patterns/UML.md` содержит **6 UML class diagrams**. `tsc -p tsconfig.json` работает в `strict` режиме, а подавление предупреждений не используется. Шаблоны связаны с финальным MarketHub: создание продуктов/заказов, интеграция legacy payment API, ценообразование, события, команды и persistence boundary.
