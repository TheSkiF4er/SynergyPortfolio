# Тема 12 — GRE

На базе темы 3 поднят point-to-point GRE tunnel R1↔R4 (`10.0.0.0/30`). Tunnel source/destination — физические адреса `192.168.12.1` и `192.168.24.4`. Для демонстрации полезной нагрузки добавлены loopback-сети R1 `1.1.1.0/24` и R4 `4.4.4.0/24`, маршрутизируемые через Tunnel0. В дампе видно GRE внутри IPv4. Проверить `show interfaces tunnel0`, `show ip route`, `ping 4.4.4.4 source loopback0`.
