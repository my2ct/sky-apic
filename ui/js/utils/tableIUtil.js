var TableUtil = (function (StringUtil,AjaxUtil) {

    var list = [];

    //this will place table on respective data
    var showList = function (module,config) {
        AjaxUtil.getData(module, successcallback);

        function successcallback(data) {
            list = data.response;

            if(module == "host") {
                document.getElementById("tableHolder").style.marginTop = "0px";
                document.getElementById("host-header").style.visibility = 'visible';
            }
            else {
                document.getElementById("host-header").style.visibility = 'hidden';
                document.getElementById("tableHolder").style.marginTop = "-50px";
            }
            document.getElementById("networkHost").innerHTML = StringUtil.camelCaseToHumanReadable(module);


            setTable(data, config);
            $('.nav-tabs a[href="#host"]').tab('show');
            if (module === "host") {
                setTopoDropDown(list);
            }

            $('a.detaillink').click(function (e) {
                e.preventDefault();
                var id = $(this).attr('id');
                if (list.length > 0) {
                    var item = _.findWhere(list, {id: id});
                    var source = $("#detailtable").html();
                    var template = Handlebars.compile(source);
                    $("#detailHolder").html(template(item));
                    $('#detailModal').modal('show');
                }
            })
        }

    };

    //refactor use Immutable Data structures,reduce mutations
    var setTable = function (data, config) {
        var tableObj = {};
        //var cols= _.union(_.difference(config.columns,['id']),['View More']);
        tableObj.columns = config;
        console.log(tableObj.columns);
        var rows = (data.response).map(function (item) {
             return _.pick(item, tableObj.columns);

        });

        var cols = _.union(_.difference(config, ['id']), ['']);


        rows = rows.map(function (row) {

            var reorderedKeys = _.difference(_.keys(row), ['id']);
            reorderedKeys.push('id');
            return _.object(reorderedKeys, _.values(row));

        });

        tableObj.rows = rows;
        var source = $("#maintable").html();
        var template = Handlebars.compile(source);
        $("#tableHolder").html(template(tableObj));

    }

    //drop down for source destination selection
    var setTopoDropDown = function (list) {
        var dropdownList = [];
        _.each(list, function (item, index) {
            dropdownList.push({id: index, text: item.hostIp});
        })
        var source = $("#dropdownId").html();
        var template = Handlebars.compile(source);
        $("#sourceDD").html("<option>--Source--</option>" + template(dropdownList));
        $("#targetDD").html("<option>--Destination--</option>" + template(dropdownList));

    }


    return {
        showList: showList
    }


})(StringUtil,AjaxUtil);
