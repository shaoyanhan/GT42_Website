let boxTypeToColor = {
    'normal': '#4fb479',
    'warning': '#ffb42c',
    'error': '#e96a6a'
}

function showCustomAlert(message, boxType = 'normal', duration = 1500) {
    const alertBox = document.getElementById('customAlert'); // 获取弹窗元素
    alertBox.innerText = message; // 设置弹窗文本
    alertBox.style.display = 'block'; // 显示弹窗
    alertBox.style.backgroundColor = boxTypeToColor[boxType]; // 设置弹窗背景颜色
    // console.log(alertBox);

    // 设置时间后隐藏弹窗
    setTimeout(() => {
        alertBox.style.display = 'none'; // 隐藏弹窗
    }, duration);
}

export { showCustomAlert };