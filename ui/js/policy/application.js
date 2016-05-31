var Application = (function (TableUtil) {
    //columns to be placed in main table
    var columns =["applicationGroup", "category", "subCategory", "name", "references", "appProtocol", "id"];
    return {
        showList: function () {
            TableUtil.showList("application",columns);
        }
    };
})(TableUtil);
