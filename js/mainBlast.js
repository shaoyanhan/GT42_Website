import { setUpBlastSubmitContainerEvents } from "./blastSubmitContainerEvents.js";
import { setUpQueryResultSelectEventListeners } from "./initialContentAreaBlast.js";
import { clickAllHitsBarPlotEventsHandler } from "./echartsEventsBlast.js";

export let allHitsBarPlotDOM = document.getElementById('all_hits_bar_plot');

export let allHitsBarPlot = echarts.init(allHitsBarPlotDOM, null, { renderer: 'canvas' });

document.addEventListener('DOMContentLoaded', async () => {
    setUpBlastSubmitContainerEvents();
    setUpQueryResultSelectEventListeners();
    allHitsBarPlot.on('click', clickAllHitsBarPlotEventsHandler);
});