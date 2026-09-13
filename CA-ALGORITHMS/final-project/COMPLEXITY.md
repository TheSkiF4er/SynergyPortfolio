# Big O документация итогового проекта

Пусть `n` — количество студентов, `k` — размер JSON в символах, `g` — число различных оценок.

| Класс / метод | Время | Доп. память |
|---|---:|---:|
| `Student.fullName()` | O(1) | O(1) относительно `n` |
| `StudentAlgorithms.quickSort()` | O(n log n) average, O(n²) worst | O(log n) average recursion |
| `quick()` | O(n log n) aggregate average | O(log n) average |
| `partition()` | O(n) на диапазон | O(1) |
| `binarySearchGrade()` | O(log n) | O(1) |
| `groupByGrade()` | O(n log g) из-за `TreeMap` | O(n) |
| `StudentJsonRepository.read()` | O(k + n) | O(k + n) |
| `StudentJsonRepository.write()` | O(n) по числу студентов | O(k) для результирующей строки |
| `MiniJson.parse()` | O(k) | O(k) |
| `MiniJson.value/object/array/string/number()` | O(k) суммарно за один parse | O(k) |
| `MiniJson.quote()` | O(length(string)) | O(length(string)) |
| `Main.main()` | O(k + n log n) average | O(k + n) |

Бинарный поиск выполняется только после сортировки массива по `grade`. Для исходных данных гарантирован ровно один студент с `grade = 10`.
