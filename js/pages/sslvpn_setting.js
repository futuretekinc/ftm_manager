/**
 * Created by kindmong on 2015-11-05.
 */
function init() {
    $.li18n.currentLocale = 'kr';
    document.getElementById("menu_dashboard").innerHTML = _t('dashboard');
    document.getElementById("menu_sensors").innerHTML = _t('sensors');
    document.getElementById("menu_clouds").innerHTML = _t('clouds');
    document.getElementById("menu_network").innerHTML = _t('network');
    document.getElementById("menu_system").innerHTML = _t('system');
	document.getElementById("modify_btn").innerHTML = _t('modify');

	document.getElementById("a_default_info").innerHTML = _t('network');
}

$(document).ready(function(){
    init();
    initVPN();
});

//json으로  수정해야함.
function initVPN() {
	var url = "";
    if (isTest) {
        url = "/json/sslvpn.json";
    } else {
        url = "/cgi-bin/sslvpn?cmd=get";
    }

    $.ajax({
        type:"get",
        url:url,
        dataType:"json",
        success : function(json) {
    
            var remote_tf = document.getElementById("remote");
			var port_tf = document.getElementById("port");
			var auth_retry_tf = document.getElementById("auth_retry");
			var connect_retry_tf = document.getElementById("connect_retry");
			var connect_retry_max_tf = document.getElementById("connect_retry_max");
			var id_tf = document.getElementById("id");
			var password_tf = document.getElementById("password");

			remote_tf.value = json.config.remote;
			port_tf.value = json.config.port;
			auth_retry_tf.value = json.config.auth;
			connect_retry_tf.value = json.config.retry;
			connect_retry_max_tf.value = json.config.max;
			id_tf.value = json.config.id;
			password_tf.value = json.config.pw;
        
        },
        error : function(xhr, status, error) {
			console.log("에러발생");
			//window.location.href="/";
        }
    });
}

function setVPN()
{
	var data = "/cgi-bin/sslvpn?cmd=set"

	var remote_tf = document.getElementById("remote");
	var port_tf = document.getElementById("port");
	var auth_retry_tf = document.getElementById("auth_retry");
	var connect_retry_tf = document.getElementById("connect_retry");
	var connect_retry_max_tf = document.getElementById("connect_retry_max");
	var id_tf = document.getElementById("id");
	var password_tf = document.getElementById("password");

	data += "&remote=" + remote_tf.value;
	data += "&port=" + port_tf.value;
	data += "&auth_retry=" + auth_retry_tf.value;
	data += "&connect_retry=" + connect_retry_tf.value;
	data += "&connect_retry_max=" + connect_retry_max_tf.value;
	data += "&id=" + id_tf.value;
	data += "&password=" + password_tf.value;

	$.ajax({
        type:"get",
        url:data,
        dataType:"json",
        success : function(json) {
            console.log(json);
            if (json.result == "success") {
            	alert("변경 되었습니다.");
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
				result = xmlhttp.responseXML.documentElement.getElementsByTagName("RET")[0];
				if (result.firstChild.nodeValue == 'OK') {
					alert("접속을 다시 시도합니다.");
				} else {
					alert("VPN : ERROR");
				}
			}
			catch(e)
			{

			}
		}
	}
	xmlhttp.send();*/
}