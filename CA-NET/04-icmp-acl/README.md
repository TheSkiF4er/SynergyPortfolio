# Тема 4 — ICMP и extended ACL

Основа — тема 3. На R2 ACL `BLOCK-R1-R4` запрещает любой IP-трафик R1→R4 на входе интерфейса со стороны R1 и разрешает остальное. Проверки: `trace 192.168.23.3`, `trace 192.168.24.4`, `show ip access-lists`, отрицательный `ping 192.168.24.4` с R1 и положительный ping R1→R3 / R3→R4. В Wireshark для ICMP Echo Request/Reply проверить инкапсуляцию ICMP в IPv4.
