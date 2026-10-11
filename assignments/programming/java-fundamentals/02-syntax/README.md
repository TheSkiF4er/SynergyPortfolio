# Тема 2 — Основы синтаксиса

Пять задач: объявление `String name`, `int age`, `String city`; остаток `15 % 6`; координаты вектора AB; увеличение на 15%; калькулятор. Аргумент `variables`, `remainder`, `vector`, `percentage` или `calculator`. Для `vector` вводите в отдельных строках `x1 y1 x2 y2` (допустимы отрицательные координаты); для `percentage` — число; для `calculator` — два числа и затем оператор. Арифметика процентов использует BigDecimal.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.syntax.Main calculator
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
