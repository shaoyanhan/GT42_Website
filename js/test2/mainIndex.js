import { initialContentArea } from "./initialContentAreaHomeStatistics.js";

export let transcriptCountDOM = document.getElementById('transcript_count');
export let snpTypeCountDOM = document.getElementById('SNP_type_count');
export let averageTPMCountDOM = document.getElementById('average_TPM_count');
export let edgeWeightCountDOM = document.getElementById('edge_weight_count');

export let transcriptCountChart = echarts.init(transcriptCountDOM, null, { renderer: 'canvas' });
export let snpTypeCountChart = echarts.init(snpTypeCountDOM, null, { renderer: 'canvas' });
export let averageTPMCountChart = echarts.init(averageTPMCountDOM, null, { renderer: 'canvas' });
export let edgeWeightCountChart = echarts.init(edgeWeightCountDOM, null, { renderer: 'canvas' });

document.addEventListener('DOMContentLoaded', async () => {
    initialContentArea();
});