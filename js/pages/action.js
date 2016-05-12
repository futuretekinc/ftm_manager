/**
 * Created by kindmong on 2015-10-27.
 */
$(document).ready(function(){
    loadActionList();
});
function loadActionList () {
    $.ajax ({
        type:"get",
        url:"/cgi-bin/action?cmd=list&field1=all",
        async:false,
        dataType:"json",
        success:response_list
    });
}

function response_list(json) {
    console.log(json);
    var actions = json.actions;

    $.each(actions, function(key){
        console.log("id :", actions[key].id, "type :", actions[key].type, "name :", actions[key].name, "epid :", actions[key].action.epid, "value :", actions[key].action.value);
        var tbody = makePanel(actions[key].id);
        makeBody(tbody, actions[key]);
    });
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
    panel_header.innerHTML = _mac +  " ";

    // 헤더에 수정 버튼 생성
    var btn_modify = document.createElement("button");
    btn_modify.setAttribute("class", "btn btn-default btn-xs");
    btn_modify.setAttribute("type", "button");
    btn_modify.setAttribute("id", "btn_" + _mac);

    // 버튼의 설정 아이콘 생성.
    var span = document.createElement("span");
    span.setAttribute("class", "glyphicon glyphicon-cog");

    /*btn_modify.appendChild(span);
    btn_modify.addEventListener("click", function(){

        $.ajax ({
            type:"get",
            url:"/cgi-bin/node?cmd=get&did=" + _mac,
            async:false,
            dataType:"json",
            success:response_node_info
        });
        console.log(this.id);
    });
    panel_header.appendChild(btn_modify);*/


    //패널 안에 센서 리스트들 테이블로 구성
    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered");

    var thead = document.createElement("thead");
    var thead_tr = document.createElement("tr");
    thead.appendChild(thead_tr);

    var thNames = ["id", "type", "name", "action epid", "action value", "modify"];

    for (var i=0; i<thNames.length; i++) {
        var th = document.createElement("th");
        thead_tr.appendChild(th).innerHTML = thNames[i];
    }

    table.appendChild(thead);


    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody_" + _mac);
    table.appendChild(tbody);

    row.appendChild(col_lg_12);
    col_lg_12.appendChild(panel);
    panel.appendChild(panel_header);
    panel.appendChild(table);

    document.getElementById("page-wrapper").appendChild(row);

    return tbody;
}

function makeBody(_tbody, _actions) {

    var tbody_tr = document.createElement("tr");
    _tbody.appendChild(tbody_tr);

    tbody_tr.appendChild(document.createElement("td")).innerHTML = _actions.id;
    tbody_tr.setAttribute("id", "tr_" + _actions.id);

    tbody_tr.appendChild(document.createElement("td")).innerHTML = _actions.type;
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _actions.name;
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _actions.action.epid;
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _actions.action.value;

    var btn_modify = document.createElement("button");
    btn_modify.setAttribute("class", "btn btn-danger btn-xs");
    btn_modify.setAttribute("type", "button");
    btn_modify.setAttribute("id", "btn_" + _actions.id);
    btn_modify.appendChild(document.createTextNode("Modify"));
    btn_modify.addEventListener("click", function(){
        console.log(this.id);
        var id = this.id.substr(4);
        $.ajax ({
            type:"get",
            url:"/cgi-bin/action?cmd=get&id=" + id,
            async:false,
            dataType:"json",
            success:function(json){
                var action = json.action;
                console.log(action);
                document.getElementById("modal_action_title").innerHTML = action.id;
                document.getElementById("action_name").value = action.name;
                document.getElementById("action_value").value = action.action.value;
            }
        });

        $("#modal_action_config").modal();
    });
    tbody_tr.appendChild(document.createElement("th")).appendChild(btn_modify);
}

$("#modal_btn_action_delete").click(function(){
    removeAction();
    $("#modal_action_config").modal("hide");
});

$("#modal_btn_action_modify").click(function(){
    modifyAction();
    $("#modal_action_config").modal("hide");
});

