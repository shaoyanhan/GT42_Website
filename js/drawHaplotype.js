
// 基于准备好的dom，初始化echarts实例
var chartDom = document.getElementById('drawHaplotype');
var haplotypeChart = echarts.init(chartDom, null, { renderer: 'svg' });
var option;

var startbp = 0;
// var haplotypeData = [
//     ["GT42G000001", "GT42G000001.SO.0", "mosaic", 5420, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.1", "haplotype1", 5124, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.2", "haplotype2", 4634, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.3", "haplotype3", 4965, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.4", "haplotype4", 4965, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.5", "haplotype5", 4965, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.6", "haplotype6", 4965, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.7", "haplotype7", 4965, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.8", "haplotype8", 4965, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.9", "haplotype9", 4965, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.10", "haplotype10", 4965, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.11", "haplotype11", 5124, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.12", "haplotype12", 4634, "ATCGATCG"],
//     ["GT42G000001", "GT42G000001.SO.13", "haplotype13", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.14", "haplotype14", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.15", "haplotype15", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.16", "haplotype16", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.17", "haplotype17", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.18", "haplotype18", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.19", "haplotype19", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.20", "haplotype20", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.21", "haplotype21", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.22", "haplotype22", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.23", "haplotype23", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.24", "haplotype24", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.25", "haplotype25", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.26", "haplotype26", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.27", "haplotype27", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.28", "haplotype28", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.29", "haplotype29", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.30", "haplotype30", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.31", "haplotype31", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.32", "haplotype32", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.33", "haplotype33", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.34", "haplotype34", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.35", "haplotype35", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.36", "haplotype36", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.37", "haplotype37", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.38", "haplotype38", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.39", "haplotype39", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.40", "haplotype40", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.41", "haplotype41", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.42", "haplotype42", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.43", "haplotype43", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.44", "haplotype44", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.45", "haplotype45", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.46", "haplotype46", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.47", "haplotype47", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.48", "haplotype48", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.49", "haplotype49", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.50", "haplotype50", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.51", "haplotype51", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.52", "haplotype52", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.53", "haplotype53", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.54", "haplotype54", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.55", "haplotype55", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.56", "haplotype56", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.57", "haplotype57", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.58", "haplotype58", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.59", "haplotype59", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.60", "haplotype60", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.61", "haplotype61", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.62", "haplotype62", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.63", "haplotype63", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.64", "haplotype64", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.65", "haplotype65", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.66", "haplotype66", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.67", "haplotype67", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.68", "haplotype68", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.69", "haplotype69", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.70", "haplotype70", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.71", "haplotype71", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.72", "haplotype72", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.73", "haplotype73", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.74", "haplotype74", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.75", "haplotype75", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.76", "haplotype76", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.77", "haplotype77", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.78", "haplotype78", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.79", "haplotype79", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.80", "haplotype80", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.81", "haplotype81", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.82", "haplotype82", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.83", "haplotype83", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.84", "haplotype84", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.85", "haplotype85", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.86", "haplotype86", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.87", "haplotype87", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.88", "haplotype88", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.89", "haplotype89", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.90", "haplotype90", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.91", "haplotype91", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.92", "haplotype92", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.93", "haplotype93", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.94", "haplotype94", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.95", "haplotype95", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.96", "haplotype96", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.97", "haplotype97", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.98", "haplotype98", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.99", "haplotype99", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.100", "haplotype100", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.101", "haplotype101", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.102", "haplotype102", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.103", "haplotype103", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.104", "haplotype104", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.105", "haplotype105", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.106", "haplotype106", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.107", "haplotype107", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.108", "haplotype108", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.109", "haplotype109", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.110", "haplotype110", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.111", "haplotype111", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.112", "haplotype112", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.113", "haplotype113", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.114", "haplotype114", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.115", "haplotype115", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.116", "haplotype116", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.117", "haplotype117", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.118", "haplotype118", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.119", "haplotype119", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.120", "haplotype120", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.121", "haplotype121", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.122", "haplotype122", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.123", "haplotype123", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.124", "haplotype124", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.125", "haplotype125", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.126", "haplotype126", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.127", "haplotype127", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.128", "haplotype128", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.129", "haplotype129", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.130", "haplotype130", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.131", "haplotype131", 5124, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.132", "haplotype132", 4634, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.133", "haplotype133", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.134", "haplotype134", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.135", "haplotype135", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.136", "haplotype136", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.137", "haplotype137", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.138", "haplotype138", 4965, "ATCGATCG"],
//     // ["GT42G000001", "GT42G000001.SO.139", "haplotype139", 4965, "ATCGATCG"],
// ];
// var SNPData = [
//     ["mosaic", "GT42G000001", 10, 'A/C', "#050f2c"],
//     ["mosaic", "GT42G000001", 20, 'C/G', "#003666"],
//     ["mosaic", "GT42G000001", 30, 'C/G', "#00aeff"],
//     ["mosaic", "GT42G000001", 40, 'A/G', "#3369e7"],
//     ["mosaic", "GT42G000001", 50, 'A/C', "#8e43e7"],
// ];
// //050f2c, 003666, 00aeff, 3369e7, 8e43e7, b84592, ff4f81, ff6c5f, ffc168, 2dde98, 1cc7d0


