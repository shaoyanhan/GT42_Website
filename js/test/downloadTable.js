import { getData } from "./data.js";
import { showCustomAlert } from "./showCustomAlert.js";

// 建立buttonID到getData函数的参数的映射
let idToType = {
    '#download_haplotype_table': 'haplotypeObjectData',
    '#download_SNP_table': 'SNPObjectData',
    '#download_transcript_table': 'transcriptObjectData',
};

function convertDataToCSV(data) {
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

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    showCustomAlert('Download started!');
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
        const csv = convertDataToCSV(data);
        const filename = type + '_table.csv'; // 自定义文件名
        downloadCSV(csv, filename);
    });
}

export { setupDownloadButton };
