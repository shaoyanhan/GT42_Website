import { initialContentArea, drawTranscriptHeatmapByGeneID } from "./initialContentAreaGeneExpressionProfile.js";
import { drawDevelopmentStageSunburstChart, changeHeatmapColorEventHandler } from "./echartsEventsGeneExpressionProfile.js";
import { setUpSearchEventListeners } from "./searchEvents.js";
// import { setUpSelectEventListeners, setUpSelectWithSelect2 } from "./selectEvents.js";
import { setUpPaginationEventListeners } from "./tablePagination.js";
import { setupDownloadButton } from "./downloadTable.js";
import { submitSearchForm } from "./searchEvents.js";


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

// 检查URL是否有searchKeyword参数，如果有，返回true，否则返回false
function checkURLSearchKeyword() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('searchKeyword');
}

// 针对于URL是否有searchKeyword参数的情况，进行不同的初始化操作
function initialBasedOnURLSearchKeyword() {
    if (checkURLSearchKeyword()) {
        // 如果URL中有searchKeyword参数，那么使用searchKeyword参数初始化页面
        // http://127.0.0.1:5501/html/test/geneExpressionProfile.html?searchKeyword=GT42G000002.SO
        let searchKeyword = new URLSearchParams(window.location.search).get('searchKeyword');

        // 找到搜索框组件
        const searchContainer = document.querySelector('#content_area_search_container');

        // 将searchKeyword填充到搜索框中
        let searchInput = searchContainer.querySelector('#search_input');
        searchInput.value = searchKeyword;

        // 提交搜索表单
        submitSearchForm(searchContainer);
    } else {
        // 如果URL中没有searchKeyword参数，那么使用默认的mosaicID初始化页面
        initialContentArea('GT42G000001', 'mosaic');
    }
}

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', async () => {
    // initialContentArea();
    initialBasedOnURLSearchKeyword();

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