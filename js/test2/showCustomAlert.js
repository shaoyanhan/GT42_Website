function showCustomAlert(message, duration = 1500) {
    const alertBox = document.getElementById('customAlert');
    alertBox.innerText = message; // 设置弹窗文本
    alertBox.style.display = 'block'; // 显示弹窗
    // console.log(alertBox);

    // 设置时间后隐藏弹窗
    setTimeout(() => {
        alertBox.style.display = 'none'; // 隐藏弹窗
    }, duration);
}

export { showCustomAlert };