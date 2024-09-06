import { getData } from './data.js';

function downloadFile(fileData, fileName, fileType) {
    // 支持的文件格式
    const supportedFileTypes = ['txt', 'tsv', 'csv', 'json'];

    // 检查 fileType 是否受支持
    if (!supportedFileTypes.includes(fileType)) {
        console.error(`Unsupported file type: ${fileType}`);
        return;
    }

    // 处理不同文件类型的数据转换
    let fileContent;
    let mimeType;

    switch (fileType) {
        case 'txt':
            fileContent = formatAsText(fileData);
            mimeType = 'text/plain';
            break;
        case 'tsv':
            fileContent = formatAsTSV(fileData);
            mimeType = 'text/tab-separated-values';
            break;
        case 'csv':
            fileContent = formatAsCSV(fileData);
            mimeType = 'text/csv';
            break;
        case 'json':
            if (typeof fileData !== 'object') {
                console.error('Invalid data format for JSON');
                return;
            }
            fileContent = JSON.stringify(fileData, null, 2);
            mimeType = 'application/json';
            break;
        default:
            console.error(`Unhandled file type: ${fileType}`);
            return;
    }

    // 创建 Blob 对象并触发下载
    const blob = new Blob([fileContent], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 各种格式化处理函数
function formatAsText(data) {
    // 假设 data 是一个字符串或者数组
    if (typeof data === 'string') {
        return data;
    } else if (Array.isArray(data)) {
        return data.join('\n');
    } else {
        console.error('Invalid data format for TXT');
        return '';
    }
}

function formatAsTSV(data) {
    // 假设 data 是二维数组
    if (Array.isArray(data) && data.every(row => Array.isArray(row))) {
        return data.map(row => row.join('\t')).join('\n');
    } else {
        console.error('Invalid data format for TSV');
        return '';
    }
}

function formatAsCSV(data) {
    // 假设 data 是二维数组
    if (Array.isArray(data) && data.every(row => Array.isArray(row))) {
        return data.map(row => row.join(',')).join('\n');
    } else {
        console.error('Invalid data format for CSV');
        return '';
    }
}

// 定义全局或在函数作用域内的事件处理程序引用，与下列setUpDownloadBlastResultFileEventListeners联用，主要是为了存储旧的事件处理程序引用，以便在更新事件处理程序时移除旧的事件处理程序
let downloadPairwiseAlignmentHandler;
let downloadDetailedTableHandler;
let downloadComprehensiveJSONHandler;
// 已弃用
async function setUpDownloadBlastResultFileEventListeners() {
    // 清除select_download_type下载列表中注册的旧的下载事件
    const downloadPairwiseAlignmentFile = document.getElementById('download_format0_pairwise_alignment_result');
    const downloadDetailedValueTableFile = document.getElementById('download_format7_detailed_value_table_result');
    const downloadComprehensiveJSONFile = document.getElementById('download_format15_comprehensive_JSON_result');

    // 如果已经有旧的处理器，移除它们
    if (downloadPairwiseAlignmentHandler) {
        downloadPairwiseAlignmentFile.removeEventListener('click', downloadPairwiseAlignmentHandler);
    }
    if (downloadDetailedTableHandler) {
        downloadDetailedValueTableFile.removeEventListener('click', downloadDetailedTableHandler);
    }
    if (downloadComprehensiveJSONHandler) {
        downloadComprehensiveJSONFile.removeEventListener('click', downloadComprehensiveJSONHandler);
    }

    // 获取文件数据
    const blastResultPairwiseAlignment = await getData('blastResultPairwiseAlignment');
    const blastResultDetailedTable = await getData('blastResultDetailedTable');
    const blastResultJSONArray = await getData('blastResultSingleJSON');
    const blastResultJSON = {
        "BlastOutput2": blastResultJSONArray
    }

    // 向select_download_type下载列表中注册下载事件
    downloadPairwiseAlignmentHandler = () => downloadFile(blastResultPairwiseAlignment, 'pairwise_alignment_result', 'txt');
    downloadDetailedTableHandler = () => downloadFile(blastResultDetailedTable, 'detailed_value_table_result', 'txt');
    downloadComprehensiveJSONHandler = () => downloadFile(blastResultJSON, 'comprehensive_JSON_result', 'json');

    downloadPairwiseAlignmentFile.addEventListener('click', downloadPairwiseAlignmentHandler);
    downloadDetailedValueTableFile.addEventListener('click', downloadDetailedTableHandler);
    downloadComprehensiveJSONFile.addEventListener('click', downloadComprehensiveJSONHandler);
}

// 为下载文件设置事件监听器
async function setUpDownloadFileEventListeners(eventContainer, eventHandler, fileData, fileName, fileType) {
    // 如果已经有旧的处理器，移除它们
    if (eventHandler) {
        eventContainer.removeEventListener('click', eventHandler);
        console.log('Removed old event handler');
    }

    // 向select_download_type下载列表中注册下载事件，并生成新的事件处理器，因为外部处理器无法在内部函数中被修改
    const newEventHandler = () => downloadFile(fileData, fileName, fileType);

    // 为事件容器添加新的下载事件监听器
    eventContainer.addEventListener('click', newEventHandler);

    // 返回新的事件处理器，用于后续的移除操作
    return newEventHandler;
}

export { downloadFile, setUpDownloadFileEventListeners };