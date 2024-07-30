import { initialContentArea, drawTranscriptHeatmapByGeneID } from "./initialContentAreaGeneExpressionProfile.js";
import { drawDevelopmentStageSunburstChart, changeHeatmapColorEventHandler } from "./echartsEventsGeneExpressionProfile.js";
import { setUpSearchEventListeners } from "./searchEvents.js";
// import { setUpSelectEventListeners, setUpSelectWithSelect2 } from "./selectEvents.js";
import { setUpPaginationEventListeners } from "./tablePagination.js";
import { setupDownloadButton } from "./downloadTable.js";

// 初始化ECharts实例
export let orthologousHeatmapDOM = document.getElementById('drawOrthologousHeatmap');
export let xenologousHeatmapDOM = document.getElementById('drawXenologousHeatmap');
export let geneHeatmapDOM = document.getElementById('drawGeneHeatmap');
export let transcriptHeatmapDOM = document.getElementById('drawTranscriptHeatmap');
export let developmentStageSunburstDOM = document.getElementById('drawDevelopmentStageSunburstChart');
export let IDTreeDOM = document.getElementById('drawIDTreeChart');

export let orthologousHeatmapChart = echarts.init(orthologousHeatmapDOM, null, { renderer: 'canvas' });
export let xenologousHeatmapChart = echarts.init(xenologousHeatmapDOM, null, { renderer: 'canvas' });
export let geneHeatmapChart = echarts.init(geneHeatmapDOM, null, { renderer: 'canvas' });
export let transcriptHeatmapChart = echarts.init(transcriptHeatmapDOM, null, { renderer: 'canvas' });
export let developmentStageSunburstChart = echarts.init(developmentStageSunburstDOM, null, { renderer: 'canvas' });
export let IDTreeChart = echarts.init(IDTreeDOM, null, { renderer: 'canvas' });

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initialContentArea();

    setUpSearchEventListeners('.search_container');
    // setUpSelectEventListeners('#haplotype_select', drawTranscriptHeatmapByGeneID);
    // setUpSelectWithSelect2('#haplotype_select', drawTranscriptHeatmapByGeneID);

    setUpPaginationEventListeners('#orthologous_TPM_table_container', 'mosaicTPMPaginationData');
    setUpPaginationEventListeners('#xenologous_TPM_table_container', 'xenologousTPMPaginationData');
    setUpPaginationEventListeners('#gene_TPM_table_container', 'geneTPMPaginationData');
    setUpPaginationEventListeners('#transcript_TPM_table_container', 'allTranscriptTPMPaginationData');

    setupDownloadButton('#download_orthologous_TPM_table');
    setupDownloadButton('#download_xenologous_TPM_table');
    setupDownloadButton('#download_gene_TPM_table');
    setupDownloadButton('#download_all_transcript_TPM_table');

    orthologousHeatmapChart.on('click', (params) => {
        console.log(params);
    });
    drawDevelopmentStageSunburstChart();

    // 为heatmap颜色选择器添加事件监听器
    const heatmapColorPickerContainer = document.querySelector('.heatmap_color_picker_container');
    const colorRadios = heatmapColorPickerContainer.querySelectorAll('input[type="radio"]');
    colorRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            changeHeatmapColorEventHandler(this);
        });
    });
});