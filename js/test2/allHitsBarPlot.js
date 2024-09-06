// 原始数据
const allHitsBarPlotDataNucleotide = [
    ["q1", "GT42G000001", "100.000", "1071", "0", "0", "1", "1071", "1", "1071", "0.0", "1978", "1/1"],
    ["q1", "GT42G000001", "98.272", "405", "7", "0", "509", "913", "2000", "2404", "0.0", "710", "1/1"],
    ["q1", "GT42G000001", "100.000", "370", "0", "0", "702", "1071", "3948", "4317", "0.0", "684", "1/1"],
    ["q1", "GT42G000001", "100.000", "222", "0", "0", "415", "636", "197", "418", "1.65e-113", "411", "1/1"],
    ["q1", "GT42G000001", "100.000", "222", "0", "0", "197", "418", "415", "636", "1.65e-113", "411", "1/1"],
    ["q1", "GT42G000001", "99.468", "188", "1", "0", "518", "705", "2387", "2574", "6.11e-93", "342", "1/1"],
    ["q1", "GT42G000001", "99.219", "128", "1", "0", "291", "418", "2000", "2127", "1.38e-59", "231", "1/1"],
    ["q1", "GT42G000001", "100.000", "119", "0", "0", "300", "418", "2387", "2505", "2.99e-56", "220", "1/1"],
    ["q1", "GT42G022956", "98.919", "370", "4", "0", "702", "1071", "1726", "1357", "0.0", "662", "1/-1"],
    ["q1", "GT42G000002", "81.805", "665", "102", "16", "415", "1071", "343", "996", "2.02e-152", "540", "1/1"],
    ["q1", "GT42G000097", "91.644", "371", "29", "2", "702", "1071", "1311", "1680", "4.40e-144", "512", "1/1"],
    ["q1", "GT42G000097", "91.409", "291", "25", "0", "415", "705", "203", "493", "3.57e-110", "399", "1/1"],
    ["q1", "GT42G000097", "89.262", "298", "32", "0", "121", "418", "127", "424", "2.17e-102", "374", "1/1"],
    ["q1", "GT42G004106", "79.421", "656", "123", "10", "415", "1067", "296", "942", "2.70e-126", "453", "1/1"],
    ["q1", "GT42G022914", "86.104", "367", "43", "5", "709", "1071", "2013", "1651", "7.73e-107", "388", "1/-1"],
    ["q1", "GT42G003238", "82.143", "364", "63", "2", "709", "1071", "700", "1062", "1.72e-83", "311", "1/1"],
    ["q2", "GT42G016702", "100.000", "286", "0", "0", "1", "286", "242", "527", "1.09e-149", "529", "1/1"]
];

