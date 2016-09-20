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

    document.getElementById("sub_wan_cb").addEventListener("change", subWanCBClicked);
}

$(document).ready(function(){
    init();
    loadNetworkData();
});

function loadNetworkData() {
    $.ajax({
        type:"get",
        url:"/test_network_info.json",
        //url:"/cgi-bin/network?cmd=get",
        dataType:"json",
        success : function(_json) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            //console.log(json);

            var json = _json.network;
            var ports = json.port;

            for (var i=0; i<ports.length; i++)
            {
                //console.log(ports[i].name, ports[i].type, ports[i].wan);
                if (ports[i].wan == "yes")
                {
                    console.log("wan yes ::: ", ports[i].name, i);
                    var option1 = document.createElement("option");
                    document.getElementById("interface").appendChild(option1);
                    option1.innerHTML = ports[i].name;
                    option1.setAttribute("value", i);

                    var option2 = document.createElement("option");
                    document.getElementById("interface_sub").appendChild(option2);
                    option2.innerHTML = ports[i].name;
                    option2.setAttribute("value", i);
                }
            }
            document.getElementById("interface").addEventListener("change", onChangeInterface);
            document.getElementById("interface_sub").addEventListener("change", onChangeInterface);

            if (document.getElementById("interface").value == "0")
            {
                changeState("", true);
                $("#interface_sub").val("1");
            } else {
                changeState("", false);
                $("#interface_sub").val("0");
            }

            // for (var i=0; i<json.interface[0].port.length; i++) {
            //     var option = document.createElement("option");
            //     document.getElementById("interface").appendChild(option);
            //     document.getElementById("interface").addEventListener("change", onChangeInterface);
            //     option.innerHTML = json.interface[0].port[i];

            // }
            
            if (json.interface[0].ipaddr != null) {
                document.getElementById("ip").value         = json.interface[0].ipaddr;
            }
            if (json.interface[0].netmask != null) {
                document.getElementById("subnet").value     = json.interface[0].netmask;
            }
            if (json.interface[0].gateway != null) {
                document.getElementById("gateway").value    = json.interface[0].gateway;
            }
            
            document.getElementById("dhcp").addEventListener("change", onCheckboxClicked);
            if (json.interface[0].proto == "dhcp" || json.interface[0].proto == "auto") {
                document.getElementById("dhcp").checked = true;
                document.getElementById("ip").disabled = true;
                document.getElementById("subnet").disabled = true;
                document.getElementById("gateway").disabled = true;
            }

            document.getElementById("dhcp_sub").addEventListener("change", onCheckboxClicked);
            if (json.interface[1].proto == "dhcp" || json.interface[1].proto == "auto") {
                document.getElementById("dhcp_sub").checked = true;
                document.getElementById("ip_sub").disabled = true;
                document.getElementById("subnet_sub").disabled = true;
                document.getElementById("gateway_sub").disabled = true;
            }

            if (json.interface[1].type == "wan") {
                
                document.getElementById("sub_wan_cb").checked = true;

                // for (var i=0; i<json.interface[1].port.length; i++) {
                //     var option = document.createElement("option");
                //     document.getElementById("interface_sub").appendChild(option);
                //     document.getElementById("interface_sub").addEventListener("change", onChangeInterface);
                //     option.innerHTML = json.interface[1].port[i];;
                // }
    
                
                
                

                document.getElementById("ip_lan").value         = json.interface[2].ipaddr;
                document.getElementById("subnet_lan").value     = json.interface[2].netmask;
            } else {

                document.getElementById("sub_wan_cb").checked = false;

                if (document.getElementById("sub_wan_cb").checked == true) {
                    document.getElementById("sub_container").hidden = false;
                } else {
                    document.getElementById("sub_container").hidden = true;
                }

                document.getElementById("ip_lan").value         = json.interface[1].ipaddr;
                document.getElementById("subnet_lan").value     = json.interface[1].netmask;
            }
        },
        error : function(xhr, status, error) {
            alert("에러발생");
        }
    });
}

function onChangeInterface() {
    console.log("func | onChangeInterface | this.value =", this.value);

    if (this.id == "interface") {
        if (this.value == "0")
        {
            changeState("", true);
            changeState("_sub", false);
            //$("#interface_sub").val("eth0").attr("selected", "selected");
            $("#interface_sub").val("1");
        } else {
            changeState("", false);
            changeState("_sub", true);
            $("#interface_sub").val("0").attr("selected", "selected");
        }
    } else {
        if (this.value == "0")
        {
            changeState("_sub", true);
            changeState("", false);
            //$("#interface").val("eth0").attr("selected", "selected");
            $("#interface").val("1");
        } else {
            changeState("_sub", false);
            changeState("", true);
            $("#interface").val("0").attr("selected", "selected");
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

function subWanCBClicked() {
    if (this.checked == true) {
        document.getElementById("sub_container").hidden = false;
    } else {
        document.getElementById("sub_container").hidden = true;
    }
}

function onApply() {
    var isSubWan = document.getElementById("sub_wan_cb").checked;
    var param = "";

    param += "&type0=wan"
    if (document.getElementById("dhcp").checked) {
        if ($("#interface option:selected").text() == "usb0") {
            param += "&proto0=" + "auto";
        } else {
            param += "&proto0=" + "dhcp";
        }
    } else {
        param += "&proto0=" + "static";
        param += "&ip0=" + $("#ip").val();
        param += "&netmask0=" + $("#subnet").val();
        param += "&gateway0=" + $("#gateway").val();
    }
    param += "&port0=" + $("#interface option:selected").text();

    if (isSubWan)
    {
        param += "&type1=wan";

        if (document.getElementById("dhcp_sub").checked) {
            if ($("#interface_sub option:selected").text() == "usb0") {
                param += "&proto1=" + "auto";
            } else {
                param += "&proto1=" + "dhcp";
            }
        } else {
            param += "&proto1=" + "static";
            param += "&ip1=" + $("#ip_sub").val();
            param += "&netmask1=" + $("#subnet_sub").val();
            param += "&gateway1=" + $("#gateway_sub").val();
        }
        param += "&port1=" + $("#interface_sub option:selected").text();

        param += "&type2=lan";
        param += "&ip2=" + $("#ip_lan").val();
        param += "&netmask2=" + $("#subnet_lan").val();
        param += "&proto2=static";
        param += "&port2=all";
    
    } else {

        param += "&type1=lan";
        param += "&ip1=" + $("#ip_lan").val();
        param += "&netmask1=" + $("#subnet_lan").val();
        param += "&proto1=static";
        param += "&port1=all";
    }
    
    console.log(param);
    return;

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