let startbp = 0;

function renderItem(params, api) {
    // console.log(params);
    // console.log(api);
    // var categoryIndex = api.value(3);
    // let geneID = api.value(1);
    let transcriptID = api.value(2);
    let areaType = api.value(4);
    // let yLable = (areaType == 'haplotype' ? geneID : transcriptID);
    let yLable = transcriptID;
    let start = api.coord([api.value(5), yLable]); // x, y
    let end = api.coord([api.value(6), yLable]);
    let height = 0;

    if (areaType == 'exon' || areaType == 'haplotype') {
        height = api.size([0, 1])[1] * 0.6;
    } else {
        height = api.size([0, 1])[1] * 0.1;
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

// 为了绘制图像时y轴统一使用transcriptID列，所以要使用.0后缀为haplotype添加一个虚拟的transcriptID
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

function getTranscriptOption(transcriptData) {
    transcriptData = insertTranscriptID(transcriptData);
    console.log(transcriptData);
    return {
        tooltip: {

            formatter: function (params) {
                // console.log(params);
                // 设置不同图形的提示信息，不知道为什么不能在series里面单独设置
                let areaType = params.value[4];
                if (areaType == 'haplotype') {
                    return [
                        params.marker + params.value[1],
                        'Mosaic ID: ' + params.value[0],
                        'Gene ID: ' + params.value[1],
                        'Gene Range: ' + params.value[8],
                        'Gene Length: ' + params.value[7] + ' bp',
                    ].join('<br>');
                }
                return [
                    params.marker + params.name,
                    (params.value[4] == 'exon' ? 'Exon: ' : 'Intron: ') + params.value[5] + ' - ' + params.value[6] + ' bp',
                    'Transcript ID: ' + params.value[2],
                    'Transcript Range: ' + params.value[8] + ' bp',
                    'Transcript Length: ' + params.value[9] + ' bp',
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
            min: startbp,
            scale: true,
            axisLabel: {
                formatter: function (val) {
                    return Math.round(Math.max(0, val - startbp)) + ' bp';
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
                // 这里不能使用index改变单倍型的ID标签，因为index是当前画幅中的index，而不是数据中的index，一旦画幅改变，那么index也会改变
                formatter: function (value, index) {
                    // 对value以'.'进行分割，如果最后一个元素是0，那么说明是haplotype，将末尾的.0去掉
                    let valueArray = value.split('.');

                    // console.log('value: ', value);
                    // console.log('index: ', index);
                    // console.log('transcriptData[index]: ', transcriptData[index]);
                    // console.log('valueArray: ', valueArray);

                    if (valueArray[valueArray.length - 1] == '0') {
                        return valueArray.slice(0, valueArray.length - 1).join('.');
                    } else {
                        return value;
                    }

                }
            }
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
                        let areaType = params.data[4];
                        if (areaType == 'haplotype') {
                            // console.log('itemStyle: ', params);
                            // 对params.value[1]以.为分隔符进行拆分，取第二个元素判断物种信息
                            let species = params.value[1].split('.')[1];
                            if (species == 'SO') {
                                // console.log(params);
                                return '#AED581';
                            } else if (species == 'SS') {
                                return '#4DB6AC';
                            } else if (species == 'CO') {
                                return '#F48FB1';
                            } else if (species == 'UK') {
                                return '#A1887F';
                            } else {
                                return 'black';
                            }
                        } else {
                            if (areaType == 'exon') {
                                return '#a8e1f5';
                            } else {
                                return '#D2DE32';
                            }
                        }
                    }
                },
                borderRadius: 5,
                encode: {
                    x: [5, 6],
                    // y: 3,
                    y: 2,
                    // tooltip: {
                    //     formatter: function (params) {

                    //         return params[0].value[0] + ': ';
                    //     }
                    // }
                },

                data: transcriptData,
                // custom 模式下无法使用select,只能使用highlight
                // select: {
                //     disabled: false,
                //     itemStyle: {
                //         borderColor: 'rgba(250, 3, 3, 1)',
                //         borderWidth: 2
                //     }
                // },
                // selectedMode: 'single',
            }
        ],
        animation: true,
        animationEasing: 'elasticOut',
    };
}

export { getTranscriptOption };