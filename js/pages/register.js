/**
 * Created by kindmong on 2015-10-27.
 */
var sensors = [];

$(document).ready(function(){

    // 검색 버튼
    $("#btn_search").click(function(){
        var mac = document.getElementById("inputMac").value;
        console.log(mac);
        loadData(mac);
    });
});
function loadData (_mac) {

    $.ajax({
        type:"get",
        url:"/cgi-bin/sensor?cmd=getlist&mac=" + _mac,
        //url:"../js/pages/network.xml",
        dataType:"xml",
        success : function(xml) {
            var tbody = makePanel(_mac);

            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            $(xml).find("SENSOR").each(function(){
                makeBody(tbody, $(this), $(this).find("MAC").text());
            });
        },
        error : function(xhr, status, error) {
            //alert("에러발생");
            window.location.href="/";
        }
    });
}

function setDatabase() {
    // 배열에 들어있는 센서들을 DB에 넣는다.
    // 파라미터에 이어 붙여 보낸다.
    console.log("센서 등록");

    $.each (sensors, function (index, value){
        var mac = value.substr(3, 17);
        var id = value.substr(21);
        console.log(index, mac, id);

        $.ajax({
            async:false,
            type:"post",
            url:"/cgi-bin/sensor?cmd=set&mac=" + mac + "&id=" + id,
            //url:"../js/pages/network.xml",
            dataType:"xml",
            success : function(xml) {
                // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
                // TODO
                $(xml).find("SENSOR_ADDED").each(function(){
                    console.log($(this).find("RET").text());
                    removeList(mac, id);
                    if (sensors.length == index + 1) {
                        alert("SAVE SENSOR");
                    }
                });
            },
            error : function(xhr, status, error) {
                //alert("에러발생");
                window.location.href="/";
            }
        });
    });
    sensors = [];
}


function onCheckboxClicked() {
    // 체크가 된 센서들을 배열에 넣는다.
    //console.log(this.id, this.checked);
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
    var btn_success = document.createElement("button");
    btn_success.setAttribute("class", "btn btn-success");
    btn_success.setAttribute("type", "button");
    btn_success.addEventListener("click", setDatabase);
    btn_success.appendChild(document.createTextNode("Register"));

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
    thead_tr.appendChild(document.createElement("th")).innerHTML = "ID";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "NAME";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "TYPE";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "SN";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "STATE";
    thead_tr.appendChild(document.createElement("th")).innerHTML = "VALUE";
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody");
    table.appendChild(tbody);

    panel_footer.appendChild(btn_success);
    panel_footer.appendChild(btn_close);
    row.appendChild(col_lg_12);
    col_lg_12.appendChild(panel);
    panel.appendChild(panel_header);
    panel.appendChild(table);
    panel.appendChild(panel_footer);

    document.getElementById("page-wrapper").appendChild(row);

    return tbody;
}

function makeBody(_tbody, _item, _mac) {

    var tbody_tr = document.createElement("tr");
    _tbody.appendChild(tbody_tr);

    var input = document.createElement("input");
    input.type = "checkbox";
    input.value = "";
    input.setAttribute("id", "cb_" + _mac.replace(/"/g, "") + "_" + _item.find("ID").text().replace(/"/g, ""));// + "_" + _index);
    input.addEventListener("change", onCheckboxClicked);
    tbody_tr.appendChild(document.createElement("th")).appendChild(input);
    tbody_tr.appendChild(document.createElement("th")).innerHTML = _item.find("ID").text();
    tbody_tr.setAttribute("id", "tr_" + _mac.replace(/"/g, "") + "_" + _item.find("ID").text().replace(/"/g, ""));

    //var input = document.createElement("input");
    //input.setAttribute("class", "form-control");
    //input.setAttribute("type", "text");
    //input.setAttribute("id", "input_" + _mac + "_" + _item.find("ID").text());// + "_" + _index);
    //input.value = _item.find("NAME").text();
    //console.log("input.id = ", input.id);
    //tbody_tr.appendChild(document.createElement("td").appendChild(input));
	tbody_tr.appendChild(document.createElement("td")).innerHTML = _item.find("NAME").text();
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _item.find("TYPE").text();
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _item.find("SN").text();
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _item.find("STATE").text();
    tbody_tr.appendChild(document.createElement("td")).innerHTML = _item.find("VALUE").text();
}

function removeList(_mac, _id) {

    // 리스트에서 삭제
    var tr = document.getElementById("tr_" + _mac + "_" + _id);
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