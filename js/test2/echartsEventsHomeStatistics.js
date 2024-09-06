import { transcriptCountChart, snpTypeCountChart, averageTPMCountChart, edgeWeightCountChart } from "./mainIndex.js";
import { getTranscriptCountOption, getSNPTypeCountOption, getAverageTPMCountOption, getEdgeWeightCountOption } from "./echartsOptionHomeStatistics.js";

function drawTranscriptCount(transcriptCount) {
    transcriptCountChart.setOption(getTranscriptCountOption(transcriptCount));
}

function drawSNPTypeCount(snpTypeCount) {
    snpTypeCountChart.setOption(getSNPTypeCountOption(snpTypeCount));
}

function drawAverageTPMCount(averageTPMTable) {
    averageTPMCountChart.setOption(getAverageTPMCountOption(averageTPMTable));
}

function drawEdgeWeightCount(edgeWeightTable) {
    edgeWeightCountChart.setOption(getEdgeWeightCountOption(edgeWeightTable));
}

export { drawTranscriptCount, drawSNPTypeCount, drawAverageTPMCount, drawEdgeWeightCount };