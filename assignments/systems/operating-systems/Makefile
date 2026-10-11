CC ?= cc
CFLAGS ?= -std=c11 -Wall -Wextra -Wpedantic -O2
BIN := build

all: $(BIN)/filter_coordinates $(BIN)/unix_server $(BIN)/unix_client $(BIN)/tcp_server $(BIN)/tcp_client $(BIN)/process_matrix $(BIN)/zombie $(BIN)/thread_matrix

$(BIN):
	mkdir -p $(BIN)

$(BIN)/filter_coordinates: 03-io-streams/filter_coordinates.c | $(BIN)
	$(CC) $(CFLAGS) $< -o $@
$(BIN)/unix_server: 04-unix-socket/server.c | $(BIN)
	$(CC) $(CFLAGS) $< -o $@
$(BIN)/unix_client: 04-unix-socket/client.c | $(BIN)
	$(CC) $(CFLAGS) $< -o $@
$(BIN)/tcp_server: 05-tcp-socket/server.c | $(BIN)
	$(CC) $(CFLAGS) $< -o $@
$(BIN)/tcp_client: 05-tcp-socket/client.c | $(BIN)
	$(CC) $(CFLAGS) $< -o $@
$(BIN)/process_matrix: 06-process-matrix/process_matrix.c | $(BIN)
	$(CC) $(CFLAGS) $< -o $@
$(BIN)/zombie: 07-zombie-process/zombie.c | $(BIN)
	$(CC) $(CFLAGS) $< -o $@
$(BIN)/thread_matrix: 08-thread-matrix/thread_matrix.c | $(BIN)
	$(CC) $(CFLAGS) -pthread $< -o $@

test: all
	./tests/smoke.sh

clean:
	rm -rf $(BIN) /tmp/synergy_unix_socket

.PHONY: all test clean
