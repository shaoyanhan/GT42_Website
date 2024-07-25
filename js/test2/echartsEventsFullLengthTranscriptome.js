
import { updateResultDetailsContainer } from './resultDetailsContainer.js';
import { getHaplotypeOption } from "./echartsOptionHaplotype.js";
import { getTranscriptOption } from "./echartsOptionTranscript.js";
// import { getHeatmapOption } from "./echartsOptionHeatmap.js"; 
import { haplotypeChart, transcriptChart } from './mainFullLengthTranscriptome.js';
// import { orthologHeatmapChart } from "./mainGeneExpressionProfile.js"; 不能导入, 会产生实例未定义的错误
import { fetchRawData, fetchPaginationData, updateData, getData } from "./data.js";
import { updateTableContainer, setUpPaginationEventListeners } from "./tablePagination.js";



function drawHaplotypeChart(haplotypeData) {
    haplotypeChart.setOption(getHaplotypeOption(haplotypeData));
}

function drawTranscriptChart(transcriptData) {
    transcriptChart.setOption(getTranscriptOption(transcriptData));
}

// function drawOrthologHeatmap() {
//     orthologHeatmapChart.setOption(getHeatmapOption());
// }

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

// 设置元素的聚焦方式：highlight（直接高亮）、select（需要在option的series中配置select）
function setDispatchAction(echartsInstance, type, dataIndex) {
    echartsInstance.dispatchAction({
        type: type,
        dataIndex: dataIndex
    });
}

// 取消元素的聚焦
function setDownplayAction(echartsInstance, dataIndex) {
    echartsInstance.dispatchAction({
        type: 'downplay',
        dataIndex: dataIndex
    });
}


async function clickHaplotypeChartsEvents(params) {


    console.log('clickHaplotypeChartsEvents events');
    console.log(params);

    let seriesName = params.seriesName; // 与option中的series.name对应
    let geneID = params.name; // 与option中的y轴名称对应
    let areaType = params.value[2]; // 点击的是mosaic还是haplotype

    let haplotypeObjectData = getData('haplotypeObjectData');

    let currentClickedData;

    // 匹配当前点击的geneID对应的行，得到结果格式为：[{}]，然后将结果对象取出
    currentClickedData = haplotypeObjectData.filter(item => item.geneID === geneID)[0]; // 取出与当前点击的haplotypeID对应的数据


    // 更新haplotype result details container
    let ResultDetailsData = { type: seriesName, data: currentClickedData };
    let haplotype_SNP_result_details_container = document.querySelector('#haplotype_SNP_result_details_container');
    updateResultDetailsContainer(ResultDetailsData, haplotype_SNP_result_details_container);

    // let haplotypeArrayData = getData('haplotypeArrayData');
    // console.log(haplotypeArrayData);
    // let transcriptArrayData = getData('transcriptArrayData');
    // console.log(transcriptArrayData);


    // 更新transcript的数据集，更新transcript的pagination，更新details container

    // 将当前点击的ECharts的参数保存到haplotypeEchartParams中
    // 注意：只有点击的是haplotype的柱子时，才会更新haplotypeEchartParams，否则如果点击mosaic时也更新，那么当再次点击可变剪接时，可变剪接图像中的单倍型颜色就会变成与mosaic一样
    // updateData('haplotypeEchartParams', params);

    // 根据点击的区域类型，取出需要展示的transcript数据；对于mosaic展示所有transcript，对于haplotype展示该haplotype对应的transcript
    let transcriptTableType;
    let transcriptPaginationTableType;
    let transcriptSearchKeyword;
    if (areaType === 'mosaic') {
        transcriptTableType = 'allTranscript';
        transcriptPaginationTableType = 'allTranscriptPagination';
        transcriptSearchKeyword = currentClickedData.mosaicID;
    } else {
        transcriptTableType = 'transcript';
        transcriptPaginationTableType = 'transcriptPagination';
        transcriptSearchKeyword = currentClickedData.geneID;
    }
    let transcriptRawData = await fetchRawData(transcriptTableType, transcriptSearchKeyword);
    // console.log(transcriptRawData);
    updateData('transcript', transcriptRawData);

    // 获取更新之后的transcript数组
    let transcriptArrayData = getData('transcriptArrayData');
    // console.log(transcriptArrayData);

    // transcriptArrayData = setBarColor(transcriptArrayData, 0, params.color);

    // 在每次绘制转录本图像之前，取消前一个高亮元素的聚焦效果，因为formerHighlightIndex存储的是上一个高亮元素的dataIndex，但是绘制转录本图像之后，transcript数据会切换为另外一组数据，导致formerHighlightIndex对应的dataIndex元素不再是高亮元素
    let formerHighlightIndex = getData('formerTranscriptHighlightIndex');
    setDownplayAction(transcriptChart, formerHighlightIndex);

    drawTranscriptChart(transcriptArrayData);

    // 设置transcriptChart中第一个exon高亮
    let currentHighlightIndex = 1;
    setDispatchAction(transcriptChart, 'highlight', currentHighlightIndex);
    updateData('formerTranscriptHighlightIndex', currentHighlightIndex); // 更新旧的高亮元素的dataIndex

    // 更新transcript 的result details container
    let transcriptResultDetailsData = { type: transcriptRawData.type, data: transcriptRawData.data[1] }; // 获取第一个可变剪接的信息
    let transcript_result_details_container = document.querySelector('#transcript_result_details_container'); // 获取transcript的result details容器
    updateResultDetailsContainer(transcriptResultDetailsData, transcript_result_details_container); // 初始化result details容器

    // 更新transcript的pagination
    let transcript_table_container = document.querySelector('#transcript_table_container'); // 获取相应id的表格容器
    // console.log(transcript_table_container);
    updateTableContainer(transcriptPaginationTableType, transcriptSearchKeyword, 1, transcript_table_container); // 初始化表格

}

