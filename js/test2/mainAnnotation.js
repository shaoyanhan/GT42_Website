import { initialContentArea } from "./initialContentAreaAnnotation.js";
import { validateGenomeID, getData } from "./data.js";
import { showCustomAlert } from "./showCustomAlert.js";
import { downloadFile } from "./downloadFile.js";




// 检查URL是否有searchKeyword参数，如果有，返回true，否则返回false
function checkURLSearchKeyword() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('searchKeyword');
}

// 提交搜索表单
async function submitSearchForm(container) {
    const searchInput = container.querySelector('.search_input');
    const searchKeyword = searchInput.value;

    // 后端验证ID是否存在
    const response = await validateGenomeID(searchKeyword);
    console.log(response);

    if (response && response.status === 'success') {
        initialContentArea(searchKeyword, response.type);

    } else {
        console.error('Genome ID validation failed', response);
        showCustomAlert('Genome ID validation failed. Please try again.', 'error');
    }
}

// 针对于URL是否有searchKeyword参数的情况，进行不同的初始化操作
function initialBasedOnURLSearchKeyword() {
    if (!checkURLSearchKeyword()) {
        initialContentArea('SGI000001.SO.01.01', 'transcript');
        return;
    }

    // 如果URL中有searchKeyword参数，那么使用searchKeyword参数初始化页面
    // http://127.0.0.1:5501/html/test/annotation.html?searchKeyword=SGI000002.SO
    let searchKeyword = new URLSearchParams(window.location.search).get('searchKeyword');

    // 找到搜索框组件
    const searchContainer = document.querySelector('.search_container');

    // 将searchKeyword填充到搜索框中
    let searchInput = searchContainer.querySelector('.search_input');
    searchInput.value = searchKeyword;

    // 提交搜索表单
    submitSearchForm(searchContainer);
}

// 初始化水平tab按钮
function initialTabButtons() {
    const buttons = document.querySelectorAll(".tab_btn");
    const panels = document.querySelectorAll(".tab_panel");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active class from all buttons and panels
            buttons.forEach(btn => btn.classList.remove("active"));
            panels.forEach(panel => panel.classList.remove("active"));

            // Add active class to the clicked button and corresponding panel
            button.classList.add("active");
            const target = button.getAttribute("tab_target");
            const targetID = "result_box_" + target;
            document.getElementById(targetID).classList.add("active");
        });
    });
}


// 仅可以包含字母、数字、下划线、短横线、点号和斜杠，不合法则终止并提示用户
function inputValidation(searchKeyword) {
    const reg = /^[a-zA-Z0-9_\-./]+$/;
    if (!reg.test(searchKeyword)) {
        showCustomAlert('Invalid search keyword! Please enter a valid search keyword.', 'error');
        return false;
    }
    return true;
}

function setUpSearchContainerEventListeners(containerSelector) {
    const searchContainer = document.querySelector(containerSelector);
    const searchInput = searchContainer.querySelector('.search_input');
    const searchButton = searchContainer.querySelector('.search_icon');
    const exampleIDs = searchContainer.querySelectorAll('.example_id');

    // 填充搜索框的值
    exampleIDs.forEach(exampleID => {
        exampleID.addEventListener('click', () => {
            searchInput.value = exampleID.getAttribute('data_value');
        });
    });

    // 表单验证和提交逻辑
    const handleSearch = () => {
        // 获取搜索框的值, 去除首尾的引号和空格
        let searchKeyword = searchInput.value.replace(/^['"]+|['"]+$/g, '').trim();

        if (!searchKeyword) {
            showCustomAlert('Please enter a search keyword!', 'error');
            return;
        }

        if (!inputValidation(searchKeyword)) {
            return;
        }

        submitSearchForm(searchContainer);
    };

    // 按钮点击事件
    searchButton.addEventListener('click', () => {
        console.log("searchButton is clicked");
        handleSearch();
    });

    // 回车键事件
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log("Enter key is pressed");
            handleSearch();
        }
    });
}

function setupDownloadButton() {
    const downloadButton = document.querySelector('.download_btn');
    downloadButton.addEventListener('click', async () => {
        const annotationData = await getData('annotationIsoform');
        const rowList = [];
        // 遍历对象，每一个键值对是一种注释类型
        for (const [typeKey, objList] of Object.entries(annotationData)) {
            // 跳过factor类型以及objList为空数组的情况
            if (typeKey === 'factor' || objList.length === 0) {
                continue;
            }

            rowList.push([typeKey + ' table:']); // 写入类型名称

            const header = Object.keys(objList[0]).filter(key => key !== 'id'); // 写入表头

            rowList.push([header.join('\t')]); // 将表头使用'\t'连接，然后写入rowList

            // 遍历objList对象数组，将每个对象的值取出，跳过id键，然后使用'\t'连接写入rowList
            objList.forEach(obj => {
                // 过滤掉 id 键，拼接值为一行字符串
                const row = Object.keys(obj)
                    .filter(key => key !== "id") // 跳过 id
                    .map(key => obj[key]) // 获取值
                    .join("\t"); // 拼接为字符串
                rowList.push(row); // 将行字符串添加到 rowList
            });

            rowList.push(['']); // 添加一个空行
        }

        // 将rowList转换为字符串
        const dataString = rowList.join('\n');

        const idContainer = document.querySelector('#annotation_id');
        const annotationID = idContainer.innerText;
        const fileName = annotationID + '_annotation';
        // 下载文件
        downloadFile(dataString, fileName, 'txt');
    });

}

function setupResourcePagebutton() {
    const redirectButton = document.querySelector('.resource_btn');
    redirectButton.addEventListener('click', () => {
        const annotationID = document.querySelector('#annotation_id').innerText;
        window.open('./searchBox.html?searchKeyword=' + annotationID);
    });
}

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化页面
    initialBasedOnURLSearchKeyword();
    // 初始化搜索框事件监听
    setUpSearchContainerEventListeners('.search_container');
    // 初始化水平tab按钮
    initialTabButtons();
    // 初始化下载按钮
    setupDownloadButton();
    // 初始化资源页面按钮
    setupResourcePagebutton();
});

// TODO：添加annotation和transcript factor页面的跳转链接，添加动图录制，补充说明文档