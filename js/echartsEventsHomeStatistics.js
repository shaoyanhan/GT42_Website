import {
    transcriptCountChart, snpTypeCountChart, averageTPMCountChart,
    edgeWeightCountChart, annotationTypeCountChart, dockingConfidenceCountChart
} from "./mainIndex.js";
import {
    getTranscriptCountOption, getSNPTypeCountOption, getAverageTPMCountOption,
    getModuleNodeEdgeCountOption, getAnnotationTypeCountOption, getDockingConfidenceCountOption
} from "./echartsOptionHomeStatistics.js";

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

function drawAnnotationTypeCount(data) {
    annotationTypeCountChart.setOption(getAnnotationTypeCountOption(data));
}

function drawDockingConfidenceCount(data) {
    dockingConfidenceCountChart.setOption(getDockingConfidenceCountOption(data));
}

export {
    drawTranscriptCount, drawSNPTypeCount, drawAverageTPMCount,
    drawModuleNodeEdgeCount, drawAnnotationTypeCount, drawDockingConfidenceCount
};