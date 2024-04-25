import { drawOrthologHeatmap, drawXenologousHeatmap, drawGeneHeatmap, drawTranscriptHeatmap } from "./echartsEventsGeneExpressionProfile.js";
import { fetchRawData, getData, updateData } from "./data.js";

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

async function initalContentArea(searchKeyword = 'GT42G000001', keywordType = 'mosaic') {
    let [mosaicID, xenologousID, geneID, transcriptID] = splitGenomeID(searchKeyword, keywordType);
    console.log(mosaicID, xenologousID, geneID, transcriptID);

    // 获取原始数据
    const mosaicTPMRawData = await fetchRawData('mosaicTPM', mosaicID);
    const xenologousTPMRawData = await fetchRawData('xenologousTPM', mosaicID);
    const geneTPMRawData = await fetchRawData('geneTPM', mosaicID);

    updateData('mosaicTPM', mosaicTPMRawData);
    updateData('xenologousTPM', xenologousTPMRawData);
    updateData('geneTPM', geneTPMRawData);

    const mosaicTPMObjectData = getData('mosaicTPMObjectData');
    const xenologousTPMObjectData = getData('xenologousTPMObjectData');
    const geneTPMObjectData = getData('geneTPMObjectData');

    if (geneID === '') {
        geneID = geneTPMObjectData[0].geneID;
    }
    const transcriptTPMRawData = await fetchRawData('transcriptTPM', geneID);
    updateData('transcriptTPM', transcriptTPMRawData);
    const transcriptTPMObjectData = getData('transcriptTPMObjectData');

    console.log(mosaicTPMRawData, xenologousTPMRawData, geneTPMRawData, transcriptTPMRawData);

    drawOrthologHeatmap(mosaicTPMObjectData);
    drawXenologousHeatmap(cutObjectArrayColumn(xenologousTPMObjectData, 0, 1));
    drawGeneHeatmap(cutObjectArrayColumn(geneTPMObjectData, 0, 2));
    drawTranscriptHeatmap(cutObjectArrayColumn(transcriptTPMObjectData, 0, 3));

    console.log(cutObjectArrayColumn(xenologousTPMObjectData, 0, 1));
}

export { initalContentArea };