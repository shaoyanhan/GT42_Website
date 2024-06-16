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
        yAxis: {},
        grid: {
            height: '70%',
            width: '90%',
            bottom: '10%'
        },
        toolbox: {
            feature: {
                restore: { show: true },
                saveAsImage: { show: true },
            }
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
            top: 30,
            right: 0,
            pieces: [
                { min: 0, max: 50, color: "#73c0de" },
                { min: 50, max: 100, color: "#91cc75" },
                { min: 100, max: 150, color: "#fac858" },
                { min: 150, color: '#e65c5e' },
            ],
            selectedMode: false // 由于点太多，选中模式会发生无法消除区域的bug
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
        toolbox: {
            feature: {
                restore: { show: true },
                saveAsImage: { show: true },
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
                data: data,
                animationType: "expansion",
                animationDuration: 2000,
                animationEasing: "quarticInOut",

            }
        ]

    }
}

export { getTranscriptCountOption, getSNPTypeCountOption };
