#!/bin/sh

sslvpn=`cat /etc/config/sslvpn | awk -f /www/cgi-bin/get_sslvpn_info.awk`
id=`echo $sslvpn | awk '{print $1}'`
pw=`echo $sslvpn | awk '{ print $2 }'`
remote=`echo $sslvpn | awk '{ print $3 }'`
port=`echo $sslvpn | awk '{ print $4 }'`
auth=`echo $sslvpn | awk '{ print $5 }'`
retry=`echo $sslvpn | awk '{ print $6 }'`
max=`echo $sslvpn | awk '{ print $7 }'`

echo "{"
echo "\"config\":{"
echo "\"id\":\"$id\","
echo "\"pw\":\"$pw\","
echo "\"remote\":\"$remote\","
echo "\"port\":\"$port\","
echo "\"auth\":\"$auth\","
echo "\"retry\":\"$retry\","
echo "\"max\":\"$max\""
echo "}" 
