#!/usr/bin/env bash
set -euo pipefail
expected=$'30 24 18\n84 69 54\n138 114 90'
[[ "$(./build/process_matrix)" == "$expected" ]]
[[ "$(./build/thread_matrix)" == "$expected" ]]
./build/filter_coordinates 03-io-streams/coordinates.txt | grep -q '55.7558 37.6173'
./build/unix_server >/tmp/os-unix-server.log 2>&1 & p=$!; sleep .2; ./build/unix_client demo | grep -q OK; wait "$p"
./build/tcp_server 5051 >/tmp/os-tcp-server.log 2>&1 & p=$!; sleep .2; ./build/tcp_client demo 5051 | grep -q OK; wait "$p"
echo 'CA-OS smoke tests: OK'
