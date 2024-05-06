import { initalContentArea, initialHubCoExpressionNetwork } from "./initialContentAreaCoExpressionNetwork.js"
import { setUpSearchEventListeners } from "./searchEvents.js";
import { setupClickToDrawSingleNetworkEventListeners } from "./clickToDrawSingleNetwork.js";
import { clickHubCoExpressionNetworkEventsHandler, clickSingleCoExpressionNetworkEventsHandler } from "./echartsEventsCoExpressionNetwork.js";

export let hubCoExpressionNetworkDOM = document.getElementById('drawHubCoExpressionNetwork');
export let singleCoExpressionNetworkDOM = document.getElementById('drawSingleCoExpressionNetwork');

export let hubCoExpressionNetworkChart = echarts.init(hubCoExpressionNetworkDOM, null, { renderer: 'canvas' });
export let singleCoExpressionNetworkChart = echarts.init(singleCoExpressionNetworkDOM, null, { renderer: 'canvas' });

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initialHubCoExpressionNetwork('mosaic');
    initalContentArea('GT42G000001', 'mosaic');
    setUpSearchEventListeners('.search_container');
    setupClickToDrawSingleNetworkEventListeners();

    hubCoExpressionNetworkChart.on('click', clickHubCoExpressionNetworkEventsHandler);
    singleCoExpressionNetworkChart.on('click', clickSingleCoExpressionNetworkEventsHandler);

});