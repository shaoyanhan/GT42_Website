// 获取所有的menu_button元素
var menuButtons = document.querySelectorAll('.menu_button');

// 为每个元素添加点击事件监听器
menuButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        // 阻止默认的事件行为，如果需要的话
        event.preventDefault();

        // 执行页面跳转
        window.location.href = './FullLenTrans.html';
    });
});