const allHitsBarPlotDataPeptide = [
    ['q1', 'GT42G017641.SO.1.1', '100.000', '186', '0', '0', '1', '186', '1', '186', '2.84e-127', '357', '1/1'],
    ['q1', 'GT42G004718.SO.4.5', '36.471', '85', '42', '5', '71', '150', '52', '129', '2.2', '32.0', '1/1'],
    ['q1', 'GT42G004718.SO.4.4', '36.471', '85', '42', '5', '71', '150', '61', '138', '2.3', '32.0', '1/1'],
    ['q1', 'GT42G004718.SO.4.1', '36.471', '85', '42', '5', '71', '150', '40', '117', '2.5', '31.6', '1/1'],
    ['q1', 'GT42G004718.SO.2.2', '36.471', '85', '42', '5', '71', '150', '74', '151', '2.5', '31.6', '1/1'],
    ['q1', 'GT42G004718.SO.2.1', '36.471', '85', '42', '5', '71', '150', '75', '152', '2.7', '31.6', '1/1'],
    ['q1', 'GT42G004718.SO.4.2', '36.471', '85', '42', '5', '71', '150', '68', '145', '2.8', '31.6', '1/1'],
    ['q1', 'GT42G001440.SO.5.1', '32.967', '91', '53', '5', '26', '114', '127', '211', '4.1', '31.2', '1/1'],
    ['q1', 'GT42G001440.SO.4.1', '29.670', '91', '56', '3', '26', '114', '127', '211', '5.5', '30.8', '1/1'],
    ['q1', 'GT42G001440.SO.1.1', '29.670', '91', '56', '3', '26', '114', '127', '211', '6.1', '30.8', '1/1'],
    ['q1', 'GT42G001440.SO.4.2', '29.670', '91', '56', '3', '26', '114', '127', '211', '6.7', '30.4', '1/1'],
    ['q1', 'GT42G001440.SO.3.4', '29.670', '91', '56', '3', '26', '114', '127', '211', '6.8', '30.4', '1/1'],
    ['q1', 'GT42G001440.SO.6.1', '29.670', '91', '56', '3', '26', '114', '127', '211', '6.9', '30.4', '1/1'],
    ['q1', 'GT42G001440.SO.2.2', '29.670', '91', '56', '3', '26', '114', '127', '211', '7.4', '30.4', '1/1'],
    ['q1', 'GT42G001440.SS.1.1', '29.670', '91', '56', '3', '26', '114', '127', '211', '7.4', '30.4', '1/1'],
    ['q1', 'GT42G001440.SS.1.3', '29.670', '91', '56', '3', '26', '114', '61', '145', '9.3', '30.0', '1/1'],
    ['q1', 'GT42G001440.SS.2.1', '29.670', '91', '56', '3', '26', '114', '127', '211', '9.3', '30.0', '1/1'],
    ['q1', 'GT42G001440.SS.2.5', '29.670', '91', '56', '3', '26', '114', '127', '211', '9.8', '30.0', '1/1']
]

let allHitsBarPlotData = allHitsBarPlotDataNucleotide;
// let allHitsBarPlotData = allHitsBarPlotDataPeptide;

// 字典来记录每个元素的出现次数
const occurrences = {};

// 更新第二列元素以包括其出现次数后缀
allHitsBarPlotData.forEach(row => {
    const key = row[1];
    if (occurrences[key]) {
        occurrences[key] += 1;
    } else {
        occurrences[key] = 1;
    }
    row[1] = `${key}.${occurrences[key]}`;
});

// 输出更新后的数据
// console.log(JSON.stringify(data, null, 2));


// 初始化ECharts
let chartDom = document.getElementById('all_hits_bar_plot');
let myChart = echarts.init(chartDom);
let option;

function isPositiveFrame(frame) {
    return (frame === "1/1" || frame === "-1/-1");
}