function clickTranscriptChartEvents(params) {


    console.log('clickTranscriptChartEvents events');
    console.log(params);


    let seriesName = params.seriesName; // 与option中的series.name对应
    let yLable = params.name; // 与option中的y轴名称对应
    // 由于绘图的时候为了y轴统一在haplotype末尾添加了'.0'，在这里需要与原始数据矩阵对应
    let splitArray = yLable.split('.');
    let transcriptID = (splitArray[splitArray.length - 1] === '0') ? '--' : yLable;
    let startSite = params.value[5];
    let endSite = params.value[6];

    let transcriptObjectData = getData('transcriptObjectData');

    let exonAndIntronData = transcriptObjectData.filter(item => item.transcriptID === transcriptID); // 取出与当前点击的transcriptID对应的数据(一个transcriptID可能对应多个数据，因为一个可变剪接展示了外显子和内含子)
    console.log(exonAndIntronData);

    let clickedAreaData = exonAndIntronData.filter(item => item.start === startSite && item.end === endSite)[0]; // 取出与当前点击的区域对应的数据
    console.log(clickedAreaData);

    // 更新details container
    let ResultDetailsData = { type: seriesName, data: clickedAreaData };
    let transcript_result_details_container = document.querySelector('#transcript_result_details_container');
    updateResultDetailsContainer(ResultDetailsData, transcript_result_details_container);

    // 修改transcriptChart的焦点
    // 按照transcriptID、startSite、endSite来查找该数据在transcriptObjectData中的下标
    const clickedAreaIndex = transcriptObjectData.findIndex(item =>
        item.transcriptID === transcriptID &&
        item.start === startSite &&
        item.end === endSite
    );
    console.log(clickedAreaIndex);
    let transcriptArrayData = getData('transcriptArrayData');
    console.log(transcriptArrayData);
    // transcriptArrayData = setBarFocus(transcriptArrayData, clickedAreaIndex, 'red');
    // console.log(transcriptArrayData);
    // transcriptArrayData = setBarColor(transcriptArrayData, clickedAreaIndex, params.color);
    // console.log(transcriptArrayData);

    // // 如果点击了可变剪接的柱子，那么transcriptArrayData又会被刷新，此时要保证可变剪接图像中的单倍型颜色保持不变
    // if (transcriptIndex !== 'haplotype') {
    //     let haplotypeEchartParamsData = getData('haplotypeEchartParamsData');
    //     console.log(haplotypeEchartParamsData);
    //     transcriptArrayData = setBarColor(transcriptArrayData, 0, haplotypeEchartParamsData.color);
    // }

    // drawTranscriptChart(transcriptChart, transcriptArrayData);

    // 设置点击的区域高亮
    let currentHighlightIndex = clickedAreaIndex; // 获取当前点击的元素对应的dataIndex
    let formerHighlightIndex = getData('formerTranscriptHighlightIndex'); // 获取旧的高亮元素的dataIndex
    setDownplayAction(transcriptChart, formerHighlightIndex); // 取消前一个高亮元素的聚焦效果，注意这里并没有重绘transcriptChart，因此dataIndex是局限在当前transcript数据集中的，可以确保每次点击都能取消前一个高亮元素的聚焦效果
    setDispatchAction(transcriptChart, 'highlight', currentHighlightIndex); // 设置当前点击的元素高亮
    updateData('formerTranscriptHighlightIndex', currentHighlightIndex); // 更新旧的高亮元素的dataIndex

}

export { drawHaplotypeChart, drawTranscriptChart, setBarFocus, setBarColor, clickHaplotypeChartsEvents, clickTranscriptChartEvents, setDispatchAction, setDownplayAction };