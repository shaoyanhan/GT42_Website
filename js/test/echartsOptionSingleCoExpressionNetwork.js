

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
                name: 'Les Miserables',
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

                },

                emphasis: {
                    focus: 'adjacency',
                    scale: 1.01,
                    itemStyle: {
                        borderColor: '#b1e4ff',
                        borderWidth: 2,
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    lineStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                selectedMode: true,
                zoom: 10,
                itemStyle: {

                    borderColor: '#ffffff',
                    borderWidth: 1,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'


                }
            }
        ]
    };
}

export { getSingleCoExpressionNetworkOption };