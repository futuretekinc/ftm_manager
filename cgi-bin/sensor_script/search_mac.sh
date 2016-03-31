#!/bin/sh
arp-scan -I br-lan -l | awk '/'$1'/ { print $1 }'
