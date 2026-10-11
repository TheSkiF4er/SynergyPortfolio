# Counter App (State-driven)

Небольшое приложение-счетчик на **vanilla JS**, переработанное под **state-driven** архитектуру.

## Архитектура

Ключевая идея: **DOM — это функция состояния**.

1) **Бизнес-логика** (чистая, без DOM)

- `src/business/counter.js`
  - `MIN_COUNT`, `MAX_COUNT`, `initialState`
  - `clamp(value, MIN, MAX)` и `validateState(raw)` — валидация/нормализация (в т.ч. для localStorage)
  - `reducer(state, action)` — чистая функция, обновляющая состояние
  - `deriveViewModel(state)` — вычисляет «view model» (тон результата, disabled кнопок, сообщение)

2) **Store (state-driven модель)**

- `src/ui/store.js`
  - `createStore(initialState, reducer)`
  - API: `getState()`, `dispatch(action)`, `subscribe(listener)`

3) **UI слой**

- `src/ui/app.js`
  - `render(state, dom)` — единственная функция, которая обновляет DOM
  - события превращаются в `action` и отправляются в `store.dispatch(...)`
  - `store.subscribe(render)` связывает обновления состояния и перерисовку

4) **Persistence (localStorage)**

- `src/ui/persistence.js`
  - чтение/запись JSON в localStorage
  - принцип **single source of truth**: store/state — источник истины, localStorage — только snapshot

Схема потока:

`UI events → dispatch(action) → reducer(state, action) → newState → render(newState)`

## UX и доступность

- Контрастные цвета через CSS классы (`result--neutral/positive/negative`)
- Анимация изменения значения (`bump`) + уважение `prefers-reduced-motion`
- `aria-live` для результата и сообщения
- `:focus-visible` стили для клавиатурной навигации
- Кнопки используют `data-action` + универсальный обработчик (DRY)
- Клавиатурные шорткаты:
  - `ArrowUp` / `+` — увеличить
  - `ArrowDown` / `-` — уменьшить
  - `0` — сброс

## Запуск

Просто откройте `index.html` в браузере.

Для запуска через локальный сервер и тестов нужен Node.js.

```bash
npm i
npm run dev
```

## Тестирование

### Unit (Jest)

```bash
npm run test:unit
```

Покрывает бизнес-логику (reducer + deriveViewModel).

### E2E (Playwright)

```bash
npm run test:e2e
```

E2E тесты поднимают локальный сервер и проверяют клики/disabled/сообщения/классы.

## Структура проекта

```
.
├── index.html
├── style.css
├── src
│   ├── business
│   │   └── counter.js
│   └── ui
│       ├── app.js
│       ├── handlers.js
│       ├── persistence.js
│       ├── render.js
│       └── store.js
└── tests
    ├── unit
    │   └── counter.test.js
    └── e2e
        └── counter.spec.js
```

## Безопасность (CSP)

В `index.html` добавлен базовый CSP через `<meta http-equiv="Content-Security-Policy" ...>`.
Для реального продакшена лучше выставлять CSP **заголовком сервера**.

## Legacy поддержка (опционально)

Если потребуется поддержка старых браузеров — используйте **Babel** (`@babel/preset-env`) и проверяйте фичи через caniuse.
Подход:

1) Определить целевые браузеры (Browserslist)
2) Транспилировать ESM → совместимый бандл
3) Проверить нужные API на caniuse и при необходимости добавить полифиллы
