import { initialContentArea } from "./initialContentAreaHaplotypeSNP.js"
import { setUpSearchEventListeners } from "./searchEvents.js";
import { submitSearchForm } from "./searchEvents.js";
import { clickHaplotypeSNPEventsHandler } from "./echartsEventsHaplotypeSNP.js";
import { setUpPaginationEventListeners } from "./tablePagination.js";
import { setupDownloadButton } from "./downloadTable.js";
import { setUpResultDetailsContainerEventListeners } from "./resultDetailsContainer.js";

export let haplotypeSNPDOM = document.getElementById('drawHaplotypeSNP');
export let threeSNPDOM = document.getElementById('drawThreeSNP');

export let haplotypeSNPChart = echarts.init(haplotypeSNPDOM, null, { renderer: 'canvas' });
export let threeSNPChart = echarts.init(threeSNPDOM, null, { renderer: 'canvas' });

// 检查URL是否有searchKeyword参数，如果有，返回true，否则返回false
function checkURLSearchKeyword() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('searchKeyword');
}

// 针对于URL是否有searchKeyword参数的情况，进行不同的初始化操作
function initialBasedOnURLSearchKeyword() {
    if (checkURLSearchKeyword()) {
        // 如果URL中有searchKeyword参数，那么使用searchKeyword参数初始化页面
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
    initialBasedOnURLSearchKeyword();

    setUpSearchEventListeners('#content_area_search_container');

    setUpPaginationEventListeners('#haplotype_table_container', 'haplotypePaginationData'); // 为haplotype表格容器添加事件监听器
    setUpPaginationEventListeners('#SNP_table_container', 'SNPPaginationData'); // 为SNP表格容器添加事件监听器
    setUpPaginationEventListeners('#SNP_evidence_table_container_both', 'SNPEvidenceBothPaginationData'); // 为SNP evidence表格容器添加事件监听器
    setUpPaginationEventListeners('#SNP_evidence_table_container_iso', 'SNPEvidenceIsoSeqPaginationData');
    setUpPaginationEventListeners('#SNP_evidence_table_container_rna', 'SNPEvidenceRNASeqPaginationData');

    setupDownloadButton('#download_haplotype_table'); // 为haplotype表格下载按钮添加事件监听器
    setupDownloadButton('#download_SNP_table'); // 为SNP表格下载按钮添加事件监听器
    setupDownloadButton('#download_SNP_evidence_table_both'); // 为SNP evidence表格下载按钮添加事件监听器
    setupDownloadButton('#download_SNP_evidence_table_iso');
    setupDownloadButton('#download_SNP_evidence_table_rna');

    setUpResultDetailsContainerEventListeners('#haplotype_SNP_result_details_container'); // 为结果详情容器添加事件监听器

    haplotypeSNPChart.on('click', clickHaplotypeSNPEventsHandler);
});
