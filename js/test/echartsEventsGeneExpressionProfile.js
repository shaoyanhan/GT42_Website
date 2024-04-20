import { getHeatmapOption } from "./echartsOptionHeatmap.js";
import { orthologHeatmapChart } from "./mainGeneExpressionProfile.js";

function drawOrthologHeatmap() {
    orthologHeatmapChart.setOption(getHeatmapOption());
}

export { drawOrthologHeatmap };