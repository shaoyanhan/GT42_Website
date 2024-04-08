import { getHaplotypeOption } from "./echartsOptionHaplotype.js";
import { getTranscriptOption } from "./echartsOptionTranscript.js";
import { fetchAllData, fetchPaginationData, updateData, getData } from "./data.js";
import { updateTableContainer, setUpPaginationEventListeners } from "./tablePagination.js";
import { setupDownloadButton } from "./downloadTable.js";
import { updateResultDetailsContainer, setUpResultDetailsContainerEventListeners } from "./resultDetailsContainer.js";


// 初始化ECharts实例
export let haplotypeChart = echarts.init(document.getElementById('drawHaplotype'), null, { renderer: 'svg' });
export let transcriptChart = echarts.init(document.getElementById('drawTranscript'), null, { renderer: 'svg' });


function drawHaplotypeChart(haplotypeData, SNPData) {
    haplotypeChart.setOption(getHaplotypeOption(haplotypeData, SNPData));
}

function drawTranscriptChart(transcriptData) {
    transcriptChart.setOption(getTranscriptOption(transcriptData));
}

// 实现单倍型和转录本图像中的选中的单倍型的颜色同步
function initialBarColorSync(haplotypeDataArray, transcriptDataArray, color) {
    let itemStyle = {
        color: color,
        borderWidth: 5,
        borderColor: "red",
        borderType: "solid",
        opacity: 1
    }
    haplotypeDataArray[1] = {
        value: haplotypeDataArray[1],
        itemStyle: itemStyle
    }
    transcriptDataArray[0] = {
        value: transcriptDataArray[0],
        itemStyle: itemStyle
    }
    return [haplotypeDataArray, transcriptDataArray];
}

// 页面初始化
async function inital() {
    // 获取搜索框中的关键词
    let searchKeywordMosaic = 'GT42G000001';

    // 请求数据并保存
    let haplotypeDataObject = await fetchAllData('haplotype', searchKeywordMosaic);
    let SNPDataObject = await fetchAllData('SNP', searchKeywordMosaic);
    console.log(haplotypeDataObject);
    console.log(SNPDataObject);
    updateData('haplotype', haplotypeDataObject);
    updateData('SNP', SNPDataObject);

    // 先获取对象数组，取出geneID作为transcriptData的搜索关键词
    console.log(haplotypeDataObject);
    // transcriptData的搜索关键词基于haplotypeData查询结果的geneID，
    // 因此需要确保先获取到了haplotypeData，再根据haplotypeData的geneID获取transcriptData
    let searchKeywordGene;
    let transcriptDataObject;
    if (haplotypeDataObject.length > 0) {
        searchKeywordGene = haplotypeDataObject[1].geneID;
        console.log(searchKeywordGene);
        transcriptDataObject = await fetchAllData('transcript', searchKeywordGene);
        console.log(transcriptDataObject);
        updateData('transcript', transcriptDataObject);
    }

    // 获取二维数组数据
    let haplotypeDataArray = getData('haplotypeDataArray');
    let SNPDataArray = getData('SNPDataArray');
    let transcriptDataArray = getData('transcriptDataArray');

    // 同步两个图像中第一条单倍型的颜色
    let [changedHaplotypeDataArray, changedTranscriptDataArray] = initialBarColorSync(haplotypeDataArray, transcriptDataArray, '#ff7e98');
    console.log(changedHaplotypeDataArray);
    console.log(changedTranscriptDataArray);

    // 绘制图像
    drawHaplotypeChart(changedHaplotypeDataArray, SNPDataArray);
    drawTranscriptChart(changedTranscriptDataArray);



    let haplotype_table_container = document.querySelector('#haplotype_table_container'); // 获取相应id的表格容器
    // console.log(haplotype_table_container);
    updateTableContainer('haplotypePagination', searchKeywordMosaic, 1, haplotype_table_container); // 初始化表格


    let SNP_table_container = document.querySelector('#SNP_table_container'); // 获取相应id的表格容器
    // console.log(SNP_table_container);
    updateTableContainer('SNPPagination', searchKeywordMosaic, 1, SNP_table_container); // 初始化表格

    let transcript_table_container = document.querySelector('#transcript_table_container'); // 获取相应id的表格容器
    // console.log(transcript_table_container);
    updateTableContainer('transcriptPagination', searchKeywordGene, 1, transcript_table_container); // 初始化表格


    let haplotype_result_details_container = document.querySelector('#haplotype_result_details_container');
    updateResultDetailsContainer(haplotypeDataObject[1], haplotype_result_details_container);

    let SNP_result_details_container = document.querySelector('#SNP_result_details_container');
    updateResultDetailsContainer(SNPDataObject[1], SNP_result_details_container);

    let transcript_result_details_container = document.querySelector('#transcript_result_details_container');
    updateResultDetailsContainer(transcriptDataObject[1], transcript_result_details_container);

}

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    inital();
    setUpPaginationEventListeners('#haplotype_table_container', 'haplotypePagination'); // 为haplotype表格容器添加事件监听器
    setUpPaginationEventListeners('#SNP_table_container', 'SNPPagination'); // 为SNP表格容器添加事件监听器
    setUpPaginationEventListeners('#transcript_table_container', 'transcriptPagination'); // 为transcript表格容器添加事件监听器
    setupDownloadButton('#download_haplotype_table'); // 为haplotype表格下载按钮添加事件监听器
    setupDownloadButton('#download_SNP_table'); // 为SNP表格下载按钮添加事件监听器
    setupDownloadButton('#download_transcript_table'); // 为transcript表格下载按钮添加事件监听器
    setUpResultDetailsContainerEventListeners('#haplotype_result_details_container'); // 为结果详情容器添加事件监听器
    setUpResultDetailsContainerEventListeners('#SNP_result_details_container'); // 为结果详情容器添加事件监听器
    setUpResultDetailsContainerEventListeners('#transcript_result_details_container'); // 为结果详情容器添加事件监听器
});