

function getSingleCoExpressionNetworkOption(graph) {

    console.log(graph);
    return {
        tooltip: {
            formatter: function (params) {
                // console.log("hovered parameters: ", params);
                let toolTipString = '';
                if (params.dataType === 'node') {
                    toolTipString = [
                        params.marker + "Node",
                        "ID: " + params.name,
                        "Symbol Size: " + params.data.symbolSize,
                        "Total Degree: " + params.data.totalDegree,
                        "In Degree: " + params.data.inDegree,
                        "Out Degree: " + params.data.outDegree,
                    ].join('<br>');
                } else if (params.dataType === 'edge') {
                    let lineElement = `<span style="display:inline-block;margin:0 5px 5px 0;width:13px;height:3px;background-color:${params.data.lineStyle.color};"></span>`;
                    toolTipString = [
                        lineElement + "Edge",
                        "Source: " + params.data.source,
                        "Target: " + params.data.target,
                        "Weight: " + params.data.lineStyle.width,
                    ].join('<br>');
                }
                return toolTipString;
            }
        },
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