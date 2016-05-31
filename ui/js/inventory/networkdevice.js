var Networkdevice = (function (TableUtil) {
    //columns to be placed in main table
    var columns = ["hostname", "macAddress", "type", "vendor", "family", "numUpdates", "id"];
    return {
        showList: function () {
            TableUtil.showList("network-device",columns);
        }
    };
})(TableUtil);