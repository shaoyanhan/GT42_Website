


function getHubCoExpressionNetworkOption(graph) {

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
        series: [
            {
                name: 'Single Co-expression Network',
                type: 'graph',
                layout: 'force',
                force: {
                    // repulsion: 1550,
                    // edgeLength: 1350,
                    gravity: 0.01
                },
                data: graph.nodes,
                links: graph.edges,
                // categories: graph.categories,
                roam: true,
                // draggable: true,
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [15, 15],
                nodeScaleRatio: 0.3,
                label: {
                    show: false,
                    position: 'right',
                    formatter: '{b}'
                },
                labelLayout: {
                    hideOverlap: true
                },

                lineStyle: {
                    // color: 'source',
                    curveness: 0.3,
                    width: 1,


                },
                emphasis: {
                    scale: 1.01,
                    itemStyle: {

                        borderColor: '#b1e4ff',
                        borderWidth: 2,
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    lineStyle: {

                        width: 3,
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                selectedMode: false,
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

export { getHubCoExpressionNetworkOption };