import { initalContentArea, initialHubCoExpressionNetwork } from "./initialContentAreaCoExpressionNetwork.js"
import { setUpSearchEventListeners } from "./searchEvents.js";
import { setupClickToDrawSingleNetworkEventListeners } from "./clickToDrawSingleNetwork.js";
import { clickHubCoExpressionNetworkEventsHandler, clickSingleCoExpressionNetworkEventsHandler } from "./echartsEventsCoExpressionNetwork.js";
import { setupNetworkSelectorContainerEventsListeners } from "./networkSelectorContainerEvents.js";


export let hubCoExpressionNetworkDOM = document.getElementById('drawHubCoExpressionNetwork');
export let singleCoExpressionNetworkDOM = document.getElementById('drawSingleCoExpressionNetwork');

export let hubCoExpressionNetworkChart = echarts.init(hubCoExpressionNetworkDOM, null, { renderer: 'canvas' });
export let singleCoExpressionNetworkChart = echarts.init(singleCoExpressionNetworkDOM, null, { renderer: 'canvas' });

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initialHubCoExpressionNetwork('gene');
    initalContentArea('GT42G000001', 'mosaic');
    setUpSearchEventListeners('.search_container');
    setupNetworkSelectorContainerEventsListeners('#hub_network_selector_container');

    // 为链接添加点击事件监听器应该在每次更新result details container之后重新设置，因为每次填充新的链接都会将之前的事件监听器清空
    // setupClickToDrawSingleNetworkEventListeners();

    hubCoExpressionNetworkChart.on('click', clickHubCoExpressionNetworkEventsHandler);
    singleCoExpressionNetworkChart.on('click', clickSingleCoExpressionNetworkEventsHandler);

});