function modifyAction() {
    
    // 센서의 이름을 수정할 수 있다.
    var id = document.getElementById("modal_action_title").innerHTML;
    console.log("id =", id);

    var tr = document.getElementById("tr_" + id);
    //console.log(tr);
    var type_td = tr.childNodes.item(1);
    var name_td = tr.childNodes.item(2);
    var value_td = tr.childNodes.item(4);

    console.log("type_td.innerHTML =", type_td.innerHTML);

    name_td.innerHTML = document.getElementById("action_name").value;
    console.log("name_td.innerHTML =", name_td.innerHTML);

    value_td.innerHTML = document.getElementById("action_value").value;
    console.log("value_td.innerHTML =", value_td.innerHTML);

    var url = "/cgi-bin/action?cmd=set&id=" + id + "&name=" + name_td.innerHTML;

    if (type_td.innerHTML == "SET") {
        url += "&value=" + value_td.innerHTML;
    }

    $.ajax ({
        type:"get",
        url:url,
        async:false,
        dataType:"json",
        success: function (json) {
            console.log(json.result);
            if (json.result == "success") {
                alert("success");
            } else {
                alert("failed");
            }
        }
    });
}

function removeAction() {
    
    // 센서의 삭제할 수 있다.
    var id = document.getElementById("modal_action_title").innerHTML;
    console.log("id =", id);

    $.ajax ({
        type:"get",
        url:"/cgi-bin/action?cmd=del&id=" + id,
        async:false,
        dataType:"json",
        success: function (json) {
            console.log(json.result);
            if (json.result == "success") {
                alert("success");
                window.location.reload();
            } else {
                alert("failed");
            }
        }
    });

    // 리스트에서 삭제
    var tr = document.getElementById("tr_" + id);
    console.log(tr);
    var tr_parent = tr.parentNode;
    tr_parent.removeChild(tr);
    tr = null;

    // 리스트 체크하여 패널을 삭제해야함.
}

$("#btn_action_add").click(function(){
    
    // 모달에 쓰인 자료를 초기화 해준다.
    var eps_select = document.getElementById("add_epid");
    eps_select.options.length = 0;

    document.getElementById("add_type").value = "";
    document.getElementById("add_epid").value = "";
    document.getElementById("add_name").value = "";
    document.getElementById("add_value").value = "";
    
    // 현재 관리중인 epid 를 불러와서 select에 넣어준다.
    $.ajax ({
        type:"get",
        url:"/cgi-bin/ep?cmd=list",
        async:false,
        dataType:"json",
        success: function (json) {
            // console.log(json.eps);
            var eps = json.eps;
            var eps_select = document.getElementById("add_epid");
            if (json.result == "success") {
                $.each(eps, function(key){
                    var ep = eps[key].epid;
                    console.log(ep);
                    var option = document.createElement("option");
                    eps_select.appendChild(option);
                    option.innerHTML = ep;
                });
            } else {
                alert("load fail");
            }
        }
    });

    $("#modal_action_add").modal();
});

$('#add_type').on('change', function () {
    
    var value_tf = document.getElementById("add_value");
    var epid_select = document.getElementById("add_epid");

    if (this.value != "set") {
        value_tf.disabled = epid_select.disabled = true;
        value_tf.value = epid_select.value = "";
    } else {
        value_tf.disabled = epid_select.disabled = false;
    }
});

$('#modal_btn_action_add').click(function(){

    var type = document.getElementById("add_type").value;
    var epid = document.getElementById("add_epid").value;
    var name = document.getElementById("add_name").value;
    var value = document.getElementById("add_value").value;

    console.log(type, epid, value, name);

    var url = "/cgi-bin/action?cmd=add&type=" + type + "&name=" + name;
    if (type == "set") {
        url += "&epid=" + epid + "&value=" + value;
    }
    console.log(url);
    
    $.ajax ({
        type:"get",
        url:url,
        async:false,
        dataType:"json",
        success: function (json) {
            
            if (json.result == "success") {
                alert("success");
               //window.location.reload();
            } else {
                alert("fail");
            }
        }
    });
    $("#modal_action_add").modal("hide");
});