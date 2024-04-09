let startbp = 0;

function renderItem(params, api) {
    var categoryIndex = api.value(3);
    var boxType = api.value(4);
    var start = api.coord([api.value(5), categoryIndex]); // x, y
    var end = api.coord([api.value(6), categoryIndex]);

    if (boxType == 1) {
        var height = api.size([0, 1])[1] * 0.6;
    } else {
        var height = api.size([0, 1])[1] * 0.1;
    }

    var rectShape = echarts.graphic.clipRectByRect(
        {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height

        },
        {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
        }
    );
    return (
        rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style(),
        }
    );
}

function getTranscriptOption(transcriptData) {
    return {
        tooltip: {

            formatter: function (params) {
                // console.log(params);
                // 设置不同图形的提示信息，不知道为什么不能在series里面单独设置
                if (params.name == 'haplotype') {
                    return [
                        params.marker + params.name,
                        'Mosaic ID: ' + params.value[0],
                        'Gene ID: ' + params.value[1],
                        'Gene Range: ' + params.value[8],
                        'Gene Length: ' + params.value[7] + ' bp',
                    ].join('<br>');
                }
                return [
                    params.marker + params.name,
                    (params.value[4] == 1 ? 'Exon: ' : 'Intron: ') + params.value[5] + ' - ' + params.value[6] + ' bp',
                    'Transcript ID: ' + params.value[2],
                    'Transcript Range: ' + params.value[8] + ' bp',
                    'Transcript Length: ' + params.value[9] + ' bp',
                ].join('<br>');
            }
        },
        title: {
            text: 'Profile',
            left: 'center'
        },
        // legend: {
        //     data: [
        //         {
        //             name: 'haplotype',
        //         },
        //         {
        //             name: 'SNP Site',
        //             backgroundColor: '#ccc'
        //         }
        //     ],
        //     left: 'left'
        // },
        dataZoom: [
            {
                id: 'dataZoomX',
                xAxisIndex: [0],
                type: 'slider',
                // filterMode: 'weakFilter',
                filterMode: 'none',
                showDataShadow: true,
                labelFormatter: function (value) {
                    return Math.round(value) + 'bp';
                },
                bottom: 50,
                height: 100,
                start: 0,
                end: 100,
                fillerColor: "rgba(36, 114, 218, 0.4)",
                borderRadius: 8,
                moveHandleSize: 20,
                showDetail: true

            },
            {
                id: 'dataZoomY',
                yAxisIndex: [0],
                type: 'slider',
                filterMode: 'weakFilter',
                showDataShadow: true,
                right: 50, // 如果不设置会导致右侧的滑块头部无法显示
                labelFormatter: '',
                width: 100,
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
        toolbox: {
            feature: {
                dataZoom: { yAxisIndex: 'none' },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
                // magicType: {
                //     type: ['line', 'bar', 'stack']
                // }

            }
        },
        // 最多 66 个转录本，平均值10-20个
        grid: {
            height: 1000,
            width: 1200
        },
        xAxis:
        {
            min: startbp,
            scale: true,
            axisLabel: {
                formatter: function (val) {
                    return Math.round(Math.max(0, val - startbp)) + ' bp';
                }
            },
            // axisPointer: {
            //     show: true,
            //     type: "line"
            // }
        },
        yAxis: {
            type: 'category',
            inverse: true
            // data: categories
        },
        series: [
            {
                name: 'transcript',
                type: 'custom',
                renderItem: renderItem,
                itemStyle: {
                    opacity: 0.9,
                    color: function (value) {
                        if (value.data[3] == 'haplotype') {
                            return '#9cd283';
                        } else {
                            if (value.data[4] == 1) {
                                return '#61A3BA';
                            } else if (value.data[4] == 0) {
                                return '#D2DE32';
                            }
                        }
                    }
                },
                borderRadius: 5,
                encode: {
                    x: [5, 6],
                    y: 3,
                    // tooltip: {
                    //     formatter: function (params) {

                    //         return params[0].value[0] + ': ';
                    //     }
                    // }

                },
                data: transcriptData
            }
        ]
    };
}

export { getTranscriptOption };