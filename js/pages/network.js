/**
 * Created by kindmong on 2015-11-05.
 */
$(document).ready(function(){
    loadNetworkData();
});

function loadNetworkData() {
    $.ajax({
        type:"get",
        url:"/cgi-bin/network?cmd=status",
        dataType:"xml",
        success : function(xml) {
            // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
            // TODO
            $(xml).find("ETH").each(function(){
                //console.log($(this).find("INDEX").text());
                //console.log($(this).find("IFNAME").text());
                //console.log($(this).find("IPADDR").text());
                //console.log($(this).find("NETMASK").text());
                //console.log($(this).find("MACADDR").text());

                if($(this).find("IFNAME").text() == "br-lan") {
                    makeBody("table_lan", $(this));
                }
                if($(this).find("IFNAME").text() == "eth0") {
                    makeBody("table_wan", $(this));
                }

            });
        },
        error : function(xhr, status, error) {
            //alert("에러발생");
            window.location.href="/";
        }
    });
}

// Network Status 테이블 추가
function makeBody(_tableName, xml) {
    var tbody = document.createElement("tbody");
    var tbody_tr = document.createElement("tr");
    document.getElementById(_tableName).appendChild(tbody);
    tbody_tr.appendChild(document.createElement("td")).innerHTML = xml.find("IFNAME").text();
    tbody_tr.appendChild(document.createElement("td")).innerHTML = xml.find("IPADDR").text();
    tbody_tr.appendChild(document.createElement("td")).innerHTML = xml.find("NETMASK").text();
    tbody_tr.appendChild(document.createElement("td")).innerHTML = xml.find("MACADDR").text();
    tbody.appendChild(tbody_tr);
}