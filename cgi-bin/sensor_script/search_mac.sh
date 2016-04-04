#!/bin/sh
arp-scan -l | awk '/'$1'/ { print $1 }'
