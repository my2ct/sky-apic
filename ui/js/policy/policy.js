var Policy = (function (TableUtil) {

    //columns to be placed in main table
    var columns = ["policyName", "policyOwner", "state", "taskId", "id"];
    return {
        showList: function () {
            TableUtil.showList("policy",columns);
        }
    };
})(TableUtil);