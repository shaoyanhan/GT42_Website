document.addEventListener('DOMContentLoaded', function () {
    // 获取 DOM 元素
    var selectElement = document.getElementById('genome_select');
    var inputElement = document.getElementById('search_input');
    var submitButton = document.getElementById('submit_button');
    var exampleIds = document.querySelectorAll('.example_id');

    // 为示例 ID 添加点击事件监听器
    exampleIds.forEach(function (exampleId) {
        exampleId.addEventListener('click', function () {
            inputElement.value = exampleId.dataset.value;
        });
    });

    // 为提交按钮添加点击事件监听器
    submitButton.addEventListener('click', function () {
        var selectedGenome = selectElement.value;
        var searchId = inputElement.value;
        // 调用你的 JS 脚本函数并传递参数
        performSearch(selectedGenome, searchId);
    });
});

function performSearch(genome, id) {
    // 在这里实现你的搜索逻辑
    console.log('Searching for ID:', id, 'in genome:', genome);
    window.drawFunctions.getHaplotypeDataAndDraw(id);
    // 例如，你可以在这里发送 AJAX 请求到服务器
}