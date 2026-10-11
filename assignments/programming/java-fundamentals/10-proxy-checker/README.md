# Тема 10 — Работа с файлами, часть 2

Из файла со строками `IPv4:port` считываются адреса, проверяется возможность TCP-соединения и доступные адреса записываются в `good_ip.txt`. По умолчанию входной файл `proxies.txt`, выходной `good_ip.txt`, таймаут 750 мс. Переопределение: `ProxyScanner <input> <output> [timeout-ms]`. Это **проверка TCP-порта**, не доказательство исправности HTTP/SOCKS-прокси. Используйте только собственные или разрешённые адреса.

## Запуск из корня SynergyPortfolio

```bash
make -C assignments/programming/java-fundamentals compile
java -cp assignments/programming/java-fundamentals/.build javafundamentals.proxy.ProxyScanner assignments/programming/java-fundamentals/10-proxy-checker/proxies.example.txt good_ip.txt 500
```

## Проверка

```bash
make -C assignments/programming/java-fundamentals test
```

Все тесты курса выполняются без внешних библиотек на JDK 21+.
