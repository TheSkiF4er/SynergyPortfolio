# Тема 5 — Методы

Отдельная эволюция `Card` из темы 4: `double balance = 1000.00`, `pay(double summ)`, последовательно три вызова `pay(500)` с результатом `true`, `true`, `false`. Отрицательные и нечисловые суммы отвергаются.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.oopmethods.Card 
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
