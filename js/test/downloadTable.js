import { getData } from "./data.js";
import { showCustomAlert } from "./showCustomAlert.js";

// 建立buttonID到getData函数的参数的映射
let idToType = {
    '#download_haplotype_table': 'haplotypeObjectData',
    '#download_SNP_table': 'SNPObjectData',
    '#download_transcript_table': 'transcriptObjectData',
};

// 将数据转换为CSV格式
function convertDataToCSV(data) {
    // console.log('Converting started!')
    // showCustomAlert('Converting started!');
    const headers = Object.keys(data[0]);
    const csvRows = data.map(row =>
        headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
    );
    csvRows.unshift(headers.join(',')); // 将标题行添加到CSV的最前面
    return csvRows.join('\n');

    function replacer(key, value) {
        return value === null ? '' : value; // 将null转换为空字符串
    }
}

// 将数据转换为TSV格式
function convertDataToTSV(data) {
    // console.log('Converting started!')
    // showCustomAlert('Converting started!');
    const headers = Object.keys(data[0]);
    const tsvRows = data.map(row =>
        headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join('\t') // 使用制表符作为分隔符
    );
    tsvRows.unshift(headers.join('\t')); // 将标题行添加到TSV的最前面
    return tsvRows.join('\n');

    function replacer(key, value) {
        // 处理数据中的特殊情况，例如将null转换为空字符串
        return value === null ? '' : value;
    }
}

// 下载CSV文件
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function setupDownloadButton(buttonId) {
    const button = document.querySelector(buttonId);
    if (!button) {
        console.error('button container not found!');
        return;
    }
    button.addEventListener('click', () => {
        const type = idToType[buttonId];
        console.log(type);
        const data = getData(type);
        showCustomAlert('Converting started!'); // 目前只有下载完成的一瞬间会显示，需要优化
        const csv = convertDataToCSV(data);
        const filename = type + '_table.csv'; // 自定义文件名
        downloadCSV(csv, filename);
    });
}

export { setupDownloadButton, convertDataToCSV, convertDataToTSV, downloadCSV };
