import { drawHaplotypeSNPChart, drawTranscriptChart, setBarFocus, setBarColor, initialBarColorSync, clickHaplotypeSNPChartsEvents, clickTranscriptChartEvents } from "./echartsEvents.js";
import { fetchAllData, fetchPaginationData, updateData, getData, validateGenomeID } from "./data.js";
import { updateTableContainer, setUpPaginationEventListeners } from "./tablePagination.js";
import { setupDownloadButton } from "./downloadTable.js";
import { updateResultDetailsContainer, setUpResultDetailsContainerEventListeners } from "./resultDetailsContainer.js";
import { validateSearchForm } from "./searchEvents.js";
import { haplotypeSNPChart, transcriptChart } from "./main.js";

function findIndexInObjectArray(objectArray, key, value) {
    return objectArray.findIndex(obj => obj[key] === value);
}


function getInitialIndex(objectArray, searchKeyword, keywordType) {
    if (keywordType === 'mosaic') { // GT42G000001

    } else if (keywordType === 'gene') { // GT42G000001.SO.1

    } else if (keywordType === 'transcript') { // GT42G000001.SO.1.1

    }
}


// 页面初始化，传入两个参数：genomeID和genomeID的类型，其实就是validateGenomeID成功之后的其中两个返回值
// keywordType是一个字符串，表示genomeID的类型，有三种可能的值：mosaic、gene、transcript
async function initalContentArea(searchKeyword, keywordType) {
    // 获取搜索框中的关键词
    let searchKeywordMosaic = 'GT42G000001';

    let haplotypeIDIndex;
    let geneIDIndex;
    let transcriptIDIndex;




    // 请求数据并保存
    let haplotypeRawData = await fetchAllData('haplotype', searchKeywordMosaic);
    let SNPRawData = await fetchAllData('SNP', searchKeywordMosaic);
    // console.log(haplotypeRawData);
    // console.log(SNPRawData);
    updateData('haplotype', haplotypeRawData);
    updateData('SNP', SNPRawData);

    let haplotypeObjectData = getData('haplotypeObjectData');
    let SNPObjectData = getData('SNPObjectData');
    // console.log(haplotypeObjectData);
    // console.log(SNPObjectData);

    // 先获取对象数组，取出geneID作为transcriptData的搜索关键词
    // transcriptData的搜索关键词基于haplotypeData查询结果的geneID，
    // 因此需要确保先获取到了haplotypeData，再根据haplotypeData的geneID获取transcriptData
    let searchKeywordGene;
    let transcriptRawData;
    let transcriptObjectData;
    if (haplotypeObjectData.length > 0) {
        searchKeywordGene = haplotypeObjectData[1].geneID;
        // console.log(searchKeywordGene);
        transcriptRawData = await fetchAllData('transcript', searchKeywordGene);
        // console.log(transcriptRawData);
        updateData('transcript', transcriptRawData);
        transcriptObjectData = getData('transcriptObjectData');
    }

    // 获取二维数组数据
    let haplotypeArrayData = getData('haplotypeArrayData');
    // console.log(haplotypeArrayData);
    let SNPArrayData = getData('SNPArrayData');
    let transcriptArrayData = getData('transcriptArrayData');

    // // 同步两个图像中第一条单倍型的颜色
    // let [changedHaplotypeArrayData, changedTranscriptArrayData] = initialBarColorSync(haplotypeArrayData, transcriptArrayData, '#ff7e98', 'red');
    // console.log(changedHaplotypeArrayData);
    // console.log(changedTranscriptArrayData);

    // drawHaplotypeSNPChart(haplotypeSNPChart, changedHaplotypeArrayData, SNPArrayData);
    // drawTranscriptChart(transcriptChart, changedTranscriptArrayData);

    // 设置第一条单倍型和转录本图像中的第一个转录本的第一个外显子的焦点
    haplotypeArrayData = setBarFocus(haplotypeArrayData, 1, 'red');
    transcriptArrayData = setBarFocus(transcriptArrayData, 1, 'red');
    let initialExonBarColor = '#61A3BA';
    transcriptArrayData = setBarColor(transcriptArrayData, 1, initialExonBarColor);

    // 将转录本图像中的单倍型颜色设置为绿色（拙劣的手法）
    let initialHaplotypeBarColor = '#9cd283';
    transcriptArrayData = setBarColor(transcriptArrayData, 0, initialHaplotypeBarColor);

    // 由于目前还没有发生点击事件，因此无法通过点击事件来更新transcript图像中单倍型的颜色，
    // 如果初始化之后用户直接点击可变剪接的柱子，那么transcript图像中单倍型的颜色会变为默认的黑色
    // 因此需要将当前的单倍型的颜色保存到haplotypeEchartParams中，以便在点击可变剪接的柱子时更新单倍型的颜色
    let initialHaplotypeEchartParams = { color: initialHaplotypeBarColor };
    updateData('haplotypeEchartParams', initialHaplotypeEchartParams);
    // console.log(getData('haplotypeEchartParamsData'));
    // console.log(transcriptArrayData);

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

    let haplotypeResultDetailsData = { type: haplotypeRawData.type, data: haplotypeRawData.data[1] }; // 获取第一条haplotype的信息
    let haplotype_result_details_container = document.querySelector('#haplotype_SNP_result_details_container'); // 获取haplotype_SNP的result details容器
    updateResultDetailsContainer(haplotypeResultDetailsData, haplotype_result_details_container); // 初始化result details容器

    let transcriptResultDetailsData = { type: transcriptRawData.type, data: transcriptRawData.data[1] }; // 获取第一条可变剪接的信息
    let transcript_result_details_container = document.querySelector('#transcript_result_details_container'); // 获取transcript的result details容器
    updateResultDetailsContainer(transcriptResultDetailsData, transcript_result_details_container); // 初始化result details容器

}

export { initalContentArea };