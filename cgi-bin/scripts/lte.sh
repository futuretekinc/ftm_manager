#!/bin/sh /etc/rc.common

. /lib/lte/lte.sh

read_lte()
{
	local	wanip
	local	apn
	local	interval
	local	maxLoop

	config_get interval $1 interval	5
	config_get maxLoop $1 maxLoop	10
	config_get apn $1 apn			
	[ -n "${apn}" ] || apn="$(get_internet_apn)"

	echo "\"apn\":\"${apn}\""
	echo "\"ip\":\"${wanip}\""
	echo "\"interval\":${interval}"
	echo "\"maxLoop\":${maxLoop}"
}                                                                      

get()                                                               
{                                                                   
	config_load lte

	echo "{"

	config_foreach	read_lte	lte

	echo "}"
}  