var haplotypeData = [];
var SNPData = [];



function getHaplotypeDataAndDraw(searchKeyword) {
    // 并行执行两个 AJAX 请求    
    Promise.all([
        window.myGlobalFunctions.ajaxPromise('http://127.0.0.1:8080/searchDatabase/getHaplotypeTable/', { searchKeyword: searchKeyword }),
        window.myGlobalFunctions.ajaxPromise('http://127.0.0.1:8080/searchDatabase/getSNPTable/', { searchKeyword: searchKeyword })
    ])
        // 当两个请求都成功时，处理数据并更新图表 
        .then(([haplotypeData, SNPData]) => {
            const transformedHaplotypeData = window.myGlobalFunctions.transformData(haplotypeData);
            const transformedSNPData = window.myGlobalFunctions.transformData(SNPData);
            console.log(searchKeyword);
            console.log(transformedHaplotypeData);
            console.log(transformedSNPData);
            haplotypeChart.setOption({
                xAxis:
                {
                    min: startbp,
                    scale: true,
                    axisLabel: {
                        formatter: function (val) {
                            return Math.round(Math.max(0, val - startbp)) + ' bp';
                        }
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
                },
                series: [
                    {
                        name: 'haplotype',
                        data: transformedHaplotypeData
                    },
                    {
                        name: 'SNP Site',
                        data: transformedSNPData
                    }
                ]
            });
        })
        .catch(error => {
            // 处理请求中出现的任何错误        
            console.error('There has been a problem with one of your ajax operations:', error);
        });
}

// 初始页面直接绘制 GT42G000001 的 haplotype
getHaplotypeDataAndDraw('GT42G000001');

// 将函数添加到一个对象中，并导出这个对象
const drawFunctions = {
    getHaplotypeDataAndDraw
};
// 将这个对象添加到 window 对象上，使其可在全局访问
window.drawFunctions = drawFunctions;

// for (let i = 0; i < 50; i++) {
//     let baseValue = 110 * (i + 1);
//     data.push(
//         { name: 'hap1', value: [0, false, baseValue, baseValue + 100, 100], itemStyle: { normal: { color: '#7b9ce1' } } },
//         { name: 'hap2', value: [1, false, baseValue, baseValue + 20, 20], itemStyle: { normal: { color: '#bd6d6c' } } },
//         { name: 'gap', value: [1, true, baseValue + 20, baseValue + 80, 60], itemStyle: { normal: { color: '#000' } } },
//         { name: 'hap2', value: [1, false, baseValue + 80, baseValue + 90, 10], itemStyle: { normal: { color: '#bd6d6c' } } },
//         { name: 'hap3', value: [2, false, baseValue, baseValue + 80, 80], itemStyle: { normal: { color: '#75d874' } } },
//         { name: 'gap', value: [2, true, baseValue + 80, baseValue + 90, 10], itemStyle: { normal: { color: '#000' } } },
//         { name: 'hap3', value: [2, false, baseValue + 90, baseValue + 100, 10], itemStyle: { normal: { color: '#75d874' } } },
//         { name: 'mosaic', value: [3, false, baseValue, baseValue + 110, 110], itemStyle: { normal: { color: '#c6fbee' } } },
//     );
// }

// var categories = haplotypeData.map(function (item) { // haplotypeData 的第三列
//     return item[2];
// });
// var barLength = haplotypeData.map(function (item) { // haplotypeData 的第四列
//     return item[3];
// });

// using colorBy: "data"
// var types = [
//     { name: 'hap1', color: '#7b9ce1' },
//     { name: 'hap2', color: '#bd6d6c' },
//     { name: 'hap3', color: '#75d874' },
//     { name: 'mosaic', color: '#c6fbee' },
//     { name: 'gap', color: '#000' }
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


// function renderItem(params, api) {

//     var categoryIndex = api.value(0);
//     var boxType = api.value(1);
//     var start = api.coord([api.value(2), categoryIndex]); // x, y
//     var end = api.coord([api.value(3), categoryIndex]);

//     if (boxType == true) {
//         var height = api.size([0, 1])[1] * 0.1;
//     } else {
//         var height = api.size([0, 1])[1] * 0.6;
//     }

//     var rectShape = echarts.graphic.clipRectByRect(
//         {
//             x: start[0],
//             y: start[1] - height / 2,
//             width: end[0] - start[0],
//             height: height
//         },
//         {
//             x: params.coordSys.x,
//             y: params.coordSys.y,
//             width: params.coordSys.width,
//             height: params.coordSys.height
//         }
//     );
//     return (
//         rectShape && {
//             type: 'rect',
//             transition: ['shape'],
//             shape: rectShape,
//             style: api.style()
//         }
//     );
// }


option = {

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
                    'Mosaic ID: ' + params.value[1],
                    'Site: ' + params.value[2] + ' bp',
                    'Type: ' + params.value[3],
                ].join('<br>');
            }
            return [
                params.marker + params.name,
                'Mosaic ID: ' + params.value[0],
                'Gene ID: ' + params.value[1],
                'Gene Type: ' + params.value[2],
                'Gene Length: ' + params.value[3] + ' bp',
            ].join('<br>');
        },
        textStyle: {
            fontSize: 25
        },
    },
    title: {
        text: 'Profile',
        left: 'center'
    },
    legend: { // 暂时实现不了详细颜色的对应，或许使用两个坐标系覆盖方式可以实现
        data: [
            {
                name: 'haplotype',
                color: 'black'

            },
            {
                name: 'SNP Site',
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
            fontSize: 20
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
            showDataShadow: true,
            labelFormatter: function (value) {
                return Math.round(value) + 'bp';
            },
            textStyle: {
                fontSize: 20
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
    // 设置坐标系的大小，这样可以保证其在网页中框架大小不变，内部元素大小变化
    // 注意这里与 dataZoomX 高度以及外部div容器一起调整
    // 目前设置为可以展示10个 haplotype 和1个 mosaic 的高度，已经测试过最多138个haplotype的情况, 大部分集中于10-20个
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
            },
            fontSize: 20
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
            fontSize: 20
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
                x: 3,
                y: 2,
                // tooltip: {
                //     formatter: function (params) {

                //         return params[0].value[0] + ': ';
                //     }
                // }

            },
            data: haplotypeData,
            colorBy: "data",
            itemStyle: {
                opacity: 0.9,
                borderRadius: 5

            }

        },

        {

            name: 'SNP Site',
            type: 'scatter',

            itemStyle: {
                color: function (value) {
                    // switch (value.value[2]) {
                    //     case 'A/C':
                    //         return "rgba(255, 48, 48, 1)";
                    //     case 'C/G':
                    //         return "rgba(48, 255, 48, 1)";
                    //     case 'A/G':
                    //         return "rgba(48, 48, 255, 1)";
                    //     case 'A/G':
                    //         return "rgba(48, 48, 255, 1)";
                    //     case 'A/G':
                    //         return "rgba(48, 48, 255, 1)";
                    //     case 'A/G':
                    //         return "rgba(48, 48, 255, 1)";
                    //     case 'A/G':
                    //         return "rgba(48, 48, 255, 1)";
                    //     case 'A/G':
                    //         return "rgba(48, 48, 255, 1)";
                    //     case 'A/G':
                    //         return "rgba(48, 48, 255, 1)";
                    //     case 'A/G':
                    //         return "rgba(48, 48, 255, 1)";
                    //     case 'A/G':
                    //         return "rgba(48, 48, 255, 1)";
                    //     default:
                    //         return "rgba(0, 0, 0, 1)";
                    // }
                    return value.value[7]; // 空间换时间，直接使用颜色值
                }
            },
            symbolSize: 20,
            // symbol:
            //     function (value) {
            //         if (value[0] == 1) {
            //             return "rect";
            //         }
            //         return "circle";
            //     },
            encode: {
                x: 2,
                y: 1,

            },
            data: SNPData
        }
    ]
};

option && haplotypeChart.setOption(option);
haplotypeChart.on('click', function (params) { // 
    window.clickParams = params; // 在window对象上设置一个全局属性clickParams，用于在其他js文件中获取点击事件的参数
    $.getScript("./testClickEvent.js", function () {
        // 使用 window.clickParams 访问这个点击事件的参数
    });
});
