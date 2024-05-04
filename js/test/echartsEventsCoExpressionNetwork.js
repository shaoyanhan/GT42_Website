import { hubCoExpressionNetworkChart, singleCoExpressionNetworkChart } from "./mainCoExpressionNetwork.js";
import { getHubCoExpressionNetworkOption } from "./echartsOptionHubCoExpressionNetwork.js";
import { getSingleCoExpressionNetworkOption } from "./echartsOptionSingleCoExpressionNetwork.js";

function drawHubCoExpressionNetwork(graph) {
    hubCoExpressionNetworkChart.setOption(getHubCoExpressionNetworkOption(graph));
}

function drawSingleCoExpressionNetwork(graph) {
    singleCoExpressionNetworkChart.setOption(getSingleCoExpressionNetworkOption(graph));
}

export { drawHubCoExpressionNetwork, drawSingleCoExpressionNetwork };