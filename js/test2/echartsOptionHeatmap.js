// prettier-ignore AM-1,AM-2,AM-3,Br-1,Br-2,Br-3,Bu1-1,Bu1-2,Bu1-3,Bu2-1,Bu2-2,Bu2-3,Bu3-1,Bu3-3,Ca1-1,Ca1-2,Ca1-3,Ca2-1,Ca2-2,Ca2-3,Ca3-1,Ca3-2,Ca3-3,Gl-2,Gl-3,In1-1,In1-2,In1-3,In2-1,In2-3,Le1-1,Le1-2,Le1-3,Le2-1,Le2-2,Le2-3,LS1-1,LS1-2,LS1-3,LS2-2,LS2-3,No2-1,No2-2,No2-3,NR1-1,NR1-2,NR1-3,Pi-1,Pi-2,Pi-3,Ro1-1,Ro1-2,Ro1-3,Ro2-1,Ro2-2,Ro2-3,Sp-1,Sp-2,Sp-3,St-1,St-2,St-3
const sampleID = [
    'AM-1', 'AM-2', 'AM-3', 'Br-1', 'Br-2', 'Br-3', 'Bu1-1', 'Bu1-2', 'Bu1-3', 'Bu2-1', 'Bu2-2', 'Bu2-3', 'Bu3-1', 'Bu3-3', 'Ca1-1', 'Ca1-2', 'Ca1-3', 'Ca2-1', 'Ca2-2', 'Ca2-3', 'Ca3-1', 'Ca3-2', 'Ca3-3', 'Gl-2', 'Gl-3', 'In1-1', 'In1-2', 'In1-3', 'In2-1', 'In2-3', 'Le1-1', 'Le1-2', 'Le1-3', 'Le2-1', 'Le2-2', 'Le2-3', 'LS1-1', 'LS1-2', 'LS1-3', 'LS2-2', 'LS2-3', 'No2-1', 'No2-2', 'No2-3', 'NR1-1', 'NR1-2', 'NR1-3', 'Pi-1', 'Pi-2', 'Pi-3', 'Ro1-1', 'Ro1-2', 'Ro1-3', 'Ro2-1', 'Ro2-2', 'Ro2-3', 'Sp-1', 'Sp-2', 'Sp-3', 'St-1', 'St-2', 'St-3'
];
// prettier-ignore
const geneID = [
    'GT42G000001', 'GT42G000002', 'GT42G000003', 'GT42G000004', 'GT42G000005', 'GT42G000006', 'GT42G000007', 'GT42G000008', 'GT42G000009', 'GT42G000010', 'GT42G000011', 'GT42G000012', 'GT42G000013', 'GT42G000014', 'GT42G000015', 'GT42G000016', 'GT42G000017', 'GT42G000018', 'GT42G000019', 'GT42G000020', 'GT42G000021', 'GT42G000022', 'GT42G000023', 'GT42G000024', 'GT42G000025', 'GT42G000026', 'GT42G000027', 'GT42G000028', 'GT42G000029', 'GT42G000030', 'GT42G000031', 'GT42G000032', 'GT42G000033', 'GT42G000034', 'GT42G000035', 'GT42G000036', 'GT42G000037', 'GT42G000038', 'GT42G000039', 'GT42G000040', 'GT42G000041', 'GT42G000042', 'GT42G000043', 'GT42G000044', 'GT42G000045', 'GT42G000046', 'GT42G000047', 'GT42G000048', 'GT42G000049', 'GT42G000050', 'GT42G000051', 'GT42G000052', 'GT42G000053', 'GT42G000054', 'GT42G000055', 'GT42G000056', 'GT42G000057', 'GT42G000058', 'GT42G000059', 'GT42G000060', 'GT42G000061'
];

