
import { updateResultDetailsContainer } from './resultDetailsContainer.js';
import { getHaplotypeSNPOption } from "./echartsOptionHaplotype.js";
import { getTranscriptOption } from "./echartsOptionTranscript.js";
import { haplotypeSNPChart, transcriptChart } from './main.js';
import { fetchAllData, fetchPaginationData, updateData, getData } from "./data.js";
import { updateTableContainer, setUpPaginationEventListeners } from "./tablePagination.js";


function drawHaplotypeSNPChart(haplotypeSNPChart, haplotypeData, SNPData) {
    haplotypeSNPChart.setOption(getHaplotypeSNPOption(haplotypeData, SNPData));
}

function drawTranscriptChart(transcriptChart, transcriptData) {
    transcriptChart.setOption(getTranscriptOption(transcriptData));
}

// 设置柱子的焦点（添加边框颜色显示焦点）
/*
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
*/

function setBarFocus(dataArray, index, borderColor) {
    let itemStyle = {
        borderWidth: 5,
        borderColor: borderColor,
        borderType: "solid",
        opacity: 1
    }
    // 检查dataArray[index]是否已经是一个对象并且具有value和itemStyle属性
    if (dataArray[index] && dataArray[index].hasOwnProperty('value') && dataArray[index].hasOwnProperty('itemStyle')) {
        // dataArray[index]已经是一个对象，只添加属性, 其他属性保持不变
        dataArray[index].itemStyle.borderWidth = itemStyle.borderWidth;
        dataArray[index].itemStyle.borderColor = itemStyle.borderColor;
        dataArray[index].itemStyle.borderType = itemStyle.borderType;
        dataArray[index].itemStyle.opacity = itemStyle.opacity;
    } else {
        // dataArray[index]是一个数组或其他，创建一个新对象
        const newData = {
            value: dataArray[index], // 如果是数组，则直接使用；如果不是，此操作将创建一个包含原始数据的数组
            itemStyle: itemStyle
        };
        dataArray[index] = newData; // 更新dataArray[index]为新对象
    }
    return dataArray;
}

