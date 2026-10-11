# Итоговое задание №2 — Finance Tracker

ООП: `Transaction`, `FinanceTracker`, `FinanceStorage`, `Main`. Добавление, список, сумма, фильтр по категории, удаление, восстановление после перезапуска. Доходы положительные, расходы отрицательные; `BigDecimal` с двумя знаками вместо `double`. Хранение в UTF-8 TSV с атомарной записью, аргумент CLI — `finance.tsv` по умолчанию.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.finance.Main 
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
