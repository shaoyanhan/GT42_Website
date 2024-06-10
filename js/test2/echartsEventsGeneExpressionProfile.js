import { getHeatmapOption } from "./echartsOptionHeatmap.js";
import { orthologousHeatmapDOM, xenologousHeatmapDOM, geneHeatmapDOM, transcriptHeatmapDOM, orthologousHeatmapChart, xenologousHeatmapChart, geneHeatmapChart, transcriptHeatmapChart } from "./mainGeneExpressionProfile.js";

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
    resizeChartAndDOMHeight(orthologousHeatmapChart, orthologousHeatmapDOM, data.length, 80);
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
    resizeChartAndDOMHeight(xenologousHeatmapChart, xenologousHeatmapDOM, data.length, 60);
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



export { drawOrthologousHeatmap, drawXenologousHeatmap, drawGeneHeatmap, drawTranscriptHeatmap };