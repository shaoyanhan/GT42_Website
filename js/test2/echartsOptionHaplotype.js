
let startbp = 0;

// function renderItem(params, api) {

//     var categoryIndex = api.value(1);
//     var start = api.coord([api.value(2), categoryIndex]); // x, y
//     var end = api.coord([api.value(2) + 1, categoryIndex]);

//     var height = api.size([0, 1])[1] * 0.6;


//     var rectShape = echarts.graphic.clipRectByRect(
//         {
//             x: start[0],
//             y: start[1] - height / 2,
//             width: end[0] - start[0],
//             height: height
//         },
//         {
//             x: params.coordSys.x,
//             y: params.coordSys.y,
//             width: params.coordSys.width,
//             height: params.coordSys.height
//         }
//     );
//     return (
//         rectShape && {
//             type: 'rect',
//             transition: ['shape'],
//             shape: rectShape,
//             style: api.style()
//         }
//     );
// }

function getHaplotypeSNPOption(haplotypeData, SNPData) {
    return {
        tooltip: {
            // trigger: 'axis', // 设置之后与formatter冲突
            // axisPointer: {
            //     type: 'cross'
            // },
            formatter: function (params) {
                // console.log(params);
                // 设置不同图形的提示信息，不知道为什么不能在series里面单独设置
                if (params.seriesType == 'scatter') {
                    return [
                        params.marker + params.seriesName,
                        'Mosaic ID: ' + params.value[1],
                        'Site: ' + params.value[2] + ' bp',
                        'Type: ' + params.value[3],
                    ].join('<br>');
                }
                return [
                    params.marker + params.name,
                    'Mosaic ID: ' + params.value[0],
                    'Gene ID: ' + params.value[1],
                    'Gene Type: ' + params.value[2],
                    'Gene Length: ' + params.value[3] + ' bp',
                ].join('<br>');
            },
            textStyle: {
                fontSize: 18
            },
        },
        title: {
            text: 'Haplotype and SNP Profile',
            left: 'center'
        },
        legend: { // 暂时实现不了详细颜色的对应，或许使用两个坐标系覆盖方式可以实现
            data: [
                {
                    name: 'haplotype',
                    color: 'black'

                },
                {
                    name: 'SNP',
                    backgroundColor: '#ccc'
                }
            ],
            itemStyle: {
                color: "rgba(255, 255, 255, 1)",
                borderColor: "rgba(0, 0, 0, 1)",
                borderType: "solid",
                borderWidth: 2
            },
            textStyle: {
                fontSize: 18
            },
            left: 'left'
        },
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
                textStyle: {
                    fontSize: 18
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
                dataZoom: { show: true },
                // dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
                // magicType: {
                //     type: ['line', 'bar', 'stack']
                // }

            }
        },
        // 设置坐标系的大小，这样可以保证其在网页中框架大小不变，内部元素大小变化
        // 注意这里与 dataZoomX 高度以及外部div容器一起调整
        // 目前设置为可以展示10个 haplotype 和1个 mosaic 的高度，已经测试过最多138个haplotype的情况, 大部分集中于10-20个
        grid: {
            height: 720,
            width: 800,
            containLabel: true
        },
        xAxis:
        {
            min: startbp,
            axisLabel: {
                formatter: function (val) {
                    return Math.round(Math.max(0, val - startbp)) + ' bp';
                },
                fontSize: 18
            },

            // axisPointer: { // 设置之后，鼠标移动到元素上，tooltip无法显示元素的信息，只会显示最近碰到的元素的信息
            //     show: true,
            //     type: "line"
            // }
            // data: barLength
        },
        yAxis: {
            // data: categories
            type: 'category',
            inverse: true,
            axisLabel: {
                show: true,
                fontSize: 18
            }
        },
        series: [
            { // 先画SNP，再画haplotype，并将，这样可以防止点击SNP的时候误触haplotype导致比例尺刷新
                name: 'SNP',
                // type: 'custom',
                type: 'scatter',
                // renderItem: renderItem,
                itemStyle: {
                    color: function (value) {
                        return value.value[7]; // 空间换时间，直接使用颜色值
                    }
                },
                symbolSize: 20,
                // symbol:
                //     function (value) {
                //         if (value[0] == 1) {
                //             return "rect";
                //         }
                //         return "circle";
                //     },
                encode: {
                    x: 2,
                    y: 1,

                },

                data: SNPData,

                // SNP选择存在bug,会一次性选择所有SNP位点，无法单独选择
                // select: {
                //     disabled: false,
                //     itemStyle: {
                //         borderColor: "rgba(250, 3, 3, 1)",
                //         borderWidth: 3
                //     }
                // },
                // selectedMode: 'single',

            },
            {
                name: 'haplotype',
                type: 'bar',
                // renderItem: renderItem,
                // itemStyle: {
                //     opacity: 0.8,

                // },
                encode: {
                    x: 3,
                    y: 2,
                    // tooltip: {
                    //     formatter: function (params) {

                    //         return params[0].value[0] + ': ';
                    //     }
                    // }

                },
                data: haplotypeData,
                colorBy: "data",
                itemStyle: {
                    opacity: 0.9,
                    borderRadius: 5

                },

                select: {
                    disabled: false,
                    itemStyle: {
                        borderColor: "rgba(250, 3, 3, 1)",
                        borderWidth: 3
                    }
                },
                selectedMode: 'single',
                // emphasis: {
                //     focus: 'self',
                //     blurScope: 'series',
                // }

            },


        ]
    };
}

export { getHaplotypeSNPOption };