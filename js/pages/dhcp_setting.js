/**
 * Created by kindmong on 2015-11-05.
 */
$(document).ready(function(){
    menu();
    init();
});

function init() {
    document.getElementById("h_dhcp_setting").innerHTML = _t('dhcp_setting');       
    document.getElementById("modify_btn").innerHTML = _t('modify');     
    document.getElementById("btn_add").innerHTML = _t('add');
    // document.getElementById("label_enable").innerHTML = _t('enabled');
    document.getElementById("label_static_enabled").innerHTML = _t('enabled');
    document.getElementById("h_static_setting").innerHTML = _t('static_ip_address');

    
    document.getElementById("label_interface").innerHTML = _t('text_active_interface');
    document.getElementById("label_ip_start").innerHTML = _t('ip_start');
    document.getElementById("label_ip_end").innerHTML = _t('ip_end');
    document.getElementById("label_gateway").innerHTML = _t('text_active_gateway');
    document.getElementById("label_dns1").innerHTML = _t('dns') + " 1";
    document.getElementById("label_dns2").innerHTML = _t('dns') + " 2";
    document.getElementById("label_leases").innerHTML = _t('leases_time');

    document.getElementById("th_number").innerHTML = _t('number');
    document.getElementById("th_mac").innerHTML = _t('mac');
    document.getElementById("th_ip").innerHTML = _t('ip');
    document.getElementById("th_add").innerHTML = _t('add');

    document.getElementById("a_default_info").innerHTML = _t('network');
    document.getElementById("a_lte_status_info").innerHTML = _t('status_info');
    document.getElementById("a_apn_setting").innerHTML = _t('apn_setting');
    document.getElementById("a_dhcp_status_info").innerHTML = _t('status_info');
    document.getElementById("a_dhcp_setting").innerHTML = _t('btn_register');
    
    var url = "";
    if (isTest) {
        url = "/json/dhcp.json";
    } else {
        url = "/cgi-bin/dhcp2?cmd=get";
    }

    $.ajax({
        type:"get",
        url:url,
        dataType:"json",
        success : function(json) {
            
            console.log(json);
            var config = json.config;

            if (json.result == "success") {
                // document.getElementById("status").innerHTML = config.status;
                document.getElementById("eth_if").readOnly = true;
                document.getElementById("eth_if").value = config.interface;
                document.getElementById("start").value = config.start;
                document.getElementById("end").value = config.end;
                document.getElementById("router").value = config.router;
                document.getElementById("time").value = config.lease;
                document.getElementById("dns1").value = config.dns[0];
                document.getElementById("dns2").value = config.dns[1];
                
                // if (config.enable == true) {
                //     document.getElementById("enable").checked = true;
                // } else {
                //     document.getElementById("enable").checked = false;
                // }

                if (config.static == true) {
                    document.getElementById("static_leases_cb").checked = true;
                } else {
                    document.getElementById("static_leases_cb").checked = false;
                }

            } else {
                alert("Please Retry");
            }
        },
        error : function(xhr, status, error) {
            console.log("에러발생");
            //window.location.href="/";
        }
    });

    /*$.ajax({
        type:"get",
        url:"/cgi-bin/dhcp?cmd=status",
        dataType:"xml",
        success : function(xml) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO 
            $(xml).find("DHCP_SERVER").each(function(){
                var status = $(this).find("STATUS").text();
                var static = $(this).find("STATIC").text();

                if (status == 'running') {
                    document.getElementById("enable").checked = true;
                } else {
                    document.getElementById("enable").checked = false;
                }

                if (static == true) {
                    document.getElementById("static_leases_cb").checked = true;
                } else {
                    document.getElementById("static_leases_cb").checked = false;
                }
				
				document.getElementById("eth_if").readOnly = true;
                document.getElementById("eth_if").value = $(this).find("INTERFACE").text();
                document.getElementById("start").value = $(this).find("START").text();
                document.getElementById("end").value = $(this).find("END").text();
                document.getElementById("router").value = $(this).find("ROUTER").text();
                document.getElementById("time").value = $(this).find("TIME").text();
                document.getElementById("dns1").value = $(this).find("DNS1").text();
                document.getElementById("dns2").value = $(this).find("DNS2").text();

                static_leases = $(this).find("STATIC_LEASE");
                for(i = 0 ; i < static_leases.length ; i++)
                {
                    ipaddr 	= static_leases[i].getElementsByTagName("IP")[0].firstChild.nodeValue;
                    macaddr	= static_leases[i].getElementsByTagName("MAC")[0].firstChild.nodeValue;

                    onAddStaticLease(macaddr, ipaddr);
                }
                loadNetwork();
            });
        },
        error : function(xhr, status, error) {
            //alert("에러발생");
            window.location.href="/";
        }
    });*/
}

