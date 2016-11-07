/**
 * Created by kindmong on 2015-11-05.
 */
var ths = ["name", "target", "type", "proto", "port", "policy", "delete"];

$(document).ready(function(){
    menu();
    init();
});

//===========================================================================================
function init() {
    
    document.getElementById("h_firewall").innerHTML = _t('firewall_setting');
    document.getElementById("modify_btn").innerHTML = _t('modify');
    document.getElementById("btn_add").innerHTML = _t('add');

    document.getElementById("a_default_info").innerHTML = _t('network');
    document.getElementById("a_lte_status_info").innerHTML = _t('status_info');
    document.getElementById("a_apn_setting").innerHTML = _t('apn_setting');
    document.getElementById("a_dhcp_status_info").innerHTML = _t('status_info');
    document.getElementById("a_dhcp_setting").innerHTML = _t('btn_register');

    // document.getElementById("label_enable").innerHTML = _t('enabled');
    // document.getElementById("th_number").innerHTML = _t('number');
    // document.getElementById("th_sort").innerHTML = _t('sort');
    // document.getElementById("th_ip").innerHTML = _t('ip');
    // document.getElementById("th_protocol").innerHTML = _t('protocol');
    // document.getElementById("th_port").innerHTML = _t('port');
    // document.getElementById("th_add").innerHTML = _t('add');

    var url = "";
    if (isTest) {
        url = "/json/test_netfilter.json";
    } else {
        url = "/cgi-bin/netfilter?cmd=get";
    }

    $.ajax({
        type:"get",
        url:url,
        dataType:"json",
        success : function(json) {
            var rules = json.netfilter.rules;
            var tbody = document.getElementById("tbody");
            console.log(tbody);
            for (var i in rules) {
                // console.log(rules[i]);
                var tbody_tr = document.createElement("tr");
                tbody_tr.setAttribute("id", "tr_" + i);
                tbody.appendChild(tbody_tr);
                
                for (var j=0; j<ths.length; j++) {
                    var td = document.createElement("td");
                    tbody_tr.appendChild(td);

                    $.each(rules[i], function(key, value) {
                        // console.log(key, ths[j]);
                        if (key == ths[j]) {
                            td.innerHTML = value;
                        }
                    });

                    if (ths[j] == "delete") {
                        var btn_modify = document.createElement("button");
                        btn_modify.setAttribute("class", "btn btn-danger btn-xs");
                        btn_modify.setAttribute("type", "button");
                        btn_modify.setAttribute("id", "btn_" + i);
                        btn_modify.appendChild(document.createTextNode(_t("remove")));
                        btn_modify.addEventListener("click", function(){
                            console.log(this.id.substr(4));
                            // 리스트에서 삭제
                            var tr = document.getElementById("tr_" + this.id.substr(4));
                            console.log(tr);
                            var tr_parent = tr.parentNode;
                            tr_parent.removeChild(tr);
                            tr = null;
                        });
                        td.appendChild(btn_modify);
                    }
                }

                /*if (rules[i].match) {
                    console.log(rules[i].name, rules[i].type, rules[i].src, rules[i].match, rules[i].target);
                } else {
                    console.log(rules[i].name, rules[i].type, rules[i].src, rules[i].proto, rules[i].target);
                }*/
            }
            
        },
        error : function(xhr, status, error) {
            console.log("fail");
        }
    });
}

function addNetfilter() {
    $("#modal_netfilter_add").modal();
}

