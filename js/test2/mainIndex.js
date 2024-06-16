import { initialContentArea } from "./initialContentAreaHomeStatistics.js";

export let transcriptCountDOM = document.getElementById('transcript_count');
export let snpTypeCountDOM = document.getElementById('SNP_type_count');

export let transcriptCountChart = echarts.init(transcriptCountDOM, null, { renderer: 'canvas' });
export let snpTypeCountChart = echarts.init(snpTypeCountDOM, null, { renderer: 'canvas' });

document.addEventListener('DOMContentLoaded', async () => {
    initialContentArea();
});