function onApply()
{
	var data = "/cgi-bin/dhcp2?cmd=set";
	data += "&enable=true"; // + document.getElementById("enable").checked;
	data += "&if=" + document.getElementById('eth_if').value;
	data += "&start=" + document.getElementById("start").value;
	data += "&end=" + document.getElementById("end").value;
	data += "&router=" + document.getElementById("router").value;
	data += "&time=" + document.getElementById("time").value;
	data += "&static=" + document.getElementById("static_leases_cb").checked;
	data += "&dns1=" + document.getElementById("dns1").value;
	data += "&dns2=" + document.getElementById("dns2").value;
    console.log(document.getElementById("static_leases_cb").checked);
    
    // 고정아이피 설정
	if (typeof(document.getElementsByName("mac")) != 'undefined')
	{
		if (typeof(document.getElementsByName("mac").length) != 'undefined')
		{
			for(i = 0 ; i < document.getElementsByName("mac").length ; i++)
			{
				data += "&mac" + i + "=" + document.getElementsByName("mac")[i].value;
				data += "&ip" + i + "=" + document.getElementsByName("ip")[i].value;
				
			}
		}
		else
		{
				data += "&mac0=" + document.getElementsByName("mac").value;
				data += "&ip0=" + document.getElementsByName("ip").value;
		}			
	}

    console.log(data);
    //return;

    $.ajax({
        type:"get",
        url:data,
        dataType:"json",
        success : function(json) {
            
            console.log(json);
            
            if (json.result == "success") {
                
                $.ajax({
                    type:"get",
                    url:"/cgi-bin/dhcp2?cmd=restart",
                    dataType:"json",
                    success : function(json) {
                        
                        console.log(json);
                        
                        if (json.result == "success") {
                            alert("수정완료");
                        } else {
                            alert("Please Retry");
                        }
                    },
                    error : function(xhr, status, error) {
                        console.log("에러발생");
                        //window.location.href="/";
                    }
                });

            } else {
                alert("Please Retry");
            }
        },
        error : function(xhr, status, error) {
            console.log("에러발생");
            //window.location.href="/";
        }
    });

	/*xmlhttp.open( "POST", data, true );
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=euc-kr");
	xmlhttp.onreadystatechange = function()
	{
		if( (xmlhttp.readyState == 4) && (xmlhttp.status == 200) )
		{
			try
			{
				ret = xmlhttp.responseXML.documentElement.getElementsByTagName("RET")[0].firstChild.nodeValue;		
				
				if (ret == 'OK')
				{
					alert('DHCP 서버 설정이 정상적으로 변경되었습니다.\n단말이 재부팅됩니다.');
					//onSystemRestart();
				}
				else
				{
					msg = xmlhttp.responseXML.documentElement.getElementsByTagName("MSG")[0].firstChild.nodeValue;		
					alert('DHCP 서버 설정에 문제가 발생하였습니다.\n' + msg);
				
				}
						
			}
			catch(e)
			{
			}
		}
	}
	xmlhttp.send();*/
}