// prettier-ignore 8.186516405397175,7.690538223807626,8.450097545640336,9.457429881262435,7.175725714165546,7.516665216777257,9.680616011323155,9.971512591095763,10.078192812976472,9.11764793043146,9.688094635648572,9.412979325227244,8.245311673674506,9.137935969876214,11.265332695869246,10.999921074160177,9.475785843321182,10.739160785154477,10.42883724078665,9.302430599985863,9.322950365180935,9.598320967255393,9.227492873242966,8.835348098338038,9.330445861156386,11.753782169595162,11.87180035064952,10.779679004939055,13.008894256333306,11.459739335937188,9.988933752999039,10.131911269943584,10.784144591968523,1.9927016915053735,1.5224561507242598,2.8940714901027134,11.422792686431427,11.300084510828187,11.961770937169975,4.905763415482744,4.9074441910210505,8.98854666269715,9.22651850607226,9.412188585361212,11.179677046957794,11.219958917129123,11.293095082620514,8.95720088000335,7.389762804537979,8.2688857485263,11.391781422240147,10.968066125878414,10.05404139554592,9.775581625357722,10.832076907924979,11.186621965482834,8.53630090298536,8.17711799433348,8.318599437474564,7.84401946330608,6.220475118984714,6.362704150957609
const data = [
    // [0, 0, 8.186516405397175], [1, 0, 7.690538223807626], [2, 0, 8.450097545640336], [3, 0, 9.457429881262435], [4, 0, 7.175725714165546], [5, 0, 7.516665216777257], [6, 0, 9.680616011323155], [7, 0, 9.971512591095763], [8, 0, 10.078192812976472], [9, 0, 9.11764793043146], [10, 0, 9.688094635648572], [11, 0, 9.412979325227244], [12, 0, 8.245311673674506], [13, 0, 9.137935969876214], [14, 0, 11.265332695869246], [15, 0, 10.999921074160177], [16, 0, 9.475785843321182], [17, 0, 10.739160785154477], [18, 0, 10.42883724078665], [19, 0, 9.302430599985863], [20, 0, 9.322950365180935], [21, 0, 9.598320967255393], [22, 0, 9.227492873242966], [23, 0, 8.835348098338038], [24, 0, 9.330445861156386], [25, 0, 11.753782169595162], [26, 0, 11.87180035064952], [27, 0, 10.779679004939055], [28, 0, 13.008894256333306], [29, 0, 11.459739335937188], [30, 0, 9.988933752999039], [31, 0, 10.131911269943584], [32, 0, 10.784144591968523], [33, 0, 1.9927016915053735], [34, 0, 1.5224561507242598], [35, 0, 2.8940714901027134], [36, 0, 11.422792686431427], [37, 0, 11.300084510828187], [38, 0, 11.961770937169975], [39, 0, 4.905763415482744], [40, 0, 4.9074441910210505], [41, 0, 8.98854666269715], [42, 0, 9.22651850607226], [43, 0, 9.412188585361212], [44, 0, 11.179677046957794], [45, 0, 11.219958917129123], [46, 0, 11.293095082620514], [47, 0, 8.95720088000335], [48, 0, 7.389762804537979], [49, 0, 8.2688857485263], [50, 0, 11.391781422240147], [51, 0, 10.968066125878414], [52, 0, 10.05404139554592], [53, 0, 9.775581625357722], [54, 0, 10.832076907924979], [55, 0, 11.186621965482834], [56, 0, 8.53630090298536], [57, 0, 8.17711799433348], [58, 0, 8.318599437474564], [59, 0, 7.84401946330608], [60, 0, 6.220475118984714], [61, 0, 6.362704150957609]
    ['AM-1', 'GT42G00001', 8.1865], ['AM-2', 'GT42G00001', 7.6905], ['AM-3', 'GT42G00001', 8.4501], ['Br-1', 'GT42G00001', 9.4574], ['Br-2', 'GT42G00001', 7.1757], ['Br-3', 'GT42G00001', 7.5167], ['Bu1-1', 'GT42G00001', 9.6806], ['Bu1-2', 'GT42G00001', 9.9715], ['Bu1-3', 'GT42G00001', 10.0782], ['Bu2-1', 'GT42G00001', 9.1176], ['Bu2-2', 'GT42G00001', 9.6881], ['Bu2-3', 'GT42G00001', 9.4130], ['Bu3-1', 'GT42G00001', 8.2453], ['Bu3-3', 'GT42G00001', 9.1379], ['Ca1-1', 'GT42G00001', 11.2653], ['Ca1-2', 'GT42G00001', 10.9999], ['Ca1-3', 'GT42G00001', 9.4758], ['Ca2-1', 'GT42G00001', 10.7392], ['Ca2-2', 'GT42G00001', 10.4288], ['Ca2-3', 'GT42G00001', 9.3024], ['Ca3-1', 'GT42G00001', 9.3229], ['Ca3-2', 'GT42G00001', 9.5983], ['Ca3-3', 'GT42G00001', 9.2275], ['Gl-2', 'GT42G00001', 8.8353], ['Gl-3', 'GT42G00001', 9.3304], ['In1-1', 'GT42G00001', 11.7538], ['In1-2', 'GT42G00001', 11.8718],
    ['AM-1', 'GT42G00002', 8.1865], ['AM-2', 'GT42G00002', 7.6905], ['AM-3', 'GT42G00002', 8.4501], ['Br-1', 'GT42G00002', 9.4574], ['Br-2', 'GT42G00002', 7.1757], ['Br-3', 'GT42G00002', 7.5167], ['Bu1-1', 'GT42G00002', 9.6806], ['Bu1-2', 'GT42G00002', 9.9715], ['Bu1-3', 'GT42G00002', 10.0782], ['Bu2-1', 'GT42G00002', 9.1176], ['Bu2-2', 'GT42G00002', 9.6881], ['Bu2-3', 'GT42G00002', 9.4130], ['Bu3-1', 'GT42G00002', 8.2453], ['Bu3-3', 'GT42G00002', 9.1379], ['Ca1-1', 'GT42G00002', 11.2653], ['Ca1-2', 'GT42G00002', 10.9999], ['Ca1-3', 'GT42G00002', 9.4758], ['Ca2-1', 'GT42G00002', 10.7392], ['Ca2-2', 'GT42G00002', 10.4288], ['Ca2-3', 'GT42G00002', 9.3024], ['Ca3-1', 'GT42G00002', 9.3229], ['Ca3-2', 'GT42G00002', 9.5983], ['Ca3-3', 'GT42G00002', 9.2275], ['Gl-2', 'GT42G00002', 8.8353], ['Gl-3', 'GT42G00002', 9.3304], ['In1-1', 'GT42G00002', 11.7538], ['In1-2', 'GT42G00002', 11.8718]

];

