# Тема 5 — TCP, Telnet и extended ACL

Credentials: `student / synergy`, enable secret `lab-enable`. В дампе Telnet наблюдается TCP three-way handshake (`SYN → SYN/ACK → ACK`). ACL на R2 запрещает только TCP/23 R1→R4, сохраняя обратное направление и прочую связность. Команды проверки: `show ip access-lists`, `telnet 192.168.24.4`, `show tcp brief`.
