# Тема 7 — VLAN / Router-on-a-Stick

VLAN 10: `192.168.10.0/24`, VLAN 20: `192.168.20.0/24`. R1 маршрутизирует через subinterfaces `.10` и `.20`. На trunk между SW1 и R1 кадры несут тег 802.1Q; на access-портах тег отсутствует. Проверить `show vlan brief`, `show interfaces trunk` и межвлановые ping.
