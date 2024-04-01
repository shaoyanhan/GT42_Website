
// 基于准备好的dom，初始化echarts实例
var chartDom = document.getElementById('drawTranscript');
var myChart = echarts.init(chartDom, null, { renderer: 'svg' });
var option;


// var data = [
//     {name: 'hap1', value: ['transcript1', false, 0, 100, 100], itemStyle: {color: '#7b9ce1', borderRadius: 5 } },
//     {name: 'hap2', value: ['transcript2', false, 0, 20, 20], itemStyle: {normal: {color: '#bd6d6c' } } },
//     {name: 'gap', value: ['transcript2', true, 20, 80, 60], itemStyle: {normal: {color: '#000' } } },
//     {name: 'hap2', value: ['transcript2', false, 80, 90, 10], itemStyle: {normal: {color: '#bd6d6c' } } },
//     {name: 'hap3', value: ['transcript3', false, 0, 80, 80], itemStyle: {normal: {color: '#75d874' } } },
//     {name: 'gap', value: ['transcript3', true, 80, 90, 10], itemStyle: {normal: {color: '#000' } } },
//     {name: 'hap3', value: ['transcript3', false, 90, 100, 10], itemStyle: {normal: {color: '#75d874' } } },
//     {name: 'mosaic', value: ['transcript4', false, 0, 110, 110], itemStyle: {normal: {color: '#c6fbee' } } },
// ];



var data = [
    { value: ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.0', 'haplotype', 1, 1, 140, 140, '1 - 140', 140], itemStyle: { color: 'black', borderRadius: 5 } },
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.1', 'transcript1', 1, 1, 20, 20, '1 - 40', 40],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.1', 'transcript1', 0, 20, 30, 10, '1 - 40', 40],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.1', 'transcript1', 1, 30, 40, 10, '1 - 40', 40],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.2', 'transcript2', 0, 20, 30, 10, '20 - 50', 30],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.2', 'transcript2', 1, 30, 50, 20, '20 - 50', 30],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.3', 'transcript3', 1, 50, 80, 30, '50 - 80', 30],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.3', 'transcript3', 0, 80, 90, 10, '50 - 80', 30],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.3', 'transcript3', 1, 90, 100, 10, '50 - 80', 30],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.4', 'transcript4', 1, 100, 110, 10, '100 - 130', 30],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.4', 'transcript4', 0, 110, 120, 10, '100 - 130', 30],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.4', 'transcript4', 1, 120, 130, 10, '100 - 130', 30],
    ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.5', 'transcript5', 1, 130, 140, 10, '130 - 140', 10],
]

// for (let i = 0; i < 50; i++) {
//     let baseValue = 110 * (i + 1);
//     data.push(
//         {name: 'hap1', value: [0, false, baseValue, baseValue + 100, 100], itemStyle: {normal: {color: '#7b9ce1' } } },
//         {name: 'hap2', value: [1, false, baseValue, baseValue + 20, 20], itemStyle: {normal: {color: '#bd6d6c' } } },
//         {name: 'gap', value: [1, true, baseValue + 20, baseValue + 80, 60], itemStyle: {normal: {color: '#000' } } },
//         {name: 'hap2', value: [1, false, baseValue + 80, baseValue + 90, 10], itemStyle: {normal: {color: '#bd6d6c' } } },
//         {name: 'hap3', value: [2, false, baseValue, baseValue + 80, 80], itemStyle: {normal: {color: '#75d874' } } },
//         {name: 'gap', value: [2, true, baseValue + 80, baseValue + 90, 10], itemStyle: {normal: {color: '#000' } } },
//         {name: 'hap3', value: [2, false, baseValue + 90, baseValue + 100, 10], itemStyle: {normal: {color: '#75d874' } } },
//         {name: 'mosaic', value: [3, false, baseValue, baseValue + 110, 110], itemStyle: {normal: {color: '#c6fbee' } } },
//     );
// }
// var dataCount = 10;
var startbp = 0;
// var categories = ['hap1', 'hap2', 'hap3', 'mosaic'];
// var types = [
//     {name: 'hap1', color: '#7b9ce1' },
//     {name: 'hap2', color: '#bd6d6c' },
//     {name: 'hap3', color: '#75d874' },
//     {name: 'mosaic', color: '#c6fbee' },
//     {name: 'gap', color: '#000' }
// ];
// Generate mock data
// categories.forEach(function (category, index) {
//     var baseTime = startTime;
//     for (var i = 0; i < dataCount; i++) {
//         var typeItem = types[Math.round(Math.random() * (types.length - 1))];
//         var duration = Math.round(Math.random() * 10000);
//         data.push({
//             name: typeItem.name,
//             value: [index, baseTime, (baseTime += duration), duration],
//             itemStyle: {
//                 normal: {
//                     color: typeItem.color
//                 }
//             }
//         });
//         baseTime += Math.round(Math.random() * 2000);
//     }
// });


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


option = {
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
            // name: 'haplotype',
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
                opacity: 0.8,
                color: function (value) {
                    if (value.data[3] == 'haplotype') {
                        return '#A2C579';
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
            data: data
        }
    ]
};

option && myChart.setOption(option);
myChart.on('click', function (params) {
    console.log(params);
    alert(params.name + ' clicked');
});
