# Тема 12 — GRE: три point-to-point туннеля + OSPF

Лабораторная построена поверх физической топологии темы 3: R1, R3 и R4 достигают друг друга через R2 по underlay-сетям `192.168.12.0/24`, `192.168.23.0/24`, `192.168.24.0/24`. На этой связности создаются три GRE-туннеля, как требует задание:

| Туннель | Endpoint A | Endpoint B | GRE-сеть |
|---|---|---|---|
| R1 ↔ R3 | R1 `192.168.12.1` | R3 `192.168.23.3` | `192.168.13.0/24` |
| R3 ↔ R4 | R3 `192.168.23.3` | R4 `192.168.24.4` | `192.168.34.0/24` |
| R4 ↔ R1 | R4 `192.168.24.4` | R1 `192.168.12.1` | `192.168.14.0/24` |

Loopback-сети для проверки overlay routing:

- R1: `1.1.1.1/32`;
- R3: `3.3.3.3/32`;
- R4: `4.4.4.4/32`.

Поверх GRE работает OSPF area 0. Физические underlay-интерфейсы в OSPF **не анонсируются**: достижимость tunnel destination обеспечивается статическими underlay-маршрутами через R2. Это исключает рекурсивную маршрутизацию endpoint через сам GRE.

## Порядок выполнения в GNS3

1. Собрать физическую топологию темы 3 и назначить адреса из `configs/*.cfg`.
2. Проверить underlay: с R1 должны пинговаться `192.168.23.3` и `192.168.24.4`, аналогично для R3/R4.
3. Применить конфигурации GRE и OSPF.
4. Убедиться, что все шесть tunnel endpoints имеют состояние `up/up`.
5. Проверить OSPF neighbours и маршруты к Loopback-сетям.
6. Снять capture на одном из физических линков и показать GRE-in-IP в Wireshark.

## Команды проверки

```text
show ip interface brief | include Tunnel
show interfaces Tunnel13
show interfaces Tunnel14
show interfaces Tunnel34
show ip ospf neighbor
show ip route ospf
show ip route 1.1.1.1
show ip route 3.3.3.3
show ip route 4.4.4.4
show ip ospf interface Tunnel13
show ip ospf interface Tunnel14
show ip ospf interface Tunnel34
```

Контрольные ping:

```text
R1# ping 3.3.3.3 source loopback0
R1# ping 4.4.4.4 source loopback0
R3# ping 1.1.1.1 source loopback0
R3# ping 4.4.4.4 source loopback0
R4# ping 1.1.1.1 source loopback0
R4# ping 3.3.3.3 source loopback0
```

OSPF cost задан разным для отдельных туннелей (`10`, `20`, `30`), поэтому можно сравнить выбранный маршрут и metric через `show ip route` / `show ip ospf interface`. При отказе одного GRE OSPF должен перестроить маршрут по двум оставшимся сторонам треугольника.

> Репозиторий содержит полные конфигурации, но реальные `.gns3`, screenshots и packet capture должны быть получены после запуска легального Cisco IOS image локально.
