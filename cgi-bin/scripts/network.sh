#!/bin/sh /etc/rc.common

. /lib/network/network.sh

IFACE_INFO=
PORT_INFO=
ACTIVE_WAN_PORT=
WAN_PORT_LIST=
PORT_LIST=

read_port()
{
	local	name
	local	type
	local	wan
	local	lan

	config_get name $1	name 
	[ -n "${name}" ] || return

	config_get type $1	type
	[ -n "${type}" ] || return

	config_get wan  $1	wan 	"no"
	config_get lan	$1	lan		"no"


	[ -n "${PORT_INFO}" ] && append PORT_INFO ","
	append PORT_INFO "{ \"name\":\"${name}\", \"type\":\"${type}\", \"wan\":\"${wan}\", \"lan\":\"${lan}\"}"

	append PORT_LIST "${name}"
}

read_interface()
{
	local   ifname
	local   type
	local	port
	local   proto
	local	macaddr
	local   ipaddr
	local   netmask
	local   gateway
	local   active
	local	failover

	config_get ifname $1 name
	[ -n "${ifname}" ] && [ "${ifname}" != "lo" ] || return

	config_get type $1 type
	[ -n "${type}" ] || return

	case "${type}" in
	"wan")
		local	val
		
		config_get val $1 port
		[ -n "${val}" ] || return

		if [ "${ACTIVE_WAN_PORT}" =  "${val}" ]; then
			failover="active"
		else
			failover="standby"
		fi

		port="\"${val}\""

		append WAN_PORT_LIST "${val}"

		config_get proto $1 proto
		[ -n "${proto}" ] || return

		case "${proto}" in
		"static")
			macaddr=$(get_mac "wan")
			config_get ipaddr	$1	ipaddr
			config_get netmask 	$1	netmask
			config_get gateway	$1	gateway
			;;

		"dhcp")
			if [ "${failover}" = "active" ]; then
				macaddr=$(get_mac "wan")
				ipaddr=$(get_ip "wan")
				netmask=$(get_netmask "wan")
				gateway=$(get_gateway)
			fi
			;;

		"auto")
			if [ "${failover}" = "active" ]; then
				macaddr=$(get_mac "wan")
				ipaddr=$(get_ip "wan")
				netmask=$(get_netmask "wan")
				gateway=$(get_gateway)
			fi
			;;
		esac

		;;

	"lan")
		local	val

		macaddr=$(get_mac "lan")
		proto="static"
		config_get ipaddr	$1	ipaddr
		config_get netmask 	$1	netmask

		config_get val $1 port
		if [ -n "${val}" ]; then
			if [ "${val}" = "all" ]; then
				for p1 in ${PORT_LIST}; do
					found=0
					for p2 in ${WAN_PORT_LIST} ; do
						if [ "${p1}" = "${p2}" ]; then
							found=1
							break
						fi
					done

					if [ "${found}" = "0" ]; then
						[ -n "${port}" ] && append port ","

						append port "\"${p1}\""
					fi
				done
			fi	
		else
			for idx in $(seq 0 10) ; do
				config_get val $1 "port$idx"

				[ -n "${val}" ] || break

				[ -n "${port}" ] && append port ","

				append port "\"${val}\""
			done
		fi

		;;
	*)
		return
	esac

	[ -n "${IFACE_INFO}" ] && append IFACE_INFO ","

	append IFACE_INFO "{"
	append IFACE_INFO "\"type\":\"${type}\","
	append IFACE_INFO "\"name\":\"${ifname}\","
	append IFACE_INFO "\"proto\":\"${proto}\","

	[ -n "${macaddr}" ] && append IFACE_INFO "\"mac\":\"${macaddr}\","
	[ -n "${ipaddr}" ] && append IFACE_INFO "\"ipaddr\":\"${ipaddr}\","
	[ -n "${netmask}" ] && append IFACE_INFO "\"netmask\":\"${netmask}\","
	[ -n "${gateway}" ] && append IFACE_INFO "\"gateway\":\"${gateway}\","
	[ -n "${failover}" ] && append IFACE_INFO "\"failover\":\"${failover}\","
	[ -n "${port}" ] && append IFACE_INFO "\"port\":[${port}]"
	append IFACE_INFO "}"
}                                                                      

get()                                                               
{                                                                   
	ACTIVE_WAN_PORT=$(get_brif "wan")

	config_load network                                           

	config_foreach	read_port	port
	config_foreach  read_interface interface                    
    config_foreach  read_dns dns                             

	echo "{"
	echo "\"port\":[${PORT_INFO}],"
	echo "\"interface\":[${IFACE_INFO}]"
	echo "}"
}  
