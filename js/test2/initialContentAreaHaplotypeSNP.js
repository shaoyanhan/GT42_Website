import { fetchRawData, updateData, getData } from "./data.js";
import { haplotypeSNPChart } from "./mainHaplotypeSNP.js";
import { drawHaplotypeSNPChart, drawThreeSNPChart } from "./echartsEventsHaplotypeSNP.js";
import { updateResultDetailsContainer } from "./resultDetailsContainer.js";
import { updateTableContainer } from "./tablePagination.js";

async function initialHaplotypeSNP(haplotypeArrayData, SNPArrayData) {
    // 生成haplotypeData用于绘制bar
    // 将haplotypeArrayData最后一列的序列换为mosaic的长度，用于绘制相同长度的bar
    let mosaicLength = haplotypeArrayData[0][3];
    let haplotypeData = haplotypeArrayData.map((item) => {
        // [mosaicID, geneID, areaType, length, mosaicLength]
        return [item[0], item[1], item[2], item[3], mosaicLength];
    });
    console.log('haplotypeData: ', haplotypeData);

    // 生成SNPData用于绘制SNP点
    // 将SNPArrayData中的SNP和单倍型对应列去除以节省空间, 并对单倍型列切分为单个点数据
    let SNPData = [];
    SNPArrayData.map(function (item) {
        let IDBasePair = item[6].split('; ').map(entry => entry.split(':'));
        IDBasePair.forEach(function (element) {
            // [mosaicID, SNPSite, geneID, base]
            SNPData.push([item[0], item[2], element[0], element[1]]);
        });
    });
    console.log('SNPData: ', SNPData);

    drawHaplotypeSNPChart(haplotypeData, SNPData);

    // 初始化的时候使用mosaic的数据生成resultDetailsData并填充result details container
    let haplotypeObjectData = getData('haplotypeObjectData');
    let SNPObjectData = getData('SNPObjectData');
    let resultDetailsType = 'haplotypeSNPChartHaplotype';
    let resultDetailsData = haplotypeObjectData[0];
    let SNPTable = [];
    // 遍历SNPObjectData，将SNPSite和SNPType组合为数组存入SNPTable
    SNPObjectData.forEach(function (item) {
        SNPTable.push([item.SNPSite, item.SNPType]);
    });
    //  将SNPTable存入resultDetailsData
    resultDetailsData.SNPTable = SNPTable;
    let haplotypeSNPResultDetailsContainer = document.querySelector('#haplotype_SNP_result_details_container');
    let haplotypeSNPResultDetailsData = { type: resultDetailsType, data: resultDetailsData };
    updateResultDetailsContainer(haplotypeSNPResultDetailsData, haplotypeSNPResultDetailsContainer);

    // 为mosaic设置聚焦，请注意haplotype使用的是标准bar图，因此可以配置select属性并设置selectMode为single，因此无需手动进行聚焦操作的取消和设置
    haplotypeSNPChart.dispatchAction({
        type: 'select',
        seriesIndex: 0,
        dataIndex: 0
    });
}

// ["GT42G000827","SNP",18,"G/T","none","G/T : 43/18","GT42G000827.SO.1:G; ...","#8e43e7",60114] -> [["G", 18], ["T", 18]]
function SNPDataToScatter(data) {
    let scatterData = [];
    let base = data[3].split('/');
    base.forEach(function (element) {
        scatterData.push([element, data[2]]);
    });
    return scatterData;
}

async function initialThreeSNP(haplotypeArrayData, SNPArrayData) {
    // 生成REFData用于绘制参考bar
    let mosaicData = haplotypeArrayData[0];
    console.log('mosaicData: ', mosaicData);
    // [['REF', mosaicID, mosaicLength]]，柱状图的输入数据必须为二维列表
    let REFData = [['REF', mosaicData[0], mosaicData[3]]];
    console.log('REFData: ', REFData);

    // 生成三个SNP数据用于绘制三个SNP图
    let SNPDataBoth = [];
    let SNPDataISO = [];
    let SNPDataRNA = [];
    // 遍历SNPArrayData，判断第五列和第六列的值是否为'none'，如果第五列为'none'，则将数据存入SNPDataRNA，如果第六列为'none'，则将数据存入SNPDataISO，如果都不为'none'，则存入SNPDataAll
    for (let i = 0; i < SNPArrayData.length; i++) {
        let item = SNPArrayData[i];
        // let SNPSite = item[2];
        // let SNPType = item[3];
        let IsoSeqEvidence = item[4];
        let RNASeqEvidence = item[5];
        // let siteBasePair = [SNPSite, SNPType];
        if (IsoSeqEvidence !== 'none') {
            SNPDataToScatter(item).forEach(function (element) {
                SNPDataISO.push(element);
            });
        }
        if (RNASeqEvidence !== 'none') {
            SNPDataToScatter(item).forEach(function (element) {
                SNPDataRNA.push(element);
            });
        }
        if (IsoSeqEvidence !== 'none' && RNASeqEvidence !== 'none') {
            SNPDataToScatter(item).forEach(function (element) {
                SNPDataBoth.push(element);
            });
        }
    }
    // console.log('SNPDataAll: ', SNPDataAll);
    // console.log('SNPDataISO: ', SNPDataISO);
    // console.log('SNPDataRNA: ', SNPDataRNA);

    drawThreeSNPChart(REFData, SNPDataBoth, SNPDataISO, SNPDataRNA);

}

