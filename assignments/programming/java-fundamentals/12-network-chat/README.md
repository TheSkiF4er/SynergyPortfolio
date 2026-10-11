# Тема 12 — Работа с сетью

Класс `User` содержит `name`, `Socket`, `BufferedReader`, `BufferedWriter` с нужными геттерами и setter имени. Сервер запрашивает имя при подключении и пересылает сообщения формата `Имя: Сообщение`. Команда `/quit` завершает сеанс. Кодировка UTF-8, несколько подключений. Чат учебный: без TLS и аутентификации, запускать только в доверенной сети.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.chat.ChatServer 5050
```
Во втором терминале выполните:

```bash
java -cp assignments/programming/java-fundamentals/.build javafundamentals.chat.ChatClient 127.0.0.1 5050
```


## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
