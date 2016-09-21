var	msg;
var	msgConfirmRestart = 0;
var msgResetaring = 1;
var msgRestartFailed=2;

$(document).ready(function(){
    $.li18n.currentLocale = 'kr';
    document.getElementById("menu_dashboard").innerHTML = _t('dashboard');
    document.getElementById("menu_sensors").innerHTML = _t('sensors');
    document.getElementById("menu_clouds").innerHTML = _t('clouds');
    document.getElementById("menu_network").innerHTML = _t('network');
    document.getElementById("menu_system").innerHTML = _t('system');
    
    document.getElementById("info").innerHTML = _t('information');
    document.getElementById("log").innerHTML = _t('log');
    document.getElementById("restart").innerHTML = _t('restart');

    document.getElementById("system_reboot").innerHTML = _t('system_reboot');
    document.getElementById("reboot_message").innerHTML = _t('reboot_message');
});

function onInit()
{
	msg = new Array();
	msg[msgConfirmRestart] = "시스템을 재시작 하시겠습니까?";
	msg[msgResetaring] = '시스템 재시작 중입니다.\n잠시 후 재시작해 주시기 바랍니다.[최대 30초]';
	msg[msgRestartFailed] = '시스템 재시작을 실패 하였습니다.\n잠시 후 다시 시도해 주십시오.';
	document.getElementById('page_title').innerHTML = '시스템 관리';
	document.getElementById('section1_title').innerHTML='시스템 재시작';
	document.getElementById('restart_info').innerHTML='시스템 재시작을 원하시면, 아래의 버튼을 누르시기 바랍니다.';
	document.getElementById('btn_restart').value = '재시작';
	
		
	document.getElementById('body').hidden = false;
}

function onLoad()
{
	onInit();
	enablePageTimeout();
}


function onSystemRestart()
{
	if (confirm("restart?"))
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
}