$("#modal_btn_add").click(function() {
    var name = document.getElementById("name").value;
    var target = document.getElementById("target").value;
    var proto = document.getElementById("proto").value;
    // var match = document.getElementById("match").value;
    var port = document.getElementById("port").value;
    var policy = document.getElementById("policy").value;

    //console.log(name, target, proto, port, policy);
    var rowCount = $('#control_table tr').length;
    // console.log(rowCount);

    var tbody = document.getElementById("tbody");
    var tbody_tr = document.createElement("tr");
    tbody_tr.setAttribute("id", "tr_" + (rowCount - 1));
    tbody.appendChild(tbody_tr);

    for (var i=0; i<ths.length; i++) {
        var td = document.createElement("td");
        tbody_tr.appendChild(td);

        if (document.getElementById(ths[i]) != null) {
            td.innerHTML = document.getElementById(ths[i]).value;
        } else {
            if (ths[i] == "delete") {
                var btn_modify = document.createElement("button");
                btn_modify.setAttribute("class", "btn btn-danger btn-xs");
                btn_modify.setAttribute("type", "button");
                btn_modify.setAttribute("id", "btn_" + (rowCount - 1));
                btn_modify.appendChild(document.createTextNode(_t("remove")));
                btn_modify.addEventListener("click", function(){
                    console.log(this.id.substr(4));
                    // 리스트에서 삭제
                    var tr = document.getElementById("tr_" + this.id.substr(4));
                    console.log(tr);
                    var tr_parent = tr.parentNode;
                    tr_parent.removeChild(tr);
                    tr = null;
                });
                td.appendChild(btn_modify);    
            }
        }
    }
    $("#modal_netfilter_add").modal("hide");
});
//===========================================================================================
/*function init() {

    document.getElementById("h_firewall").innerHTML = _t('firewall_setting');
    document.getElementById("modify_btn").innerHTML = _t('modify');
    document.getElementById("btn_add").innerHTML = _t('add');

    document.getElementById("a_default_info").innerHTML = _t('network');
    document.getElementById("a_lte_status_info").innerHTML = _t('status_info');
    document.getElementById("a_apn_setting").innerHTML = _t('apn_setting');
    document.getElementById("a_dhcp_status_info").innerHTML = _t('status_info');
    document.getElementById("a_dhcp_setting").innerHTML = _t('btn_register');

    document.getElementById("label_enable").innerHTML = _t('enabled');
    document.getElementById("th_number").innerHTML = _t('number');
    document.getElementById("th_sort").innerHTML = _t('sort');
    document.getElementById("th_ip").innerHTML = _t('ip');
    document.getElementById("th_protocol").innerHTML = _t('protocol');
    document.getElementById("th_port").innerHTML = _t('port');
    document.getElementById("th_add").innerHTML = _t('add');

    $.ajax({
        type:"get",
        url:"/cgi-bin/firewall?cmd=status",
        dataType:"xml",
        success : function(xml) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            $(xml).find("STATUS_NETWORK").each(function(){
                var state = $(this).find("STATE").text();

                if (state == 'enabled') {
                    document.getElementById("enable").checked = true;
                } else {
                    document.getElementById("enable").checked = false;
                }

                var rules = $(this).find("RULE");
                for (i = 0 ; i < rules.length ; i++)
                {
                    dir = rules[i].getElementsByTagName('DIR')[0].firstChild.nodeValue;
                    sip = rules[i].getElementsByTagName('SIP')[0].firstChild.nodeValue;
                    proto = rules[i].getElementsByTagName('PROTO')[0].firstChild.nodeValue;
                    dport = rules[i].getElementsByTagName('DPORT')[0].firstChild.nodeValue;

                    if (dir == 'IN')
                    {
                        addHost(sip, proto, dport);
                    }
                }
            });
        },
        error : function(xhr, status, error) {
            alert("xml 로드 실패");
            //window.location.href="/";
        }
    });
}
function createOption(value, txt)
{
    var item = document.createElement('option');
    item.value=value;
    item.innerHTML=txt;

    return	item;
}

function createAddressType(_type, _callback)
{
    var item = document.createElement('select');
    item.appendChild(createOption(0, 'Single'));
    item.appendChild(createOption(1, 'Any'));
    item.id = 'type';
    item.value = _type;
    item.setAttribute("class", "form-control");
    item.onchange=function()
    {
        if (item.value == 0)
        {
            _callback(false);
        }
        else
        {
            _callback(true);
        }
    }

    return	item;
}

function createProtocolType(type)
{
    var item = document.createElement('select');
    //item.appendChild(createOption('all', 'ALL'));
    item.appendChild(createOption('tcp', 'TCP'));
    item.appendChild(createOption('udp', 'UDP'));
    item.appendChild(createOption('icmp', 'ICMP'));
    item.setAttribute("class", "form-control");
    item.id = 'type';
    item.value = type;

    return	item;
}

function createInput(value, _class, _readonly)
{
    var item = document.createElement('input');
    item.type = 'text';
    item.value = value;
    item.setAttribute('class', _class);
    item.readOnly = _readonly;

    return	item;
}

function createBtn(value, _class, _onclick)
{
    var item = document.createElement('input');
    item.type = 'button';
    item.value = value;
    item.onclick = _onclick;
    item.setAttribute('onclick', _onclick);
    item.setAttribute('class', _class);

    return	item;
}

function addHost(sip, proto, dport)
{
    table = document.getElementById('control_table');
    index = table.rows.length - 1;
    row = table.insertRow(index);
    console.log(index);
    if (sip == '0.0.0.0')
    {
        var input_sip 	= createInput(sip, 'form-control', true);
        var select_type	= createAddressType(1, function(_readonly) {input_sip.value='0.0.0.0'; input_sip.readOnly=_readonly;});
    }
    else
    {
        var input_sip = createInput(sip, 'form-control', false);
        var select_type	= createAddressType(0, function(_readonly) {input_sip.readOnly=_readonly;});
    }

    cell = row.insertCell(0);
    cell.setAttribute('class','center');
    cell.innerHTML = index;
    cell = row.insertCell(1);
    cell.setAttribute('class','center');
    cell.appendChild(select_type);
    cell = row.insertCell(2);
    cell.setAttribute('class','center');
    cell.appendChild(input_sip);
    cell = row.insertCell(3);
    cell.setAttribute('class','center');
    cell.appendChild(createProtocolType(proto));
    cell = row.insertCell(4);
    cell.setAttribute('class','center');
    cell.appendChild(createInput(dport, "form-control"));
    cell = row.insertCell(5);
    cell.setAttribute('class','center');
    cell.appendChild(createBtn("remove", "btn btn-default", "onRemoveHost(" + (index) + ");"));
}

function onAddHost()
{
    addHost('0.0.0.0', 'all', '0');
}

function onRemoveHost(index)
{
    table = document.getElementById('control_table');
    console.log(table.rows.length)
    if (0 < index && index < table.rows.length - 1)
    {
        table.deleteRow(index);
        for( ; index < table.rows.length - 1; index++)
        {
            table.rows[index].cells[0].innerHTML = index;
            table.rows[index].cells[5].firstChild.setAttribute("onclick", "onRemoveHost(" + (index) + ");");
        }
    }
}*/

