import { haplotypeSNPChart, threeSNPChart } from "./mainHaplotypeSNP.js";
import { getHaplotypeSNPOption } from "./echartsOptionHaplotypeSNP.js";
import { getThreeSNPOption } from "./echartsOptionThreeSNP.js";
import { getData } from "./data.js";
import { updateResultDetailsContainer } from "./resultDetailsContainer.js";

function drawHaplotypeSNPChart(haplotypeData, SNPData) {
    console.log('drawHaplotypeSNPChart');
    haplotypeSNPChart.setOption(getHaplotypeSNPOption(haplotypeData, SNPData));
}

function drawThreeSNPChart(REFData, SNPDataAll, SNPDataISO, SNPDataRNA) {
    console.log('drawThreeSNPChart');
    threeSNPChart.setOption(getThreeSNPOption(REFData, SNPDataAll, SNPDataISO, SNPDataRNA));
}

function findObjectWithKey(array, key, value) {
    return array.find(item => item[key] === value);
}


function clickHaplotypeSNPEventsHandler(params) {
    console.log('params: ', params);

    let haplotypeObjectData = getData('haplotypeObjectData');
    let SNPObjectData = getData('SNPObjectData');
    console.log('haplotypeObjectData: ', haplotypeObjectData);
    console.log('SNPObjectData: ', SNPObjectData);

    let resultDetailsData = {};
    let SNPTable = [];
    let resultDetailsType = '';

    // 点击的是haplotype，生成的SNP表格显示SNPSite和SNPType信息
    if (params.seriesName === 'haplotype') {
        let geneID = params.name;
        resultDetailsData = findObjectWithKey(haplotypeObjectData, 'geneID', geneID);

        // 点击的是mosaic，生成的SNP表格需要显示所有的SNPSite和SNPType
        if (geneID === '--') {
            // 遍历SNPObjectData，将SNPSite和SNPType组合为数组存入SNPTable
            SNPObjectData.forEach(function (item) {
                SNPTable.push([item.SNPSite, item.SNPType]);
            });
        }

        // 点击的是haplotype，生成的SNP表格需要显示这个haplotype上的SNPSite和SNPType
        else {
            // 遍历SNPObjectData
            SNPObjectData.forEach(item => {
                // 正则表达式匹配geneID和碱基信息
                const regex = new RegExp(`${geneID}:(\\w)`);
                const match = item.haplotypeSNP.match(regex);

                // 如果匹配到geneID，则提取碱基信息
                if (match) {
                    let base = (match[1] === 'n') ? 'no exon evidence' : match[1]; // 提取到的碱基信息
                    SNPTable.push([item.SNPSite, base]);
                }
            });
        }
        resultDetailsType = 'haplotypeSNPChartHaplotype';

        // 点击的是SNP，生成的SNP表格显示这个位点的haplotype和碱基信息
    } else if (params.seriesName === 'SNP') {
        let SNPSite = params.value[1];
        let selectedSNPBase = params.value[3];
        let selectedSNPBaseColor = params.color;
        resultDetailsData = findObjectWithKey(SNPObjectData, 'SNPSite', SNPSite);
        resultDetailsData.selectedSNPBase = selectedSNPBase;
        resultDetailsData.selectedSNPBaseColor = selectedSNPBaseColor;
        SNPTable = resultDetailsData.haplotypeSNP.split('; ').map(entry => entry.split(':'));
        resultDetailsType = 'haplotypeSNPChartSNP';
    }

    //  将SNPTable存入resultDetailsData
    resultDetailsData.SNPTable = SNPTable;
    console.log('resultDetailsData: ', resultDetailsData);

    let haplotypeSNPResultDetailsContainer = document.querySelector('#haplotype_SNP_result_details_container');
    let haplotypeSNPResultDetailsData = { type: resultDetailsType, data: resultDetailsData };
    updateResultDetailsContainer(haplotypeSNPResultDetailsData, haplotypeSNPResultDetailsContainer);
}

export { drawHaplotypeSNPChart, drawThreeSNPChart, clickHaplotypeSNPEventsHandler };
