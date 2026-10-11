# Counter App (State-driven)

Небольшое приложение-счетчик на **vanilla JS**, переработанное под **state-driven** архитектуру.

## Архитектура

Ключевая идея: **DOM — это функция состояния**.

1) **Бизнес-логика** (чистая, без DOM)

- `src/business/counter.js`
  - `MIN_COUNT`, `MAX_COUNT`, `initialState`
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

Схема потока:

`UI events → dispatch(action) → reducer(state, action) → newState → render(newState)`

## UX и доступность

- Контрастные цвета через CSS классы (`result--neutral/positive/negative`)
- Анимация изменения значения (`bump`) + уважение `prefers-reduced-motion`
- `aria-live` для результата и сообщения
- `:focus-visible` стили для клавиатурной навигации
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

### Unit (Vitest)

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
│       └── store.js
└── tests
    ├── unit
    │   └── counter.test.js
    └── e2e
        └── counter.spec.js
```