// // 按照echarts的数据格式要求，生成模拟数据
// const generateMockData = () => {
//     const newData = [];
//     for (let i = 0; i < geneID.length; i++) {
//         for (let j = 0; j < sampleID.length; j++) {
//             const randomValue = Math.random() * 10;
//             newData.push([j, i, randomValue]);
//         }
//     }
//     return newData;
// };
// const newData = generateMockData();


// 提取出heatmap绘制所需的数据
// [
//     {
//         "mosaicID": "GT42G000001",
//         "xenologousID": "GT42G000001.SO",
//         "Ca1_1": "10.8184",
//         "Ca1_2": "10.5647",
//         "Ca1_3": "9.0946",
//         "id": 1
//     },
//     {
//         "mosaicID": "GT42G000001",
//         "xenologousID": "GT42G000001.SS",
//         "Ca1_1": "9.3591",
//         "Ca1_2": "9.0615",
//         "Ca1_3": "7.3778",
//         "id": 2
//     }
// ]
// [
//     ["Ca1_1", "GT42G000001", 10.8184], ["Ca1_2", "GT42G000001", 10.5647], ["Ca1_3", "GT42G000001", 9.0946], 
//     ["Ca1_1", "GT42G000002", 9.3591], ["Ca1_2", "GT42G000002", 9.0615], ["Ca1_3", "GT42G000002", 7.3778]
// ]
function extractHeatmapData(dataArray) {
    const heatmapData = [];

    dataArray.forEach(item => {
        const entries = Object.entries(item);
        const ID = entries[0][1]; // 取第一个键的值作为ID标识
        for (let i = 1; i < entries.length - 1; i++) { // 从第二个键开始，结束于倒数第二个键，即跳过ID和id键
            const [key, value] = entries[i];
            heatmapData.push([key, ID, parseFloat(value)]);
        }
    });

    return heatmapData;
}

function returnAbbreviationDetails(abbreviation) {
    // 定义一个对象，其中包含所有缩写与全称的映射
    const abbreviationMap = {
        "Ca": "Callus",
        "Ro": "Trefoil: Root",
        "Le1": "Elongation: Leaf",
        "LS1": "Elongation: Leaf + Sheath",
        "Bu1": "Elongation: Bud",
        "In1": "Elongation: Internode",
        "NR1": "Elongation: Nodal Root",
        "AM": "Elongation: Apical Meristem",
        "Bu2": "Biennial Root: Bud",
        "Sp": "Florescence: Spikelet",
        "Br": "Florescence: Branch",
        "St": "Florescence: Stamen",
        "Pi": "Florescence: Pistil",
        "Gl": "Florescence: Glume",
        "LS2": "Florescence: Leaf + Sheath",
        "In2": "Florescence: Internode",
        "No2": "Florescence: Node",
        "Bu3": "Florescence: Bud",
        "Le2": "Florescence: Leaf",
        // 更多的映射可以继续添加
    };

    // 遍历映射对象的键，查找匹配的缩写
    for (const key in abbreviationMap) {
        if (abbreviation.startsWith(key)) {
            return abbreviationMap[key];
        }
    }

    // 如果没有找到匹配的缩写，返回未知
    return "Unknown";
}

