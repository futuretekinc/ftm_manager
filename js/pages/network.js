/**
 * Created by kindmong on 2015-11-05.
 */
function init() {
    document.getElementById("sub_wan_cb").addEventListener("change", subWanCBClicked);

    document.getElementById("text_active_wan").innerHTML = _t('text_active_wan');
    document.getElementById("text_active_interface").innerHTML = _t('text_active_interface');
    document.getElementById("text_active_dhcp").innerHTML = _t('text_active_dhcp');
    document.getElementById("text_active_ip").innerHTML = _t('text_active_ip');
    document.getElementById("text_active_subnet").innerHTML = _t('text_active_subnet');
    document.getElementById("text_active_gateway").innerHTML = _t('text_active_gateway');

    document.getElementById("text_standby_wan").innerHTML = "&nbsp;" + _t('text_standby_wan');
    document.getElementById("text_standby_interface").innerHTML = _t('text_active_interface');
    document.getElementById("text_standby_dhcp").innerHTML = _t('text_active_dhcp');
    document.getElementById("text_standby_ip").innerHTML = _t('text_active_ip');
    document.getElementById("text_standby_subnet").innerHTML = _t('text_active_subnet');
    document.getElementById("text_standby_gateway").innerHTML = _t('text_active_gateway');

    document.getElementById("text_lan").innerHTML = _t('text_lan');
    document.getElementById("text_lan_ip").innerHTML = _t('text_active_ip');
    document.getElementById("text_lan_subnet").innerHTML = _t('text_active_subnet');

    document.getElementById("modify_btn").innerHTML = _t('modify');
}

$(document).ready(function(){
    menu();
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
            var activeWanIdx = "";
            var activeWan = "";
            var standbyWan = "";
            var currentLan = "";

            for (var j=0; j<json.interface.length; j++) {
                if (json.interface[j].failover == "active") {
                    activeWan = j;
                    console.log("active", activeWan);
                }
                if (json.interface[j].type == "lan") {
                    currentLan = j;
                    console.log("lan", currentLan);
                }
                if (json.interface[j].failover == "standby") {
                    standbyWan = j;
                    console.log("standby", standbyWan);
                }
            }

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

                    if (json.interface[activeWan].port[0] == ports[i].name) {
                        activeWanIdx = i;
                    }
                }
            }

            document.getElementById("interface").addEventListener("change", onChangeInterface);
            document.getElementById("interface_sub").addEventListener("change", onChangeInterface);

            $("#interface").val(activeWanIdx).attr("selected", "selected");

            if (json.interface[activeWan].ipaddr != null) {
                document.getElementById("ip").value         = json.interface[activeWan].ipaddr;
            }
            if (json.interface[activeWan].netmask != null) {
                document.getElementById("subnet").value     = json.interface[activeWan].netmask;
            }
            if (json.interface[activeWan].gateway != null) {
                document.getElementById("gateway").value    = json.interface[activeWan].gateway;
            }
            
            document.getElementById("dhcp").addEventListener("change", onCheckboxClicked);
            if (json.interface[activeWan].proto == "dhcp" || json.interface[activeWan].proto == "auto") {
                document.getElementById("dhcp").checked = true;
                document.getElementById("ip").disabled = true;
                document.getElementById("subnet").disabled = true;
                document.getElementById("gateway").disabled = true;
            }

            document.getElementById("dhcp_sub").addEventListener("change", onCheckboxClicked);
            if (standbyWan != "") {
                if (json.interface[standbyWan].proto == "dhcp" || json.interface[standbyWan].proto == "auto") {
                    document.getElementById("dhcp_sub").checked = true;
                    document.getElementById("ip_sub").disabled = true;
                    document.getElementById("subnet_sub").disabled = true;
                    document.getElementById("gateway_sub").disabled = true;
                }
            }

            if (standbyWan != "") {
                document.getElementById("sub_wan_cb").checked = true;
                if (json.interface[standbyWan].type == "wan") {
                
                    document.getElementById("sub_wan_cb").checked = true;
                    document.getElementById("ip_lan").value         = json.interface[currentLan].ipaddr;
                    document.getElementById("subnet_lan").value     = json.interface[currentLan].netmask;
                }
            } else {
                document.getElementById("sub_wan_cb").checked = false;

                if (document.getElementById("sub_wan_cb").checked == true) {
                    document.getElementById("sub_container").hidden = false;
                } else {
                    document.getElementById("sub_container").hidden = true;
                }

                document.getElementById("ip_lan").value         = json.interface[currentLan].ipaddr;
                document.getElementById("subnet_lan").value     = json.interface[currentLan].netmask;
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