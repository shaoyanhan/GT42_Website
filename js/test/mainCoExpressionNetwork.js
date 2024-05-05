import { initalContentArea, initialHubCoExpressionNetwork } from "./initialContentAreaCoExpressionNetwork.js"
import { setUpSearchEventListeners } from "./searchEvents.js";

export let hubCoExpressionNetworkDOM = document.getElementById('drawHubCoExpressionNetwork');
export let singleCoExpressionNetworkDOM = document.getElementById('drawSingleCoExpressionNetwork');

export let hubCoExpressionNetworkChart = echarts.init(hubCoExpressionNetworkDOM, null, { renderer: 'canvas' });
export let singleCoExpressionNetworkChart = echarts.init(singleCoExpressionNetworkDOM, null, { renderer: 'canvas' });

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initialHubCoExpressionNetwork('mosaic');
    initalContentArea();
    setUpSearchEventListeners('.search_container');

});