import { getHaplotypeOption } from "./echartsOptionHaplotype.js";
import { getTranscriptOption } from "./echartsOptionTranscript.js";
import { fetchAllData, fetchPaginationData, updateData, getData } from "./data.js";
import { updateTableContainer, setUpPaginationEventListeners } from "./tablePagination.js";
import { setupDownloadButton } from "./downloadTable.js";


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
    if (haplotypeDataObject.length > 0) {
        let searchKeywordGene = haplotypeDataObject[1].geneID;
        console.log(searchKeywordGene);
        let transcriptDataObject = await fetchAllData('transcript', searchKeywordGene);
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

    let paginationDataObject = await fetchPaginationData('haplotypePagination', searchKeywordMosaic, 1);
    // console.log(paginationDataObject);
    updateData('haplotypePagination', paginationDataObject);
    // console.log(getData('haplotypePagination'));
    let haplotype_table_container = document.querySelector('.haplotype_table_container');
    // console.log(haplotype_table_container);
    updateTableContainer('haplotypePagination', searchKeywordMosaic, 1, haplotype_table_container); // 初始化表格


}

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    inital();
    setUpPaginationEventListeners('.haplotype_table_container', 'haplotypePagination'); // 为haplotype表格容器添加事件监听器
    setupDownloadButton('download_haplotype_table'); // 为haplotype表格下载按钮添加事件监听器
});