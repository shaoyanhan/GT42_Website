import { showCustomAlert } from './showCustomAlert.js';

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

export { createClickToCopyHandler };