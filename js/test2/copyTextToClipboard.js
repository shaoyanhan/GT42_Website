import { showCustomAlert } from './showCustomAlert.js';
import { fetchRawData2 } from './data.js';

// 将data_sequence里的文本复制到剪贴板
function copyTextToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    navigator.clipboard.writeText(text).then(() => {
        // 可选：提醒用户已复制
        // 成功复制文本后
        showCustomAlert('Text copied to clipboard!');
    }).catch(err => {
        console.error('Error in copying text: ', err);
    });
    document.body.removeChild(textarea);
}

// 使用一个工厂函数来创建一个点击复制按钮的事件处理器
function createClickToCopyHandler() {
    return function (e) {
        if (e.target && e.target.classList.contains('copy_button')) {
            const sequence = e.target.getAttribute('data_sequence');
            copyTextToClipboard(sequence);
        }
    };
}

// haplotype table 中的点击复制需要先请求后端序列数据
async function clickToCopyHandlerHaplotypeTable(e) {
    if (e.target && e.target.classList.contains('copy_button')) {
        const sequenceID = e.target.getAttribute('sequence_id');
        const sequenceType = e.target.getAttribute('sequence_type');
        const response = await fetchRawData2('getSeqWithID', { 'sequenceID': sequenceID, 'sequenceType': sequenceType });
        const responseData = response.data;

        if (responseData.length === 0) {
            showCustomAlert('No sequence data found for the specified ID', 'error');
            return;
        }
        let sequence = responseData[sequenceType];
        copyTextToClipboard(sequence);
    }
}

export { createClickToCopyHandler, clickToCopyHandlerHaplotypeTable };