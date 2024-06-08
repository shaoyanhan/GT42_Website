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

function getOption(data) {
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
            axisPointer: {
                type: 'line',
                show: true,
                triggerEmphasis: true, // 是否触发强调
                snap: true, // 是否自动吸附到点
                label: {
                    show: false
                },
                lineStyle: {
                    // width: 3,
                    type: "dashed",
                }
            }

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
        series: [
            {
                // name: 'transcript count',
                type: 'scatter',
                symbolSize: 2,

                itemStyle: {
                    color: function (params) {
                        // console.log(params);
                        if (params.value[1] > 150) {
                            return 'red';
                        } else if (params.value[1] > 100 && params.value[1] <= 150) {
                            return 'yellow';
                        } else if (params.value[1] > 50 && params.value[1] <= 100) {
                            return 'green';
                        }
                        return 'blue';
                    },
                },
                data: data,
                encode: {
                    x: 0,
                    y: 1
                }
            },

        ]
    };
}


function drawTranscriptCount(transcriptCount) {
    let dom = document.getElementById('transcript_count');
    let transcriptCountChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    console.log('transcriptCount:', transcriptCount);
    transcriptCountChart.setOption(getOption(transcriptCount));
    transcriptCountChart.on('click', function (params) {
        console.log(params);
    });
}


function draw() {
    fetchData('http://127.0.0.1:8080/searchDatabase/getHomePageStatisticData/?dataType=transcriptCount').then(responseData => {
        drawTranscriptCount(responseData.data);
    });
}

draw();