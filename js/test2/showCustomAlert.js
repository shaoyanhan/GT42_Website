let boxTypeToColor = {
    'normal': '#4fb479',
    'warning': '#ffb42c',
    'error': '#e96a6a'
}

let messageQueue = []; // 消息队列

function showCustomAlert(message, boxType = 'normal', duration = 1500) {
    const alertBox = document.createElement('div'); // 动态创建消息框
    alertBox.className = 'custom_alert';
    alertBox.innerText = message; // 设置消息内容
    alertBox.style.backgroundColor = boxTypeToColor[boxType]; // 设置背景颜色

    document.body.appendChild(alertBox); // 添加到页面
    messageQueue.push(alertBox); // 加入队列

    // 动态调整位置
    updateMessagePositions();

    // 定时移除消息
    setTimeout(() => {
        alertBox.classList.add('hide'); // 添加隐藏样式
        setTimeout(() => {
            document.body.removeChild(alertBox); // 从页面移除元素
            messageQueue.shift(); // 从队列中移除
            updateMessagePositions(); // 更新剩余消息的位置
        }, 500); // 与 CSS 的过渡时间一致
    }, duration);
}

// 更新所有消息框的位置
function updateMessagePositions() {
    messageQueue.forEach((alertBox, index) => {
        alertBox.style.top = `${index * 60 + 350}px`; // 每个消息框之间间隔 60px，距离顶部 20px
    });
}

export { showCustomAlert };