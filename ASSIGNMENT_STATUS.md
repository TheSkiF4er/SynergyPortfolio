# Статус учебных заданий

Обозначения: `CS*` — учебная практика; `CA-*` — учебные задания.

## Текущий статус

| Дисциплина | Репозиторий | Статус |
|---|---|---|
| Архитектуры операционных систем | `CA-OS`: 8 заданий | ✅ Completed locally: code + smoke tests |
| Компьютерные системы и сети | `CA-NET`: labs 3–12 | 🟡 Configs complete; requires real GNS3 run/evidence |
| JavaScript | `CA-JS`: 20 заданий | ✅ Completed locally: source + tests |
| React | `CA-REACT`: 9 заданий | ✅ Implemented; network-dependent demos require internet at runtime |
| Итоговый React | `CA-JSTS1`, `PLUS`, `MAX` | ✅ Implemented |
| UI/UX intermediate | `CA-UIUX`: 13 практик | 🟡 Local design/research kits ready; real participants/Figma/Form/video still external |
| UI/UX final | `CA-DSGN1*`, `CA-DSGN2*` | 🟡 Local case studies ready; literal Figma URL/prototype remains external |
| Архитектура ПО | `CA-ARCH`: 8 ДЗ + final | ✅ Implemented locally; API examples include protobuf gRPC |
| PHP | `CA-PHP`: 17 заданий | ✅ Completed locally: source + PHP smoke tests |
| Структуры и алгоритмы | `CA-ALGORITHMS`: 10 ДЗ + final | ✅ Completed locally: Java source + 38 checks |
| Документирование ПО | `CA-SOFTWARE-DOCUMENTATION`: 20 заданий | 🟡 18/20 выполнены воспроизводимо; создание реальных GitHub/Bitbucket репозиториев требует внешних аккаунтов |

## Важные уточнения

### GNS3
Lab 12 содержит три GRE-туннеля R1↔R3, R3↔R4, R4↔R1, Loopback на R1/R3/R4 и OSPF поверх overlay. Все labs содержат конфигурации/verification guidance. Формальная практическая часть считается завершённой после запуска легального Cisco IOS image в GNS3, сохранения проекта и реальных результатов ping/show/Wireshark.

### UI/UX
Практики 1–6 имеют локальные редактируемые макеты; 7–13 дополнены brief/research/test/recording/handoff kits. Нельзя честно пометить real user testing, Google Form, Figma prototype/Dev Mode или видеозащиту как completed, пока такие объекты не созданы в соответствующих сервисах/с реальными людьми.

Подробности: `CA-UIUX/EXTERNAL_DELIVERABLES.md`.


### Документирование программного обеспечения
Тема 3: подготовлены 5 руководств пользователя и 15 документов по выходным данным/БД. Тема 6: подготовлены 5 технических заданий. Тема 5: задания 3–5 выполняются воспроизводимым local-remote demo; для заданий 1–2 реальные GitHub/Bitbucket URL не подделываются и добавляются после действий владельца аккаунтов.
