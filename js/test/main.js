import { getHaplotypeOption } from "./echartsOptionHaplotype.js";
import { getTranscriptOption } from "./echartsOptionTranscript.js";
import { updateHaplotypeData, updateSNPData, updateTranscriptData, getHaplotypeData, getSNPData, getTranscriptData, getHaplotypeDataArray, getSNPDataArray, getTranscriptDataArray, fetchData } from "./data.js";

// 初始化ECharts实例
export let haplotypeChart = echarts.init(document.getElementById('drawHaplotype'), null, { renderer: 'svg' });
export let transcriptChart = echarts.init(document.getElementById('drawTranscript'), null, { renderer: 'svg' });


// 定义API请求的前缀
let apiPrefix = {
    haplotype: 'http://127.0.0.1:8080/searchDatabase/getHaplotypeTable/?searchKeyword=',
    SNP: 'http://127.0.0.1:8080/searchDatabase/getSNPTable/?searchKeyword=',
    transcript: 'http://127.0.0.1:8080/searchDatabase/getTranscriptTable/?searchKeyword=',
}
// 定义更新函数的映射关系, 从名称映射到函数
const updateFunctions = {
    haplotype: updateHaplotypeData,
    SNP: updateSNPData,
    transcript: updateTranscriptData,
};
// 请求数据
async function requestData(type, searchKeyword) {
    try {
        const dataRequestUrl = apiPrefix[type] + searchKeyword;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        // 从映射中获取对应的更新函数并调用它
        const updateDataFunction = updateFunctions[type];
        if (updateDataFunction) {
            updateDataFunction(data);
        } else {
            console.error(`未知的数据类型: ${type}`);
        }
    } catch (error) {
        console.error(`${type}数据加载失败:`, error);
    }
}


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
    await requestData('haplotype', searchKeyword);
    await requestData('SNP', searchKeyword);

    // 先获取对象数组，取出geneID作为transcriptData的搜索关键词
    let haplotypeDataObject = getHaplotypeData();
    console.log(haplotypeDataObject);
    // transcriptData的搜索关键词基于haplotypeData查询结果的geneID，
    // 因此需要确保先获取到了haplotypeData，再根据haplotypeData的geneID获取transcriptData
    if (haplotypeDataObject.length > 0) {
        searchKeyword = haplotypeDataObject[1].geneID;
        console.log(searchKeyword);
        await requestData('transcript', searchKeyword);
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