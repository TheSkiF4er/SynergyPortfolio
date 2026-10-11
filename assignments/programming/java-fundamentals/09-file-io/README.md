# Тема 9 — Работа с файлами, часть 1

Запрашивается имя файла и текст. Программа создаёт новый файл в рабочей директории, выводит содержимое, удаляет **символы обычного пробела**, повторно читает и выводит результат. Уже существующие файлы не перезаписываются; имена с каталогами отвергаются.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.fileio.FileEditor 
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
