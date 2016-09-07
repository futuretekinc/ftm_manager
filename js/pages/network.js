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
}

$(document).ready(function(){
    init();
    loadNetworkData();
});

function loadNetworkData() {
    $.ajax({
        type:"get",
        url:"/test_network_info.json",
        dataType:"json",
        success : function(json) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            //console.log(json);

            for (var i=0; i<json.interface[0].port.length; i++) {
                var option = document.createElement("option");
                document.getElementById("interface").appendChild(option);
                document.getElementById("interface").addEventListener("change", onChangeInterface);
                option.innerHTML = json.interface[0].port[i];;
            }

            document.getElementById("ip").value         = json.interface[0].ipaddr;
            document.getElementById("subnet").value     = json.interface[0].netmask;
            document.getElementById("gateway").value    = json.interface[0].gateway;

            for (var i=0; i<json.interface[1].port.length; i++) {
                var option = document.createElement("option");
                document.getElementById("interface_sub").appendChild(option);
                document.getElementById("interface_sub").addEventListener("change", onChangeInterface);
                option.innerHTML = json.interface[1].port[i];;
            }

            if (json.interface[0].proto == "auto") {
                document.getElementById("dhcp").checked = true;

            }
            if (json.interface[1].proto == "auto") {
                document.getElementById("dhcp_sub").checked = true;
                document.getElementById("ip_sub").disabled = true;
                document.getElementById("subnet_sub").disabled = true;
                document.getElementById("gateway_sub").disabled = true;
            }

            document.getElementById("dhcp").addEventListener("change", onCheckboxClicked);
            document.getElementById("dhcp_sub").addEventListener("change", onCheckboxClicked);

            document.getElementById("ip_lan").value         = json.interface[2].ipaddr;
            document.getElementById("subnet_lan").value     = json.interface[2].netmask;
            
        },
        error : function(xhr, status, error) {
            alert("에러발생");
        }
    });
}

function onChangeInterface() {
    //console.log(this.value);
    if (this.id == "interface") {
        if (this.value == "lte0")
        {
            changeState("", true);
        } else {
            changeState("", false);
        }
    } else {
        if (this.value == "lte0")
        {
            changeState("_sub", true);
        } else {
            changeState("_sub", false);
        }
    }
}

function changeState(_common, _isTrue) {
    document.getElementById("dhcp" + _common).disabled = _isTrue;
    document.getElementById("dhcp" + _common).checked = _isTrue;
    document.getElementById("ip" + _common).disabled = _isTrue;
    document.getElementById("subnet" + _common).disabled = _isTrue;
    document.getElementById("gateway" + _common).disabled = _isTrue;
}

function onCheckboxClicked() {
    //console.log("onCheckboxClicked", this.id.substr(4));
    if (this.checked == true) {
        document.getElementById("ip" + this.id.substr(4)).disabled = true;
        document.getElementById("subnet" + this.id.substr(4)).disabled = true;
        document.getElementById("gateway" + this.id.substr(4)).disabled = true;
    } else {
        document.getElementById("ip" + this.id.substr(4)).disabled = false;
        document.getElementById("subnet" + this.id.substr(4)).disabled = false;
        document.getElementById("gateway" + this.id.substr(4)).disabled = false;
    }
}

function onApply() {
    var isSubWan = document.getElementById("sub_wan_cb").checked;
    var param = "";

    param += "&type0=wan"
    if (document.getElementById("dhcp").checked) {
        param += "&proto0=" + "dhcp";
    } else {
        param += "&proto0=" + "static";
        param += "&ip0=" + document.getElementById("ip").value;
        param += "&netmask0=" + document.getElementById("subnet").value;
        param += "&gateway0=" + document.getElementById("gateway").value;
    }
    param += "&port0=" + document.getElementById("interface").value;

    if (isSubWan)
    {
        param += "&type1=wan";

        if (document.getElementById("dhcp_sub").checked) {
            param += "&proto1=" + "auto";
        } else {
            param += "&proto1=" + "static";
        }
        param += "&port1=" + document.getElementById("interface_sub").value;

        param += "&type2=lan";
        param += "&ip2=" + document.getElementById("ip_lan").value;
        param += "&netmask2=" + document.getElementById("subnet_lan").value;
        param += "&port2=all";
    
    } else {

        param += "&type1=lan";
        param += "&ip1=" + document.getElementById("ip_lan").value;
        param += "&netmask1=" + document.getElementById("subnet_lan").value;
        param += "&port1=all";
    }
    
    console.log(param);

    $.ajax({
        type:"get",
        url:"/cgi-bin/network?cmd=set" + param,
        dataType:"json",
        success : function(json) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            console.log(json.result);
            alert(json.result);
        },
        error : function(xhr, status, error) {
            console.log("에러발생");
        }
    });
}