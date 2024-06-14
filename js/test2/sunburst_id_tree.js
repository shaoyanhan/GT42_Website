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

let sunburstData = [
    {
        name: 'Callus',
        itemStyle: {
            color: '#fff176'
        },
        children: [
            {
                name: 'Callus1',
                itemStyle: {
                    color: '#ffeb3b'
                },
                children: [
                    {
                        name: 'Ca1-1',
                        value: 1,
                        itemStyle: {
                            color: '#fbc02d'
                        }
                    },
                    {
                        name: 'Ca1-2',
                        value: 1,
                        itemStyle: {
                            color: '#fbc02d'
                        }
                    },
                    {
                        name: 'Ca1-3',
                        value: 1,
                        itemStyle: {
                            color: '#fbc02d'
                        }
                    }
                ]
            },
            {
                name: 'Callus2',
                itemStyle: {
                    color: '#ffeb3b'
                },
                children: [
                    {
                        name: 'Ca2-1',
                        value: 1,
                        itemStyle: {
                            color: '#fbc02d'
                        }
                    },
                    {
                        name: 'Ca2-2',
                        value: 1,
                        itemStyle: {
                            color: '#fbc02d'
                        }
                    },
                    {
                        name: 'Ca2-3',
                        value: 1,
                        itemStyle: {
                            color: '#fbc02d'
                        }
                    }
                ]
            },
            {
                name: 'Callus3',
                itemStyle: {
                    color: '#ffeb3b'
                },
                children: [
                    {
                        name: 'Ca3-1',
                        value: 1,
                        itemStyle: {
                            color: '#fbc02d'
                        }
                    },
                    {
                        name: 'Ca3-2',
                        value: 1,
                        itemStyle: {
                            color: '#fbc02d'
                        }
                    },
                    {
                        name: 'Ca3-3',
                        value: 1,
                        itemStyle: {
                            color: '#fbc02d'
                        }
                    }
                ]
            }
        ]
    },
    {
        name: 'Trefoil',
        itemStyle: {
            color: '#aed581'
        },
        children: [
            {
                name: 'Root1',
                itemStyle: {
                    color: '#8bc34a'
                },
                children: [
                    {
                        name: 'Ro1-1',
                        value: 1,
                        itemStyle: {
                            color: '#689f38'
                        }
                    },
                    {
                        name: 'Ro1-2',
                        value: 1,
                        itemStyle: {
                            color: '#689f38'
                        }
                    },
                    {
                        name: 'Ro1-3',
                        value: 1,
                        itemStyle: {
                            color: '#689f38'
                        }
                    }
                ]
            },
            {
                name: 'Root2',
                itemStyle: {
                    color: '#8bc34a'
                },
                children: [
                    {
                        name: 'Ro2-1',
                        value: 1,
                        itemStyle: {
                            color: '#689f38'
                        }
                    },
                    {
                        name: 'Ro2-2',
                        value: 1,
                        itemStyle: {
                            color: '#689f38'
                        }
                    },
                    {
                        name: 'Ro2-3',
                        value: 1,
                        itemStyle: {
                            color: '#689f38'
                        }
                    }
                ]
            }
        ]
    },
    {
        name: 'Elongation',
        itemStyle: {
            color: '#4db6ac'
        },
        children: [
            {
                name: 'Leaf1',
                itemStyle: {
                    color: '#009688'
                },
                children: [
                    {
                        name: 'Le1-1',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'Le1-2',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'Le1-3',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    }
                ]
            },
            {
                name: 'Leaf + Sheath1',
                itemStyle: {
                    color: '#009688'
                },
                children: [
                    {
                        name: 'LS1-1',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'LS1-2',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'LS1-3',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    }
                ]
            },
            {
                name: 'Bud1',
                itemStyle: {
                    color: '#009688'
                },
                children: [
                    {
                        name: 'Bu1-1',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'Bu1-2',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'Bu1-3',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    }
                ]
            },
            {
                name: 'Internode1',
                itemStyle: {
                    color: '#009688'
                },
                children: [
                    {
                        name: 'In1-1',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'In1-2',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'In1-3',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    }
                ]
            },
            {
                name: 'Nodal Root1',
                itemStyle: {
                    color: '#009688'
                },
                children: [
                    {
                        name: 'NR1-1',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'NR1-2',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'NR1-3',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    }
                ]
            },
            {
                name: 'Apical Meristem',
                itemStyle: {
                    color: '#009688'
                },
                children: [
                    {
                        name: 'AM1-1',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'AM1-2',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    },
                    {
                        name: 'AM1-3',
                        value: 1,
                        itemStyle: {
                            color: '#00796b'
                        }
                    }
                ]
            }
        ]
    },
    {
        name: 'Biennial Root',
        itemStyle: {
            color: '#a1887f'
        },
        children: [
            {
                name: 'Bud2',
                itemStyle: {
                    color: '#795548'
                },
                children: [
                    {
                        name: 'Bu2-1',
                        value: 1,
                        itemStyle: {
                            color: '#5d4037'
                        }
                    },
                    {
                        name: 'Bu2-2',
                        value: 1,
                        itemStyle: {
                            color: '#5d4037'
                        }
                    },
                    {
                        name: 'Bu2-3',
                        value: 1,
                        itemStyle: {
                            color: '#5d4037'
                        }
                    }
                ]
            }
        ]
    },
    {
        name: 'Florescence',
        itemStyle: {
            color: '#f48fb1'
        },
        children: [
            {
                name: 'Spikelet',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'Sp-1',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Sp-2',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Sp-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            },
            {
                name: 'Branch',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'Br-1',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Br-2',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Br-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            },
            {
                name: 'Stamen',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'St-1',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'St-2',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'St-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            },
            {
                name: 'Pistil',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'Pi-1',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Pi-2',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Pi-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            },
            {
                name: 'Glume',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'Gl-2',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Gl-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            },
            {
                name: 'Leaf + Sheath2',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'LS2-2',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'LS2-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            },
            {
                name: 'Internode2',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'In2-1',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'In2-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            },
            {
                name: 'Node2',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'No2-1',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'No2-2',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'No2-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            },
            {
                name: 'Bud3',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'Bu3-1',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Bu3-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            },
            {
                name: 'Leaf2',
                itemStyle: {
                    color: '#f06292'
                },
                children: [
                    {
                        name: 'Le2-1',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Le2-2',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    },
                    {
                        name: 'Le2-3',
                        value: 1,
                        itemStyle: {
                            color: '#c2185b'
                        }
                    }
                ]
            }
        ]
    },

    {
        name: 'Development Stages',
        value: 5,
        itemStyle: {
            color: 'white'
        },
        label: {
            rotate: 'radial',
            padding: [0, 250, 0, 0],
            fontSize: 18,
            fontWeight: 'bold'
        },
        nodeClick: 'false',
    },

];

let treeData = [
    {
        name: 'GT42G000001',
        // itemStyle: {
        //     color: '#da0d68'
        // },
        children: [
            {
                name: 'GT42G000001.SO',
                // itemStyle: {
                //     color: '#975e6d'
                // },
                children: [
                    {
                        name: 'GT42G000001.SO.1',
                        // itemStyle: {
                        //     color: '#3e0317'
                        // },
                        children: [
                            {
                                name: 'GT42G000001.SO.1.1',
                                // itemStyle: {
                                //     color: '#e62969'
                                // }
                            },
                            {
                                name: 'GT42G000001.SO.1.2',
                            },
                            {
                                name: 'GT42G000001.SO.1.3',
                            },
                            {
                                name: 'GT42G000001.SO.1.4',
                            },
                            {
                                name: 'GT42G000001.SO.1.5',
                            },
                            {
                                name: 'GT42G000001.SO.1.6',
                            },
                            {
                                name: 'GT42G000001.SO.1.7',
                            },
                            {
                                name: 'GT42G000001.SO.1.8',
                            },
                            {
                                name: 'GT42G000001.SO.1.9',
                            },
                            {
                                name: 'GT42G000001.SO.1.10',
                            },
                            {
                                name: 'GT42G000001.SO.1.11',
                            },
                            {
                                name: 'GT42G000001.SO.1.12',
                            },
                            {
                                name: 'GT42G000001.SO.1.13',
                            },
                            {
                                name: 'GT42G000001.SO.1.14',
                            },
                            {
                                name: 'GT42G000001.SO.1.15',
                            },
                            {
                                name: 'GT42G000001.SO.1.16',
                            },
                            {
                                name: 'GT42G000001.SO.1.17',
                            },
                            {
                                name: 'GT42G000001.SO.1.18',
                            },
                            {
                                name: 'GT42G000001.SO.1.19',
                            },
                            {
                                name: 'GT42G000001.SO.1.20',
                            },
                            {
                                name: 'GT42G000001.SO.1.21',
                            },
                            {
                                name: 'GT42G000001.SO.1.22',
                            },
                            {
                                name: 'GT42G000001.SO.1.23',
                            },
                            {
                                name: 'GT42G000001.SO.1.24',
                            },
                            {
                                name: 'GT42G000001.SO.1.25',
                            },
                        ]
                    },
                    {
                        name: 'GT42G000001.SO.2',
                        children: [
                            {
                                name: 'GT42G000001.SO.2.1',
                            },
                            {
                                name: 'GT42G000001.SO.2.2',
                            },
                            {
                                name: 'GT42G000001.SO.2.3',
                            }
                        ]
                    },
                    {
                        name: 'GT42G000001.SO.3',
                        children: [
                            {
                                name: 'GT42G000001.SO.3.1',
                            },
                            {
                                name: 'GT42G000001.SO.3.2',
                            },
                            {
                                name: 'GT42G000001.SO.3.3',
                            }
                        ]
                    }
                ]
            },
            {
                name: 'GT42G000001.CO',
                children: [
                    {
                        name: 'GT42G000001.CO.1',
                    },
                    {
                        name: 'GT42G000001.CO.2',
                    },
                    {
                        name: 'GT42G000001.CO.3',
                    }
                ]
            },
            {
                name: 'GT42G000001.UK',
                children: [
                    {
                        name: 'GT42G000001.UK.1',
                    },
                    {
                        name: 'GT42G000001.UK.2',
                    },
                    {
                        name: 'GT42G000001.UK.3',
                    }
                ]
            }
        ]
    }
];

function getSunburstOption(data) {
    return {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: "{b}" // 只显示name
        },
        toolbox: {
            feature: {
                // dataZoom: { show: true },
                // dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
                // magicType: {
                //     type: ['line', 'bar', 'stack']
                // }

            }
        },
        series: {
            type: 'sunburst',
            data: data,
            radius: [0, '95%'],
            sort: undefined,
            emphasis: {
                focus: 'descendant'
            },
            label: {
                fontSize: 14
            },
            labelLayout: { //防止标签重叠
                hideOverlap: true
            },
            startAngle: 180, // 起始角度，支持范围[0, 360]，但是同样导致了label.rotate: 'tangential'的节点下钻的时候标签向右了
            levels: [ // 为每一层设置样式
                {}, // 第一层留空用作下钻按钮，否则第一层label会被按钮遮挡
                {
                    r0: '15%',
                    r: '35%',
                    itemStyle: {
                        borderWidth: 2
                    },
                    label: {
                        rotate: 'tangential'
                    }
                },
                {
                    r0: '35%',
                    r: '70%',
                    label: {
                        align: 'right'
                    }
                },
                {
                    r0: '70%',
                    r: '72%',
                    label: {
                        position: 'outside',
                        padding: 3,
                        silent: false
                    },
                    itemStyle: {
                        borderWidth: 3
                    }
                }
            ]
        }
    };
}

function getTreeOption(data) {
    return {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: "{b}" // 只显示name
        },
        title: {
            text: 'ID Tree',
            left: 'center',
            top: 20,
            textStyle: {
                fontSize: 16
            },
        },
        toolbox: {
            feature: {
                // dataZoom: { show: true },
                // dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
                // magicType: {
                //     type: ['line', 'bar', 'stack']
                // }

            }
        },

        grid: {
            containLabel: true
        },
        series: {
            type: "tree",
            data: data,
            layout: 'orthogonal', // 树图布局，orthogonal正交布局，radial环形布局
            orient: 'LR', // 树图方向，LR从左到右，RL从右到左，TB从上到下，BT从下到上
            roam: true, // 是否开启滚轮和拖拽缩放
            zoom: 0.8, // 缩放比例
            emphasis: {
                focus: 'ancestor'
            },
            label: {
                fontSize: 14,
                position: "top", // 分支节点标签在节点上方显示
            },
            leaves: {
                label: {
                    position: "right" // 叶子节点标签在节点右侧显示
                }
            }

        }
    };
}

function drawDevelopmentStageSunburstChart(data) {
    let dom = document.getElementById('drawDevelopmentStageSunburstChart');
    let developmentStageSunburstChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    // console.log('sunburstData:', data);
    let option = getSunburstOption(data);
    if (option && typeof option === 'object') {
        developmentStageSunburstChart.setOption(option);
        developmentStageSunburstChart.on('click', function (params) {
            console.log(params);
        });
        window.addEventListener('resize', developmentStageSunburstChart.resize);
    } else {
        console.error('Invalid sunburst chart option:', option);
    }
}

function drawIDTreeChart(data) {
    let dom = document.getElementById('drawIDTreeChart');
    let IDTreeChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    // console.log('treeData:', data);
    let option = getTreeOption(data);
    if (option && typeof option === 'object') {
        IDTreeChart.setOption(option);
        IDTreeChart.on('click', function (params) {
            console.log(params);
        });
        window.addEventListener('resize', IDTreeChart.resize);
    } else {
        console.error('Invalid tree chart option:', option);
    }
}

function buildTree(data) {
    const tree = {};

    Object.keys(data).forEach(key => {
        data[key].forEach(id => {
            const parts = id.split('.');
            let currentLevel = tree;
            let path = '';

            parts.forEach((part, index) => {
                path = path ? `${path}.${part}` : part;

                if (!currentLevel[part]) {
                    currentLevel[part] = {
                        name: path,
                        children: {}
                    };
                }

                if (index === parts.length - 1) {
                    currentLevel[part].children = null;
                } else {
                    if (currentLevel[part].children === null) {
                        currentLevel[part].children = {};
                    }
                    currentLevel = currentLevel[part].children;
                }
            });
        });
    });

    function convertToTreeArray(obj) {
        return Object.values(obj).map(node => {
            if (node.children && Object.keys(node.children).length > 0) {
                return {
                    name: node.name,
                    children: convertToTreeArray(node.children)
                };
            }
            return {
                name: node.name
            };
        });
    }

    return convertToTreeArray(tree);
}


function draw() {
    // fetchData('http://127.0.0.1:8080/searchDatabase/getHomologousIDSet/?searchKeyword=GT42G000001').then(responseData => {
    //     let treeData = buildTree(responseData);
    //     drawIDTreeChart(treeData);
    // });

    // drawIDTreeChart(treeData);

    // drawDevelopmentStageSunburstChart(sunburstData);
}
// draw();

document.addEventListener('DOMContentLoaded', draw);


// const IDData = {
//     "mosaic": [
//         "GT42G000003"
//     ],
//     "xenologous": [
//         "GT42G000003.SO",
//         "GT42G000003.SS"
//     ],
//     "gene": [
//         "GT42G000003.SO.1",
//         "GT42G000003.SO.2",
//         "GT42G000003.SO.3",
//         "GT42G000003.SO.4",
//         "GT42G000003.SO.5",
//         "GT42G000003.SO.6",
//         "GT42G000003.SS.1",
//         "GT42G000003.SS.2"
//     ],
//     "transcript": [
//         "GT42G000003.SO.1.1",
//         "GT42G000003.SO.1.2",
//         "GT42G000003.SO.1.3",
//         "GT42G000003.SO.2.1",
//         "GT42G000003.SO.2.2",
//         "GT42G000003.SO.3.1",
//         "GT42G000003.SO.3.2",
//         "GT42G000003.SO.4.1",
//         "GT42G000003.SO.4.2",
//         "GT42G000003.SO.5.1",
//         "GT42G000003.SO.5.2",
//         "GT42G000003.SO.6.1",
//         "GT42G000003.SS.1.1",
//         "GT42G000003.SS.2.1",
//         "GT42G000003.SS.2.2"
//     ]
// }

// function buildTree(data) {
//     const tree = {};

//     Object.keys(data).forEach(key => {
//         data[key].forEach(id => {
//             const parts = id.split('.');
//             let currentLevel = tree;
//             let path = '';

//             parts.forEach((part, index) => {
//                 path = path ? `${path}.${part}` : part;

//                 if (!currentLevel[part]) {
//                     currentLevel[part] = {
//                         name: path,
//                         children: {}
//                     };
//                 }

//                 if (index === parts.length - 1) {
//                     currentLevel[part].children = null;
//                 } else {
//                     if (currentLevel[part].children === null) {
//                         currentLevel[part].children = {};
//                     }
//                     currentLevel = currentLevel[part].children;
//                 }
//             });
//         });
//     });

//     function convertToTreeArray(obj) {
//         return Object.values(obj).map(node => {
//             if (node.children && Object.keys(node.children).length > 0) {
//                 return {
//                     name: node.name,
//                     children: convertToTreeArray(node.children)
//                 };
//             }
//             return {
//                 name: node.name
//             };
//         });
//     }

//     return convertToTreeArray(tree);
// }

// const treeData1 = buildTree(IDData);
// console.log(treeData1)

// console.log(JSON.stringify(treeData1, null, 2));