async function initialContentArea(searchKeyword, keywordType) {
    // 该页面只需要mosaicID作为搜索关键字，因此先对ID进行过滤
    let searchKeywordMosaic = (keywordType === 'mosaic') ? searchKeyword : searchKeyword.split('.')[0];
    // console.log('searchKeywordMosaic: ', searchKeywordMosaic);

    // 请求haplotype和SNP数据并保存
    let haplotypeRawData = await fetchRawData('haplotype', searchKeywordMosaic);
    let SNPRawData = await fetchRawData('SNP', searchKeywordMosaic);
    // console.log(haplotypeRawData);
    // console.log(SNPRawData);
    updateData('haplotype', haplotypeRawData);
    updateData('SNP', SNPRawData);
    let haplotypeArrayData = getData('haplotypeArrayData');
    let SNPArrayData = getData('SNPArrayData');
    console.log('haplotypeArrayData: ', haplotypeArrayData);
    console.log('SNPArrayData: ', SNPArrayData);

    initialHaplotypeSNP(haplotypeArrayData, SNPArrayData);
    initialThreeSNP(haplotypeArrayData, SNPArrayData);

    // 请求SNP证据数据并保存，用于后续表格数据的下载
    let SNPEvidenceBothRawData = await fetchRawData('SNPEvidenceBoth', searchKeywordMosaic);
    let SNPEvidenceIsoSeqRawData = await fetchRawData('SNPEvidenceIsoSeq', searchKeywordMosaic);
    let SNPEvidenceRNASeqRawData = await fetchRawData('SNPEvidenceRNASeq', searchKeywordMosaic);
    updateData('SNPEvidenceBoth', SNPEvidenceBothRawData);
    updateData('SNPEvidenceIsoSeq', SNPEvidenceIsoSeqRawData);
    updateData('SNPEvidenceRNASeq', SNPEvidenceRNASeqRawData);

    // 填充haplotype表格
    let haplotype_table_container = document.querySelector('#haplotype_table_container'); // 获取相应id的表格容器
    // console.log(haplotype_table_container);
    updateTableContainer('haplotypePagination', searchKeywordMosaic, 1, haplotype_table_container); // 初始化表格

    let SNP_table_container = document.querySelector('#SNP_table_container'); // 获取相应id的表格容器
    // console.log(SNP_table_container);
    updateTableContainer('SNPPagination', searchKeywordMosaic, 1, SNP_table_container); // 初始化表格

    let SNP_evidence_table_container_both = document.querySelector('#SNP_evidence_table_container_both'); // 获取相应id的表格容器
    // console.log(SNP_evidence_table_container_both);
    updateTableContainer('SNPEvidenceBothPagination', searchKeywordMosaic, 1, SNP_evidence_table_container_both); // 初始化表格

    let SNP_evidence_table_container_iso = document.querySelector('#SNP_evidence_table_container_iso'); // 获取相应id的表格容器
    // console.log(SNP_evidence_table_container_iso);
    updateTableContainer('SNPEvidenceIsoSeqPagination', searchKeywordMosaic, 1, SNP_evidence_table_container_iso); // 初始化表格

    let SNP_evidence_table_container_rna = document.querySelector('#SNP_evidence_table_container_rna'); // 获取相应id的表格容器
    // console.log(SNP_evidence_table_container_rna);
    updateTableContainer('SNPEvidenceRNASeqPagination', searchKeywordMosaic, 1, SNP_evidence_table_container_rna); // 初始化表格

}

export { initialContentArea }