// 配置
function getAllHitsBarPlotOption(data) {
    return {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                // console.log(params);
                // 使用axis触发会导致返回一个对象数组，所以需要使用params[0]来获取第一个对象
                let param = params[0];

                let queryID = param.value[0];

                let repeatSubjectID = param.value[1];
                let parts = repeatSubjectID.split('.');
                let lastElement = parts.pop();
                let subjectID = parts.join('.');

                let queryRange = param.value[6] + ' - ' + param.value[7];
                let subjectRange = param.value[8] + ' - ' + param.value[9];

                return [
                    'Query ID: ' + queryID,
                    'Query Range: ' + queryRange,
                    'Subject ID: ' + subjectID,
                    'Hit Index: ' + lastElement,
                    'Subject Range: ' + subjectRange,
                    'E-value: ' + param.value[10]
                ].join('<br>');
            }
        },
        xAxis: {
            type: 'value',
            // name: 'bp',
            axisLabel: {
                formatter: function (val) {
                    return Math.round(Math.max(0, val)) + ' bp';
                },
                fontSize: 15
            },
            min: 0
        },
        yAxis: {
            type: 'category',
            inverse: true,
            axisLabel: {
                show: true,
                fontSize: 15,
                formatter: function (value, index) {

                    const parts = value.split('.');
                    // 获取最后一个元素
                    const lastElement = parts.pop();

                    return lastElement === '1' ? parts.join('.') : '';


                }
            }

        },
        dataZoom: [
            {
                id: 'dataZoomY',
                yAxisIndex: [0],
                type: 'slider',
                filterMode: 'weakFilter',
                showDataShadow: false,
                right: 50, // 如果不设置会导致右侧的滑块头部无法显示
                labelFormatter: '',
                width: 30,
                start: 0,
                end: 100,
                fillerColor: "rgba(36, 114, 218, 0.4)",
                borderRadius: 8,
                moveHandleSize: 15,
                handleSize: 50,
                showDetail: true
            },
            {
                type: 'inside',
                filterMode: 'none',
                orient: "vertical" // 设置为纵向控制柱状条的数量
            }
        ],
        grid: {
            // height: 500,
            // width: 800,
            containLabel: true
        },
        toolbox: {
            feature: {
                dataZoom: { show: true },
                saveAsImage: { show: true },
            },
            right: "2%"
        },
        series: [{
            type: 'custom',
            renderItem: function (params, api) {
                var categoryIndex = api.value(1); // sseqid
                // 将数值转换为像素坐标，返回的一个数组，数组的第一个元素是x坐标，第二个元素是y坐标，这是五个点共用的一组数据，后面需要根据五个点的位置调整路径
                var start = api.coord([api.value(6), categoryIndex]);
                var end = api.coord([api.value(7), categoryIndex]);
                var isPositiveFrame = api.value(12) === "1/1" || api.value(12) === "-1/-1";

                // 设置柱子的高度：获取y轴方向的尺寸，乘以0.6以便在y轴上留出一定间距，如果不乘以0.6，那么箭头的位置会和y轴的标签重叠
                var height = api.size([0, 1])[1] * 0.5;

                // echarts.graphic.clipRectByRect用于确保矩形在坐标系统内。
                var rectShape = echarts.graphic.clipRectByRect({
                    x: start[0], // 矩形的左侧的x坐标
                    y: start[1] - height / 2, // 矩形左侧的y坐标，这里减去高度的一半是为了使矩形在y轴上居中，在图像中y轴的正方向是向下的，减去相当于向上移动
                    width: end[0] - start[0],
                    height: height
                }, {
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                });

                // 为了确保色块填充矩形而不出现色块的割裂，使用path绘制矩形，M表示移动到某个点，L表示画直线到某个点，Z表示关闭路径。
                var path;
                // 如果是正向匹配，那么在右侧多绘制一个点模拟向右的箭头，否则在左侧多绘制一个点模拟向左的箭头
                if (isPositiveFrame) {
                    // 右端箭头
                    path = [
                        ['M', rectShape.x, rectShape.y], // 左上角
                        ['L', rectShape.x + rectShape.width - height / 2, rectShape.y], // 右上角，这里x需要减去一个值，因为箭头的顶端对应end的位置，相当于将原来的长方形右上角削去
                        ['L', rectShape.x + rectShape.width, rectShape.y + height / 2], // 右顶点，也就是箭头的顶点，由于y轴的正方向是向下的，加上一个值相当于向下移动
                        ['L', rectShape.x + rectShape.width - height / 2, rectShape.y + height],
                        ['L', rectShape.x, rectShape.y + height],
                        ['Z']
                    ];
                } else {
                    // 左端箭头
                    path = [
                        ['M', rectShape.x + height / 2, rectShape.y],
                        ['L', rectShape.x + rectShape.width, rectShape.y],
                        ['L', rectShape.x + rectShape.width, rectShape.y + height],
                        ['L', rectShape.x + height / 2, rectShape.y + height],
                        ['L', rectShape.x, rectShape.y + height / 2],
                        ['Z']
                    ];
                }

                return {
                    type: 'path',
                    shape: {
                        pathData: path.map(function (cmd) {
                            return cmd.join(' ');
                        }).join(' ')
                    },
                    style: api.style({
                        fill: 'steelblue'
                    })
                };
            },
            encode: {
                x: [6, 7],
                y: 1
            },
            data: allHitsBarPlotData
        }]
    };
}

option = getAllHitsBarPlotOption(allHitsBarPlotData);

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);