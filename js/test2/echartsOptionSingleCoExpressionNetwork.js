

function getSingleCoExpressionNetworkOption(graph) {

    console.log(graph);
    return {
        tooltip: {},
        // legend: [
        //   {
        //     data: graph.categories.map(function (a) {
        //       return a.name;
        //     })
        //   }
        // ],
        // title: {
        //     text: 'Profile',
        //     left: 'center',
        //     top: 20,
        // },
        series: [
            {
                name: 'Single Co-expression Network',
                type: 'graph',
                layout: 'force',
                // force: {
                //     // repulsion: 1550,
                //     // edgeLength: 1350,
                //     gravity: 0
                // },
                data: graph.nodes,
                links: graph.edges,
                // categories: graph.categories,
                roam: true,
                // draggable: true,
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [10, 10],
                nodeScaleRatio: 0.6,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                },
                labelLayout: {
                    hideOverlap: true
                },

                lineStyle: {
                    // color: 'source',
                    curveness: 0.3,
                    // opacity: 0.3,

                },

                emphasis: {
                    focus: 'adjacency',
                    scale: 1.01,
                    itemStyle: {
                        borderColor: '#202020',
                        borderWidth: 2,
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    lineStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                selectedMode: false,
                zoom: 10,
                itemStyle: {

                    borderColor: '#505050',
                    borderWidth: 1,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'


                }
            }
        ]
    };
}

export { getSingleCoExpressionNetworkOption };