// 这里在页面加载时就导入了echartsEvents.js，如果echartsEvents.js中导入了其他的main文件，那么这些文件也会被加载，也就是说，
// 如果其他main文件中初始化了echarts实例，那么由于其他页面并没有载入，所以会产生其他页面的echarts实例未定义的错误
import { setUpPaginationEventListeners } from "./tablePagination.js";
import { clickHaplotypeChartsEvents, clickTranscriptChartEvents } from "./echartsEventsFullLengthTranscriptome.js";
import { setupDownloadButton } from "./downloadTable.js";
import { initialContentArea } from "./initialContentAreaFullLengthTranscriptome.js";
import { setUpSearchEventListeners } from "./searchEvents.js";
import { submitSearchForm } from "./searchEvents.js";
import { createClickToCopyHandler } from './copyTextToClipboard.js';



// 初始化ECharts实例
export let haplotypeChart = echarts.init(document.getElementById('drawHaplotype'), null, { renderer: 'svg' });
export let transcriptChart = echarts.init(document.getElementById('drawTranscript'), null, { renderer: 'svg' });

// 检查URL是否有searchKeyword参数，如果有，返回true，否则返回false
function checkURLSearchKeyword() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('searchKeyword');
}

// 针对于URL是否有searchKeyword参数的情况，进行不同的初始化操作
function initialBasedOnURLSearchKeyword() {
    if (checkURLSearchKeyword()) {
        // 如果URL中有searchKeyword参数，那么使用searchKeyword参数初始化页面
        // http://127.0.0.1:5501/html/test/fullLengthTranscriptome.html?searchKeyword=GT42G000002
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
    // initialContentArea('GT42G000001', 'mosaic');
    initialBasedOnURLSearchKeyword();

    // 由于 haplotype table 只有一种类型的 pagination data，所以只需要注册一次事件监听器
    setUpPaginationEventListeners('#haplotype_table_container', 'haplotypePaginationData'); // 为haplotype表格容器添加事件监听器
    // setUpPaginationEventListeners('#SNP_table_container', 'SNPPaginationData'); // 为SNP表格容器添加事件监听器

    // 由于transcript的表格分为 transcriptPagination 和 allTranscriptPagination，所以只能在每一次updateTableContainer时，根据transcriptPaginationTableType的值来设定容器事件
    // setUpPaginationEventListeners('#transcript_table_container', 'transcriptPaginationData'); // 为transcript表格容器添加事件监听器

    setupDownloadButton('#download_haplotype_table'); // 为haplotype表格下载按钮添加事件监听器
    // setupDownloadButton('#download_SNP_table'); // 为SNP表格下载按钮添加事件监听器
    setupDownloadButton('#download_transcript_table'); // 为transcript表格下载按钮添加事件监听器

    // setUpResultDetailsContainerEventListeners('#haplotype_SNP_result_details_container'); // 为结果详情容器添加事件监听器
    // setUpResultDetailsContainerEventListeners('#transcript_result_details_container'); // 为结果详情容器添加事件监听器

    // 由于页码中的复制按钮数量不定，所以只能监听一整个容器中的复制按钮点击事件
    const clickToCopyHandler = createClickToCopyHandler();

    // 为 Result Details 中的复制按钮添加事件监听器
    const haplotypeSNPResultDetailsContainer = document.getElementById('haplotype_SNP_result_details_container');
    const transcriptResultDetailsContainer = document.getElementById('transcript_result_details_container');
    haplotypeSNPResultDetailsContainer.addEventListener('click', clickToCopyHandler);
    transcriptResultDetailsContainer.addEventListener('click', clickToCopyHandler);

    // 为 haplotype table 和 transcript table 中的复制按钮添加事件监听器
    let haplotypeTableContainer = document.querySelector('#haplotype_table_container'); // 获取相应id的表格容器
    let transcriptTableContainer = document.querySelector('#transcript_table_container'); // 获取相应id的表格容器
    haplotypeTableContainer.addEventListener('click', clickToCopyHandler);
    transcriptTableContainer.addEventListener('click', clickToCopyHandler);

    setUpSearchEventListeners('.search_container'); // 为搜索容器添加事件监听器
    haplotypeChart.on('click', clickHaplotypeChartsEvents); // 为单倍型图像添加事件监听器
    transcriptChart.on('click', clickTranscriptChartEvents); // 为转录本图像添加事件监听器
});