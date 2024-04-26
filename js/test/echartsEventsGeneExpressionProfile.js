import { getHeatmapOption } from "./echartsOptionHeatmap.js";
import { orthologousHeatmapDOM, xenologousHeatmapDOM, geneHeatmapDOM, transcriptHeatmapDOM, orthologousHeatmapChart, xenologousHeatmapChart, geneHeatmapChart, transcriptHeatmapChart } from "./mainGeneExpressionProfile.js";


function resizeChartAndDOMHeight(chart, container, dataLength, dataHeight) {
    const xAxisLabelHeight = 80;
    const visualMapHeight = 80;
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
            height: DOMHeight - xAxisLabelHeight - visualMapHeight,
        },
    });
    chart.resize();
}

function drawOrthologHeatmap(data) {
    // resizeDOMHeight(orthologousHeatmapDOM, data.length, 80, 1);
    orthologousHeatmapChart.setOption(getHeatmapOption(data));
    resizeChartAndDOMHeight(orthologousHeatmapChart, orthologousHeatmapDOM, data.length, 80);
    console.log(data.length, orthologousHeatmapChart, orthologousHeatmapDOM);
    // orthologousHeatmapChart.setOption({
    //     grid: {
    //         height: ,
    //     },
    // });
}

function drawXenologousHeatmap(data) {
    // resizeDOMHeight(xenologousHeatmapDOM, data.length, 80, 1);
    xenologousHeatmapChart.setOption(getHeatmapOption(data));
    resizeChartAndDOMHeight(xenologousHeatmapChart, xenologousHeatmapDOM, data.length, 60);
    console.log(data.length, xenologousHeatmapChart, xenologousHeatmapDOM);
    // xenologousHeatmapChart.setOption({
    //     grid: {
    //         height: 160,
    //     },
    // });
}

function drawGeneHeatmap(data) {
    // resizeDOMHeight(geneHeatmapDOM, data.length, 80, 0.5);
    geneHeatmapChart.setOption(getHeatmapOption(data));
    resizeChartAndDOMHeight(geneHeatmapChart, geneHeatmapDOM, data.length, 30);
    console.log(data.length, geneHeatmapChart, geneHeatmapDOM);

    // geneHeatmapChart.setOption({
    //     grid: {
    //         height: 720,
    //     },
    // });

}

function drawTranscriptHeatmap(data) {
    // resizeDOMHeight(transcriptHeatmapDOM, data.length, 80, 0.5);
    transcriptHeatmapChart.setOption(getHeatmapOption(data));
    resizeChartAndDOMHeight(transcriptHeatmapChart, transcriptHeatmapDOM, data.length, 30);
    // transcriptHeatmapChart.setOption({ grid: { height: 3760 } });
    console.log(data.length, transcriptHeatmapChart, transcriptHeatmapDOM);
}



export { drawOrthologHeatmap, drawXenologousHeatmap, drawGeneHeatmap, drawTranscriptHeatmap };