function onAddStaticLease(macaddr, ipaddr)
{
    if (typeof(macaddr) == 'undefined')
    {
        macaddr = '00:00:00:00:00:00';
        ipaddr 	= '0.0.0.0';
    }

    static_lease = document.getElementById('static_lease');

    index = static_lease.rows.length - 1;
    row = static_lease.insertRow(index);
    cell = row.insertCell(0);
    cell.setAttribute('class', 'center');
    cell.innerHTML = index;

    cell = row.insertCell(1);
    cell.setAttribute('class', 'center');
    newElement = document.createElement('input');
    newElement.setAttribute('class', 'form-control');
    newElement.setAttribute('name', 'mac');
    newElement.setAttribute('value', macaddr);
    cell.appendChild(newElement);

    cell = row.insertCell(2);
    cell.setAttribute('class', 'center');
    newElement = document.createElement('input');
    newElement.setAttribute('class', 'form-control');
    newElement.setAttribute('name', 'ip');
    newElement.setAttribute('value', ipaddr);
    cell.appendChild(newElement);

    cell = row.insertCell(3);
    cell.setAttribute('class', 'center');
    newElement = document.createElement('input');
    newElement.setAttribute('type', 'button');
    newElement.setAttribute('value', 'remove');
    newElement.setAttribute('class', 'btn btn-default');
    newElement.setAttribute('onclick', 'onRemoveStaticLease(' + index + ');');
    cell.appendChild(newElement);
}

function onRemoveStaticLease(index)
{
    static_lease = document.getElementById('static_lease');

    if (0 < index && index < static_lease.rows.length - 1)
    {
        static_lease.deleteRow(index);
    }
}

function loadNetwork()
{
    if(typeof window.ActiveXObject != 'undefined')
    {
        xmlhttp = (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else
    {
        xmlhttp = (new XMLHttpRequest());
    }

    var data = "/cgi-bin/network?cmd=status";

    xmlhttp.open( "POST", data, true );
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=euc-kr");
    xmlhttp.onreadystatechange = function()
    {
        if( (xmlhttp.readyState == 4) && (xmlhttp.status == 200) )
        {
            try
            {
                interfaces = xmlhttp.responseXML.documentElement.getElementsByTagName("ETH");
                for(i = 0 ; i < interfaces.length ; i++)
                {
                    ifname 	= interfaces[i].getElementsByTagName("IFNAME")[0].firstChild.nodeValue;
                    ipaddr  = interfaces[i].getElementsByTagName("IPADDR")[0].firstChild.nodeValue;
                    netmask = interfaces[i].getElementsByTagName("NETMASK")[0].firstChild.nodeValue;
                    if (i == 0)
                    {
                        ip_eth0 = ipaddr.split(".");
                    }
                    if (i == 1)
                    {
                        ip_eth1 = ipaddr.split(".");
                    }
                    //alert(ipaddr);
                    //addInterface(ifname, ipaddr, netmask);
                }
            }
            catch(e)
            {
            }
        }
    };
    xmlhttp.send();
}

function onSystemRestart()
{
    if(typeof window.ActiveXObject != 'undefined')
    {
        xmlhttp = (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else
    {
        xmlhttp = (new XMLHttpRequest());
    }

    var data = "/cgi-bin/system?cmd=reboot";

    xmlhttp.open( "POST", data, true );
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=euc-kr");
    xmlhttp.onreadystatechange = function()
    {
        if( (xmlhttp.readyState == 4) && (xmlhttp.status == 200) )
        {
            try
            {
                ret  = xmlhttp.responseXML.documentElement.getElementsByTagName("RET");
                if (ret[0].firstChild.nodeValue == 'OK')
                {
                    alert(msg[msgResetaring]);
                }
                else
                {
                    alert(msg[msgRestartFailed]);
                }
            }
            catch(e)
            {
                window.location.href = '/';
            }
        }
    }
    xmlhttp.send();
}