function getIDTreeOption(data) {
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

export { getIDTreeOption };