import { getData } from "./data.js";
import { showCustomAlert } from "./showCustomAlert.js";

// 建立buttonID到getData函数的参数的映射
let idToType = {
    '#download_haplotype_table': 'haplotype_data_table_download',
    '#download_SNP_table': 'SNP_data_table_download',
    '#download_transcript_table': 'transcript_data_table_download',
    '#download_orthologous_TPM_table': 'mosaic_TPM_data_table_download',
    '#download_xenologous_TPM_table': 'xenologous_TPM_data_table_download',
    '#download_gene_TPM_table': 'gene_TPM_data_table_download',
    '#download_transcript_TPM_table': 'transcript_TPM_data_table_download',
    '#download_all_transcript_TPM_table': 'all_transcript_TPM_data_table_download',
    '#download_single_network_nodes_table': 'single_network_nodes_table_download',
    '#download_single_network_edges_table': 'single_network_edges_table_download',
    '#download_hub_network_nodes_table': 'downloadHubNetworkNodesTable',
    '#download_hub_network_edges_table': 'downloadHubNetworkEdgesTable',

    '#download_SNP_evidence_table_both': 'SNP_evidence_table_both_download',
    '#download_SNP_evidence_table_iso': 'SNP_evidence_table_iso_download',
    '#download_SNP_evidence_table_rna': 'SNP_evidence_table_rna_download',

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
    button.addEventListener('click', async () => {
        const type = idToType[buttonId];
        console.log(type);

        let alertText = 'Converting started!';

        if (type === 'downloadHubNetworkNodesTable' || type === 'downloadHubNetworkEdgesTable') {
            // 直接转化为访问下载链接的形式，下载前缀为https://cbi.gxu.edu.cn/download/yhshao/GT42_web/network/
            // 获取当前的hub网络类型
            const networkResolution = getData('currentHubNetworkType');
            const networkType = type === 'downloadHubNetworkNodesTable' ? 'nodes' : 'edges';
            const filename = 'gt42_' + networkResolution + '_network_' + networkType + '.tsv';
            const downloadLink = 'https://cbi.gxu.edu.cn/download/yhshao/GT42_web/network/' + filename;
            showCustomAlert(alertText);
            window.open(downloadLink);
            return;
        }

        const data = await getData(type); // 等待 getDownloadHaplotypeTable() 中的异步操作
        showCustomAlert(alertText); // 目前只有下载完成的一瞬间会显示，需要优化

        // const csv = convertDataToCSV(data);
        // const filename = type + '_table.csv'; // 自定义文件名
        // downloadCSV(csv, filename);

        const tsv = convertDataToTSV(data);
        const filename = type + '.tsv'; // 自定义文件名
        downloadCSV(tsv, filename);
    });
}

export { setupDownloadButton, convertDataToCSV, convertDataToTSV, downloadCSV };
