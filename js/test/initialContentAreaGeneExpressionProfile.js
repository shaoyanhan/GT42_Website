import { drawOrthologHeatmap } from "./echartsEventsGeneExpressionProfile.js";

// 根据genomeID的类型，拆分genomeID得到mosaicID、xenologousID、geneID、transcriptID，此处mosaicID和geneID没有别名情况
function splitGenomeID(genomeID, keywordType) {
    let mosaicID = '';
    let xenologousID = '';
    let geneID = '';
    let transcriptID = '';
    if (keywordType === 'mosaic') {
        mosaicID = genomeID;
    } else if (keywordType === 'xenologous') {
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

async function initalContentArea(searchKeyword, keywordType) {
    drawOrthologHeatmap();
}

export { initalContentArea };