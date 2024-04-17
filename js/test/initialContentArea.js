import { drawHaplotypeSNPChart, drawTranscriptChart, setBarFocus, setBarColor, initialBarColorSync, clickHaplotypeSNPChartsEvents, clickTranscriptChartEvents } from "./echartsEvents.js";
import { fetchAllData, fetchPaginationData, updateData, getData, validateGenomeID } from "./data.js";
import { updateTableContainer, setUpPaginationEventListeners } from "./tablePagination.js";
import { setupDownloadButton } from "./downloadTable.js";
import { updateResultDetailsContainer, setUpResultDetailsContainerEventListeners } from "./resultDetailsContainer.js";
import { validateSearchForm } from "./searchEvents.js";
import { haplotypeSNPChart, transcriptChart } from "./main.js";

// 从对象数组中查找指定key和value的对象的行索引
function findIndexInObjectArray(objectArray, key, value) {
    return objectArray.findIndex(obj => obj[key] === value);
}

// 根据genomeID的类型，拆分genomeID得到mosaicID、geneID、transcriptID，请注意mosaicID和geneID还有两种别名情况
function splitGenomeID(genomeID, keywordType) {
    let mosaicID = '';
    let geneID = '';
    let transcriptID = '';
    if (keywordType === 'mosaic') {
        // mosaicID = genomeID;
        mosaicID = genomeID.split('.')[0]; // GT42G000001 / GT42G000001.0.0 => GT42G000001
    } else if (keywordType === 'gene') {
        mosaicID = genomeID.split('.')[0];
        // geneID = genomeID;
        geneID = genomeID.split('.')[0] + '.' + genomeID.split('.')[1] + '.' + genomeID.split('.')[2]; // GT42G000001.SO.1 / GT42G000001.SO.1.0 => GT42G000001.SO.1
    } else if (keywordType === 'transcript') {
        mosaicID = genomeID.split('.')[0];
        geneID = genomeID.split('.')[0] + '.' + genomeID.split('.')[1] + '.' + genomeID.split('.')[2];
        transcriptID = genomeID;
    }
    return [mosaicID, geneID, transcriptID];
}


// 页面初始化，传入两个参数：genomeID和genomeID的类型，其实就是validateGenomeID成功之后的其中两个返回值
// keywordType是一个字符串，表示genomeID的类型，有三种可能的值：mosaic、gene、transcript
async function initalContentArea(searchKeyword, keywordType) {

    console.log(searchKeyword);
    console.log(keywordType);

    let geneIDIndex; // 用于保存某个geneID在haplotypeObjectData中的行索引
    let transcriptIDIndex; // 用于保存某个transcriptID在transcriptObjectData中的行索引

    // 根据关键词的类型，分别获取mosaicID、geneID、transcriptID，
    // 注意：mosaicID是必须的（否则在searchEvent中无法通过validateGenomeID），geneID和transcriptID可能为空
    let [searchKeywordMosaic, searchKeywordGene, searchKeywordTranscript] = splitGenomeID(searchKeyword, keywordType);
    console.log(searchKeywordMosaic);
    console.log(searchKeywordGene);
    console.log(searchKeywordTranscript);

    // 请求原始数据并保存
    let haplotypeRawData = await fetchAllData('haplotype', searchKeywordMosaic);
    let SNPRawData = await fetchAllData('SNP', searchKeywordMosaic);
    console.log(haplotypeRawData);
    console.log(SNPRawData);
    updateData('haplotype', haplotypeRawData);
    updateData('SNP', SNPRawData);

    let haplotypeObjectData = getData('haplotypeObjectData');
    let SNPObjectData = getData('SNPObjectData');
    // console.log(haplotypeObjectData);
    // console.log(SNPObjectData);


    let transcriptRawData;
    let transcriptObjectData;
    if (searchKeywordGene === '') { // 如果searchKeywordGene为空，证明用户搜索的是mosaicID，那么默认显示第一条单倍型的转录本
        searchKeywordGene = haplotypeObjectData[1].geneID;
        geneIDIndex = 1;
    } else { // 如果searchKeywordGene不为空，那么查找这个geneID在haplotypeObjectData中的行索引
        geneIDIndex = findIndexInObjectArray(haplotypeObjectData, 'geneID', searchKeywordGene);
    }
    // console.log(searchKeywordGene);
    transcriptRawData = await fetchAllData('transcript', searchKeywordGene);
    // console.log(transcriptRawData);
    updateData('transcript', transcriptRawData);
    transcriptObjectData = getData('transcriptObjectData');

    if (searchKeywordTranscript === '') { // 如果searchKeywordTranscript为空，证明用户搜索的是mosaicID或者geneID，那么默认显示第一条转录本的第一个外显子
        searchKeywordTranscript = transcriptObjectData[1].transcriptID;
        transcriptIDIndex = 1;
    } else { // 如果searchKeywordTranscript不为空，那么查找这个transcriptID在transcriptObjectData中的行索引
        transcriptIDIndex = findIndexInObjectArray(transcriptObjectData, 'transcriptID', searchKeywordTranscript);
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

    // 设置用户所搜索的单倍型以及转录本图像中的外显子的焦点
    haplotypeArrayData = setBarFocus(haplotypeArrayData, geneIDIndex, 'red');
    transcriptArrayData = setBarFocus(transcriptArrayData, transcriptIDIndex, 'red');
    let initialExonBarColor = '#61A3BA'; // 对第一个显示的外显子设置颜色，否则transcriptArrayData被刷新之后默认为黑色
    transcriptArrayData = setBarColor(transcriptArrayData, transcriptIDIndex, initialExonBarColor);

    // 初始的时候，将转录本图像中的单倍型颜色设置为浅绿色（拙劣的手法）
    let initialHaplotypeBarColor = '#dce6d7';
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

    let haplotypeResultDetailsData = { type: haplotypeRawData.type, data: haplotypeRawData.data[geneIDIndex] }; // 根据用户搜索的geneID的索引，获取第一条待展示的haplotype的信息
    let haplotype_result_details_container = document.querySelector('#haplotype_SNP_result_details_container'); // 获取haplotype_SNP的result details容器
    updateResultDetailsContainer(haplotypeResultDetailsData, haplotype_result_details_container); // 初始化result details容器

    let transcriptResultDetailsData = { type: transcriptRawData.type, data: transcriptRawData.data[transcriptIDIndex] }; // 根据用户搜索的transcriptID的索引，获取第一条待展示的可变剪接的信息
    let transcript_result_details_container = document.querySelector('#transcript_result_details_container'); // 获取transcript的result details容器
    updateResultDetailsContainer(transcriptResultDetailsData, transcript_result_details_container); // 初始化result details容器
}

export { initalContentArea };