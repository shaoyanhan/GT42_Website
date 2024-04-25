import { initalContentArea } from "./initialContentAreaGeneExpressionProfile.js";
import { setUpSearchEventListeners } from "./searchEvents.js";

// 初始化ECharts实例
export let orthologousHeatmapDOM = document.getElementById('drawOrthologousHeatmap');
export let xenologousHeatmapDOM = document.getElementById('drawXenologousHeatmap');
export let geneHeatmapDOM = document.getElementById('drawGeneHeatmap');
export let transcriptHeatmapDOM = document.getElementById('drawTranscriptHeatmap');

export let orthologousHeatmapChart = echarts.init(orthologousHeatmapDOM, null, { renderer: 'canvas' });
export let xenologousHeatmapChart = echarts.init(xenologousHeatmapDOM, null, { renderer: 'canvas' });
export let geneHeatmapChart = echarts.init(geneHeatmapDOM, null, { renderer: 'canvas' });
export let transcriptHeatmapChart = echarts.init(transcriptHeatmapDOM, null, { renderer: 'canvas' });


// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initalContentArea();
    setUpSearchEventListeners('.search_container');
    orthologousHeatmapChart.on('click', (params) => {
        console.log(params);
    });
});