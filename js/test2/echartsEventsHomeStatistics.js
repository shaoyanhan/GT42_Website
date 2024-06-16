import { transcriptCountChart } from "./mainIndex.js";
import { snpTypeCountChart } from "./mainIndex.js";
import { getTranscriptCountOption } from "./echartsOptionHomeStatistics.js";
import { getSNPTypeCountOption } from "./echartsOptionHomeStatistics.js";

function drawTranscriptCount(transcriptCount) {
    transcriptCountChart.setOption(getTranscriptCountOption(transcriptCount));
}

function drawSNPTypeCount(snpTypeCount) {
    snpTypeCountChart.setOption(getSNPTypeCountOption(snpTypeCount));
}

export { drawTranscriptCount, drawSNPTypeCount };