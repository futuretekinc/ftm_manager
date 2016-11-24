#!/bin/sh /etc/rc.common                                                                                             

CONFIG=                                                                                                              
DNS_LIST=                                                                                                            

get_config()                                                                                                          
{
	local	enable                                                                                                                  
	local   interface                                                                                            
	local   static                                                                                               
	local   start                                                                                                
	local   end                                                                                                  
	local   lease                                                                                                
	local   router                                                                                               
	local   subnet                                                                                               

	config_get	enable $1 enable
	config_get      interface $1 interface                                                                       
	config_get      static $1 static                                                                             
	config_get      start $1 start                                                                               
	config_get      end $1 end                                                                                   
	config_get      lease $1 lease                                                                               
	config_get      router $1 router                                                                             
	config_get      subnet $1 subnet                                                                             

	if [ -n "${enable}" ]
	then
		[ -n "${CONFIG}" ] && append CONFIG ","
		append CONFIG "\"enable\":\"${enable}\""
	fi
	if [ -n "${interface}" ]                                                                                     
	then                                                                                                         
		[ -n "${CONFIG}" ] && append CONFIG ","                                                              
		append CONFIG "\"interface\":\"${interface}\""                                                       
	fi                                                                                                           
								
	if [ -n "${static}" ]                                                                                        
	then                                                                                                         
		[ -n "${CONFIG}" ] && append CONFIG ","                                                              
		append CONFIG "\"static\":\"${static}\""                                                             
	fi                                                                                                           

	if [ -n "${start}" ]                                                                                         
	then                                                                                                         
		[ -n "${CONFIG}" ] && append CONFIG ","                                                              
		append CONFIG "\"start\":\"${start}\""                                                               
	fi                                                                                                           

	if [ -n "${end}" ]                                                                                           
	then                                                                                                         
		[ -n "${CONFIG}" ] && append CONFIG ","                                                              
		append CONFIG "\"end\":\"${end}\""                                                                   
	fi                                                                                                           

	if [ -n "${lease}" ]                                                                                         
	then                                                                                                         
		[ -n "${CONFIG}" ] && append CONFIG ","                                                              
		append CONFIG "\"lease\":\"${lease}\""                                                               
	fi                                                                                                           

	if [ -n "${router}" ]                                                                                        
	then                                                                                                         
		[ -n "${CONFIG}" ] && append CONFIG ","                                                              
		append CONFIG "\"router\":\"${router}\""                                                             
	fi                                                                                                           

	if [ -n "${subnet}" ]                                                                                        
	then                                                                                                         
		[ -n "${CONFIG}" ] && append CONFIG ","                                                              
		append CONFIG "\"subnet\":\"${subnet}\""                                                             
	fi                                                                                                           
}                                                                                                                    


get_dns()                                                                                                            
{                                                                                                                    
	local   host                                                                                                 

	config_get host $1 host                                                                                      

	if [ -n "${host}" ]                                                                                          
	then                                                                                                         
		[ -n "${DNS_LIST}" ] && append DNS_LIST ","                                                          
		append DNS_LIST "\"${host}\""                                                                        
	fi                                                                                                           
}                                                                                                                    

get_leases()
{

	/usr/bin/dumpleases | awk 'BEGIN{count=0; printf("[");}{ if ($1 !~ /Mac/) { \
		if (count != 0) printf(",");\
		printf("{");\
		printf("\"%s\":\"%s\",", "mac", substr($0, 1, 17));\
		printf("\"%s\":\"%s\",", "ipaddr", substr($0, 19,16)); \
		printf("\"%s\":\"%s\",", "hostname", substr($0, 35,20));\
		printf("\"%s\":\"%s\"", "expiresin", substr($0, 55, 20));
		printf("}");\
		count++;}}END{ printf("]")}'

}

get()                                                                                                                
{                                                                                                                    
	config_load     udhcpd                                                                                       

	config_foreach  get_config udhcpd                                                                             
	config_foreach  get_dns dns                                                                                  

	echo "{\"config\": {${CONFIG},\"dns\":[${DNS_LIST}],\"leases\":$(get_leases)}"                                                                                                     
}                                                                                                                    

start()
{
	[ -e /etc/init.d/udhcpd ] && /etc/init.d/udhcpd start
}

stop()
{
	[ -e /etc/init.d/udhcpd ] && /etc/init.d/udhcpd stop
}

enable()
{
	[ -e /etc/init.d/udhcpd ] && /etc/init.d/udhcpd enable
}

disable()
{
	[ -e /etc/init.d/udhcpd ] && /etc/init.d/udhcpd disable
}
