var Host = (function (nx, AjaxUtil,TableUtil) {

    //private variables

    //columns to be placed in main table
    var columns = ["hostMac", "hostIp", "hostType", "connectedInterfaceName", "vlanId", "numUpdates", "userStatus", "id"];
    var routingParams = [];
    var shell = new Shell();



   //private methods

    //topology rendering methods

    //validate dropdowns for source and destination then return url path
    var getTopologyUrl = function (source, destination) {
        if (source === destination) {
            alert('Source and Destination are same,please change it.');
            return false;
        }
        else {
            return 'routing-path/' + source + '/' + destination;
        }
    };


    //call url data then initate the topology map
    var getTopology = function (url) {

        AjaxUtil.get(url, false, successCallBack);

        function successCallBack(data) {
            $('#topo-container').html("");
            $('.nav-tabs a[href="#topology"]').tab('show')
            try {
                if (_.isObject(data.response)) {
                    var topologyData = data.response;
                }
                if (_.isArray(data.response)) {
                    var topologyData = data.response[0];
                }
                topoconfig.nodeconfig(topologyData);
                console.log(JSON.stringify(topologyData));
                shell.start(topologyData);

            }
            catch (ex) {
                console.log(ex);
                console.log('error while rendering topology');
                console.log('using sample data');
                shell.start(topologyData);
            }
        }

    };

    //method gets called from button click,get source and data
    // then call getTopology
    var showTopology = function () {
        var source = $('#sourceDD  option:selected').text();
        var target = $('#targetDD  option:selected').text();
        var url = getTopologyUrl(source, target);
        getTopology(url);
    };

    //this is also event triggered from show full topology button
    var showPhysicalTopology = function () {
        var url = "topology/physical-topology";
        getTopology(url);
    }


    // public methods
    return {
        showTopology: showTopology,
        showPhysicalTopology: showPhysicalTopology,
        showList: function () {
           // e.preventDefault();
            TableUtil.showList("host",columns);
        }
    }

}(nx, AjaxUtil,TableUtil));
