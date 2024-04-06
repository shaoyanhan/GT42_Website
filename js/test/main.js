import { getHaplotypeOption } from "./echartsOptionHaplotype.js";
import { getTranscriptOption } from "./echartsOptionTranscript.js";
import { getHaplotypeData, getSNPData, getTranscriptData, getHaplotypeDataArray, getSNPDataArray, getTranscriptDataArray, fetchAllData } from "./data.js";

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
    let searchKeyword = 'GT42G000001';

    // 请求数据
    await fetchAllData('haplotype', searchKeyword);
    await fetchAllData('SNP', searchKeyword);

    // 先获取对象数组，取出geneID作为transcriptData的搜索关键词
    let haplotypeDataObject = getHaplotypeData();
    console.log(haplotypeDataObject);
    // transcriptData的搜索关键词基于haplotypeData查询结果的geneID，
    // 因此需要确保先获取到了haplotypeData，再根据haplotypeData的geneID获取transcriptData
    if (haplotypeDataObject.length > 0) {
        searchKeyword = haplotypeDataObject[1].geneID;
        console.log(searchKeyword);
        await fetchAllData('transcript', searchKeyword);
        console.log(getTranscriptData());
    }

    // 获取二维数组数据
    let haplotypeDataArray = getHaplotypeDataArray();
    let SNPDataArray = getSNPDataArray();
    let transcriptDataArray = getTranscriptDataArray();

    // 同步两个图像中第一条单倍型的颜色
    let [changedHaplotypeDataArray, changedTranscriptDataArray] = initialBarColorSync(haplotypeDataArray, transcriptDataArray, '#ff7e98');
    console.log(changedHaplotypeDataArray);
    console.log(changedTranscriptDataArray);

    // 绘制图像
    drawHaplotypeChart(changedHaplotypeDataArray, SNPDataArray);
    drawTranscriptChart(changedTranscriptDataArray);
}

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', inital);