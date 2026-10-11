# Тема 1 — Начало работы с Java

Установите JDK 21+ и IntelliJ IDEA Community или Ultimate самостоятельно. В IDEA выберите **New Project → Java → JDK 21+**, UTF-8, создайте класс и выполните `SetupCheck`. Проверьте путь к JDK в **File → Project Structure → Project SDK**, конфигурацию запуска и вывод консоли. Установка IDE и её реальные настройки на вашем компьютере не могут быть подтверждены исходниками.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.setup.SetupCheck 
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
