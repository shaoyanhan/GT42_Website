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
        // columns.forEach(column => {
        //     const td = document.createElement('td');
        //     td.textContent = column.trim();
        //     tr.appendChild(td);
        // });
        // 第二列元素的subjectID创建为链接元素再填写到td中，其余列元素直接填写到td中：
        // <a href="./searchBox.html?searchKeyword=${objectData.subject_id}" target="_blank" class="result_details_dynamic_link" data-replace="${objectData.subject_id}" title="click to resource page">
        //     <span>${objectData.subject_id}</span>
        // </a>
        const columnTitleAttr = ['Query sequence ID', 'click to resource page', 'Percentage of identical matches', 'Alignment length', 'Number of mismatches', 'Number of gap openings', 'Start of alignment in query', 'End of alignment in query', 'Start of alignment in subject', 'End of alignment in subject', 'Expect value', 'Bit score', 'Query frame / Subject frame'];
        columns.forEach((column, index) => {
            let columnText = column.trim();
            const td = document.createElement('td');
            if (index === 1) {
                const a = document.createElement('a');
                a.href = `./searchBox.html?searchKeyword=${columnText}`;
                a.target = '_blank';
                a.classList.add('table_dynamic_link');
                a.dataset.replace = columnText;
                a.title = columnTitleAttr[1];
                const span = document.createElement('span');
                span.textContent = columnText;
                a.appendChild(span);
                td.appendChild(a);
            } else {
                td.textContent = columnText.trim();
                td.title = columnTitleAttr[index];
            }
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
    const queryIDList = getData('blastQueryIDList');
    console.log('queryIDList:', queryIDList);

    // 设置下载总的blast结果文件的事件监听器，如果当前query没有结果，那也有没有结果的文件可以下载
    setUpRawBlastResultFileDownloadEvents();

    let queryTableStringList = getData('blastResultQueryTableStringList');
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


// 将按照换行符拆分为字符串列表的元素利用换行符连接还原回原始字符串
function joinStringListByLineBreak(stringList) {
    let resultString = '';
    stringList.forEach(string => {
        // 每个字符串后面都加上换行符，如果原本是换行符，则在列表里就是''，加上之后还原为'\n'
        resultString += string + '\n';
    });
    return resultString;
}


// 从format0的结果中提取出指定queryIndex的结果
function splitPairwiseAlignmentResultByIndex(resultData, queryIndex) {
    let resultRows = resultData.split('\n');

    // 首先存储文件头部信息
    let headerRows = [];
    // 遍历resultRows，找到第一个以"Query= "开头的行，将其之前的行存储到headerRows中
    let headerEndIndex = 0;
    for (let i = 0; i < resultRows.length; i++) {
        if (resultRows[i].startsWith('Query= ')) {
            headerEndIndex = i;
            break;
        }
        headerRows.push(resultRows[i]);
    }

    // 存储queryIndex对应的结果
    let queryResultCount = 0;
    let queryIndexResultRows = [];
    // 以刚才找到的headerEndIndex为起点，遍历resultRows，找到第queryIndex个以"Query= "开头的行
    for (let i = headerEndIndex; i < resultRows.length; i++) {
        if (resultRows[i].startsWith('Query= ')) {
            if (queryResultCount === queryIndex) {
                // 从当前行开始，找到当前Query结果部分的结束行，将这些行存储到queryIndexResultRows中
                for (let j = i; j < resultRows.length; j++) {
                    queryIndexResultRows.push(resultRows[j]);
                    if (resultRows[j].startsWith('Effective search space used: ')) {
                        break;
                    }
                }
                break;
            }
            queryResultCount++;
        }
    }

    // 存储文件尾部信息
    let footerRows = [];
    // 从后往前遍历resultRows，找到第一个以"Effective search space used: "开头的行，将其之后的行存储到footerRows中
    let footerStartIndex = 0;
    for (let i = resultRows.length - 1; i >= 0; i--) {
        if (resultRows[i].startsWith('Effective search space used: ')) {
            footerStartIndex = i + 1;
            break;
        }
    }
    for (let i = footerStartIndex; i < resultRows.length; i++) {
        footerRows.push(resultRows[i]);
    }

    // 将数组元素用换行符连接，恢复为原始字符串
    let headerString = joinStringListByLineBreak(headerRows);
    let queryIndexResultString = joinStringListByLineBreak(queryIndexResultRows);
    let footerString = joinStringListByLineBreak(footerRows);
    let resultString = headerString + queryIndexResultString + footerString;

    return resultString;
}

// 从format7的结果中提取出指定queryIndex的结果
function splitDetailedTableResultByIndex(resultData, queryIndex) {
    let resultRows = resultData.split('\n');

    // 遍历resultRows，找到以"Query: "开头的行并计数
    let queryResultCount = 0;
    let queryIndexResultRows = [];
    for (let i = 0; i < resultRows.length; i++) {
        if (resultRows[i].startsWith('# Query:')) {
            if (queryResultCount === queryIndex) {
                console.log('queryResultCount === queryIndex:', queryIndex);
                queryIndexResultRows.push(resultRows[i - 1]); // 存储标题行
                queryIndexResultRows.push(resultRows[i]); // 存储第一行

                // 从下一行开始，找到当前Query结果部分的结束行，将这些行存储到queryIndexResultRows中
                for (let j = i + 1; j < resultRows.length; j++) {
                    // 没有query结果的情况
                    if (resultRows[j].startsWith('# 0 hits found')) {
                        queryIndexResultRows.push(resultRows[j]);
                        break;
                    }
                    // 有Query结果，且位于文件中部的情况
                    if (resultRows[j].startsWith('# Query:')) {
                        // 删除queryIndexResultRows的最后一个元素，因为这个元素是下一个Query的标题行
                        queryIndexResultRows.pop();
                        break;
                    }
                    // 位于文件末尾的情况
                    if (resultRows[j].startsWith('# BLAST processed')) {
                        break;
                    }
                    queryIndexResultRows.push(resultRows[j]);
                }
                break;
            }
            queryResultCount++;
        }
    }

    // 将数组元素用换行符连接，恢复为原始字符串
    let resultString = joinStringListByLineBreak(queryIndexResultRows);

    return resultString;
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

    // 接收到数据之后，按照currentQueryIndex切分并得到相应下载数据
    // 获取文件数据
    const currentQueryIndex = getData('currentBlastResultQueryIndex');

    const blastResultPairwiseAlignment = getData('blastResultPairwiseAlignment');
    const blastResultPairwiseAlignmentByIndex = splitPairwiseAlignmentResultByIndex(blastResultPairwiseAlignment, currentQueryIndex);

    const blastResultDetailedTable = getData('blastResultDetailedTable');
    const blastResultDetailedTableByIndex = splitDetailedTableResultByIndex(blastResultDetailedTable, currentQueryIndex);

    const blastResultJSONArray = getData('blastResultSingleJSON');
    const blastResultJSONByIndex = {
        "BlastOutput2": blastResultJSONArray[currentQueryIndex]
    }

    // 注册下载事件并更新事件处理器，必须使用await等待，否则依旧会出现事件累积
    downloadPairwiseAlignmentHandler = await setUpDownloadFileEventListeners(downloadPairwiseAlignmentFile, downloadPairwiseAlignmentHandler, blastResultPairwiseAlignmentByIndex, 'pairwise_alignment_result', 'txt');
    downloadDetailedTableHandler = await setUpDownloadFileEventListeners(downloadDetailedValueTableFile, downloadDetailedTableHandler, blastResultDetailedTableByIndex, 'detailed_value_table_result', 'txt');
    downloadComprehensiveJSONHandler = await setUpDownloadFileEventListeners(downloadComprehensiveJSONFile, downloadComprehensiveJSONHandler, blastResultJSONByIndex, 'comprehensive_JSON_result', 'json');
}


export { initialContentArea, setUpQueryResultSelectEventListeners, splitDetailedTableResultByIndex };