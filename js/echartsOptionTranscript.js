let startbp = 0;

function renderItem(params, api) {
    // console.log("params: ", params);
    // console.log("api: ", api);
    // var categoryIndex = api.value(3);
    // let geneID = api.value(1);
    let transcriptID = api.value(2);
    let areaType = api.value(3);
    // let yLable = (areaType == 'haplotype' ? geneID : transcriptID);
    let yLable = transcriptID;
    let start = api.coord([api.value(7), yLable]); // x, y
    let end = api.coord([api.value(8) + 1, yLable]); // 这里的加1是因为绘制点时取的是区间的左端点，但是1bp是一个长度为1的区间，所以需要加1让右端点也在区间内
    let height = 0;

    if (areaType == 'intron' || areaType == 'deletion') {
        height = api.size([0, 1])[1] * 0.1;
    } else {
        height = api.size([0, 1])[1] * 0.6;
    }

    let rectShape = echarts.graphic.clipRectByRect(
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

// 绘制图像时y轴统一使用transcriptID列，而mosaic行或haplotype行（第一行）的transcriptID都为'--'，需要单独添加一个虚拟的transcriptID
function insertTranscriptID(transcriptData) {
    // 遍历transcriptData
    for (let i = 0; i < transcriptData.length; i++) {
        let geneID = transcriptData[i][1];
        let areaType = transcriptData[i][4];
        if (areaType == 'haplotype') {
            // haplotype添加一个虚拟的transcriptID
            transcriptData[i][2] = geneID + '.0';
        }
    }
    return transcriptData;
}

// 将softClip和insertion的行分离出来绘制点图
function separateMarkers(transcriptData) {
    let markerData = [];
    let transcriptDataNew = [];
    for (let i = 0; i < transcriptData.length; i++) {
        let areaType = transcriptData[i][3];
        if (areaType == 'softClip' || areaType == 'insertion') {
            markerData.push(transcriptData[i]);
        } else {
            transcriptDataNew.push(transcriptData[i]);
        }
    }
    return [transcriptDataNew, markerData];
}

function getTranscriptOption(transcriptData) {
    console.log("transcriptData: ", transcriptData);

    let [transcriptDataNew, markerData] = separateMarkers(transcriptData);
    console.log("transcriptDataNew: ", transcriptDataNew);
    console.log("markerData: ", markerData);

    return {
        tooltip: {

            formatter: function (params) {
                // console.log(params);
                // 设置不同图形的提示信息，不知道为什么不能在series里面单独设置
                let transcriptID = params.value[2];
                let areaType = params.value[3];
                let queryRangeStr;
                let subjectRangeStr;

                if (areaType === 'mosaic' || areaType === 'haplotype') {
                    return [
                        params.marker + areaType,
                        'ID: ' + (areaType === "mosaic" ? params.value[0] : params.value[1]),
                        'Range: ' + params.value[7] + ' - ' + params.value[8] + ' bp',
                    ].join('<br>');
                } else if (areaType === 'exon') {
                    queryRangeStr = params.value[5] + ' - ' + params.value[6] + ' bp';
                    subjectRangeStr = params.value[7] + ' - ' + params.value[8] + ' bp';
                } else if (areaType === 'intron' || areaType === 'deletion') {
                    queryRangeStr = ' -- ';
                    subjectRangeStr = params.value[7] + ' - ' + params.value[8] + ' bp';
                } else {
                    queryRangeStr = params.value[5] + ' - ' + params.value[6] + ' bp';
                    subjectRangeStr = ' -- ';
                }
                return [
                    params.marker + areaType,
                    'Length: ' + params.value[4] + ' bp',
                    'Query Range: ' + queryRangeStr,
                    'Subject Range: ' + subjectRangeStr,
                    'Transcript ID: ' + params.value[2],
                ].join('<br>');

            },
            textStyle: {
                fontSize: 16
            },
        },
        title: {
            text: 'Transcripts Profile of Haplotype',
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
                filterMode: 'none', // 这里只能设置为none，因为一旦开启过滤或者设置为空，那么横向放大之后转录本就会被截断
                showDataShadow: false,
                labelFormatter: function (value) {
                    return Math.round(value) + 'bp';
                },
                textStyle: {
                    fontSize: 15
                },
                bottom: 20,
                height: 30,
                start: 0,
                end: 100,
                fillerColor: "rgba(36, 114, 218, 0.4)",
                borderRadius: 8,
                moveHandleSize: 15, //横向柄条
                handleSize: 50, //纵向柄条
                showDetail: true

            },
            {
                id: 'dataZoomY',
                yAxisIndex: [0],
                type: 'slider',
                filterMode: 'none',
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
            // 控制内部的缩放，这里对x和y都开启，可以实现整个区域的放缩和自由拖拽
            {
                type: 'inside',
                filterMode: 'none',
                orient: "vertical",
                yAxisIndex: [0]
            },
            {
                type: 'inside',
                filterMode: 'none',
                orient: "horizontal",
                xAxisIndex: [0]
            }
        ],
        toolbox: {
            feature: {
                dataZoom: { show: true },
                // dataView: { show: true, readOnly: false },
                // restore功能有bug，在切换数据之后，点击restore会自动绘制GT42000001的图像
                // restore: { show: true }, 
                saveAsImage: { show: true },
                // magicType: {
                //     type: ['line', 'bar', 'stack']
                // }

            }
        },
        // 最多 66 个转录本，平均值10-20个
        grid: {
            height: 950,
            width: 800,
            containLabel: true
        },
        xAxis:
        {
            min: -2,
            // scale: true,
            axisLabel: {
                formatter: function (val) {
                    // return Math.round(Math.max(0, val - startbp)) + ' bp';
                    return Math.round(val - startbp) + ' bp';

                },
                fontSize: 15
            },
            // axisPointer: {
            //     show: true,
            //     type: "line"
            // }
        },
        yAxis: {
            type: 'category',
            inverse: true,
            axisLabel: {
                show: true,
                fontSize: 15,
                // 修改第一行的名称为mosaicID或者haplotypeID
                // 如果需要修改非第一行的行名称，则不能使用index改变单倍型的ID标签，因为index是当前画幅中的index，而不是数据中的index，一旦画幅改变，那么index也会改变
                formatter: function (value, index) {
                    if (value !== '--') return value;
                    const firstRow = transcriptData[0];
                    if (firstRow[3] === 'mosaic') return firstRow[0];
                    return firstRow[1];
                }
            },
            // data: categories
        },
        series: [
            {
                name: 'transcript',
                type: 'custom',
                renderItem: renderItem,
                itemStyle: {
                    opacity: 1,
                    color: function (params) {
                        let areaType = params.data[3];
                        if (areaType == 'haplotype') {
                            // console.log('itemStyle: ', params);
                            // 对params.value[1]以.为分隔符进行拆分，取第二个元素判断物种信息
                            let species = params.value[1].split('.')[1];
                            if (species == 'SO') {
                                // console.log(params);
                                return '#AED581';
                            } else if (species == 'SS') {
                                return '#4DB6AC';
                            } else if (species == 'SO_SS') {
                                return '#A1887F';
                            } else {
                                return 'black';
                            }
                        } else {
                            if (areaType == 'mosaic') {
                                return '#657FCB';
                            } else if (areaType == 'exon') {
                                return '#a8e1f5';
                            } else if (areaType == 'intron') {
                                return '#D2DE32';
                            } else if (areaType == 'deletion') {
                                return 'gray';
                            } else {
                                return 'black';
                            }
                        }
                    }
                },
                borderRadius: 5,
                encode: {
                    x: [7, 8],
                    // y: 3,
                    y: 2,
                    // tooltip: {
                    //     formatter: function (params) {

                    //         return params[0].value[0] + ': ';
                    //     }
                    // }
                },

                data: transcriptDataNew,
                // custom 模式下无法使用select,只能使用highlight
                // select: {
                //     disabled: false,
                //     itemStyle: {
                //         borderColor: 'rgba(250, 3, 3, 1)',
                //         borderWidth: 2
                //     }
                // },
                // selectedMode: 'single',
            },
            {
                name: 'marker',
                type: 'scatter', // Use scatter plot for markers
                encode: {
                    x: 7, // Marker position on the x-axis
                    y: 2  // Corresponding transcript ID on the y-axis
                },
                // symbol: "path://M197,476.5L177,476.5L177,481L168,472L177,463L177,467.5L197,467.5Z",
                symbol: function (value, params) {
                    let areaType = params.data[3];
                    // 根据是否是第一个softClip返回左右箭头
                    if (areaType === 'softClip') {
                        return params.data[5] === '1' ? 'path://M197,476.5L177,476.5L177,481L168,472L177,463L177,467.5L197,467.5Z' : 'path://M506,467.5L526,467.5L526,463L535,472L526,481L526,476.5L506,476.5Z';
                    } else if (areaType === 'insertion') {
                        return 'arrow';
                    } else {
                        return 'pin'
                    }
                },
                symbolSize: 15, // Adjust marker size
                // symbolSize: function () {
                //     // 动态计算标记点大小，限制为 exon 高度的 80%
                //     let baseSize = 10; // 默认大小
                //     return Math.min(baseSize * currentZoomScale, exonHeight * 0.8);
                // },
                itemStyle: {
                    color: function (params) {
                        let areaType = params.data[3];
                        return areaType === 'softClip' ? '#60bd84ba' : '#887ba5ba'; // Different colors for marker types
                    }
                },
                data: markerData
            }
        ],
        animation: true,
        animationEasing: 'elasticOut',
    };
}

export { getTranscriptOption };