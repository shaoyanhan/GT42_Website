import { allHitsBarPlot } from "./mainBlast.js";
import { getAllHitsBarPlotOption } from "./echartsOptionAllHitsBarPlot.js";
import { getData } from "./data.js";
import { loadBatchByIndex } from "./blastAllHitsAlignEvents.js";

function drawAllHitsBarPlot(dataArray) {
    let option = getAllHitsBarPlotOption(dataArray);
    allHitsBarPlot.setOption(option);
}

function findSubjectHitIndex(queryTableString, subjectID) {
    let queryTableRows = queryTableString.split('\n');

    let subjectHitIndex = 0;
    let currentSubjectID = queryTableRows[0].split('\t')[1];
    for (let i = 0; i < queryTableRows.length; i++) {
        let columns = queryTableRows[i].split('\t');
        if (columns[1] !== currentSubjectID) {
            currentSubjectID = columns[1];
            subjectHitIndex += 1;
        }
        if (columns[1] === subjectID) {
            break;
        }
    }

    return subjectHitIndex;
}

function scrollToTargetID(targetID) {
    // 获取最外层的 details 元素作为滚动容器，让内部的元素在这个视界内滚动
    let scrollContainer = document.getElementById('blast_result_container');
    let targetElement = document.getElementById(targetID);

    // 使用 scrollIntoView 方法，将 targetElement 滚动到外层 details 的可见区域
    targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
    });

    // 将滚动容器的 scrollTop 设置为目标元素的位置，这里相当于让 targetElement 对齐到距离 scrollContainer 顶部的距离减去 scrollContainer 高度的15%的位置
    scrollContainer.scrollTop = targetElement.offsetTop - scrollContainer.offsetTop - scrollContainer.clientHeight * 0.15;
}


function clickAllHitsBarPlotEventsHandler(params) {
    console.log('clickAllHitsBarPlotEventsHandler:', params);

    // 将带有计数后缀的subjectID的后缀去掉，以便在queryTableString中查找原始的subjectID
    let subjectIDParts = params.value[1].split('.');
    // 合并subjectIDParts中除去最后一个元素的所有元素
    let subjectID = subjectIDParts.length > 2 ? subjectIDParts.slice(0, -1).join('.') : subjectIDParts[0];


    let currentQueryIndex = getData('currentBlastResultQueryIndex');
    let blastResultQueryTableStringList = getData('blastResultQueryTableStringList');
    let queryTableString = blastResultQueryTableStringList[currentQueryIndex];

    // 找到subjectID在queryTableString中的索引
    let subjectHitIndex = findSubjectHitIndex(queryTableString, subjectID);

    // 加载到足够展示subjectHitIndex的数据，防止index指向的数据未加载
    loadBatchByIndex(subjectHitIndex);

    // 移动到id为align_seq_result_container_i的标签
    let targetID = 'align_seq_result_container_' + subjectHitIndex;
    scrollToTargetID(targetID);

}

export { drawAllHitsBarPlot, clickAllHitsBarPlotEventsHandler, scrollToTargetID };