# Тема 8 — Исключения

Массив из трёх введённых чисел; в `while(true)` выполняется деление `i / values[i]`. `ArithmeticException` сообщает о нуле, `ArrayIndexOutOfBoundsException` завершает цикл с предписанным сообщением.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.exceptions.Main 
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
