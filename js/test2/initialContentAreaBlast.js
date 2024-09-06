import { getData, updateData } from './data.js';
import { drawAllHitsBarPlot } from './echartsEventsBlast.js';
import { updateAllHitsAlignDetails } from './blastAllHitsAlignEvents.js';
import { setUpDownloadFileEventListeners } from './downloadFile.js';


function updateTableItems(data) {
    const table = document.getElementById('all_hits_table');
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = '';
    const rows = data.split('\n');
    rows.forEach(row => {
        const columns = row.split('\t');
        const tr = document.createElement('tr');
        columns.forEach(column => {
            const td = document.createElement('td');
            td.textContent = column.trim();
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function updateTableFooter(data) {
    const tableFooterContainer = document.getElementById('all_hits_table_footer');
    console.log('tableFooterContainer:', tableFooterContainer);
    tableFooterContainer.innerHTML = '';
    let tableRowNum = data.split('\n').length;
    tableFooterContainer.innerHTML = `<span class="footer_notes"><span>Showing total of ${tableRowNum} hits (HSP included)</span></span>`;
}


async function initialContentArea() {
    console.log('initialContentArea');
    // 获取currentQueryIndex
    let currentQueryIndex = getData('currentBlastResultQueryIndex');

    // 获取queryIDList，填充select的任务不应该由initialContentArea函数完成，因为切换query result时也要调用这个函数
    const queryIDList = await getData('blastQueryIDList');
    console.log('queryIDList:', queryIDList);

    let queryTableStringList = await getData('blastResultQueryTableStringList');
    console.log('queryTableStringList:', queryTableStringList);
    // 获取当前query的结果，如果没有则显示 "No Hits Found" 提示并返回
    const blastResultComponents = document.getElementById('blast_result_components');
    const noHitsFoundContainer = document.getElementById('no_hits_found');
    if (queryTableStringList[currentQueryIndex] === '') {
        blastResultComponents.classList.add('tmp_display_none');
        noHitsFoundContainer.querySelector('p').textContent = `No Hits Found for Query: ${queryIDList[currentQueryIndex]} ...`;
        noHitsFoundContainer.style.display = 'flex';

        return;
    }
    // 如果有结果，则隐藏 "No Hits Found" 提示，显示结果组件
    noHitsFoundContainer.style.display = 'none';
    blastResultComponents.classList.remove('tmp_display_none');

    // 设置下载总的blast结果文件的事件监听器
    setUpRawBlastResultFileDownloadEvents();

    // 绘制all_hits_bar_plot
    // 将queryTableStringList[currentQueryIndex]转化为二维数组
    const queryTableString = queryTableStringList[currentQueryIndex];
    const queryTableArray = queryTableString.split('\n').map(row => row.split('\t'));
    console.log('queryTableArray:', queryTableArray);
    drawAllHitsBarPlot(queryTableArray);

    // 绘制all_hits_table
    updateTableItems(queryTableString);
    updateTableFooter(queryTableString);

    // 一组组地填充all_hits_align_details的数据
    updateAllHitsAlignDetails();

}

// 当select标签切换时的事件处理程序
async function queryResultSelectEventHandler(event) {
    let selectedQueryIndex = event.target.selectedIndex;
    console.log('currentQueryIndex:', selectedQueryIndex);

    updateData('currentBlastResultQueryIndex', selectedQueryIndex);

    initialContentArea();
}

// 设置query result selector的事件监听器
async function setUpQueryResultSelectEventListeners() {
    const queryResultSelect = document.getElementById('result_select');
    queryResultSelect.addEventListener('change', queryResultSelectEventHandler);
}

// 定义全局或在函数作用域内的事件处理程序引用，与下列setUpRawBlastResultFileDownloadEvents联用，主要是为了存储旧的事件处理程序引用，以便在更新事件处理程序时移除旧的事件处理程序
let downloadPairwiseAlignmentHandler;
let downloadDetailedTableHandler;
let downloadComprehensiveJSONHandler;

// 设置下载原始blast结果文件的事件监听器
async function setUpRawBlastResultFileDownloadEvents() {
    // 获取容器元素
    const downloadPairwiseAlignmentFile = document.getElementById('download_format0_pairwise_alignment_result');
    const downloadDetailedValueTableFile = document.getElementById('download_format7_detailed_value_table_result');
    const downloadComprehensiveJSONFile = document.getElementById('download_format15_comprehensive_JSON_result');

    // 获取文件数据
    const blastResultPairwiseAlignment = await getData('blastResultPairwiseAlignment');
    const blastResultDetailedTable = await getData('blastResultDetailedTable');
    const blastResultJSONArray = await getData('blastResultSingleJSON');
    const blastResultJSON = {
        "BlastOutput2": blastResultJSONArray
    }

    // 注册下载事件并更新事件处理器，必须使用await等待，否则依旧会出现事件累积
    downloadPairwiseAlignmentHandler = await setUpDownloadFileEventListeners(downloadPairwiseAlignmentFile, downloadPairwiseAlignmentHandler, blastResultPairwiseAlignment, 'pairwise_alignment_result', 'txt');
    downloadDetailedTableHandler = await setUpDownloadFileEventListeners(downloadDetailedValueTableFile, downloadDetailedTableHandler, blastResultDetailedTable, 'detailed_value_table_result', 'txt');
    downloadComprehensiveJSONHandler = await setUpDownloadFileEventListeners(downloadComprehensiveJSONFile, downloadComprehensiveJSONHandler, blastResultJSON, 'comprehensive_JSON_result', 'json');
}


export { initialContentArea, setUpQueryResultSelectEventListeners };