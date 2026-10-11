# Язык программирования Java — 12 тем и 3 итоговых проекта

Решения выполнены по пятнадцати предоставленным методическим PDF. Это самостоятельный курс, не заменяющий существующий [`java-algorithms`](../java-algorithms/).

## Требования

- **JDK 21+** (`java`, `javac`) и `make`; внешние библиотеки, Maven и Gradle не нужны.
- UTF-8 в консоли и файлах. Команды запуска выполняются из корня SynergyPortfolio.
- Для темы 1 требуется **самостоятельно установить и настроить IntelliJ IDEA**. Архив содержит чек-лист и исполняемую проверку JDK, но не может подтверждать установку IDE на чужом компьютере.

```bash
make -C assignments/programming/java-fundamentals test
make -C assignments/programming/java-fundamentals compile
```

Результат компиляции помещается в `.build` (не включается в Git). Для запуска конкретного класса используйте `java -cp assignments/programming/java-fundamentals/.build <полное-имя-класса> [аргументы]`.

## Темы

| № | Работа | Запускаемый класс | Особенности |
|---|---|---|---|
| 1 | [Начало работы](01-getting-started/) | `javafundamentals.setup.SetupCheck` | JDK / настройки IDEA |
| 2 | [Синтаксис](02-syntax/) | `javafundamentals.syntax.Main` | `variables`, `remainder`, `vector`, `percentage`, `calculator` |
| 3 | [Массивы и циклы](03-arrays-and-loops/) | `javafundamentals.arrays.Main` | `minimum`, `expand`, `triangle`, `deposit`, `longest-run` |
| 4 | [ООП](04-oop-basics/) | `javafundamentals.oopbasics.Card` | Поля, конструктор, вывод карты |
| 5 | [Методы](05-oop-methods/) | `javafundamentals.oopmethods.Card` | `pay()` и баланс |
| 6 | [Инкапсуляция](06-encapsulation/) | `javafundamentals.encapsulation.Card` | Геттеры/сеттеры, PIN |
| 7 | [Наследование](07-inheritance/) | `javafundamentals.inheritance.Main` | Employee / ProductionWorker |
| 8 | [Исключения](08-exceptions/) | `javafundamentals.exceptions.Main` | Zero division / выход из массива |
| 9 | [Файлы I](09-file-io/) | `javafundamentals.fileio.FileEditor` | Создание, чтение, удаление пробелов |
| 10 | [Файлы II](10-proxy-checker/) | `javafundamentals.proxy.ProxyScanner` | `good_ip.txt` |
| 11 | [Потоки](11-multithreading/) | `javafundamentals.threads.RunnableProxyChecker`, `javafundamentals.threads.ThreadProxyChecker` | Две отдельные реализации |
| 12 | [Сетевой чат](12-network-chat/) | `javafundamentals.chat.ChatServer`, `javafundamentals.chat.ChatClient` | User, TCP и UTF-8 |

## Итоговые проекты

| № | Работа | Команда запуска после `make compile` |
|---|---|---|
| 1 | [Library Management](final-projects/library-management/) | `java -cp assignments/programming/java-fundamentals/.build javafundamentals.library.Main` |
| 2 | [Finance Tracker](final-projects/finance-tracker/) | `java -cp assignments/programming/java-fundamentals/.build javafundamentals.finance.Main` |
| 3 | [Task Manager](final-projects/task-manager/) | `java -cp assignments/programming/java-fundamentals/.build javafundamentals.tasks.Main` |

## Реализация и защита данных

- Тесты в `tests/CourseTests.java` охватывают обе реализации ProxyChecker, TCP-чат с двумя клиентами, ввод, бизнес-логику, CRUD и повторную загрузку сохранённых файлов.
- Файлы итоговых проектов: `*.tsv` (UTF-8). Табуляции и переводы строк в текстовых полях сериализуются Base64. В `support/TextStore.java` запись делается во временный файл с заменой по rename; при неподдерживаемом atomic move используется обычное перемещение.
- В отличие от заданий на работу с реальными платёжными картами, `Card` — исключительно учебная модель с вымышленными номерами. Не храните настоящие CVV/PIN в коде или логах.
- ProxyChecker делает **только TCP connect**, не выполняет HTTP/SOCKS handshake и не доказывает работоспособность прокси. Используйте адреса только с разрешением. Чат не предоставляет TLS/аутентификацию и не предназначен для открытого интернета.
- При повреждении или несовместимости файла итоговые проекты сообщают об ошибке, не заменяя его автоматически пустой базой.

## Результаты, требующие действий студента

Тема 1 — установка IntelliJ IDEA по видеоуроку и настройка IDE — не может быть выполнена удалённо для вашей рабочей станции. Проверить установку можно самостоятельно, запустив [`01-getting-started/README.md`](01-getting-started/README.md), `java -version` и `javac -version`. Пример из видео урока по ProxyChecker не предоставлялся в виде исходников, поэтому реализация написана заново по текстовым требованиям PDF.