// 设置柱子的颜色
function setBarColor(dataArray, index, color) {
    let itemStyle = {
        color: color
    }
    // 检查dataArray[index]是否已经是一个对象并且具有value和itemStyle属性
    if (dataArray[index] && dataArray[index].hasOwnProperty('value') && dataArray[index].hasOwnProperty('itemStyle')) {
        // dataArray[index]已经是一个对象，只更新边框颜色
        dataArray[index].itemStyle.color = itemStyle.color;
    } else {
        // dataArray[index]是一个数组或其他，创建一个新对象
        const newData = {
            value: dataArray[index], // 如果是数组，则直接使用；如果不是，此操作将创建一个包含原始数据的数组
            itemStyle: itemStyle
        };
        dataArray[index] = newData; // 更新dataArray[index]为新对象
    }
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




async function clickHaplotypeSNPChartsEvents(params) {
    console.log('clickHaplotypeSNPChartsEvents events');
    console.log(params);

    let seriesName = params.seriesName; // 与option中的series.name对应
    let areaType = params.name; // 与option中的y轴名称对应



    let haplotypeObjectData = getData('haplotypeObjectData');
    let SNPObjectData = getData('SNPObjectData');

    let ObjectData = seriesName === 'haplotype' ? haplotypeObjectData : SNPObjectData;
    // console.log(ObjectData);
    let currentClickedData;

    if (seriesName === 'haplotype') { // filter 会返回一个包含查询结果的对象数组，用[0]取出查询数据：[{...}] => {...}
        currentClickedData = ObjectData.filter(item => item.areaType === areaType)[0]; // 取出与当前点击的haplotypeID对应的数据
    } else { // 取出前点击的SNP位点的SNPSite对应的SNP数据，这里使用value而不用data是因为data可能会成为一个对象数组附加其他绘图属性，但是value就是纯粹的绘图数据，另外，这里不使用mosaicID && SNPSite的方式是因为ObjectData只会存储当前mosaicID的数据
        currentClickedData = ObjectData.filter(item => item.SNPSite === params.value[2])[0];
    }
    // console.log(data);

    let ResultDetailsData = { type: seriesName, data: currentClickedData };
    let haplotype_SNP_result_details_container = document.querySelector('#haplotype_SNP_result_details_container');
    updateResultDetailsContainer(ResultDetailsData, haplotype_SNP_result_details_container);



    let haplotypeArrayData = getData('haplotypeArrayData');
    console.log(haplotypeArrayData);
    let transcriptArrayData = getData('transcriptArrayData');
    console.log(transcriptArrayData);
    // 如果点击的是mosaic的柱子（且点击的不是SNP），那么只需要将haplotypeSNPChart的焦点进行更新, 并去除transcriptChart的焦点
    if (seriesName === 'haplotype') {
        if (areaType === 'mosaic') {
            haplotypeArrayData = setBarFocus(haplotypeArrayData, 0, 'red');
            drawHaplotypeSNPChart(haplotypeSNPChart, haplotypeArrayData, getData('SNPArrayData'));
        } else {
            // 如果点击的是haplotype的柱子，那么需要将transcriptChart的焦点和柱颜色进行更新，
            // 更新transcript的数据集，更新transcript的pagination，更新details container

            // 将当前点击的ECharts的参数保存到haplotypeEchartParams中
            // 注意：只有点击的是haplotype的柱子时，才会更新haplotypeEchartParams，否则如果点击mosaic时也更新，那么当再次点击可变剪接时，可变剪接图像中的单倍型颜色就会变成与mosaic一样
            updateData('haplotypeEchartParams', params);

            let searchKeywordGene = currentClickedData.geneID; // 根据点击的haplotype数据获取geneID，然后根据geneID获取transcript数据
            // console.log(searchKeywordGene);
            let transcriptRawData = await fetchAllData('transcript', searchKeywordGene);
            // console.log(transcriptRawData);
            updateData('transcript', transcriptRawData);

            transcriptArrayData = getData('transcriptArrayData'); // 获取更新之后的数组
            console.log(transcriptArrayData);
            haplotypeArrayData = setBarFocus(haplotypeArrayData, params.dataIndex, 'red');
            transcriptArrayData = setBarFocus(transcriptArrayData, 0, 'red');
            transcriptArrayData = setBarColor(transcriptArrayData, 0, params.color);

            // 更新transcript的pagination
            let transcript_table_container = document.querySelector('#transcript_table_container'); // 获取相应id的表格容器
            // console.log(transcript_table_container);
            updateTableContainer('transcriptPagination', searchKeywordGene, 1, transcript_table_container); // 初始化表格

            // 更新transcript 的details container
            let transcriptResultDetailsData = { type: transcriptRawData.type, data: transcriptRawData.data[1] }; // 获取第一个可变剪接的信息
            let transcript_result_details_container = document.querySelector('#transcript_result_details_container'); // 获取transcript的result details容器
            updateResultDetailsContainer(transcriptResultDetailsData, transcript_result_details_container); // 初始化result details容器

            drawHaplotypeSNPChart(haplotypeSNPChart, haplotypeArrayData, getData('SNPArrayData'));
            drawTranscriptChart(transcriptChart, transcriptArrayData);
        }
    }
}

function clickTranscriptChartEvents(params) {
    console.log('clickTranscriptChartEvents events');
    console.log(params);


    let seriesName = params.seriesName; // 与option中的series.name对应
    let transcriptIndex = params.name; // 与option中的y轴名称对应
    let startSite = params.value[5];
    let endSite = params.value[6];

    let transcriptObjectData = getData('transcriptObjectData');

    let exonAndIntronData = transcriptObjectData.filter(item => item.transcriptIndex === transcriptIndex); // 取出与当前点击的transcriptIndex对应的数据(一个transcriptIndex可能对应多个数据，因为一个可变剪接展示了外显子和内含子)
    console.log(exonAndIntronData);

    let clickedAreaData = exonAndIntronData.filter(item => item.start === startSite && item.end === endSite)[0]; // 取出与当前点击的区域对应的数据
    console.log(clickedAreaData);

    // 更新details container
    let ResultDetailsData = { type: seriesName, data: clickedAreaData };
    let transcript_result_details_container = document.querySelector('#transcript_result_details_container');
    updateResultDetailsContainer(ResultDetailsData, transcript_result_details_container);

    // 修改transcriptChart的焦点
    // 按照transcriptIndex、startSite、endSite来查找该数据在transcriptObjectData中的下标
    const clickedAreaIndex = transcriptObjectData.findIndex(item =>
        item.transcriptIndex === transcriptIndex &&
        item.start === startSite &&
        item.end === endSite
    );
    console.log(clickedAreaIndex);
    let transcriptArrayData = getData('transcriptArrayData');
    console.log(transcriptArrayData);
    transcriptArrayData = setBarFocus(transcriptArrayData, clickedAreaIndex, 'red');
    console.log(transcriptArrayData);
    transcriptArrayData = setBarColor(transcriptArrayData, clickedAreaIndex, params.color);
    console.log(transcriptArrayData);

    // 如果点击了可变剪接的柱子，那么transcriptArrayData又会被刷新，此时要保证可变剪接图像中的单倍型颜色保持不变
    if (transcriptIndex !== 'haplotype') {
        let haplotypeEchartParamsData = getData('haplotypeEchartParamsData');
        console.log(haplotypeEchartParamsData);
        transcriptArrayData = setBarColor(transcriptArrayData, 0, haplotypeEchartParamsData.color);
    }

    drawTranscriptChart(transcriptChart, transcriptArrayData);


}

export { drawHaplotypeSNPChart, drawTranscriptChart, setBarFocus, setBarColor, initialBarColorSync, clickHaplotypeSNPChartsEvents, clickTranscriptChartEvents };