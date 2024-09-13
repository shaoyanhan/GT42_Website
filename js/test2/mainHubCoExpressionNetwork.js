import { initialHubCoExpressionNetwork } from "./initialContentAreaHubCoExpressionNetwork.js"
import { clickHubCoExpressionNetworkEventsHandler } from "./echartsEventsHubCoExpressionNetwork.js";
import { setupNetworkSelectorContainerEventsListeners } from "./hubNetworkSelectorContainerEvents.js";
import { setupDownloadButton } from "./downloadTable.js";


export let hubCoExpressionNetworkDOM = document.getElementById('drawHubCoExpressionNetwork');
// export let singleCoExpressionNetworkDOM = document.getElementById('drawSingleCoExpressionNetwork');

export let hubCoExpressionNetworkChart = echarts.init(hubCoExpressionNetworkDOM, null, { renderer: 'canvas' });
// export let singleCoExpressionNetworkChart = echarts.init(singleCoExpressionNetworkDOM, null, { renderer: 'canvas' });

// 为帮助按钮添加点击事件监听器
async function setupHelpButton() {
    let helpButton = document.querySelector('#help_tooltip_button');
    helpButton.addEventListener('click', () => {
        let helpTooltipContent = document.querySelector('#help_tooltip_content');
        helpTooltipContent.style.display = 'flex';
    });
}

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', async () => {
    initialHubCoExpressionNetwork('mosaic');
    // initalContentArea('GT42G000001', 'mosaic');
    // setUpSearchEventListeners('.search_container');
    setupNetworkSelectorContainerEventsListeners('#hub_network_selector_container');
    // setupNetworkSelectorContainerEventsListeners('#single_network_selector_container');


    // setUpSelectEventListeners('#homologous_id_select', initalContentArea);
    // setUpSelectWithSelect2('#homologous_id_select', initalContentArea);

    // 为链接添加点击事件监听器应该在每次更新result details container之后重新设置，因为每次填充新的链接都会将之前的事件监听器清空
    // setupClickToDrawSingleNetworkEventListenhub

    // 为下载按钮添加点击事件监听器, 不能在initial里添加, 因为updateTableContainer并没有将下载按钮清除, 
    // 所以只需要在页面加载完成后添加一次即可
    setupDownloadButton('#download_hub_network_nodes_table');
    setupDownloadButton('#download_hub_network_edges_table');

    hubCoExpressionNetworkChart.on('click', clickHubCoExpressionNetworkEventsHandler);
    // singleCoExpressionNetworkChart.on('click', clickSingleCoExpressionNetworkEventsHandler);

    setupHelpButton();

});