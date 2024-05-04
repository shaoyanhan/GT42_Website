async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('数据请求失败:', error);
        throw error; // 重新抛出错误，让调用者处理
    }
}


async function drawNetwork() {
    let dataRequest = await fetchData('http://127.0.0.1:8080/searchDatabase/getNetworkGraphJSON/?type=mosaic&searchKeyword=GT42G014520');
    console.log(dataRequest);
    let graph = dataRequest.data;

    // graph.edges.forEach(element => {
    //     if (element.lineStyle.width < 2) {
    //         element.lineStyle.width = 0;
    //     }
    // });

    var dom = document.getElementById('network_container');
    var myChart1 = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    var option = {
        tooltip: {},
        // legend: [
        //   {
        //     data: graph.categories.map(function (a) {
        //       return a.name;
        //     })
        //   }
        // ],
        title: {
            text: 'Profile',
            left: 'center',
            top: 20,
        },
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
                    normal: {
                        borderColor: '#ffffff',
                        borderWidth: 1,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    emphasis: {
                        borderColor: '#b1e4ff',
                        borderWidth: 2,
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };



    myChart1.setOption(option);
    // console.log('drawNetwork');

    myChart1.on('click', function (params) {
        console.log(params);
    });
}

drawNetwork();



