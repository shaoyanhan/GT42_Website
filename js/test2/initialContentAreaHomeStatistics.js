import { fetchRawData } from "./data.js";
import { drawTranscriptCount, drawSNPTypeCount } from "./echartsEventsHomeStatistics.js";

let SNPTypeCount = [
    { name: 'C/T', value: 406541 },
    { name: 'A/G', value: 386814 },
    { name: 'C/G', value: 135900 },
    { name: 'G/T', value: 120228 },
    { name: 'A/C', value: 108567 },
    { name: 'A/T', value: 101392 },
    { name: 'A/G/T', value: 8918 },
    { name: 'A/C/T', value: 8326 },
    { name: 'C/G/T', value: 8008 },
    { name: 'A/C/G', value: 7750 },
    { name: 'A/C/G/T', value: 791 },
];

async function initialContentArea() {
    // console.log("initialContentAreaHomeStatistics.js");

    // 请求转录本计数的数据，这里不对其进行存储的实现，因为没有缓存优化的必要
    let response = await fetchRawData('homePageStatisticData', 'transcriptCount');
    let transcriptCount = response.data;

    drawTranscriptCount(transcriptCount);
    // 由于SQL查询缓慢，SNP的统计数据已经在本文件中定义，因此不需要再次请求
    drawSNPTypeCount(SNPTypeCount);
}

export { initialContentArea };