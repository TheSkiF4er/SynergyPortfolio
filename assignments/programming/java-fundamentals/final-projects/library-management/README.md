# Итоговое задание №1 — Library Management

ООП: `Book`, `Library`, `LibraryStorage`, `Main`. Добавление/удаление, список, поиск по названию/автору/жанру, сортировка по названию/автору/году, валидация, регистрация читателей, выдача и возврат книг. У каждой книги UUID (одноимённые книги не конфликтуют), сохранение в TSV с Base64-полями и атомарной заменой файла. Первый аргумент CLI — путь к файлу (по умолчанию `library.tsv`).

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.library.Main 
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
