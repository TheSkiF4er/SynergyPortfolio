# Тема 9 — IPv6

R1/R2 используют статические IPv6-адреса; R3/R4 получают host address через SLAAC (`ipv6 address autoconfig`) от R2. Статические IPv6-маршруты обеспечивают полную связность. Проверить `show ipv6 interface brief`, `show ipv6 route static`, `ping 2001:23::3` / адрес, полученный SLAAC.
