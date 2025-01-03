

// function getNetworkGraphOption(graphData) {
//     let option = {
//         title: {
//             text: 'Network Graph',
//             left: 'center'
//         },
//         // tooltip: {
//         //     trigger: 'item',
//         //     formatter: function (params) {
//         //         if (params.dataType === 'node') {
//         //             return 'Node: ' + params.data.name;
//         //         } else {
//         //             return 'Edge: ' + params.data.source + ' -> ' + params.data.target;
//         //         }
//         //     }
//         // },
//         series: [
//             {
//                 type: 'graphGL',
//                 // forceAtlas2: {
//                 //     steps: 1,
//                 //     stopThreshold: 1,
//                 //     jitterTolerence: 10,
//                 //     // edgeWeight: [0.2, 1],
//                 //     gravity: 1,
//                 //     edgeWeightInfluence: 1,
//                 //     scaling: 0.2,
//                 //     // preventOverlap: true,
//                 // },
//                 data: graphData.nodes,
//                 links: graphData.links,
//                 // categories: graphData.categories,
//                 // roam: true,
//                 // label: {
//                 //     show: true,
//                 //     position: 'right',
//                 //     formatter: '{b}'
//                 // },
//                 // lineStyle: {
//                 //     color: 'source',
//                 //     curveness: 0.3
//                 // },
//                 symbolSize: function (value, params) {
//                     return params.data.symbolSize;
//                 }
//             }
//         ]
//     };
//     return option;
// }


// let networkGraphChart = echarts.init(document.getElementById('drawNetworkGraph'));
// let graphData;
// let option;

// fetch('http://127.0.0.1:30000/searchDatabase/getNetworkGraphJSONTest/')
//     .then(response => response.json())
//     .then(data => {
//         graphData = data;
//         option = getNetworkGraphOption(graphData);
//         networkGraphChart.setOption(option);
//     })
//     .catch(error => console.error('Error:', error));
// // window.addEventListener('resize', function () {
// //     networkGraphChart.resize();
// // });





// 1️⃣  加载示例数据
const graphData = {
    nodes: [
        { id: 'TF1', label: 'TF1', x: 0, y: 0, size: 5, color: '#ff5733' },
        { id: 'TF2', label: 'TF2', x: 2, y: 1, size: 4, color: '#33ff57' },
        { id: 'TF3', label: 'TF3', x: 1, y: -2, size: 3, color: '#3357ff' },
        { id: 'TF4', label: 'TF4', x: -2, y: -1, size: 2, color: '#f39c12' },
        { id: 'TF5', label: 'TF5', x: -1, y: 2, size: 6, color: '#8e44ad' },
        { id: 'TF6', label: 'TF6', x: 3, y: -3, size: 4, color: '#c0392b' },
        { id: 'TF7', label: 'TF7', x: -3, y: 2, size: 2, color: '#2ecc71' },
        { id: 'TF8', label: 'TF8', x: 4, y: 3, size: 3, color: '#2980b9' }
    ],
    edges: [
        { id: 'e1', source: 'TF1', target: 'TF2', color: '#ff5733' },
        { id: 'e2', source: 'TF2', target: 'TF3', color: '#33ff57' },
        { id: 'e3', source: 'TF3', target: 'TF4', color: '#3357ff' },
        { id: 'e4', source: 'TF4', target: 'TF1', color: '#f39c12' }
    ]
};

// 2️⃣  创建 Sigma 图
const container = document.getElementById('graph-container');
const graph = new Sigma({
    graph: graphData,
    container: container
});

// 3️⃣  高亮节点的功能
let selectedNode = null;

graph.on('clickNode', (e) => {
    const nodeId = e.data.node.id;
    selectedNode = nodeId;
    graph.graph.nodes().forEach(node => {
        node.hidden = node.id !== nodeId && !graph.graph.neighbors(nodeId).includes(node.id);
    });
    graph.graph.edges().forEach(edge => {
        edge.hidden = edge.source !== nodeId && edge.target !== nodeId;
    });
    graph.refresh();
});

// 4️⃣  点击空白恢复网络图
graph.on('clickStage', () => {
    if (selectedNode) {
        graph.graph.nodes().forEach(node => node.hidden = false);
        graph.graph.edges().forEach(edge => edge.hidden = false);
        graph.refresh();
        selectedNode = null;
    }
});

// 5️⃣  鼠标悬浮高亮
graph.on('overNode', (e) => {
    const nodeId = e.data.node.id;
    graph.graph.nodes().forEach(node => node.color = node.id === nodeId ? '#000' : node.color);
    graph.refresh();
});

// 6️⃣  鼠标移开恢复颜色
graph.on('outNode', () => {
    graph.graph.nodes().forEach(node => node.color = graphData.nodes.find(n => n.id === node.id).color);
    graph.refresh();
});