function onApply()
{
    var param = "/cgi-bin/netfilter?cmd=set";
    var table = document.getElementById("control_table");

    var rowCount = $('#control_table tr').length;

    for(i = 1 ; i < rowCount; i++)
    {
        //console.log(table.rows[i].cells[0].innerHTML);
        param += '&name' + (i-1) + '=' + table.rows[i].cells[0].innerHTML;
        param += '&target' + (i-1) + '=' + table.rows[i].cells[1].innerHTML;
        param += '&proto' + (i-1) + '=' + table.rows[i].cells[3].innerHTML;
        param += '&port' + (i-1) + '=' + table.rows[i].cells[4].innerHTML;
        //param += '&match' + (i-1) + '=' + "'" + table.rows[i].cells[5].innerHTML + "'";
        param += '&policy' + (i-1) + '=' + table.rows[i].cells[5].innerHTML;
    }
    console.log(param);
    //alert(param)
    $.ajax({
        type:"get",
        url:param,
        dataType:"json",
        success : function(json) {
            
            console.log(json.result);
            if (json.result == "success") {

                // iptable 재실행
                $.ajax({
                    type:"get",
                    url:"/cgi-bin/netfilter?cmd=restart",
                    dataType:"json",
                    success : function(json) {
                        console.log(json.result);
                        alert(json.result);
                    },
                    error : function(xhr, status, error) {
                        console.log("에러발생");
                    }
                });
            }
            //alert(json.result);
        },
        error : function(xhr, status, error) {
            console.log("에러발생");
        }
    });




    /*if(typeof window.ActiveXObject != 'undefined')
    {
        xmlhttp = (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else
    {
        xmlhttp = (new XMLHttpRequest());
    }

    var data = "/cgi-bin/firewall?cmd=set";

    if (document.getElementById("enable").checked == true)
    {
        data += "&state=enabled" ;
    }
    else
    {
        data += "&state=disabled" ;
    }

    table = document.getElementById('control_table');
    for(i = 1 ; i < table.rows.length - 1; i++)
    {
        data += '&sip' + (i-1) + '=' + table.rows[i].cells[2].firstChild.value;
        data += '&proto' + (i-1) + '=' + table.rows[i].cells[3].firstChild.value;
        data += '&dport' + (i-1) + '=' + table.rows[i].cells[4].firstChild.value;
    }

    xmlhttp.open( "POST", data, true );
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
                    alert(msg[msgUpdateSuccess]);
                }
                else
                {
                    alert(msg[msgUpdateFailed]);
                }
            }
            catch(e)
            {
            }
        }
    }
    xmlhttp.send();*/
}
