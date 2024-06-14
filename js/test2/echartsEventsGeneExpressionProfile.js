import { getHeatmapOption } from "./echartsOptionHeatmap.js";
import { getDevelopmentStageSunburstOption } from "./echartsOptionDevelopmentStageSunburst.js";
import { getIDTreeOption } from "./echartsOptionIDTree.js";
import { orthologousHeatmapDOM, xenologousHeatmapDOM, geneHeatmapDOM, transcriptHeatmapDOM, orthologousHeatmapChart, xenologousHeatmapChart, geneHeatmapChart, transcriptHeatmapChart, developmentStageSunburstChart, IDTreeChart } from "./mainGeneExpressionProfile.js";

// 根据数据的行数，动态地调整DOM元素的高度、图表的高度
function resizeChartAndDOMHeight(chart, container, dataLength, dataHeight) {
    const xAxisLabelHeight = 80; // x轴标签的高度
    const visualMapHeight = 80; // visualMap 的高度，即grid的top值 = visualMapHeight + visualMapTop
    const DOMHeight = dataLength * dataHeight + xAxisLabelHeight + visualMapHeight;

    // 检查 container 是否是 DOM 元素
    if (!(container instanceof HTMLElement)) {
        console.error('Provided container is not a valid DOM element.');
        return;
    }

    // 更新容器的高度
    container.style.height = `${DOMHeight}px`;

    // 重置图表的高度
    chart.setOption({
        grid: {
            // 重新设置 grid 的高度，由于grid设置了containLabel: true，grid高度就是x轴标签加上图表区高度，因此不需要减去xAxisLabelHeight
            height: DOMHeight - visualMapHeight,
        },
    });

    // 重置图表的大小，否则ECharts实例只会记住初始化时的DOM大小
    chart.resize();
}

function drawOrthologousHeatmap(data) {
    // resizeDOMHeight(orthologousHeatmapDOM, data.length, 80, 1);
    orthologousHeatmapChart.setOption(getHeatmapOption(data));
    resizeChartAndDOMHeight(orthologousHeatmapChart, orthologousHeatmapDOM, data.length, 30);
    // console.log(data.length, orthologousHeatmapChart, orthologousHeatmapDOM);

    orthologousHeatmapChart.setOption({ // 由于mosaic只有一行数据，隐藏y轴的axisPointer
        title: {
            text: 'Orthologous Gene Expression Profile',
        },
        yAxis: {
            axisPointer: {
                show: false,
            }
        },
    });

}

function drawXenologousHeatmap(data) {
    // resizeDOMHeight(xenologousHeatmapDOM, data.length, 80, 1);
    xenologousHeatmapChart.setOption(getHeatmapOption(data));
    resizeChartAndDOMHeight(xenologousHeatmapChart, xenologousHeatmapDOM, data.length, 30);
    // console.log(data.length, xenologousHeatmapChart, xenologousHeatmapDOM);

    xenologousHeatmapChart.setOption({
        title: {
            text: 'Xenologous Gene Expression Profile',
        },
    });
}

function drawGeneHeatmap(data) {
    // resizeDOMHeight(geneHeatmapDOM, data.length, 80, 0.5);
    geneHeatmapChart.setOption(getHeatmapOption(data));
    resizeChartAndDOMHeight(geneHeatmapChart, geneHeatmapDOM, data.length, 30);
    // console.log(data.length, geneHeatmapChart, geneHeatmapDOM);

    geneHeatmapChart.setOption({
        title: {
            text: 'Haplotypes Gene Expression Profile',
        },
    });

}

function drawTranscriptHeatmap(data) {
    // resizeDOMHeight(transcriptHeatmapDOM, data.length, 80, 0.5);
    transcriptHeatmapChart.setOption(getHeatmapOption(data));
    resizeChartAndDOMHeight(transcriptHeatmapChart, transcriptHeatmapDOM, data.length, 30);
    // transcriptHeatmapChart.setOption({ grid: { height: 3760 } });
    // console.log(data.length, transcriptHeatmapChart, transcriptHeatmapDOM);

    transcriptHeatmapChart.setOption({
        title: {
            text: 'Transcripts Gene Expression Profile',
        },
    });
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

function drawDevelopmentStageSunburstChart() {
    developmentStageSunburstChart.setOption(getDevelopmentStageSunburstOption());
}

function drawIDTree(data) {
    // console.log('IDTree Data: ', data);
    treeData = buildTree(data);
    IDTreeChart.setOption(getIDTreeOption(treeData));
}


export { drawOrthologousHeatmap, drawXenologousHeatmap, drawGeneHeatmap, drawTranscriptHeatmap, drawDevelopmentStageSunburstChart, drawIDTree };