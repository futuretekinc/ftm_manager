/**
 * Created by kindmong on 2015-11-05.
 */
function init() {
    
    document.getElementById("th_port").innerHTML = _t('port');
    document.getElementById("th_ip").innerHTML = _t('ip');
    document.getElementById("th_subnet").innerHTML = _t('subnet');
    // document.getElementById("th_mac").innerHTML = _t('mac');

    document.getElementById("a_default_info").innerHTML = _t('network');
    document.getElementById("a_lte_status_info").innerHTML = _t('status_info');
    document.getElementById("a_apn_setting").innerHTML = _t('apn_setting');
    document.getElementById("a_dhcp_status_info").innerHTML = _t('status_info');
    document.getElementById("a_dhcp_setting").innerHTML = _t('btn_register');

    document.getElementById("h_information").innerHTML =  _t('information');
    document.getElementById("th_key").innerHTML =  _t('key');
    document.getElementById("th_value").innerHTML =  _t('value');
}

$(document).ready(function(){
    menu();
    init();
    usim_socket_status();
});

function usim_socket_status() {

    var url = "";
    if (isTest) {
        url = "/json/usim_socket_status.json";
    } else {
        url = "/cgi-bin/usim?cmd=usim_socket_status";
    }

    $.ajax({
        type:"get",
        url:url,
        dataType:"json",
        success : function(json) {
            
            console.log(json);

            if (json.result == "success") {
                if (json.usim.status == "not installed") {
                    console.log("유심 미장착");
                    alert("USIM이 장착되어있지 않습니다.\nUSIM을 장착하신 후 전원을 껐다 켜주십시오.");
                    return;
                } else {
                    console.log("유심장착");
                    //usim_different_status();
                    usim_cnum();
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
}

/*function usim_different_status(){
    $.ajax({
        type:"get",
        url:"/cgi-bin/usim?cmd=usim_different_status",
        dataType:"xml",
        success : function(xml) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            $(xml).find("data").each(function(){
                console.log($(this).find("text").text());
                result = $(this).find("text").text();
                if (result == "done" || result == "URC MESSAGE") {
                    alert('다시 시도해 주십시오..');
                    return;
                }
                if (result == 3) {
                    // 기기인증 실패 (타단말 유심 의심)
                    alert("타 이통사 USIM 입니다.\n새로운 USIM을 장착한 후 전원을 껏다 켜주십시오.");
                    //document.getElementById("usim_status").innerHTML = "타 이통사 USIM";
                    return;
                }
                usim_open_status();
            });
        },
        error : function(xhr, status, error) {
            //alert("에러발생");
            window.location.href="/";
        }
    });
}*/

/*function usim_open_status(){
    $.ajax({
        type7:"get",
        url:"/cgi-bin/usim?cmd=usim_open_status",
        dataType:"xml",
        success : function(xml) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            $(xml).find("data").each(function(){
                console.log($(this).find("text").text());
                result = $(this).find("text").text();
                if (result == "done" || result == "URC MESSAGE") {
                    alert('다시 시도해 주십시오..');
                    return;
                }
                if (result == 1) {
                    // 미개통 유심
                    alert("미개통 USIM입니다.\n개통후 전원을 껏다 켜 주십시오.");
                    //document.getElementById("usim_status").innerHTML = "미개통 USIM";
                    return;
                }
                usim_cnum();
            });
        },
        error : function(xhr, status, error) {
            //alert("에러발생");
            window.location.href="/";
        }
    });
}*/


function usim_cnum() {

    var url = "";
    if (isTest) {
        url = "/json/cnum.json";
    } else {
        url = "/cgi-bin/cnum?cmd=get";
    }
    
    $.ajax({
        type:"get",
        url:url,
        dataType:"json",
        success : function(json) {
            
            console.log(json);

            if (json.result == "success") {
                var tbody = document.getElementById("static_body");
                tr = document.createElement("tr");
                tbody.appendChild(tr);
                tr.appendChild(document.createElement("th")).innerHTML = "MSISDN";
                tr.appendChild(document.createElement("td")).innerHTML = json.modem.mdn;
                is_limited();
            } else {
                alert("Please Retry");
            }
        },
        error : function(xhr, status, error) {
            console.log("에러발생");
            //window.location.href="/";
        }
    });
}


function is_limited() {
    var url = "";
    if (isTest) {
        url = "/json/is_limited.json";
    } else {
        url = "/cgi-bin/usim?cmd=is_limited";
    }
    
    $.ajax({
        type:"get",
        url:url,
        dataType:"json",
        success : function(json) {
            
            console.log(json);

            if (json.result == "success") {

                var tbody = document.getElementById("static_body");
                
                if (json.net.status == "no service") {
                    tr = document.createElement("tr");
                    tbody.appendChild(tr);
                    tr.appendChild(document.createElement("th")).innerHTML = "USIM Status";
                    tr.appendChild(document.createElement("td")).innerHTML = "No Service";
                    return;
                } else {
                    tr = document.createElement("tr");
                    tbody.appendChild(tr);
                    tr.appendChild(document.createElement("th")).innerHTML = "USIM Status";
                    tr.appendChild(document.createElement("td")).innerHTML = "Ready";
                    //get_pppData();
                    networkState();
                }
                
            } else {
                alert("Please Retry");
            }
        },
        error : function(xhr, status, error) {
            console.log("에러발생", status, error);
            networkState();
            //window.location.href="/";
        }
    });
}


/*function get_pppData() {
    $.ajax({
        type:"get",
        url:"/cgi-bin/getdata?cmd=state",
        dataType:"xml",
        success : function(xml) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            $(xml).find("data").each(function(){
                console.log($(this).find("text").text());
                result = $(this).find("text").text();
                //var resultArr = result.split(" ");
                //var rx_data = resultArr[0];
                //var tx_data = resultArr[1];
                //var rx = document.getElementById("rx_data");
                //var tx = document.getElementById("tx_data");
                //rx.innerHTML = bytesToSize(rx_data);
                //tx.innerHTML = bytesToSize(tx_data);
                networkState();
            });
        },
        error : function(xhr, status, error) {
            //alert("에러발생");
            window.location.href="/";
        }
    });
}*/
function networkState() {
    var keys = ["usim", "tx_power", "tx_adjust", "time", "system_id", "rx_power", "reg_zone", "pilot_pn_offset", "network_id", "mdn", "ec_lo", "dl_earfcn", "base_station_id"];

    var url = "";
    if (isTest) {
        url = "/json/network_state.json";
    } else {
        url = "/cgi-bin/network_state?cmd=get";
    }

    $.ajax({
        type:"get",
        url:url,
        dataType:"json",
        success : function(json) {
            
            console.log(json);

            if (json.result == "success") {

                $.each(json.modem.info, function(key, value) {
                    var td = document.getElementById(key);
                    td.innerHTML = value;
                });
                loadpppIP();

            } else {
                alert("Please Retry");
            }
        },
        error : function(xhr, status, error) {
            console.log("에러발생");
            //window.location.href="/";
        }
    });
}

function loadpppIP() {
     var url = "";
    if (isTest) {
        url = "/json/pppip.json";
    } else {
        url = "/cgi-bin/pppip?cmd=get";
    }

    $.ajax({
        type:"get",
        url:url,
        dataType:"json",
        success : function(json) {
            
            console.log(json);

            if (json.result == "success") {
                console.log(json.net.ip);
                document.getElementById("usb0_port").innerHTML = "usb0";
                document.getElementById("usb0_ip").innerHTML = json.net.ip;
                document.getElementById("usb0_subnet").innerHTML = "255.255.255.0";
            } else {
                alert("Please Retry");
            }
        },
        error : function(xhr, status, error) {
            console.log("에러발생");
            //window.location.href="/";
        }
    });
}

/*function usim_sending_stop_status()
{
    if(typeof window.ActiveXObject != 'undefined')
    {
        xmlhttp = (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else
    {
        xmlhttp = (new XMLHttpRequest());
    }
    
    var data = "/cgi-bin/usim?cmd=usim_sending_stop_status";

    xmlhttp.open( "POST", data, true );
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=euc-kr");
    xmlhttp.onreadystatechange = function()
    {
        if( (xmlhttp.readyState == 4) && (xmlhttp.status == 200) )
        {
            try
            {
                result = xmlhttp.responseXML.documentElement.getElementsByTagName("res")[0];
                if (result.firstChild.nodeValue == 'OK') {

                    // 파싱
                    var resultNode = xmlhttp.responseXML.documentElement.getElementsByTagName("text")[0];
                    var result = resultNode.firstChild.nodeValue;

                    if (result == "done" || result == "URC MESSAGE")
                    {
                        document.getElementById('message').innerHTML='다시 시도해 주십시오..';
                        return;
                    }

                    //result = "Barred";
                    if (result == "OK")
                    {
                        // 정상 서비스 상태
                        document.getElementById("usim_status").innerHTML = "READY";
                    }
                    if (result == "Barred")
                    {
                        // 발신정지 상태
                        alert("단말이 발신정지 상태입니다.\n고객센터에 연락하여 발신정지 해지를 요청하십시오.\n발신정지가 해지되면 단말을 재부팅 해주십시오.");
                        document.getElementById("usim_status").innerHTML = "발신정지";
                        //return;
                    }

                    new_pppData();

                } else {
                    // error
                    alert("Please Refresh..");
                }
            }
            catch(e)
            {

            }
        }
    }
    xmlhttp.send();
}*/