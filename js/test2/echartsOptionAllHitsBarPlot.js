function addOccurrenceToSubjectID(dataArray) {
    // 字典来记录每个元素的出现次数
    const occurrences = {};

    // 更新第二列元素以包括其出现次数后缀
    dataArray.forEach(row => {
        const key = row[1];
        if (occurrences[key]) {
            occurrences[key] += 1;
        } else {
            occurrences[key] = 1;
        }
        row[1] = `${key}.${occurrences[key]}`;
    });

    return [dataArray, occurrences];
}

// frames代表阅读框，blastn和blastp不涉及阅读框转化的问题，所以使用1代表从头开始的序列，其中核酸序列存在正反链，所以需要考虑正负号，但是蛋白质序列不存在正负链，所以不需要考虑正负号
// blastx和tblastn中存在一方转化为6种阅读框的问题，但是蛋白质序列不存在阅读框的概念，所以使用0代表从头开始的序列与转化为阅读框的结果区别开来
// blastn: ±1/±1
// blastp：1/1
// blastx: ±1/0, ±2/0, ±3/0
// tblastn: 0/±1, 0/±2, 0/±3
// tblastx: ±1/±1, ±1/±2, ±1/±3, ±2/±1, ±2/±2, ±2/±3, ±3/±1, ±3/±2, ±3/±3


// 确定箭头的方向，这里加上三种正向阅读框 (+1, +2, +3) 和三种反向阅读框 (-1, -2, -3) 的判断；以及query只有一种方向的情况（tblastn）
function determineArrowDirection(input) {
    // 拆分输入字符串，提取 query 和 subject 的方向
    const [queryFrame, subjectFrame] = input.split('/').map(Number);

    // 由于图像的横轴是以query的方向为基准的，所以如果query的方向是正的，那么箭头的方向就是右，否则是左
    return queryFrame >= 0 ? 'right' : 'left';
}



function getAllHitsBarPlotOption(dataArray) {
    const [allHitsBarPlotData, occurrences] = addOccurrenceToSubjectID(dataArray);
    const allHSPCount = allHitsBarPlotData.length;
    const allHitCount = Object.keys(occurrences).length;

    return {
        title: {
            text: `Hits Count: ${allHitCount}, HSP Count: ${allHSPCount}`,
            subtext: allHSPCount > 10 ? 'Please scroll wheel to see hits' : '', // 根据条件动态设置 subtext
            left: "center",
            top: "1%",
            textStyle: {
                fontSize: 15
            },
            subtextStyle: {
                fontSize: 12
            }
        },
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
                    'HSP Index: ' + lastElement,
                    'Subject Range: ' + subjectRange,
                    'E-value: ' + param.value[10],
                    'Query/Subject Frame: ' + param.value[12],
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
                let categoryIndex = api.value(1); // sseqid
                // 将数值转换为像素坐标，返回的一个数组，数组的第一个元素是x坐标，第二个元素是y坐标，这是五个点共用的一组数据，后面需要根据五个点的位置调整路径
                let start = api.coord([api.value(6), categoryIndex]);
                let end = api.coord([api.value(7), categoryIndex]);
                let arrowDirection = determineArrowDirection(api.value(12));

                // 设置柱子的高度：获取y轴方向的尺寸，乘以0.6以便在y轴上留出一定间距，如果不乘以0.6，那么箭头的位置会和y轴的标签重叠
                let height = api.size([0, 1])[1] * 0.5;

                // console.log('start:', start);
                // console.log('end:', end);
                // console.log('arrowDirection:', arrowDirection);
                // console.log('height:', height);

                // echarts.graphic.clipRectByRect用于确保矩形在坐标系统内。
                let rectParams = {};
                if (arrowDirection === 'right') {
                    rectParams = {
                        x: start[0], // 矩形的左侧的x坐标
                        y: start[1] - height / 2, // 矩形左侧的y坐标，这里减去高度的一半是为了使矩形在y轴上居中，在图像中y轴的正方向是向下的，减去相当于向上移动
                        width: end[0] - start[0],
                        height: height
                    };
                } else {
                    rectParams = {
                        x: end[0],
                        y: start[1] - height / 2,
                        width: start[0] - end[0],
                        height: height
                    };
                }
                let rectShape = echarts.graphic.clipRectByRect(
                    rectParams
                    , {
                        x: params.coordSys.x,
                        y: params.coordSys.y,
                        width: params.coordSys.width,
                        height: params.coordSys.height
                    });
                // console.log('params.coordSys:', params.coordSys);
                // console.log('rectShape:', rectShape);


                // 为了确保色块填充矩形而不出现色块的割裂，使用path绘制矩形，M表示移动到某个点，L表示画直线到某个点，Z表示关闭路径。
                let path;
                // 如果是正向匹配，那么在右侧多绘制一个点模拟向右的箭头，否则在左侧多绘制一个点模拟向左的箭头
                if (arrowDirection === 'right') {
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
                        ['M', rectShape.x, rectShape.y + height / 2],
                        ['L', rectShape.x + height / 2, rectShape.y],
                        ['L', rectShape.x + rectShape.width, rectShape.y],
                        ['L', rectShape.x + rectShape.width, rectShape.y + height],
                        ['L', rectShape.x + height / 2, rectShape.y + height],
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

export { getAllHitsBarPlotOption };