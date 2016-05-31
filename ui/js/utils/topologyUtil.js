var TopologyUtil = (function (nx, global) {
   //used for configuring icons and label
    function nodeconfig(topologyData) {
        nx.define('Base.NodeConfig', nx.ui.Component, {
            properties: {
                icon: {
                    value: function () {
                        return function (vertex) {
                            var type = vertex.get("nodeType");
                            if (type == "host") {
                                return "host"
                            }
                            else {
                                return vertex.get("deviceType");
                            }
                        }
                    }
                }
            },
            view: {
                content: {
                    name: 'topo',
                    type: 'nx.graphic.Topology',
                    props: {
                        adaptive: true,
                        identityKey: 'id',
                        width: 600,
                        height: 600,
                        nodeConfig: {
                            label: function (vertex) {
                                return vertex.get("label");
                            },
                            iconType: '{#icon}'
                        },
                        linkConfig: {
                            linkType: 'curve'
                        },
                        nodeSetConfig: {
                            iconType: 'model.deice_type'
                        },
                        showIcon: true,
                        data: topologyData
                    }
                }
            }
        });
        return new Base.NodeConfig();
    }

    return {
        nodeconfig: nodeconfig
    }

})(nx, nx.global);


var Shell = nx.define(nx.ui.Application, {
    methods: {
        start: function (topoLogyData) {
            //your application main entry

            var view = TopologyUtil.nodeconfig(topoLogyData);
            view.attach(this);
            // initialize a topology


        },
        //set the Dom id for topology map to get placed
        getContainer: function () {
            return new nx.dom.Element(document.getElementById('topo-container'));
        }
    }
});
