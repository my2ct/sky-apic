var Location = (function (TableUtil) {
    //columns to be placed in main table
    var columns = ["civicAddress", "geographicalAddress", "description", "locationName", "id"];
    return {
        showList: function () {
            TableUtil.showList("location",columns);
        }
    };
})(TableUtil);