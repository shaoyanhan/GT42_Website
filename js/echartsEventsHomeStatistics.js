import { transcriptCountChart, snpTypeCountChart, averageTPMCountChart, edgeWeightCountChart } from "./mainIndex.js";
import { getTranscriptCountOption, getSNPTypeCountOption, getAverageTPMCountOption, getModuleNodeEdgeCountOption } from "./echartsOptionHomeStatistics.js";

function drawTranscriptCount(transcriptCount) {
    transcriptCountChart.setOption(getTranscriptCountOption(transcriptCount));
}

function drawSNPTypeCount(snpTypeCount) {
    snpTypeCountChart.setOption(getSNPTypeCountOption(snpTypeCount));
}

function drawAverageTPMCount(averageTPMTable) {
    averageTPMCountChart.setOption(getAverageTPMCountOption(averageTPMTable));
}

function drawModuleNodeEdgeCount(moduleNodeEdgeTable) {
    edgeWeightCountChart.setOption(getModuleNodeEdgeCountOption(moduleNodeEdgeTable));
}

export { drawTranscriptCount, drawSNPTypeCount, drawAverageTPMCount, drawModuleNodeEdgeCount };