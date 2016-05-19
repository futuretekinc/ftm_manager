/**
 * Created by kindmong on 2015-10-27.
 */
var sensors = [];
var interval;
var intervalCount = 0;

$(document).ready(function(){

    // 검색 버튼
    $("#btn_search").click(function(){
        var mac = document.getElementById("inputMac").value;
        mac = mac.replace(/ /gi, '');
        if (mac != '') {
            
            if (document.getElementById("row_" + mac)) {
                alert("Already loaded");
            } else {
                //loadData(mac);
                startDiscovery(true);
                //$("#btn_search").attr('disabled',true);
            }

        } else {
            alert("All Search Mac");

            if (document.getElementById("row_" + mac)) {
                alert("Already loaded");
            } else {
                //loadData(mac);
                startDiscovery(false);
                //$("#btn_search").attr('disabled',true);
            }
        }
    });
});

function startDiscovery(_isAll) {
    $.ajax ({
        type:"get",
        url:"/cgi-bin/discovery?cmd=start&ip=10.0.1.255",
        async:false,
        dataType:"json",
        success:function(json) {
            var result = json.result;
            console.log(result);
            if (result == "success") {
                interval = setInterval( function() { getDiscoveryResult(_isAll); }, 1000);
                //getEpsList(_isAll);
            } else {
                alert("discovery failed");
            }
        }
    });
}

function getDiscoveryResult(_isAll) {
    $.ajax ({
        type:"get",
        url:"/cgi-bin/discovery?cmd=get",
        async:false,
        dataType:"json",
        success:function(json) {
            var result = json.result;
            if (result == "success") {
                var finished = json.finished;
                if (finished == "true") {
                    // 노드 리스트가져오기
                    console.log("ready");
                    intervalCount = 0;
                    getEpsList(_isAll);
                    clearInterval(interval);
                    $("#btn_search").attr('disabled',false);
                } else {
                    console.log("discovery ing..");
                    intervalCount++;
                    console.log(intervalCount);
                    if (intervalCount > 15) {
                        intervalCount = 0;
                        clearInterval(interval);
                        alert("retry search..");
                        $("#btn_search").attr('disabled',false);
                    }
                }
            } else {
                alert("discovery failed");
                $("#btn_search").attr('disabled',false);
            }
        }
    });
}

function getEpsList(_isAll) {
    $.ajax ({
        type:"get",
        url:"/cgi-bin/ep?cmd=list",
        async:false,
        dataType:"json",
        success:function(json) {
            var result = json.result;
            console.log("getEpsList =", result);
            if (result == "success") {
                var registed_eps = json.eps;
                var eps = [];
                $.each(registed_eps, function(key){
                    var registed_epid = registed_eps[key].epid;
                    //console.log(registed_epid);
                    eps.push(registed_epid);
                });
                getEps(eps, _isAll);
            } else {
                alert("discovery failed");
            }
        }
    });
}

function getEps(_eps, _isAll) {
    var mac = document.getElementById("inputMac").value;
    mac = mac.replace(/ /gi, '');

    $.ajax ({
        type:"get",
        url:"/cgi-bin/discovery?cmd=eps",
        async:false,
        dataType:"json",
        success:function(json) {
            var result = json.result;
            console.log(result);
            if (result == "success") {
                var count = json.count;
                var eps = json.eps;
                for (var i = 0; i<count; i++) {
                    var ep = eps[i].ep;
                    var did = ep.did;
                    var epid = ep.epid;
                    // console.log("did =", epid);

                    if (mac.toLowerCase() == did.toLowerCase() && _isAll == false) {
                        if(_eps.indexOf(epid.toLowerCase()) == -1) {
                            var tbody = makePanel(did);
                            makeBody(tbody, ep);
                        }
                        $("#btn_search").attr('disabled',false);
                    } else {
                        if(_eps.indexOf(epid.toLowerCase()) == -1) {
                            var tbody = makePanel(did);
                            makeBody(tbody, ep);
                        }
                        $("#btn_search").attr('disabled',false);
                    }
                }
            } else {
                alert("failed");
            }
        }
    });   
}

function addSensorList() {
    console.log("센서 등록");
    var did = this.id.substr(9);
    console.log("getIsNode(did)", getIsNode(did));
    //return;
    if (!getIsNode(did)) {
        console.log("!!!!!!!");
        //http://10.0.1.18/cgi-bin/node?cmd=add&type=snmp&version=1&url=10.0.1.148&community=futuretek&mib=fte.mib
        $.ajax ({
            type:"get",
            url:"/cgi-bin/discovery?cmd=nodes",
            async:false,
            dataType:"json",
            success:function(json) {
                var result = json.result;
                
                if (result == "success") {
                    var nodes = json.nodes;
                    $.each(nodes, function(index, node) {
                        if (did.toLowerCase() == node.did.toLowerCase()) {
                            $.ajax ({
                                type:"get",
                                url:"/cgi-bin/node?cmd=add&did=" + did + "&type=" + node.type + "&version=" + node.snmp.version + "&url=" + node.snmp.url + "&community=" + node.snmp.community + "&mib=" + node.snmp.mib,
                                async:false,
                                dataType:"json",
                                success:function(json) {
                                    var result = json.result;
                                    console.log("/cgi-bin/node?cmd=add", result);
                                    if (result == "success") {

                                    } else {
                                        console.log("failed");
                                    }
                                }
                            });
                        }
                    });
                } else {
                    console.log("failed");
                }
            }
        });
    }

    $.each (sensors, function (index, value){
        var epid = value.substr(3).toLowerCase();
        var type = document.getElementById("tr_" + value.substr(3)).cells[2].innerHTML;
        console.log(did, type, epid);

        $.ajax ({
            type:"get",
            url:"/cgi-bin/ep?cmd=add&epid=" + epid + "&type=" + type + "&did=" + did,
            async:false,
            dataType:"json",
            success:function(json) {
                var result = json.result;
                console.log(result);
                if (result == "success") {
                    //interval = setInterval("getDiscoveryResult()", 1000);
                    console.log("success added");
                    removeList(value.substr(3));
                } else {
                    alert("failed");
                }
            }
        });

        console.log(index, epid);
    });

    sensors = [];
}