function getHeatmapOption(dataArray) {
    console.log(dataArray);
    const heatmapData = extractHeatmapData(dataArray);
    console.log(heatmapData);
    return {
        title: {
            text: 'Profile',
            left: 'center',
            top: 20,
            textStyle: {
                fontSize: 16
            },
        },
        tooltip: {
            formatter: function (params) {
                // console.log(params);
                return [
                    params.marker + 'TPM:&nbsp;&nbsp;&nbsp;' + params.value[2],
                    'ID:&nbsp;&nbsp;&nbsp;' + params.value[1],
                    'Sample ID:&nbsp;&nbsp;&nbsp;' + params.value[0],
                    returnAbbreviationDetails(params.value[0])

                ].join('<br>');
            },
            textStyle: {
                fontSize: 16,
                fontWeight: "bolder"
            },
            // position: function (pos, params, el, elRect, size) {
            //     var obj = { top: 10 };
            //     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            //     return obj;
            // },
            // 将提示框限制在图表区域内，因为现在为绘图区域设置了自动生成竖直滚动条，会导致提示框被遮挡
            confine: true,

        },
        grid: {
            // height: 80,
            // width: '86%',
            // top: 80,
            // left: '12%',
            // containLabel: false
            height: 80,
            width: '95%',
            top: 80, // 为visualMap预留空间
            left: 40,
            containLabel: true // 图像框架包含坐标轴的刻度标签，这样可以整体调整防止文字溢出
        },
        toolbox: {
            feature: {
                // dataZoom: { show: true },
                // dataView: { show: true, readOnly: true },
                // restore: { show: true },
                saveAsImage: { show: true },
                // magicType: {
                //     type: ['line', 'bar', 'stack']
                // }

            },
            itemSize: 20,
            top: 10,
            left: 10,
        },
        xAxis: {

            type: 'category',
            // data: sampleID,
            splitArea: {
                show: true
            },
            axisLabel: {
                show: true,
                rotate: 80,
                fontSize: 16,
                interval: 0
            },
            axisPointer: {
                type: 'line',
                show: true,
                triggerEmphasis: false, // 是否触发强调
                label: {
                    fontSize: 18,
                },
                lineStyle: {
                    width: 3,
                    type: "dashed",
                }
            }
        },
        yAxis: {
            type: 'category',
            // data: geneID,
            splitArea: {
                show: true
            },
            axisLabel: {
                show: true,
                fontSize: 16,
            },
            axisPointer: {
                type: 'line',
                show: true,
                triggerEmphasis: false, // 是否触发强调
                label: {
                    fontSize: 18,
                    // overflow: "break",
                    // width: 170
                },
                lineStyle: {
                    width: 3,
                    type: "dashed",
                }
            },
            inverse: true
        },
        // dataZoom 与 axisPointer 无法共存
        // dataZoom: [

        //     {
        //         id: 'dataZoomY',
        //         yAxisIndex: [0],
        //         type: 'slider',
        //         filterMode: 'weakFilter',
        //         showDataShadow: false,
        //         left: 50, // 如果不设置会导致右侧的滑块头部无法显示

        //         width: 30,
        //         start: 0,
        //         end: 100,
        //         fillerColor: "rgba(36, 114, 218, 0.4)",
        //         borderRadius: 8,
        //         moveHandleSize: 15,
        //         handleSize: 50,
        //         showDetail: true
        //     },
        //     {
        //         type: 'inside',
        //         filterMode: 'none',
        //         orient: "vertical" // 设置为纵向控制柱状条的数量
        //     }
        // ],

        visualMap: {
            min: 0,
            max: 20,
            type: 'continuous', // 定义为连续型 visualMap
            calculable: true,
            orient: 'horizontal',
            right: 10,
            top: 10,
            precision: 2,
            hoverLink: true,
            textStyle: {
                fontWeight: "bold",
                fontSize: 16
            },
            itemHeight: 250,
            // inRange: {

            //     // color: ['#4E659B', '#8A8CBF', '#B8A8CF', '#E7BCC6', '#FDCF9E', '#EFA484', '#B6766C']
            //     // color: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9']
            //     // color: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081']
            //     // color: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']
            //     // color: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a']
            //     color: ['#92c5de', '#d1e5f0', '#f7f7f7', '#fddbc7', '#f4a582']
            //     // color: ['#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027']
            //     // color: ['#3288bd', '#66c2a5', '#abdda4', '#e6f598', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d53e4f']
            //     // color: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9']
            //     // color: ['#4d9221', '#7fbc41', '#b8e186', '#e6f5d0', '#f7f7f7', '#fde0ef', '#f1b6da', '#de77ae', '#c51b7d']
            //     // color: ['#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081']
            //     // color: ['#4E659B', '#8A8CBF', '#B8A8CF', '#E7BCC6', '#FDCF9E', '#EFA484', '#B6766C']
            //     // color: ['#8A8CBF', '#B8A8CF', '#E7BCC6', '#FDCF9E', '#EFA484']
            // }

        },
        series: [
            {
                name: 'Heatmap',
                type: 'heatmap',
                data: heatmapData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        borderColor: "#333",
                        borderWidth: 1
                    }
                },
                label: { // 不显示数值
                    show: false
                },
                encode: {
                    x: 0,
                    y: 1,
                    value: 2
                }
            }
        ]
    };
}


export { getHeatmapOption };