# Тема 11 — Многопоточность

Две отдельные программы, использующие единый файловый формат из темы 10: `RunnableProxyChecker` создаёт работников `implements Runnable`, `ThreadProxyChecker` использует `extends Thread`. Общая очередь задач, ограничение 1–32 потоков, сохранение порядка адресов. Формат CLI: `[input-file] [output-file] [worker-count]`; проверка только TCP-доступности.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.threads.RunnableProxyChecker assignments/programming/java-fundamentals/10-proxy-checker/proxies.example.txt good_ip.txt 4
```
Вариант `extends Thread`:

```bash
java -cp assignments/programming/java-fundamentals/.build javafundamentals.threads.ThreadProxyChecker assignments/programming/java-fundamentals/10-proxy-checker/proxies.example.txt good_ip.txt 4
```


## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