function getIsNode(_did) {
    var isnode;
    $.ajax ({
        type:"get",
        url:"/cgi-bin/node?cmd=list",
        async:false,
        dataType:"json",
        success:function(json) {
            var result = json.result;
            console.log(result);
            if (result == "success") {
                var savedNodes = json.nodes;
                for (var i=0; i<savedNodes.length; i++) {
                    var node = savedNodes[i].did;
                    if (node.toLowerCase() == _did.toLowerCase()) {
                        isnode = true;
                        break;
                    } else {
                        isnode = false;
                    }
                }
            } else {
                
            }
        }
    });

    console.log(isnode);
    return isnode;
}

function onCheckboxClicked() {
    // 체크가 된 센서들을 배열에 넣는다.
    console.log(this.id, this.checked);
    if (this.checked == true) {
        sensors.push(this.id);
    } else {
        if (sensors.indexOf(this.id) != -1) {
            sensors.splice(sensors.indexOf(this.id), 1);
        }
    }
    console.log(sensors);
}

function makePanel(_mac) {

    if (document.getElementById("row_" + _mac)) {
        //console.log("있음");
        return document.getElementById("tbody_" + _mac);
    }

    // 패널을 추가할 row 생성
    var row = document.createElement("div");
    row.setAttribute("id", "row_" + _mac);
    row.setAttribute("class", "row");

    var col_lg_12 = document.createElement("div");
    col_lg_12.setAttribute("class", "col-lg-12");

    // 패널 생성
    var panel = document.createElement("div");
    panel.setAttribute("class", "panel panel-green");

    // 패널 헤더
    var panel_header = document.createElement("div");
    panel_header.setAttribute("class", "panel-heading");
    panel_header.innerHTML = _mac;

    //패널 푸터
    var panel_footer = document.createElement("div");
    panel_footer.setAttribute("class", "panel-footer");

    //패널 등록 버튼
    var btn_register = document.createElement("button");
    btn_register.setAttribute("class", "btn btn-success");
    btn_register.setAttribute("type", "button");
    btn_register.setAttribute("id", "register_" + _mac);
    btn_register.addEventListener("click", addSensorList);
    btn_register.appendChild(document.createTextNode("Register"));

    //패널 닫기 버튼
    var btn_close = document.createElement("button");
    btn_close.setAttribute("class", "btn btn-danger");
    btn_close.setAttribute("type", "button");
    btn_close.setAttribute("id", "close_" + _mac);
    btn_close.addEventListener("click", removePanel);
    btn_close.appendChild(document.createTextNode("Close"));

    //패널 안에 센서 리스트들 테이블로 구성
    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered");

    var thead = document.createElement("thead");
    var thead_tr = document.createElement("tr");
    thead.appendChild(thead_tr);

    //var input = document.createElement("input");
    //input.setAttribute("type", "checkbox");
    //input.value = "";
    thead_tr.appendChild(document.createElement("th")).innerHTML = ""; //appendChild(input);
    thead_tr.appendChild(document.createElement("th")).innerHTML = "epid";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "type";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "name";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "unit";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "state";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "interval";
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody_" + _mac);
    table.appendChild(tbody);

    panel_footer.appendChild(btn_register);
    panel_footer.appendChild(btn_close);
    row.appendChild(col_lg_12);
    col_lg_12.appendChild(panel);
    panel.appendChild(panel_header);
    panel.appendChild(table);
    panel.appendChild(panel_footer);

    document.getElementById("page-wrapper").appendChild(row);

    return tbody;
}

function makeBody(_tbody, _ep) {
    console.log("_ep.epid =", _ep.epid);
    if (document.getElementById("tr_" + _ep.epid)) {
        //console.log("있음");
        return;
    }

    var tbody_tr = document.createElement("tr");
    _tbody.appendChild(tbody_tr);

    var input = document.createElement("input");
    input.type = "checkbox";
    input.value = "";
    input.setAttribute("id", "cb_" + _ep.epid);// + "_" + _index);
    input.addEventListener("change", onCheckboxClicked);
    tbody_tr.appendChild(document.createElement("th")).appendChild(input);
    tbody_tr.appendChild(document.createElement("th")).innerHTML = _ep.epid;
    tbody_tr.setAttribute("id", "tr_" + _ep.epid);

	tbody_tr.appendChild(document.createElement("td")).innerHTML = _ep.type;
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _ep.name;
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _ep.unit;
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _ep.state;
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _ep.interval;
}

function removeList(_epid) {

    // 리스트에서 삭제
    var tr = document.getElementById("tr_" + _epid);
    console.log("test = ", tr);
    var tr_parent = tr.parentNode;
    tr_parent.removeChild(tr);
    tr = null;
}

function removePanel() {

    var mac = this.id.substr(6);
    var row_id = "row_" + mac;
    var row = document.getElementById(row_id);

    var row_parent = row.parentNode;
    row_parent.removeChild(row);
    row = null;
   // console.log(mac);
}
