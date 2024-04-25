import { getHeatmapOption } from "./echartsOptionHeatmap.js";
import { orthologousHeatmapDOM, xenologousHeatmapDOM, geneHeatmapDOM, transcriptHeatmapDOM, orthologousHeatmapChart, xenologousHeatmapChart, geneHeatmapChart, transcriptHeatmapChart } from "./mainGeneExpressionProfile.js";

function adjustChartSize(dataLength, echartsInstance, container) {
    // 假设的最佳比例和基础高度
    const baseHeightPerRow = 80; // 每行数据的基础高度
    const baseTotalHeight = 250; // 总的基础高度

    // 计算实际的 gridHeight 和 DOM容器的 height
    const gridHeight = '90%'; // grid 高度占据容器的 75%
    const height = baseHeightPerRow * dataLength < baseTotalHeight ? baseTotalHeight : baseHeightPerRow * dataLength;

    // 检查 container 是否是 DOM 元素
    if (!(container instanceof HTMLElement)) {
        console.error('Provided container is not a valid DOM element.');
        return;
    }

    // 更新容器的高度
    container.style.height = `${height}px`;

    // 更新图表的 grid 尺寸
    echartsInstance.setOption({
        grid: {
            height: gridHeight
        }
    });
}

function drawOrthologHeatmap(data) {
    orthologousHeatmapChart.setOption(getHeatmapOption(data));
    orthologousHeatmapChart.setOption({
        grid: {
            height: '65%',
        },
    });
}

function drawXenologousHeatmap(data) {
    xenologousHeatmapChart.setOption(getHeatmapOption(data));
    xenologousHeatmapChart.setOption({
        grid: {
            height: '75%',
        },
    });
}

function drawGeneHeatmap(data) {
    geneHeatmapChart.setOption(getHeatmapOption(data));
    console.log(data.length, geneHeatmapChart, geneHeatmapDOM);
    // adjustChartSize(data.length, geneHeatmapChart, geneHeatmapDOM);
    geneHeatmapChart.setOption({
        grid: {
            height: '90%',
        },
    });

}

function drawTranscriptHeatmap(data) {
    transcriptHeatmapChart.setOption(getHeatmapOption(data));
}

export { drawOrthologHeatmap, drawXenologousHeatmap, drawGeneHeatmap, drawTranscriptHeatmap };