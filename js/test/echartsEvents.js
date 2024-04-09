import { getData } from './data.js';
import { updateResultDetailsContainer } from './resultDetailsContainer.js';
import { getHaplotypeSNPOption } from "./echartsOptionHaplotype.js";
import { getTranscriptOption } from "./echartsOptionTranscript.js";
import { haplotypeSNPChart, transcriptChart } from './main.js';


function drawHaplotypeSNPChart(haplotypeSNPChart, haplotypeData, SNPData) {
    haplotypeSNPChart.setOption(getHaplotypeSNPOption(haplotypeData, SNPData));
}

function drawTranscriptChart(transcriptChart, transcriptData) {
    transcriptChart.setOption(getTranscriptOption(transcriptData));
}

// 设置柱子的焦点（添加边框颜色显示焦点）
function setBarFocus(dataArray, index, borderColor) {
    let itemStyle = {
        borderWidth: 5,
        borderColor: borderColor,
        borderType: "solid",
        opacity: 1
    }
    dataArray[index] = {
        value: dataArray[index],
        itemStyle: itemStyle
    }
    return dataArray;
}

// 设置柱子的颜色
function setBarColor(dataArray, index, color) {
    dataArray[index].itemStyle.color = color;
    return dataArray;
}

// 初始化的时候，实现第一条单倍型和转录本图像中的单倍型的颜色同步，并为它们设置焦点
function initialBarColorSync(haplotypeArrayData, transcriptArrayData, barColor, borderColor) {
    // 设置第一条单倍型和转录本图像中的单倍型的焦点
    haplotypeArrayData = setBarFocus(haplotypeArrayData, 1, borderColor);
    transcriptArrayData = setBarFocus(transcriptArrayData, 0, borderColor);

    // 设置第一条单倍型和转录本图像中的单倍型的颜色
    haplotypeArrayData = setBarColor(haplotypeArrayData, 1, barColor);
    transcriptArrayData = setBarColor(transcriptArrayData, 0, barColor);

    return [haplotypeArrayData, transcriptArrayData];
}




function clickHaplotypeSNPChartsEvents(params) {
    console.log('clickHaplotypeSNPChartsEvents events');
    console.log(params);
    let seriesName = params.seriesName; // 与option中的series.name对应
    let geneType = params.name; // 与option中的y轴名称对应

    let haplotypeObjectData = getData('haplotypeObjectData');
    let SNPObjectData = getData('SNPObjectData');

    let ObjectData = seriesName === 'haplotype' ? haplotypeObjectData : SNPObjectData;
    // console.log(ObjectData);
    let data;

    if (seriesName === 'haplotype') { // filter 会返回一个包含查询结果的对象数组，用[0]取出查询数据：[{...}] => {...}
        data = ObjectData.filter(item => item.geneType === geneType)[0]; // 取出与当前点击的haplotypeID对应的数据
    } else { // 取出前点击的SNP位点的SNPSite对应的SNP数据，这里使用value而不用data是因为data可能会成为一个对象数组附加其他绘图属性，但是value就是纯粹的绘图数据，另外，这里不使用mosaicID && SNPSite的方式是因为ObjectData只会存储当前mosaicID的数据
        data = ObjectData.filter(item => item.SNPSite === params.value[2])[0];
    }
    // console.log(data);

    let ResultDetailsData = { type: seriesName, data: data };
    let haplotype_SNP_result_details_container = document.querySelector('#haplotype_SNP_result_details_container');
    updateResultDetailsContainer(ResultDetailsData, haplotype_SNP_result_details_container);


    // 如果点击的是mosaic的柱子，那么只需要将haplotypeSNPChart的焦点进行更新, 并去除transcriptChart的焦点
    let haplotypeArrayData = getData('haplotypeArrayData');
    console.log(haplotypeArrayData);
    let transcriptArrayData = getData('transcriptArrayData');
    console.log(transcriptArrayData);
    if (geneType === 'mosaic') {
        haplotypeArrayData = setBarFocus(haplotypeArrayData, 0, 'red');
    } else { // 如果点击的是haplotype的柱子，那么需要将transcriptChart的焦点和柱颜色进行更新，并更新transcript的数据集
        haplotypeArrayData = setBarFocus(haplotypeArrayData, params.dataIndex, 'red');
        transcriptArrayData = setBarFocus(transcriptArrayData, 0, 'red');




        transcriptArrayData = setBarColor(transcriptArrayData, 0, params.color);
    }
    drawHaplotypeSNPChart(haplotypeSNPChart, haplotypeArrayData, getData('SNPArrayData'));
    drawTranscriptChart(transcriptChart, transcriptArrayData);

}

function clickTranscriptChartEvents(params) {
    console.log('clickTranscriptChartEvents events');
    console.log(params);
    let seriesName = params.seriesName; // 与option中的series.name对应
    let transcriptIndex = params.name; // 与option中的y轴名称对应

    let transcriptObjectData = getData('transcriptObjectData');

    let data = transcriptObjectData.filter(item => item.transcriptIndex === transcriptIndex)[0]; // 取出与当前点击的transcriptIndex对应的数据
    // console.log(data);

    let ResultDetailsData = { type: seriesName, data: data };
    let transcript_result_details_container = document.querySelector('#transcript_result_details_container');
    updateResultDetailsContainer(ResultDetailsData, transcript_result_details_container);
}

export { drawHaplotypeSNPChart, drawTranscriptChart, setBarFocus, setBarColor, initialBarColorSync, clickHaplotypeSNPChartsEvents, clickTranscriptChartEvents };