import { initialContentArea } from "./initialContentAreaSingleCoExpressionNetwork.js"
import { setUpSearchEventListeners } from "./searchEvents.js";
import { clickSingleCoExpressionNetworkEventsHandler } from "./echartsEventsSingleCoExpressionNetwork.js";
import { setupNetworkSelectorContainerEventsListeners } from "./singleNetworkSelectorContainerEvents.js";
import { setUpSelectEventListeners, setUpSelectWithSelect2 } from "./selectEvents.js";
import { setupDownloadButton } from "./downloadTable.js";
import { validateGenomeID } from "./data.js"
import { submitSearchForm } from "./searchEvents.js";
import { showCustomAlert } from "./showCustomAlert.js";


// export let hubCoExpressionNetworkDOM = document.getElementById('drawHubCoExpressionNetwork');
export let singleCoExpressionNetworkDOM = document.getElementById('drawSingleCoExpressionNetwork');

// export let hubCoExpressionNetworkChart = echarts.init(hubCoExpressionNetworkDOM, null, { renderer: 'canvas' });
export let singleCoExpressionNetworkChart = echarts.init(singleCoExpressionNetworkDOM, null, { renderer: 'canvas' });

// 检查URL是否有searchKeyword参数，如果有，返回true，否则返回false
function checkURLSearchKeyword() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('searchKeyword');
}

// 针对于URL是否有searchKeyword参数的情况，进行不同的初始化操作
function initialBasedOnURLSearchKeyword() {
    if (checkURLSearchKeyword()) {
        // 如果URL中有searchKeyword参数，那么使用searchKeyword参数初始化页面
        let searchKeyword = new URLSearchParams(window.location.search).get('searchKeyword');

        // 找到搜索框组件
        const searchContainer = document.querySelector('#content_area_search_container');

        // 将searchKeyword填充到搜索框中
        let searchInput = searchContainer.querySelector('#search_input');
        searchInput.value = searchKeyword;

        // 提交搜索表单
        submitSearchForm(searchContainer);
    } else {
        // 如果URL中没有searchKeyword参数，那么使用默认的mosaicID初始化页面
        initialContentArea('SGI000001', 'mosaic');
    }
}

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', async () => {
    showCustomAlert('Database of this page is not available yet! Please waiting for next update.', 'error', 6000);

    // let { searchKeyword, keywordType } = await getInitialParams();
    // initialHubCoExpressionNetwork('mosaic');
    // initalContentArea(searchKeyword, keywordType);
    initialBasedOnURLSearchKeyword();
    setUpSearchEventListeners('#content_area_search_container');
    // setupNetworkSelectorContainerEventsListeners('#hub_network_selector_container');
    setupNetworkSelectorContainerEventsListeners('#single_network_selector_container');


    // setUpSelectEventListeners('#homologous_id_select', initalContentArea);
    setUpSelectWithSelect2('#homologous_id_select', initialContentArea);

    // 为链接添加点击事件监听器应该在每次更新result details container之后重新设置，因为每次填充新的链接都会将之前的事件监听器清空
    // setupClickToDrawSingleNetworkEventListeners();

    // 为下载按钮添加点击事件监听器, 不能在initial里添加, 因为updateTableContainer并没有将下载按钮清除, 
    // 所以只需要在页面加载完成后添加一次即可
    setupDownloadButton('#download_single_network_nodes_table');
    setupDownloadButton('#download_single_network_edges_table');

    // hubCoExpressionNetworkChart.on('click', clickHubCoExpressionNetworkEventsHandler);
    singleCoExpressionNetworkChart.on('click', clickSingleCoExpressionNetworkEventsHandler);

});

// TODO:
// 1. 由于数据尚未得到，该页先不管，加一个customAlert提醒用户尚未得到数据
// 2. 将新的数据库导出并替换到服务器