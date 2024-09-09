import { validateGenomeID } from "./data.js";

// 检查URL是否有searchKeyword参数，如果有，返回true，否则返回false
function checkURLSearchKeyword() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('searchKeyword');
}

async function initialContentArea(searchKeyword) {
    // 获取搜索关键词的类型
    const response = await validateGenomeID(searchKeyword);
    let keywordType = response.type;

    // 修改标题的搜索关键词
    const titleKeyword = document.getElementById('title_keyword');
    titleKeyword.innerHTML = searchKeyword;

    // 修改图片容器的链接和及其底部ID栏
    const imageContainer = document.querySelectorAll('.image_container')
    imageContainer.forEach(container => {
        const redirectLink = container.querySelector('.redirect_link');
        const pageName = redirectLink.getAttribute('page-name');

        // 为不同关键词类型禁用页面跳转功能
        if (keywordType === 'xenologous' && pageName === 'fullLengthTranscriptome' ||
            keywordType === 'transcript' && pageName === 'singleCoExpressionNetwork') {
            container.classList.add('disabled');
        }

        // 修改链接及其容器底部ID栏
        redirectLink.href = `./${pageName}.html?searchKeyword=${searchKeyword}`;
        const idContainer = container.querySelector('.open_id_title');
        idContainer.innerHTML = `Open With: ${searchKeyword}`;
    });
}

// 针对于URL是否有searchKeyword参数的情况，进行不同的初始化操作
function initialBasedOnURLSearchKeyword() {
    let searchKeyword;
    if (checkURLSearchKeyword()) {
        // 如果URL中有searchKeyword参数，那么使用searchKeyword参数初始化页面
        // http://127.0.0.1:5501/html/test/fullLengthTranscriptome.html?searchKeyword=GT42G000002
        searchKeyword = new URLSearchParams(window.location.search).get('searchKeyword');

        // 找到搜索框组件，注意这里由于响应式，有两个搜索框组件
        const searchContainer = document.querySelectorAll('.search_box_container');

        // // 将searchKeyword填充到搜索框中
        // searchContainer.forEach(container => {
        //     const searchInput = container.querySelector('input');
        //     searchInput.value = searchKeyword;
        // });

    } else {
        // 如果URL中没有searchKeyword参数，那么使用默认的初始化页面
        searchKeyword = 'GT42G000001';
    }

    // 初始化内容区域
    initialContentArea(searchKeyword);
}

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initialBasedOnURLSearchKeyword();
});