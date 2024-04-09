import { drawHaplotypeSNPChart, drawTranscriptChart, setBarFocus, setBarColor, initialBarColorSync, clickHaplotypeSNPChartsEvents, clickTranscriptChartEvents } from "./echartsEvents.js";
import { fetchAllData, fetchPaginationData, updateData, getData } from "./data.js";
import { updateTableContainer, setUpPaginationEventListeners } from "./tablePagination.js";
import { setupDownloadButton } from "./downloadTable.js";
import { updateResultDetailsContainer, setUpResultDetailsContainerEventListeners } from "./resultDetailsContainer.js";


// 初始化ECharts实例
export let haplotypeSNPChart = echarts.init(document.getElementById('drawHaplotype'), null, { renderer: 'svg' });
export let transcriptChart = echarts.init(document.getElementById('drawTranscript'), null, { renderer: 'svg' });

// 页面初始化
async function inital() {
    // 获取搜索框中的关键词
    let searchKeywordMosaic = 'GT42G000001';

    // 请求数据并保存
    let haplotypeRawData = await fetchAllData('haplotype', searchKeywordMosaic);
    let SNPRawData = await fetchAllData('SNP', searchKeywordMosaic);
    console.log(haplotypeRawData);
    console.log(SNPRawData);
    updateData('haplotype', haplotypeRawData);
    updateData('SNP', SNPRawData);

    let haplotypeObjectData = getData('haplotypeObjectData');
    let SNPObjectData = getData('SNPObjectData');
    console.log(haplotypeObjectData);
    console.log(SNPObjectData);

    // 先获取对象数组，取出geneID作为transcriptData的搜索关键词
    // transcriptData的搜索关键词基于haplotypeData查询结果的geneID，
    // 因此需要确保先获取到了haplotypeData，再根据haplotypeData的geneID获取transcriptData
    let searchKeywordGene;
    let transcriptRawData;
    let transcriptObjectData;
    if (haplotypeObjectData.length > 0) {
        searchKeywordGene = haplotypeObjectData[1].geneID;
        console.log(searchKeywordGene);
        transcriptRawData = await fetchAllData('transcript', searchKeywordGene);
        console.log(transcriptRawData);
        updateData('transcript', transcriptRawData);
        transcriptObjectData = getData('transcriptObjectData');
    }

    // 获取二维数组数据
    let haplotypeArrayData = getData('haplotypeArrayData');
    console.log(haplotypeArrayData);
    let SNPArrayData = getData('SNPArrayData');
    let transcriptArrayData = getData('transcriptArrayData');

    // // 同步两个图像中第一条单倍型的颜色
    // let [changedHaplotypeArrayData, changedTranscriptArrayData] = initialBarColorSync(haplotypeArrayData, transcriptArrayData, '#ff7e98', 'red');
    // console.log(changedHaplotypeArrayData);
    // console.log(changedTranscriptArrayData);

    // drawHaplotypeSNPChart(haplotypeSNPChart, changedHaplotypeArrayData, SNPArrayData);
    // drawTranscriptChart(transcriptChart, changedTranscriptArrayData);

    // 设置第一条单倍型和转录本图像中的单倍型的焦点
    haplotypeArrayData = setBarFocus(haplotypeArrayData, 1, 'red');
    transcriptArrayData = setBarFocus(transcriptArrayData, 0, 'red');
    // 将转录本图像中的单倍型颜色设置为绿色（拙劣的手法）
    transcriptArrayData = setBarColor(transcriptArrayData, 0, '#9cd283');
    // 绘制图像
    drawHaplotypeSNPChart(haplotypeSNPChart, haplotypeArrayData, SNPArrayData);
    drawTranscriptChart(transcriptChart, transcriptArrayData);



    let haplotype_table_container = document.querySelector('#haplotype_table_container'); // 获取相应id的表格容器
    // console.log(haplotype_table_container);
    updateTableContainer('haplotypePagination', searchKeywordMosaic, 1, haplotype_table_container); // 初始化表格


    let SNP_table_container = document.querySelector('#SNP_table_container'); // 获取相应id的表格容器
    // console.log(SNP_table_container);
    updateTableContainer('SNPPagination', searchKeywordMosaic, 1, SNP_table_container); // 初始化表格

    let transcript_table_container = document.querySelector('#transcript_table_container'); // 获取相应id的表格容器
    // console.log(transcript_table_container);
    updateTableContainer('transcriptPagination', searchKeywordGene, 1, transcript_table_container); // 初始化表格

    let haplotypeResultDetailsData = { type: haplotypeRawData.type, data: haplotypeRawData.data[1] };
    let haplotype_result_details_container = document.querySelector('#haplotype_SNP_result_details_container');
    updateResultDetailsContainer(haplotypeResultDetailsData, haplotype_result_details_container);

    let transcriptResultDetailsData = { type: transcriptRawData.type, data: transcriptRawData.data[1] };
    let transcript_result_details_container = document.querySelector('#transcript_result_details_container');
    updateResultDetailsContainer(transcriptResultDetailsData, transcript_result_details_container);

}

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    inital();
    setUpPaginationEventListeners('#haplotype_table_container', 'haplotypePaginationData'); // 为haplotype表格容器添加事件监听器
    setUpPaginationEventListeners('#SNP_table_container', 'SNPPaginationData'); // 为SNP表格容器添加事件监听器
    setUpPaginationEventListeners('#transcript_table_container', 'transcriptPaginationData'); // 为transcript表格容器添加事件监听器
    setupDownloadButton('#download_haplotype_table'); // 为haplotype表格下载按钮添加事件监听器
    setupDownloadButton('#download_SNP_table'); // 为SNP表格下载按钮添加事件监听器
    setupDownloadButton('#download_transcript_table'); // 为transcript表格下载按钮添加事件监听器
    setUpResultDetailsContainerEventListeners('#haplotype_SNP_result_details_container'); // 为结果详情容器添加事件监听器
    setUpResultDetailsContainerEventListeners('#transcript_result_details_container'); // 为结果详情容器添加事件监听器
    haplotypeSNPChart.on('click', clickHaplotypeSNPChartsEvents); // 为单倍型图像添加事件监听器
    transcriptChart.on('click', clickTranscriptChartEvents); // 为转录本图像添加事件监听器
});