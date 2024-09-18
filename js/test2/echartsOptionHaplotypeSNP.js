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
                        'Type: ' + params.value[3],
                        'Mosaic ID: ' + params.value[0],
                        'Haplotype ID: ' + params.value[2],
                        'Site: ' + params.value[1] + ' bp',

                    ].join('<br>');
                }
                return [
                    params.marker + (params.name === '--' ? 'Mosaic gene' : 'Haplotype gene'),
                    'Mosaic ID: ' + params.value[0],
                    'Gene ID: ' + params.value[1],
                    'Gene Type: ' + params.value[2],
                    'Gene Length: ' + params.value[3] + ' bp',
                ].join('<br>');
            },
            textStyle: {
                fontSize: 16
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
                fontSize: 15
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
                end: 99,
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
                filterMode: 'none'
            }
        ],
        toolbox: {
            feature: {
                dataZoom: { show: true },
                // dataView: { show: true, readOnly: false },
                // restore: { show: true },
                saveAsImage: { show: true, name: "Haplotypes && SNPs" },
                // magicType: {
                //     type: ['line', 'bar', 'stack']
                // }

            }
        },
        // 设置坐标系的大小，这样可以保证其在网页中框架大小不变，内部元素大小变化
        // 注意这里与 dataZoomX 高度以及外部div容器一起调整
        // 目前设置为可以展示10个 haplotype 和1个 mosaic 的高度，已经测试过最多138个haplotype的情况, 大部分集中于10-20个
        grid: {
            height: 620,
            width: 800,
            containLabel: true
        },
        xAxis:
        {
            min: 0,
            axisLabel: {
                formatter: function (val) {
                    return Math.round(Math.max(0, val)) + ' bp';
                },
                fontSize: 15
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
                fontSize: 15,
                formatter: function (value) {
                    // 先以.为分隔符对字符串进行分割，然后取分割后的最后一个元素，判断是否为0，如果为0，说明是mosaic，返回分割后的第一个元素，否则是haplotype，直接返回ID
                    return (value === '--') ? haplotypeData[0][0] : value;
                }
            }
        },
        series: [
            {
                name: 'haplotype',
                type: 'bar',
                // renderItem: renderItem,
                // itemStyle: {
                //     opacity: 0.8,

                // },
                encode: {
                    x: 4,
                    y: 1,
                    // tooltip: {
                    //     formatter: function (params) {

                    //         return params[0].value[0] + ': ';
                    //     }
                    // }

                },
                data: haplotypeData,
                // colorBy: "data",

                itemStyle: {
                    opacity: 0.9,
                    borderRadius: 5,
                    color: function (params) {

                        // 对params.value[1]以.为分隔符进行拆分，取第二个元素，如果为'SO',则返回'#AED581'
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
                            return '#657FCB';
                        }

                    },

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
            {
                name: 'SNP',
                // type: 'custom',
                type: 'scatter',
                // renderItem: renderItem,
                itemStyle: {
                    color: function (params) {
                        let value = params.value;
                        if (value[3] == 'A') {
                            return 'blue';
                        } else if (value[3] == 'C') {
                            return 'red';
                        } else if (value[3] == 'G') {
                            return 'yellow';
                        } else if (value[3] == 'T') {
                            return 'green';
                        } else { // no exon evidence
                            return 'black';
                        }
                    }
                },
                // symbolSize: 20,
                // symbol:
                //     function (value) {
                //         if (value[0] == 1) {
                //             return "rect";
                //         }
                //         return "circle";
                //     },
                encode: {
                    x: 1,
                    y: 2,

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

            }
        ]
    };
}

export { getHaplotypeSNPOption };