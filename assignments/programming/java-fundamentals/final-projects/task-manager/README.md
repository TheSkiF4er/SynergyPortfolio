# Итоговое задание №3 — Task Manager

ООП: `TaskItem`, `TaskManager`, `TaskStorage`, `Main`. Название, описание, дедлайн ISO `YYYY-MM-DD`, список, отметка выполнения, фильтр `done/todo`, удаление, сохранение и загрузка после перезапуска. Каждая задача имеет UUID; UTF-8 TSV, атомарная запись, аргумент CLI — `tasks.tsv` по умолчанию.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.tasks.Main 
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
