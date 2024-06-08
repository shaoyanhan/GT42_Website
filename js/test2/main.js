// async function fetchData(url) {
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data;
//     }
//     catch (error) {
//         console.error('数据请求失败:', error);
//         throw error; // 重新抛出错误，让调用者处理
//     }
// }

function drawNetwork() {
    // let dataRequest = await fetchData('http://127.0.0.1:8080/searchDatabase/getNetworkGraphJSON/?type=mosaic&searchKeyword=GT42G014520');
    // console.log(dataRequest);
    // let graph = dataRequest.data;

    // graph.edges.forEach(element => {
    //     if (element.lineStyle.width < 2) {
    //         element.lineStyle.width = 0;
    //     }
    // });

    let yAxisCategory = ['T', 'G', 'C', 'A', 'REF'];
    let REFData = [['REF', 900]];
    let SNPDataAll = [
        ['GT42G000001', 17, 'A/C', 'A/C : 10045 / 5210', 'A/C : 5921 / 1705', 'GT42G000001.SO.1: C; GT42G000001.SO.2: A; GT42G000001.SO.3: A; GT42G000001.SO.4: C; GT42G000001.SO.5: A; GT42G000001.SO.6: A; GT42G000001.SO.7: C; GT42G000001.SS.1: A; GT42G000001.SS.2:A'],
        ['GT42G000001', 55, 'C/G', 'G/C : 11401 / 3802', 'G/C : 5305 / 2465', 'GT42G000001.SO.1: G; GT42G000001.SO.2: G; GT42G000001.SO.3: C; GT42G000001.SO.4: G; GT42G000001.SO.5: C; GT42G000001.SO.6: C; GT42G000001.SO.7: G; GT42G000001.SS.1: G; GT42G000001.SS.2: G'],
        ['GT42G000001', 67, 'C/G', 'C/G : 13285/1918', 'C/G : 6709/1152', 'GT42G000001.SO.1:C; GT42G000001.SO.2:C; GT42G000001.SO.3:C; GT42G000001.SO.4:C; GT42G000001.SO.5:G; GT42G000001.SO.6:G; GT42G000001.SO.7:C; GT42G000001.SS.1:C; GT42G000001.SS.2:C'],
        ['GT42G000001', 177, 'A/G', 'A/G : 12032/3378', 'A/G : 5741/2090', 'GT42G000001.SO.1:A; GT42G000001.SO.2:G; GT42G000001.SO.3:A; GT42G000001.SO.4:A; GT42G000001.SO.5:A; GT42G000001.SO.6:A; GT42G000001.SO.7:A; GT42G000001.SS.1:A; GT42G000001.SS.2:G'],
        ['GT42G000001', 411, 'A/C', 'A/C : 26/11', 'C/A : 751/45', 'GT42G000001.SO.1:A; GT42G000001.SO.2:A; GT42G000001.SO.3:A; GT42G000001.SO.4:A; GT42G000001.SO.5:A; GT42G000001.SO.6:C; GT42G000001.SO.7:no exon evidence; GT42G000001.SS.1:C; GT42G000001.SS.2:C'],
        ['GT42G000001', 683, 'G/T', 'T/G : 13044/2996', 'T/G : 6299/1440', 'GT42G000001.SO.1:T; GT42G000001.SO.2:T; GT42G000001.SO.3:T; GT42G000001.SO.4:T; GT42G000001.SO.5:T; GT42G000001.SO.6:T; GT42G000001.SO.7:T; GT42G000001.SS.1:G; GT42G000001.SS.2:T'],
        ['GT42G000001', 815, 'C/G', 'G/C : 12595/3438', 'G/C : 7391/325', 'GT42G000001.SO.1:G; GT42G000001.SO.2:G; GT42G000001.SO.3:G; GT42G000001.SO.4:C; GT42G000001.SO.5:G; GT42G000001.SO.6:G; GT42G000001.SO.7:G; GT42G000001.SS.1:G; GT42G000001.SS.2:C']
    ];
    let SNPDataISO = [
        ['GT42G000001', 17, 'A/C', 'A / C : 10045 / 5210', 'GT42G000001.SO.1: C; GT42G000001.SO.2: A; GT42G000001.SO.3: A; GT42G000001.SO.4: C; GT42G000001.SO.5: A; GT42G000001.SO.6: A; GT42G000001.SO.7: C; GT42G000001.SS.1: A; GT42G000001.SS.2:A'],
        ['GT42G000001', 55, 'C/G', 'G / C : 11401 / 3802', 'GT42G000001.SO.1: G; GT42G000001.SO.2: G; GT42G000001.SO.3: C; GT42G000001.SO.4: G; GT42G000001.SO.5: C; GT42G000001.SO.6: C; GT42G000001.SO.7: G; GT42G000001.SS.1: G; GT42G000001.SS.2: G'],
        ['GT42G000001', 67, 'C/G', 'C/G : 13285/1918', 'GT42G000001.SO.1:C; GT42G000001.SO.2:C; GT42G000001.SO.3:C; GT42G000001.SO.4:C; GT42G000001.SO.5:G; GT42G000001.SO.6:G; GT42G000001.SO.7:C; GT42G000001.SS.1:C; GT42G000001.SS.2:C'],
        ['GT42G000001', 94, 'C/G', 'G/C : 15013/214', 'GT42G000001.SO.1:G; GT42G000001.SO.2:G; GT42G000001.SO.3:G; GT42G000001.SO.4:G; GT42G000001.SO.5:G; GT42G000001.SO.6:G; GT42G000001.SO.7:G; GT42G000001.SS.1:G; GT42G000001.SS.2:G'],
        ['GT42G000001', 177, 'A/G', 'A/G : 12032/3378', 'GT42G000001.SO.1:A; GT42G000001.SO.2:G; GT42G000001.SO.3:A; GT42G000001.SO.4:A; GT42G000001.SO.5:A; GT42G000001.SO.6:A; GT42G000001.SO.7:A; GT42G000001.SS.1:A; GT42G000001.SS.2:G'],
        ['GT42G000001', 411, 'A/C', 'A/C : 26/11', 'GT42G000001.SO.1:A; GT42G000001.SO.2:A; GT42G000001.SO.3:A; GT42G000001.SO.4:A; GT42G000001.SO.5:A; GT42G000001.SO.6:C; GT42G000001.SO.7:no exon evidence; GT42G000001.SS.1:C; GT42G000001.SS.2:C'],
        ['GT42G000001', 683, 'G/T', 'T/G : 13044/2996', 'GT42G000001.SO.1:T; GT42G000001.SO.2:T; GT42G000001.SO.3:T; GT42G000001.SO.4:T; GT42G000001.SO.5:T; GT42G000001.SO.6:T; GT42G000001.SO.7:T; GT42G000001.SS.1:G; GT42G000001.SS.2:T'],
        ['GT42G000001', 815, 'C/G', 'G/C : 12595/3438', 'GT42G000001.SO.1:G; GT42G000001.SO.2:G; GT42G000001.SO.3:G; GT42G000001.SO.4:C; GT42G000001.SO.5:G; GT42G000001.SO.6:G; GT42G000001.SO.7:G; GT42G000001.SS.1:G; GT42G000001.SS.2:C']

    ];
    let SNPDataRNA = [
        ['GT42G000001', 17, 'A/C', 'A / C : 5921 / 1705', 'GT42G000001.SO.1: C; GT42G000001.SO.2: A; GT42G000001.SO.3: A; GT42G000001.SO.4: C; GT42G000001.SO.5: A; GT42G000001.SO.6: A; GT42G000001.SO.7: C; GT42G000001.SS.1: A; GT42G000001.SS.2:A'],
        ['GT42G000001', 55, 'C/G', 'G / C : 5305 / 2465', 'GT42G000001.SO.1: G; GT42G000001.SO.2: G; GT42G000001.SO.3: C; GT42G000001.SO.4: G; GT42G000001.SO.5: C; GT42G000001.SO.6: C; GT42G000001.SO.7: G; GT42G000001.SS.1: G; GT42G000001.SS.2: G'],
        ['GT42G000001', 67, 'C/G', 'C/G : 6709/1152', 'GT42G000001.SO.1:C; GT42G000001.SO.2:C; GT42G000001.SO.3:C; GT42G000001.SO.4:C; GT42G000001.SO.5:G; GT42G000001.SO.6:G; GT42G000001.SO.7:C; GT42G000001.SS.1:C; GT42G000001.SS.2:C'],
        ['GT42G000001', 177, 'A/G', 'A/G : 5741/2090', 'GT42G000001.SO.1:A; GT42G000001.SO.2:G; GT42G000001.SO.3:A; GT42G000001.SO.4:A; GT42G000001.SO.5:A; GT42G000001.SO.6:A; GT42G000001.SO.7:A; GT42G000001.SS.1:A; GT42G000001.SS.2:G'],
        ['GT42G000001', 411, 'A/C', 'C/A : 751/45', 'GT42G000001.SO.1:A; GT42G000001.SO.2:A; GT42G000001.SO.3:A; GT42G000001.SO.4:A; GT42G000001.SO.5:A; GT42G000001.SO.6:C; GT42G000001.SO.7:no exon evidence; GT42G000001.SS.1:C; GT42G000001.SS.2:C'],
        ['GT42G000001', 413, 'C/G/T', 'T/C/G : 452/80/9', 'GT42G000001.SO.1:C; GT42G000001.SO.2:C; GT42G000001.SO.3:C; GT42G000001.SO.4:C; GT42G000001.SO.5:C; GT42G000001.SO.6:no exon evidence; GT42G000001.SO.7:no exon evidence; GT42G000001.SS.1:no exon evidence; GT42G000001.SS.2:C'],
        ['GT42G000001', 683, 'G/T', 'T/G : 6299/1440', 'GT42G000001.SO.1:T; GT42G000001.SO.2:T; GT42G000001.SO.3:T; GT42G000001.SO.4:T; GT42G000001.SO.5:T; GT42G000001.SO.6:T; GT42G000001.SO.7:T; GT42G000001.SS.1:G; GT42G000001.SS.2:T'],
        ['GT42G000001', 707, 'C/T', 'T/C : 7551/80', 'GT42G000001.SO.1:T; GT42G000001.SO.2:T; GT42G000001.SO.3:T; GT42G000001.SO.4:T; GT42G000001.SO.5:T; GT42G000001.SO.6:T; GT42G000001.SO.7:T; GT42G000001.SS.1:T; GT42G000001.SS.2:T'],
        ['GT42G000001', 815, 'C/G', 'G/C : 7391/325', 'GT42G000001.SO.1:G; GT42G000001.SO.2:G; GT42G000001.SO.3:G; GT42G000001.SO.4:C; GT42G000001.SO.5:G; GT42G000001.SO.6:G; GT42G000001.SO.7:G; GT42G000001.SS.1:G; GT42G000001.SS.2:C']
    ];

    let SNPPointAll = [];
    let SNPPointISO = [];
    let SNPPointRNA = [];
    function SNPDataToScatter(data) {
        let SNPData = [];
        data.map(function (item) {
            let base = item[2].split('/');
            SNPData.push([base[0], item[1]]);
            SNPData.push([base[1], item[1]]);
        });
        return SNPData;
    }
    SNPPointAll = SNPDataToScatter(SNPDataAll);
    console.log('SNPPointAll: ', SNPPointAll);
    SNPPointISO = SNPDataToScatter(SNPDataISO);
    console.log('SNPPointISO: ', SNPPointISO);
    SNPPointRNA = SNPDataToScatter(SNPDataRNA);
    console.log('SNPPointRNA: ', SNPPointRNA);


    let dom = document.getElementById('snp_chart_all');
    let snpChartAll = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    let dom1 = document.getElementById('snp_chart_iso');
    let snpChartISO = echarts.init(dom1, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    let dom2 = document.getElementById('snp_chart_rna');
    let snpChartRNA = echarts.init(dom2, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    // let option = {
    //     tooltip: {},
    //     // legend: [
    //     //   {
    //     //     data: graph.categories.map(function (a) {
    //     //       return a.name;
    //     //     })
    //     //   }
    //     // ],
    //     title: {
    //         text: 'Profile',
    //         left: 'center',
    //         top: 20,
    //     },
    //     // yAxis: {
    //     //     type: 'category',
    //     //     // data: yAxisCategory,
    //     // },
    //     series: [
    //         // {
    //         //     name: 'REF',
    //         //     type: 'bar',
    //         //     data: REFData,


    //         // },
    //         {
    //             name: 'snps',
    //             type: 'scatter',
    //             data: SNPData,
    //             symbolSize: 20,
    //             encode: {
    //                 x: 1,
    //                 y: 0,
    //             },
    //         }
    //     ]
    // };

    function getOption(data) {
        return {
            tooltip: {},
            xAxis: {
                axisLabel: {
                    formatter: function (val) {
                        return Math.round(val) + ' bp';
                    },
                    fontSize: 16
                },
                axisPointer: {
                    type: 'line',
                    show: true,
                    triggerEmphasis: true, // 是否触发强调
                    snap: true, // 是否自动吸附到点
                    label: {
                        fontSize: 20,
                        formatter: function (params) {
                            return Math.round(params.value) + 'bp';
                        }
                    },
                    lineStyle: {
                        width: 3,
                        type: "dashed",
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: yAxisCategory,
                axisLabel: {
                    show: true,
                    fontSize: 25,
                    fontWeight: 'bolder',
                    textStyle: {
                        color: function (value) {
                            if (value == 'REF') {
                                return 'rgba(36, 114, 218, 0.4)';
                            } else if (value == 'A') {
                                return 'blue';
                            } else if (value == 'G') {
                                return 'yellow';
                            } else if (value == 'C') {
                                return 'red';
                            } else if (value == 'T') {
                                return 'green';
                            }
                        }
                    }
                }

            },
            grid: {
                containLabel: true,
                bottom: 100,
            },
            dataZoom: [
                {
                    id: 'dataZoomX',
                    xAxisIndex: [0],
                    type: 'slider',
                    // filterMode: 'weakFilter',
                    filterMode: 'none',
                    showDataShadow: false,
                    labelFormatter: function (value) {
                        return Math.round(value) + 'bp';
                    },
                    textStyle: {
                        fontSize: 18
                    },
                    bottom: 30,
                    height: 50,
                    start: 0,
                    end: 100,
                    fillerColor: "rgba(36, 114, 218, 0.4)",
                    borderRadius: 8,
                    moveHandleSize: 20,
                    showDetail: true

                },
                {
                    type: 'inside',
                    filterMode: 'none'
                }
            ],
            series: [
                {

                    name: 'SNP',
                    type: 'scatter',
                    // symbolSize: 20,
                    tooltip: {
                        formatter: function (params) {
                            // console.log(params);
                            return [
                                params.seriesName,
                                params.marker + params.name,
                                'Site: ' + params.value[1] + ' bp',
                            ].join('<br>');
                        }
                    },
                    itemStyle: {
                        color: function (params) {
                            console.log(params);
                            if (params.value[0] == 'A') {
                                return 'blue';
                            } else if (params.value[0] == 'G') {
                                return 'yellow';
                            } else if (params.value[0] == 'C') {
                                return 'red';
                            } else if (params.value[0] == 'T') {
                                return 'green';
                            }
                        }
                    },
                    data: data,
                    encode: {
                        x: 1,
                        y: 0
                    }
                },
                {
                    name: 'REF',
                    type: 'bar',
                    data: REFData,
                    encode: {
                        x: 1,
                        y: 0
                    },
                    itemStyle: {
                        color: 'rgba(15, 150, 218, 0.5)',
                        borderRadius: 10
                    }
                }
            ]
        };
    }

    snpChartAll.setOption(getOption(SNPPointAll));
    snpChartISO.setOption(getOption(SNPPointISO));
    snpChartRNA.setOption(getOption(SNPPointRNA));
    // console.log('drawNetwork');

    snpChartAll.on('click', function (params) {
        console.log(params);
    });

    snpChartISO.on('click', function (params) {
        console.log(params);
    });

    snpChartRNA.on('click', function (params) {
        console.log(params);
    });

    let SNPTableAll = document.getElementById('SNP_table_container_all');
    let SNPTableISO = document.getElementById('SNP_table_container_iso');
    let SNPTableRNA = document.getElementById('SNP_table_container_rna');
    updateSNPTable(SNPDataAll, SNPTableAll.querySelector('tbody'));
    updateSNPTable(SNPDataISO, SNPTableISO.querySelector('tbody'));
    updateSNPTable(SNPDataRNA, SNPTableRNA.querySelector('tbody'));

}

// 传入一个二维数组和一个容器，更新表格
function updateSNPTable(data, container) {
    container.innerHTML = '';  // 清空当前表格
    data.forEach(row => {
        const tr = document.createElement('tr');
        // 如果row的数组长度为6，那么就是SNP表格的数据
        if (row.length === 6) {
            tr.innerHTML = `<td>${row[0]}</td>
                            <td>${row[1]}</td>
                            <td>${row[2]}</td>
                            <td>${row[3]}</td>
                            <td>${row[4]}</td>
                            <td>${row[5]}</td>`;
        }
        else {
            tr.innerHTML = `<td>${row[0]}</td>
                            <td>${row[1]}</td>
                            <td>${row[2]}</td>
                            <td>${row[3]}</td>
                            <td>${row[4]}</td>`;
        }
        container.appendChild(tr);
    });
}

drawNetwork();




