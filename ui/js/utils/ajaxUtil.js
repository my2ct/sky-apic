//mainly used for making ajaxCalla with aysnchronous get function to get the counnts for links,hosr ,..etc
var AjaxUtil = (function () {

    var baseApiUrl = "https://sandboxapic.cisco.com/api/v0/";
    var root = 'host';
    var countConfig = [
        {url: 'host', elemId: 'hostCount'}, {url: 'network-device', elemId: 'networkDeviceCount'},
        {url: 'link', elemId: 'linkCount'}, {url: 'location', elemId: 'locationCount'},
        {url: 'application', elemId: 'applicationCount'}, {url: 'category', elemId: 'categoryCount'},
        {url: 'policy', elemId: 'policyCount'}];


    var get = function (url, async, successcallback, errorcallback) {
        $.ajax({
            url: baseApiUrl + url,
            type: "GET",
            async: async || true,
            context: document.body,
            success: function (data) {
                successcallback(data);
            },
            error: function (errorData) {
                errorcallback(errorData);
            }
        });
    };
    var getCount = function (url, type, async, elementId) {

        get(url, async, function (data) {
            $("#" + elementId).html(data.response);
        });
    };

    var getCounts = function () {
        countConfig.forEach(function (config) {
            getCount(config.url + '/count', 'GET', true, config.elemId);
        });
    };

    var getData = function (module, successcallback) {
        $.ajax({
            url: baseApiUrl + module,
            type: "GET",
            async: false,
            context: document.body,
            success: function (data) {
                successcallback(data);
            },
            error: function (errorData) {

            }
        });
    };
    //public methods
    return {
        get: get,
        getCounts: getCounts,
        getData: getData
    }

})();

