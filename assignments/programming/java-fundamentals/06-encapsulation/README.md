# Тема 6 — Инкапсуляция

Приватные поля `Card`, осмысленные геттеры и сеттеры, защита отрицательного баланса, уведомление о пополнении, валидация PIN из четырёх цифр. CVV и PIN не предоставляются через геттеры; реквизиты демонстрационные.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.encapsulation.Card 
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
