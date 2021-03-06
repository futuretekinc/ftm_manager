/**
 * Created by kindmong on 2015-11-05.
 */
$(document).ready(function(){
    menu();
    init();
});

function init() {
    document.getElementById("h_dhcp_info").innerHTML = _t('dhcp_info');
    document.getElementById("h_dhcp_ip_info").innerHTML = _t('dhcp_ip_info');

    document.getElementById("th_status").innerHTML = _t('state');
    document.getElementById("th_interface").innerHTML = _t('text_active_interface');
    document.getElementById("th_ip_start").innerHTML = _t('ip_start');
    document.getElementById("th_ip_end").innerHTML = _t('ip_end');
    document.getElementById("th_gateway").innerHTML = _t('text_active_gateway');
    document.getElementById("th_leases_time").innerHTML = _t('leases_time');
    document.getElementById("th_static_ip").innerHTML = _t('static_ip');
    document.getElementById("th_dns1").innerHTML = _t('dns') + " 1";
    document.getElementById("th_dns2").innerHTML = _t('dns') + " 2";

    document.getElementById("th_number").innerHTML = _t('number');
    document.getElementById("th_mac").innerHTML = _t('mac');
    document.getElementById("th_ip").innerHTML = _t('ip');
    document.getElementById("th_name").innerHTML = _t('name');
    document.getElementById("th_time_remain").innerHTML = _t('time_remain');

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
                if (config.enable == true) {
                    document.getElementById("status").innerHTML = "enable";
                } else {
                    document.getElementById("status").innerHTML = "disable";
                }
                document.getElementById("interface").innerHTML = config.interface;
                document.getElementById("start").innerHTML = config.start;
                document.getElementById("end").innerHTML = config.end;
                document.getElementById("router").innerHTML = config.router;
                document.getElementById("time").innerHTML = config.lease;
                document.getElementById("dns1").innerHTML = config.dns[0];
                document.getElementById("dns2").innerHTML = config.dns[1];
                if (config.static == 1) {
                    document.getElementById("static").innerHTML = "enable";
                } else {
                    document.getElementById("static").innerHTML = "disable";
                }

                var leases = config.leases;
                active_ip(leases);

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
                //console.log($(this).find("STATUS").text());
                document.getElementById("status").innerHTML = $(this).find("STATUS").text();
                document.getElementById("interface").innerHTML = $(this).find("INTERFACE").text();
                document.getElementById("start").innerHTML = $(this).find("START").text();
                document.getElementById("end").innerHTML = $(this).find("END").text();
                document.getElementById("router").innerHTML = $(this).find("ROUTER").text();
                document.getElementById("time").innerHTML = $(this).find("TIME").text();
                document.getElementById("dns1").innerHTML = $(this).find("DNS1").text();
                document.getElementById("dns2").innerHTML = $(this).find("DNS2").text();
                var staticip = $(this).find("STATIC").text();
                if (staticip == 1) {
                    document.getElementById("static").innerHTML = "enable";
                } else {
                    document.getElementById("static").innerHTML = "disable";
                }

                var leases = $(this).find("LEASE");
                active_ip(leases);
            });
        },
        error : function(xhr, status, error) {
            //alert("에러발생");
            window.location.href="/";
        }
    });*/
}

function active_ip(leases) {
    //console.log(leases);

    var url = "";
    if (isTest) {
        url = "/json/active_ip.xml";
    } else {
        url = "/cgi-bin/dhcp?cmd=real_status";
    }

    $.ajax({
        type:"get",
        url:url,
        dataType:"xml",
        success : function(xml) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            $(xml).find("ACTIVE_IP").each(function(){
                result = $(this).find("IP");
                console.log(result);
                var arr = [];
                for (var k = 0; k < result.length; k++)
                {
                    arr.push(result[k].firstChild.nodeValue);
                }

                ips = arr.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
                //ips = ["(192.168.100.20)"]; //임시

                list_count=0;
                for(j = 0 ; j < ips.length ; j++)
                {
                    ip = ips[j];
                    ip = ip.replace(/\(/g,''); //특정문자 제거
                    ip = ip.replace(/\)/g,''); //특정문자 제거
                    //alert(ip);

                    if (leases.length != 0)
                    {
                        for(i = 0 ; i < leases.length ; i++)
                        {
                            macaddr = leases[i].mac;

                            ipaddr = leases[i].ipaddr.replace(/\s+$/g, "");;

                            if (hostname = leases[i].hostname == null)
                            {
                                hostname = "";
                             } else {
                                hostname = leases[i].hostname;
                            }

                            expiresin = leases[i].expiresin;
                            //alert(i);
                            var tbody = document.getElementById('dhcp_active_leases');
                            if (ip == ipaddr)
                            {
                                var tbody_tr = document.createElement("tr");
                                tbody.appendChild(tbody_tr);
                                tbody_tr.appendChild(document.createElement("td")).innerHTML = list_count+1;
                                tbody_tr.appendChild(document.createElement("td")).innerHTML = macaddr;
                                tbody_tr.appendChild(document.createElement("td")).innerHTML = ipaddr;
                                tbody_tr.appendChild(document.createElement("td")).innerHTML = hostname;
                                tbody_tr.appendChild(document.createElement("td")).innerHTML = expiresin;
                                list_count++;
                            }


                        }
                    }
                }
            });
        },
        error : function(xhr, status, error) {
            console.log("에러발생");
            // window.location.href="/";
        }
    });
}