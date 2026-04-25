#!/data/data/com.termux/files/usr/bin/bash
code-server &
sleep 2
termux-open-url http://127.0.0.1:8080
