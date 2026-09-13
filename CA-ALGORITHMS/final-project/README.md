# Итоговый проект — обработка данных студентов

Программа:

1. читает `info.json` с диска;
2. разбирает JSON в Java-объекты без внешних библиотек;
3. создаёт **статический массив** `Student[]` ровно размера `count`;
4. сортирует его собственной quick sort по `grade` — среднее `O(n log n)`, худшее `O(n²)`;
5. собственной binary search находит одного студента с `grade = 10` — `O(log n)` после сортировки;
6. строит `Map<Integer,List<Student>>` — `O(n)`;
7. сериализует результат в JSON и добавляет первым полем `goldenStudent`;
8. выводит ФИО и факультет медалиста.

```bash
cd CA-ALGORITHMS
make test
# либо после make compile:
java -cp .build edu.synergy.algorithms.finalproject.Main final-project/info.json final-project/result.json
```

Готовый результат для приложенного `info.json` находится в `result.json`. Таблица сложности каждого метода — `COMPLEXITY.md`.
