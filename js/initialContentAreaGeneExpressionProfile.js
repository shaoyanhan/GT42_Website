import { drawOrthologousHeatmap, drawXenologousHeatmap, drawGeneHeatmap, drawTranscriptHeatmap, drawIDTree } from "./echartsEventsGeneExpressionProfile.js";
import { fetchRawData, getData, updateData } from "./data.js";
// import { fillSelect } from "./selectEvents.js";
import { updateTableContainer } from "./tablePagination.js";

// 根据genomeID的类型，拆分genomeID得到mosaicID、xenologousID、geneID、transcriptID，此处mosaicID和geneID没有别名情况
function splitGenomeID(genomeID, keywordType) {
    let mosaicID = '';
    let xenologousID = '';
    let geneID = '';
    let transcriptID = '';
    if (keywordType === 'mosaic') { // mosaicID的格式：GT42G000001
        mosaicID = genomeID;
    } else if (keywordType === 'xenologous') { // xenologousID的格式：GT42G000001.SO
        mosaicID = genomeID.split('.')[0];
        xenologousID = genomeID;
    } else if (keywordType === 'gene') { // geneID的格式：GT42G000001.SO.1
        mosaicID = genomeID.split('.')[0];
        xenologousID = genomeID.split(".").slice(0, 2).join(".");
        geneID = genomeID;
    } else if (keywordType === 'transcript') { // transcriptID的格式：GT42G000001.SO.1.1
        mosaicID = genomeID.split('.')[0];
        xenologousID = genomeID.split(".").slice(0, 2).join(".");
        geneID = genomeID.split(".").slice(0, 3).join(".");
        transcriptID = genomeID;
    }
    return [mosaicID, xenologousID, geneID, transcriptID];
}

// 删除对象数组中指定范围的列，start和end限定了一个左闭右开区间
function cutObjectArrayColumn(objectArray, start, end) {
    objectArray.forEach(item => {
        const keys = Object.keys(item);
        for (let i = start; i < end; i++) {
            if (i < keys.length) { // 确保不会超出键数组的范围
                delete item[keys[i]];
            }
        }
    });
    return objectArray;
}

// 提取出对象数组中第一个键的值，返回一个字符串数组
function extractObjectArrayFirstKey(objectArray) {
    return objectArray.map(item => item[Object.keys(item)[0]]);
}

// 从对象数组中查找指定key和value的对象的行索引
function findIndexInObjectArray(objectArray, key, value) {
    return objectArray.findIndex(obj => obj[key] === value);
}

// 当用户使用'#select_haplotype'选择框选择了特定的单倍型ID之后, 绘制特定单倍型的转录本表达热图
async function drawTranscriptHeatmapByGeneID(geneID) {

    // 获取原始数据
    const transcriptTPMRawData = await fetchRawData('transcriptTPM', geneID);
    updateData('transcriptTPM', transcriptTPMRawData);
    const transcriptTPMObjectData = getData('transcriptTPMObjectData');

    const cuttedTranscriptTPMObjectData = cutObjectArrayColumn(transcriptTPMObjectData, 0, 3);
    console.log(cuttedTranscriptTPMObjectData);

    drawTranscriptHeatmap(cuttedTranscriptTPMObjectData);

    let transcript_table_container = document.querySelector('#transcript_TPM_table_container'); // 获取相应id的表格容器
    updateTableContainer('transcriptTPMPagination', geneID, 1, transcript_table_container); // 初始化表格

}


async function initialContentArea(searchKeyword = 'GT42G000001', keywordType = 'mosaic') {

    // 根据用户输入的搜索关键词，拆分得到mosaicID、xenologousID、geneID、transcriptID
    let [mosaicID, xenologousID, geneID, transcriptID] = splitGenomeID(searchKeyword, keywordType);
    // console.log(mosaicID, xenologousID, geneID, transcriptID);

    // 获取原始数据, 默认情况下使用mosaicID请求除了transcriptTPM之外的所有数据
    const mosaicTPMRawData = await fetchRawData('mosaicTPM', mosaicID);
    const xenologousTPMRawData = await fetchRawData('xenologousTPM', mosaicID);
    const geneTPMRawData = await fetchRawData('geneTPM', mosaicID);
    const transcriptTPMRawData = await fetchRawData('allTranscriptTPM', mosaicID);
    const homologousIDSet = await fetchRawData('homologousIDSet', mosaicID);

    // 存储数据到全局变量中
    updateData('mosaicTPM', mosaicTPMRawData);
    updateData('xenologousTPM', xenologousTPMRawData);
    updateData('geneTPM', geneTPMRawData);
    updateData('allTranscriptTPM', transcriptTPMRawData);
    updateData('homologousIDSet', homologousIDSet);

    // 获取对象数组数据
    const mosaicTPMObjectData = getData('mosaicTPMObjectData');
    const xenologousTPMObjectData = getData('xenologousTPMObjectData');
    const geneTPMObjectData = getData('geneTPMObjectData');
    const transcriptTPMObjectData = getData('allTranscriptTPMObjectData');

    // 删除各个对象数组中的不必要的列
    const cuttedXenologousTPMObjectData = cutObjectArrayColumn(xenologousTPMObjectData, 0, 1);
    const cuttedGeneTPMObjectData = cutObjectArrayColumn(geneTPMObjectData, 0, 2);
    const cuttedTranscriptTPMObjectData = cutObjectArrayColumn(transcriptTPMObjectData, 0, 3);

    // 绘制热图
    drawOrthologousHeatmap(mosaicTPMObjectData);
    drawXenologousHeatmap(cuttedXenologousTPMObjectData);
    drawGeneHeatmap(cuttedGeneTPMObjectData);
    drawTranscriptHeatmap(cuttedTranscriptTPMObjectData);
    // 绘制IDTree
    drawIDTree(homologousIDSet);

    let orthologous_table_container = document.querySelector('#orthologous_TPM_table_container'); // 获取相应id的表格容器
    updateTableContainer('mosaicTPMPagination', mosaicID, 1, orthologous_table_container); // 初始化表格

    let xenologous_table_container = document.querySelector('#xenologous_TPM_table_container'); // 获取相应id的表格容器
    updateTableContainer('xenologousTPMPagination', mosaicID, 1, xenologous_table_container); // 初始化表格

    let gene_table_container = document.querySelector('#gene_TPM_table_container'); // 获取相应id的表格容器
    updateTableContainer('geneTPMPagination', mosaicID, 1, gene_table_container); // 初始化表格

    let transcript_table_container = document.querySelector('#transcript_TPM_table_container'); // 获取相应id的表格容器
    updateTableContainer('allTranscriptTPMPagination', mosaicID, 1, transcript_table_container); // 初始化表格


    // 根据keywordType的类型，跳转到相应的页面位置
    // let jumpTargetElement = '';
    // if (keywordType === 'mosaic') {
    //     jumpTargetElement = document.getElementById('drawOrthologousHeatmap');
    // } else if (keywordType === 'xenologous') {
    //     jumpTargetElement = document.getElementById('drawXenologousHeatmap');
    // }
    // else if (keywordType === 'gene') {
    //     jumpTargetElement = document.getElementById('drawGeneHeatmap');
    // }
    // else if (keywordType === 'transcript') {
    //     jumpTargetElement = document.getElementById('drawTranscriptHeatmap');
    // }
    // if (jumpTargetElement) {
    //     //  'smooth' 选项会平滑地滚动到指定元素，而不是瞬间跳转，'center' 选项会将元素滚动到视口的中间( block: 'start' 为顶部 )
    //     jumpTargetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // }

}

export { initialContentArea, drawTranscriptHeatmapByGeneID };