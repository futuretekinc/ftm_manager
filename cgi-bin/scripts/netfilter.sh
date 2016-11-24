#!/bin/sh /etc/rc.common

. /lib/firewall/config.sh

RULES=
rule_count=0

config_rule()
{
	local   ret=0
	local   name
	local   ruleType
	local   target
	local   dest
	local   proto
	local  	policy 
	local   sport
	local   dport
	local   rule

	config_get name $1 name
	[ -n "${name}" ] || return 0

	rule="{ \"name\" : \"${name}\""
	config_get ruleType $1 type

	[ -n "${ruleType}" ] && append rule ", \"type\" : \"${ruleType}\"" || append rule ", \"type\" : \"static\""
	config_get target $1 target
	[ -n "${target}" ] && append rule ", \"target\" : \"${target}\""

	config_get dest $1 dest
	[ -n "${dest}" ] && append rule ", \"dest\" : \"${dest}\""

	config_get proto $1 proto
	[ -n "${proto}" ] && append rule ", \"proto\" : \"${proto}\""

	config_get match $1 match
	[ -n "${match}" ] && append rule ", \"match\" : \"${match}\""
																							     
	config_get sport $1 sport
	[ -n "${sport}" ] && append rule ", \"sport\" : \"${sport}\""

	config_get dport $1 dport
	[ -n "${dport}" ] && append rule ", \"dport\" : \"${dport}\""

	config_get port $1 port
	[ -n "${port}" ] && append rule ", \"port\" : \"${port}\""

	config_get policy $1 policy
	[ -n "${policy}" ] && append rule ", \"policy\" : \"${policy}\""

	append rule "}"

	[ -n "${RULES}" ] && append RULES

	if [ 0 -eq $rule_count ]
	then
		append RULES "${rule}"
	else
		append RULES ", ${rule}"
	fi

	rule_count=`expr $rule_count + 1`

}

get()
{
#	fw_config_reflash

	config_load firewall_usr

	config_foreach config_rule rule

	echo "{\"rules\":[${RULES}]}"
}

