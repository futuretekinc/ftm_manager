/**
 * Created by kindmong on 2015-11-05.
 */
$(document).ready(function(){
	menu();
    init();
});

function init() {
	
	document.getElementById("h_apn").innerHTML = _t('apn_setting');
	document.getElementById("modify_btn").innerHTML = _t('modify');

	document.getElementById("a_default_info").innerHTML = _t('network');
	document.getElementById("a_lte_status_info").innerHTML = _t('status_info');
    document.getElementById("a_apn_setting").innerHTML = _t('apn_setting');
    document.getElementById("a_dhcp_status_info").innerHTML = _t('status_info');
    document.getElementById("a_dhcp_setting").innerHTML = _t('btn_register');

    var url = "";
    if (isTest) {
    	url = "/json/apn_info.json";
    } else {
    	url = "/cgi-bin/apn?cmd=get";
    }
	
    $.ajax({
        type:"get",
        url:url,
        dataType:"json",
        success : function(json) {
            
        	console.log(json);

        	if (json.result == "success") {
        		var apn_tf = document.getElementById("apn");
        		apn_tf.value = json.apn.internet;
        	} else {
        		alert("Please Retry");
        	}

            /*$(xml).find("data").each(function(){
                console.log($(this).find("text").text());
                result = $(this).find("text").text();
                if (result == "done" || result == "URC MESSAGE") {
                    alert('다시 시도해 주십시오..');
                    return;
                }

                var textArr = result.split(",");
                var apn_tf = document.getElementById("apn");
                apn_tf.value = textArr[1];
            });*/
        },
        error : function(xhr, status, error) {
			//alert("에러발생");
			window.location.href="/";
        }
    });
}

function setAPN()
{
	if (confirm("설정 후 재부팅을 시작합니다."))
	{
		var url = "/cgi-bin/apn2?cmd=set"
		var apn_tf = document.getElementById("apn");

		url += "&cid=0";
		url += "&apn=" + apn_tf.value;
		
		$.ajax({
	        type:"get",
	        url:url,
	        dataType:"json",
	        success : function(json) {
	            
	        	console.log(json);

	        	if (json.result == "success") {
	        		alert("재부팅을 시작합니다.");
					onSystemRestart();
	        	} else {
	        		alert("Please Retry");
	        	}
	        },
	        error : function(xhr, status, error) {
				alert("Error");
				//window.location.href="/";
	        }
	    });
	}
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