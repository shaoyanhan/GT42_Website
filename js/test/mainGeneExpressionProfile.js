import { initalContentArea } from "./initialContentAreaGeneExpressionProfile.js";

// 初始化ECharts实例
export let orthologHeatmapChart = echarts.init(document.getElementById('drawOrthologHeatmap'), null, { renderer: 'svg' });

// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initalContentArea();
});