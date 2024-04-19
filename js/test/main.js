import { clickHaplotypeSNPChartsEvents, clickTranscriptChartEvents } from "./echartsEvents.js";
import { setUpPaginationEventListeners } from "./tablePagination.js";
import { setupDownloadButton } from "./downloadTable.js";
import { setUpResultDetailsContainerEventListeners } from "./resultDetailsContainer.js";
import { initalContentArea } from "./initialContentArea.js";
import { setUpSearchEventListeners } from "./searchEvents.js";


// 初始化ECharts实例
export let haplotypeSNPChart = echarts.init(document.getElementById('drawHaplotype'), null, { renderer: 'svg' });
export let transcriptChart = echarts.init(document.getElementById('drawTranscript'), null, { renderer: 'svg' });


// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initalContentArea('GT42G000001', 'mosaic');
    setUpPaginationEventListeners('#haplotype_table_container', 'haplotypePaginationData'); // 为haplotype表格容器添加事件监听器
    setUpPaginationEventListeners('#SNP_table_container', 'SNPPaginationData'); // 为SNP表格容器添加事件监听器
    setUpPaginationEventListeners('#transcript_table_container', 'transcriptPaginationData'); // 为transcript表格容器添加事件监听器
    setupDownloadButton('#download_haplotype_table'); // 为haplotype表格下载按钮添加事件监听器
    setupDownloadButton('#download_SNP_table'); // 为SNP表格下载按钮添加事件监听器
    setupDownloadButton('#download_transcript_table'); // 为transcript表格下载按钮添加事件监听器

    setUpResultDetailsContainerEventListeners('#haplotype_SNP_result_details_container'); // 为结果详情容器添加事件监听器

    setUpResultDetailsContainerEventListeners('#transcript_result_details_container'); // 为结果详情容器添加事件监听器
    setUpSearchEventListeners('.search_container'); // 为搜索容器添加事件监听器
    haplotypeSNPChart.on('click', clickHaplotypeSNPChartsEvents); // 为单倍型图像添加事件监听器
    transcriptChart.on('click', clickTranscriptChartEvents); // 为转录本图像添加事件监听器
});