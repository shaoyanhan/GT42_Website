import { updateResultDetailsContainer } from './resultDetailsContainer.js';

function testEchartsEvents(params) {
    console.log('Echarts events');
    console.log(params);
    let seriesName = params.seriesName;
    let data = params.data;
    let haplotypeResultDetailsData = { type: seriesName, data: data };
    let haplotype_result_details_container = document.querySelector('#haplotype_result_details_container');
    updateResultDetailsContainer(haplotypeResultDetailsData, haplotype_result_details_container);
}

export { testEchartsEvents };