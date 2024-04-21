// import { initalContentArea } from "./initialContentArea.js";
import { validateGenomeID, getCurrentPageName } from "./data.js";

// function validateSearchForm(searchKeyword) {
//     // var input = document.getElementById('search_input').value;

//     var mosaicPattern = /^GT42G\d{6}$/;
//     var genePattern = /^GT42G\d{1,6}\.[A-Z]{2}\.\d{1,2}$/;
//     var transcriptPattern = /^GT42G\d{1,6}\.[A-Z]{2}\.\d{1,2}\.\d{1,2}$/;

//     if (mosaicPattern.test(searchKeyword)) {
//         // 输入符合mosaicID的格式
//         alert("Valid mosaicID format");
//         return true;
//     } else if (genePattern.test(searchKeyword)) {
//         // 输入符合geneID的格式
//         alert("Valid geneID format");
//         return true;
//     } else if (transcriptPattern.test(searchKeyword)) {
//         // 输入符合transcriptID的格式
//         alert("Valid transcriptID format");
//         return true;
//     } else {
//         // 输入不符合任何已知的格式
//         alert("Invalid ID format. Please enter a valid ID.");
//         return false;
//     }
// }

function showAlert(container, message) {
    console.log("showAlert is called"); // 确认函数被调用
    const alertBox = container.querySelector('.search_alert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    // Hide the alert box after 2 seconds
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);

}


function validateSearchForm(searchKeyword) {
    var mosaicPattern = /^GT42G\d{6}$/; // mosaicID的格式：GT42G000001
    var xenologousPattern = /^GT42G\d{6}\.[A-Z]{2}$/; // xenologousID的格式：GT42G000001.SO
    var genePattern = /^GT42G\d{1,6}\.(?:[A-Z]{2}|0)\.\d{1,2}$/; // geneID的格式：GT42G000001.SO.1，加入了mosaic别名的情况：GT42G000001.0.0
    var transcriptPattern = /^GT42G\d{1,6}\.[A-Z]{2}\.\d{1,2}\.\d{1,2}$/; // transcriptID的格式：GT42G000001.SO.1.1，已经包括了gene别名的情况：GT42G000001.SO.1.0

    // 检查是否匹配任何一个格式
    var isValid = mosaicPattern.test(searchKeyword) ||
        xenologousPattern.test(searchKeyword) ||
        genePattern.test(searchKeyword) ||
        transcriptPattern.test(searchKeyword);

    // if (isValid) {
    //     console.log("Valid ID format"); // 或者使用其他方式提供反馈
    // } else {
    //     alert("Invalid ID format. Please enter a valid ID."); // 考虑使用更友好的反馈方式
    // }

    return isValid;
}


// 用户点击example_id时，填充input框
function fillInputWithExampleID(container, target) {
    const searchInput = container.querySelector('.search_input');
    searchInput.value = target.getAttribute('data_value');
}

// 用户点击submit按钮时，执行表单验证和进一步的处理
async function submitSearchForm(container) {
    console.log("submitSearchForm is called"); // 确认方法被调用
    const searchInput = container.querySelector('.search_input');
    const searchKeyword = searchInput.value.trim(); // trim()方法是用来移除字符串两端的空白符的，包括：空格、制表符（tab）、换行符等

    // 验证搜索关键词
    if (validateSearchForm(searchKeyword)) { // 前端验证格式是否正确
        const response = await validateGenomeID(searchKeyword); // 后端验证ID是否存在
        console.log(response);

        if (response && response.status === 'success') {
            // 导入当前页面的初始化模块
            const currentPageName = getCurrentPageName();
            const module = await import(`./initialContentArea${currentPageName}.js`);
            // console.log(currentPageName)
            // console.log(module);
            await module.initalContentArea(searchKeyword, response.type);
        } else {
            console.error('Validation failed', response);
            showAlert(container, 'Validation failed. Please try again.');
        }
    } else {
        console.error('Invalid search keyword');
        showAlert(container, 'Invalid search keyword. Please try again.');
    }
}

// 创建search container事件处理器
function createSearchEventHandler(container) {
    return async function (event) {
        event.preventDefault();
        const target = event.target;

        // 用户点击example_id时，填充input框
        if (target.classList.contains('example_id')) {
            fillInputWithExampleID(container, target);
            return;
        }

        // 用户点击submit按钮时，执行表单验证和进一步的处理
        if (target.classList.contains('submit_button')) {
            await submitSearchForm(container);
            return;
        }
    };
}



// 设置search container事件监听器
function setUpSearchEventListeners(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error('Search container not found!');
        return;
    }
    const eventHandler = createSearchEventHandler(container);
    container.addEventListener('click', eventHandler);
}

export { validateSearchForm, createSearchEventHandler, setUpSearchEventListeners };
