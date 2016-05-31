var app = (function (nx, AjaxUtil,  Host) {

    return {

        //this initiate counts in sidemenu
        init: function () {
            document.getElementById("host-header").style.visibility = 'hidden';

            //Handlebars helper for if condition
            Handlebars.registerHelper('ifCond', function (v1, v2, options) {
                if (v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            });

            //Handlebars helper for camelCase conversion of values
            Handlebars.registerHelper('camelCase', function (str, options) {
                return str.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, function (str) {
                        return str.toUpperCase();
                    });
            });

            AjaxUtil.getCounts();
            //by default open the topology tab and show the full topology
            Host.showPhysicalTopology();
        }

    }

})(nx, AjaxUtil,Host);