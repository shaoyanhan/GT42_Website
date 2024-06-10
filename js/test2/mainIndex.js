async function fetchData(url) {
    try {
        const response = await fetch(url);
        const responseData = await response.json();
        return responseData;
    }
    catch (error) {
        console.error('数据请求失败:', error);
        throw error; // 重新抛出错误，让调用者处理
    }
}

function getTranscriptCountOption(data) {
    return {
        tooltip: {},

        title: {
            text: 'Transcript Count',
            left: 'center',
            top: 'top',
            textStyle: {
                fontSize: 14,
                fontWeight: 'bold',
            }
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                show: false
            },
            // axisPointer: {
            //     type: 'line',
            //     show: true,
            //     triggerEmphasis: true, // 是否触发强调
            //     snap: true, // 是否自动吸附到点
            //     label: {
            //         show: false
            //     },
            //     lineStyle: {
            //         // width: 3,
            //         type: "dashed",
            //     }
            // }

        },
        yAxis: {


        },
        grid: {
            height: '70%',
            width: '90%',
            bottom: '10%'
        },
        dataZoom: [
            {
                id: 'dataZoomX',
                xAxisIndex: [0],
                type: 'slider',
                // filterMode: 'weakFilter',
                filterMode: 'none',
                showDataShadow: true,
                bottom: 0,
                height: 10,
                start: 0,
                end: 100,
                fillerColor: "rgba(36, 114, 218, 0.4)",
                borderRadius: 8,
                // moveHandleSize: 20,
                showDetail: false
            },
            {
                type: 'inside',
                filterMode: 'none'
            }
        ],
        visualMap: {
            top: 10,
            right: 0,
            pieces: [
                { min: 0, max: 50, color: "#73c0de" },
                { min: 50, max: 100, color: "#91cc75" },
                { min: 100, max: 150, color: "#fac858" },
                { min: 150, color: '#e65c5e' },
            ],
            selectedMode: false // 选中模式会发生bug
        },
        series: [
            {
                // name: 'transcript count',
                type: 'scatter',
                symbolSize: 5,

                // itemStyle: {
                //     color: function (params) {
                //         // console.log(params);
                //         if (params.value[1] > 150) {
                //             return 'red';
                //         } else if (params.value[1] > 100 && params.value[1] <= 150) {
                //             return 'yellow';
                //         } else if (params.value[1] > 50 && params.value[1] <= 100) {
                //             return 'green';
                //         }
                //         return 'blue';
                //     },
                // },
                data: data,
                encode: {
                    x: 0,
                    y: 1
                }
            },

        ]
    };
}

function getSNPTypeCountOption(data) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return [
                    params.marker + params.name,
                    'Count: ' + params.value,
                    'Proportion: ' + params.percent + '%',
                ].join('<br>');
            }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 0,
            top: 30,
            bottom: 0,
        },
        title: {
            text: 'SNP Type Count',
            left: 'center',
            top: 'top',
            textStyle: {
                fontSize: 14,
                fontWeight: 'bold',
            }
        },

        series: [
            {
                name: 'SNP Type Count',
                type: 'pie',
                center: ['30%', '50%'], // 圆心坐标，饼图只能通过这个来调整其在容器内的定位
                radius: ['40%', '70%'],
                // avoidLabelOverlap: true,
                padAngle: 2,
                right: 0,
                itemStyle: {
                    borderRadius: 10
                },

                label: {
                    // show: true,
                    // position: 'inside',
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold',
                        formatter: '{b} \n {d}%' // 这里自动计算了百分比
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { name: 'C/T', value: 406541 },
                    { name: 'A/G', value: 386814 },
                    { name: 'C/G', value: 135900 },
                    { name: 'G/T', value: 120228 },
                    { name: 'A/C', value: 108567 },
                    { name: 'A/T', value: 101392 },
                    { name: 'A/G/T', value: 8918 },
                    { name: 'A/C/T', value: 8326 },
                    { name: 'C/G/T', value: 8008 },
                    { name: 'A/C/G', value: 7750 },
                    { name: 'A/C/G/T', value: 791 },
                ],
                animationType: "expansion",
                animationDuration: 2000,
                animationEasing: "quarticInOut",

            }
        ]

    }
}


function drawTranscriptCount(transcriptCount) {
    let dom = document.getElementById('transcript_count');
    let transcriptCountChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    // console.log('transcriptCount:', transcriptCount);
    transcriptCountChart.setOption(getTranscriptCountOption(transcriptCount));
    transcriptCountChart.on('click', function (params) {
        console.log(params);
    });
}

function drawSNPTypeCount(snpTypeCount) {
    let dom = document.getElementById('SNP_type_count');
    let snpTypeCountChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    // console.log('snpTypeCount:', snpTypeCount);
    snpTypeCountChart.setOption(getSNPTypeCountOption(snpTypeCount));
    snpTypeCountChart.on('click', function (params) {
        console.log(params);
    });
}


function draw() {
    fetchData('http://127.0.0.1:8080/searchDatabase/getHomePageStatisticData/?dataType=transcriptCount').then(responseData => {
        drawTranscriptCount(responseData.data);
    });
    // fetchData('http://127.0.0.1:8080/searchDatabase/getHomePageStatisticData/?dataType=SNPTypeCount').then(responseData => {
    //     drawSNPTypeCount(responseData.data);
    // });
    drawSNPTypeCount();
}

draw();