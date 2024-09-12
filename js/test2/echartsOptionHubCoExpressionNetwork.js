


function getHubCoExpressionNetworkOption(graph) {

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
                        "Weight: " + params.data.weight,
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
        series: [
            {
                name: 'Hub Co-expression Network',
                type: 'graph',
                layout: 'force',
                force: {
                    // repulsion: 1550,
                    // edgeLength: 1350,
                    gravity: 0.01,
                    // layoutAnimation: false
                    // initLayout: 'circular',
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

                        borderColor: '#202020',
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