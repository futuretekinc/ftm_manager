/**
 * Created by kindmong on 2015-11-05.
 */
$(document).ready(function(){
	menu();
    init();
});

function init() {
	document.getElementById("a_default_info").innerHTML = _t('network');
    document.getElementById("a_lte_status_info").innerHTML = _t('status_info');
    document.getElementById("a_apn_setting").innerHTML = _t('apn_setting');
    document.getElementById("a_dhcp_status_info").innerHTML = _t('status_info');
    document.getElementById("a_dhcp_setting").innerHTML = _t('btn_register');

	alert("WIFI 미탑제");
	window.location.href = "../../pages/network.html";
}