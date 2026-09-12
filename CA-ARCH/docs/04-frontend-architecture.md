# ДЗ 4 — Архитектура фронтенда

Выбор: **SPA**, feature-oriented modular frontend. Microfrontend не нужен: одна команда и единый release train. SSR стоит добавить только публичным SEO-страницам каталога (через Next.js) при подтверждённой SEO-потребности.

```text
src/
  app/            # routing/providers
  pages/
  features/       # add-to-cart, checkout, auth
  entities/       # product/order/user
  shared/         # ui/api/lib
```

Оптимизации: route-level code splitting, image lazy-loading, HTTP caching, memoization только после профилирования, virtualized large lists, Web Vitals budget. API-state отделяется от ephemeral UI-state; server state можно вести TanStack Query.
