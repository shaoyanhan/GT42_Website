// import { initalContentArea } from "./initialContentArea.js";
import { validateGenomeID, getCurrentPageName, fetchGenomeIDList, fetchNextSearchIDData, updateData, getData } from "./data.js";
import { convertDataToTSV, downloadCSV } from "./downloadTable.js";
import { showCustomAlert } from "./showCustomAlert.js";


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
    const searchKeyword = searchInput.value.trim(); // 获取当前搜索框中的ID, trim()方法是用来移除字符串两端的空白符的，包括：空格、制表符（tab）、换行符等

    // 验证搜索关键词
    if (validateSearchForm(searchKeyword)) { // 前端验证格式是否正确
        const response = await validateGenomeID(searchKeyword); // 后端验证ID是否存在
        console.log(response);

        // 确保当前的searchKeyword是有效的，然后再进行后续更新的一系列操作
        if (response && response.status === 'success') {
            // 更新与PreviousID和NextID组件相关的一系列参数，此时由于用户点击了submit按钮，所以currentIDIndex是未知的，需要通过将当前搜索框中的ID当作currentIDIndex查询数据库获取当前ID的index，
            // 然后更新currentIDIndex，这样的话当用户点击submit之后再点击PreviousID或NextID按钮时，就可以根据currentIDIndex来获取上一个或下一个ID的数据
            // 获取select标签中的选中的option的value值
            const select = container.querySelector('.genome_select');
            const selectedValue = select.value;
            const apiType = selectedValue + 'NextID';
            let currentSearchID = searchKeyword;
            let parts = currentSearchID.split('.');
            currentSearchID = parts.length > 1 ? parts[0] : currentSearchID; // 如果输入的ID是geneID或transcriptID，则只取mosaicID部分
            const data = await fetchNextSearchIDData(apiType, currentSearchID);
            updateData('nextIDData', data);


            // 导入当前页面的初始化模块
            const currentPageName = getCurrentPageName();
            const module = await import(`./initialContentArea${currentPageName}.js`);
            // console.log(currentPageName)
            // console.log(module);
            await module.initialContentArea(searchKeyword, response.type);

        } else {
            console.error('Genome ID validation failed', response);
            showAlert(container, 'Genome ID validation failed. Please try again.');
        }
    } else {
        console.error('Invalid search keyword');
        showAlert(container, 'Invalid search keyword. Please try again.');
    }
}


// 定义切换帮助浮窗显示/隐藏的函数
function toggleHelpBox(helpBox) {
    // 使用CSS的display属性来切换显示状态
    if (helpBox.style.display === 'block') {
        helpBox.style.display = 'none';
    } else {
        helpBox.style.display = 'block';
    }
}

// 下载genomeID列表
async function downloadGenomeIDList() {
    showCustomAlert('Converting started!');
    const genomeIDList = await fetchGenomeIDList();
    const tsv = convertDataToTSV(genomeIDList.data);
    const filename = 'genomeID_list.tsv'; // 自定义文件名
    downloadCSV(tsv, filename);
}



// 创建search container事件处理器
function createSearchEventHandler(container) {
    return async function (event) {
        event.preventDefault();
        const target = event.target;
        console.log(target);

        // 用户点击example_id时，填充input框
        if (target.classList.contains('example_id')) {
            fillInputWithExampleID(container, target);
            return;
        }

        // 用户点击submit按钮时，更新与PreviousID和NextID组件相关的一系列参数、执行表单验证和进一步的处理，如果此时helpBox是显示状态，则隐藏
        if (target.classList.contains('submit_button')) {
            await submitSearchForm(container);
            const helpBox = container.querySelector('.help_box');
            helpBox.style.display = 'none';
            return; // 这里不设置return是为了在submitSearchForm执行完之后执行下面隐藏帮助浮窗的代码
        }

        if (target.classList.contains('previous_id_button')) {
            // 获取select标签中的选中的option的value值
            const select = container.querySelector('.genome_select');
            const selectedValue = select.value;
            const apiType = selectedValue + 'NextID';
            const currentIDIndex = getData('currentIDIndex');
            // 为了获取上一个ID的数据，需要获取上上个ID的index，因为后端的currentIDIndex是递增查询的，所以要减2
            const previousOfPreviousID = currentIDIndex - 2;
            const data = await fetchNextSearchIDData(apiType, previousOfPreviousID);

            updateData('nextIDData', data);

            // 修改search_input的值
            const searchInput = container.querySelector('.search_input');
            searchInput.value = getData('nextSearchID');

            await submitSearchForm(container);

            const helpBox = container.querySelector('.help_box');
            helpBox.style.display = 'none';
            return; // 这里不设置return是为了在submitSearchForm执行完之后执行下面隐藏帮助浮窗的代码
        }

        // 用户点击NextID按钮时，获取下一个ID的数据，执行与上一个if块相同的操作
        if (target.classList.contains('next_id_button')) {
            // 获取select标签中的选中的option的value值
            const select = container.querySelector('.genome_select');
            const selectedValue = select.value;
            const apiType = selectedValue + 'NextID';
            const currentIDIndex = getData('currentIDIndex');
            const data = await fetchNextSearchIDData(apiType, currentIDIndex);

            updateData('nextIDData', data);

            // 修改search_input的值
            const searchInput = container.querySelector('.search_input');
            searchInput.value = getData('nextSearchID');

            await submitSearchForm(container);

            const helpBox = container.querySelector('.help_box');
            helpBox.style.display = 'none';
            return; // 这里不设置return是为了在submitSearchForm执行完之后执行下面隐藏帮助浮窗的代码

        }

        // 用户点击帮助图标时，切换帮助浮窗的显示状态
        if (target.classList.contains('help_icon')) {
            const helpBox = container.querySelector('.help_box');
            toggleHelpBox(helpBox);
            return;
        }

        // 用户点击.download_button时，下载数据
        if (target.classList.contains('download_button')) {
            // console.log('Download button clicked');
            downloadGenomeIDList();
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

export { validateSearchForm, submitSearchForm, createSearchEventHandler, setUpSearchEventListeners };
