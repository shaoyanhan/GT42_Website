import { drawHaplotypeChart, drawTranscriptChart, setDispatchAction, setDownplayAction, splitObjectArray } from "./echartsEventsFullLengthTranscriptome.js";
import { fetchRawData, updateData, getData } from "./data.js";
import { updateTableContainer } from "./tablePagination.js";
import { updateResultDetailsContainer } from "./resultDetailsContainer.js";
import { haplotypeChart, transcriptChart } from "./mainFullLengthTranscriptome.js";
import { setUpPaginationEventListeners } from "./tablePagination.js";
import { showAlert } from "./searchEvents.js";

// 从对象数组中查找指定key和value的对象的行索引
function findIndexInObjectArray(objectArray, key, value) {
    return objectArray.findIndex(obj => obj[key] === value);
}

// 根据genomeID的类型，拆分genomeID得到mosaicID、geneID、transcriptID，请注意mosaicID和geneID还有两种别名情况
function splitGenomeID(genomeID, keywordType) {
    let mosaicID = '';
    let geneID = '';
    let transcriptID = '';
    if (keywordType === 'mosaic') {
        // mosaicID = genomeID;
        mosaicID = genomeID.split('.')[0]; // GT42G000001 / GT42G000001.0.0 => GT42G000001
    } else if (keywordType === 'gene') {
        mosaicID = genomeID.split('.')[0];
        // geneID = genomeID;
        geneID = genomeID.split('.')[0] + '.' + genomeID.split('.')[1] + '.' + genomeID.split('.')[2]; // GT42G000001.SO.1 / GT42G000001.SO.1.0 => GT42G000001.SO.1
    } else if (keywordType === 'transcript') {
        mosaicID = genomeID.split('.')[0];
        geneID = genomeID.split('.')[0] + '.' + genomeID.split('.')[1] + '.' + genomeID.split('.')[2];
        transcriptID = genomeID;
    }
    return [mosaicID, geneID, transcriptID];
}


async function initialContentArea(searchKeyword, keywordType) {

    if (keywordType === 'xenologous') {
        const searchContainer = document.querySelector('#content_area_search_container');
        showAlert(searchContainer, 'Xenologous ID is not available in Full Length Transcriptome!');

        return;
    }

    // 将搜索关键词填充到搜索框中
    let searchInput = document.getElementById('search_input');
    searchInput.value = searchKeyword;

    initialContentAreaFullLengthTranscriptome(searchKeyword, keywordType);
    // loadingElement.style.display = 'none';

}

// 页面初始化，传入两个参数：genomeID和genomeID的类型，其实就是validateGenomeID成功之后的其中两个返回值
// keywordType是一个字符串，表示genomeID的类型，有三种可能的值：mosaic、gene、transcript
async function initialContentAreaFullLengthTranscriptome(searchKeyword, keywordType) {

    console.log(searchKeyword);
    console.log(keywordType);

    let haplotypeTableIndex; // 用于保存mosaic或某个单倍型在haplotypeObjectData中的行索引
    let transcriptIDIndex; // 用于保存某个transcriptID在transcriptObjectData中的行索引

    // 根据关键词的类型，分别获取mosaicID、geneID、transcriptID，
    // 注意：mosaicID是必须的（否则在searchEvent中无法通过validateGenomeID），geneID和transcriptID可能为空
    let [searchKeywordMosaic, searchKeywordGene, searchKeywordTranscript] = splitGenomeID(searchKeyword, keywordType);
    console.log(searchKeywordMosaic);
    console.log(searchKeywordGene);
    console.log(searchKeywordTranscript);

    // 请求原始数据并保存
    let haplotypeRawData = await fetchRawData('haplotype', searchKeywordMosaic);
    console.log("haplotypeRawData: ", haplotypeRawData);
    updateData('haplotype', haplotypeRawData);

    let haplotypeObjectData = getData('haplotypeObjectData');
    console.log("haplotypeObjectData: ", haplotypeObjectData);


    let transcriptTableType;
    let transcriptPaginationTableType;
    let transcriptSearchKeyword;
    let transcriptRawData;
    let transcriptObjectData;
    if (searchKeywordGene === '') { // 如果searchKeywordGene为空，证明用户搜索的是mosaicID，那么展示所有的转录本
        transcriptTableType = 'allTranscript';
        transcriptPaginationTableType = 'allTranscriptPagination';
        haplotypeTableIndex = 0; // 单倍型表格的第一行是mosaic
        transcriptSearchKeyword = searchKeywordMosaic;
    } else { // 如果searchKeywordGene不为空，那么查找这个geneID在haplotypeObjectData中的行索引，并只展示这个geneID的转录本
        transcriptTableType = 'transcript';
        transcriptPaginationTableType = 'transcriptPagination';
        haplotypeTableIndex = findIndexInObjectArray(haplotypeObjectData, 'geneID', searchKeywordGene);
        transcriptSearchKeyword = searchKeywordGene;
    }
    transcriptRawData = await fetchRawData(transcriptTableType, transcriptSearchKeyword);
    updateData('transcript', transcriptRawData);
    transcriptObjectData = getData('transcriptObjectData');

    // 将transcript对象数组拆分为transcript和marker数组，并使用transcript数组
    let splitObjectData = splitObjectArray(transcriptObjectData, obj => !(obj.areaType === "softClip" || obj.areaType === "insertion"));
    let seriesIndex = 0;
    let splitTranscriptObjectData = splitObjectData[seriesIndex];

    if (searchKeywordTranscript === '') { // 如果searchKeywordTranscript为空，证明用户搜索的是mosaicID或者geneID，那么默认显示第一条转录本的第一个外显子
        searchKeywordTranscript = splitTranscriptObjectData[1].transcriptID;
        transcriptIDIndex = 1;
    } else { // 如果searchKeywordTranscript不为空，那么查找这个transcriptID在transcript对象数组中的行索引
        transcriptIDIndex = findIndexInObjectArray(splitTranscriptObjectData, 'transcriptID', searchKeywordTranscript);
    }


    // 获取二维数组数据
    let haplotypeArrayData = getData('haplotypeArrayData');
    let transcriptArrayData = getData('transcriptArrayData');

    // 绘制图像
    drawHaplotypeChart(haplotypeArrayData);

    // 在每次绘制转录本图像之前，取消前一个高亮元素的聚焦效果，因为formerHighlightIndex存储的是上一个高亮元素的dataIndex，但是绘制转录本图像之后，transcript数据会切换为另外一组数据，导致formerHighlightIndex对应的dataIndex元素不再是高亮元素
    let formerHighlightDataIndex = getData('formerTranscriptHighlightDataIndex'); // 获取旧的高亮元素的dataIndex
    let formerHighlightSeriesIndex = getData('formerTranscriptHighlightSeriesIndex'); // 获取旧的高亮元素的seriesIndex
    setDownplayAction(transcriptChart, formerHighlightSeriesIndex, formerHighlightDataIndex); // 取消前一个高亮元素的聚焦效果

    drawTranscriptChart(transcriptArrayData);

    // 为用户搜索的单倍型设置聚焦，请注意haplotype使用的是标准bar图，因此可以配置select属性并设置selectMode为single，因此无需手动进行聚焦操作的取消和设置
    haplotypeChart.dispatchAction({
        type: 'select',
        seriesIndex: 0,
        dataIndex: haplotypeTableIndex
    });

    // 为用户搜索的转录本的第一个外显子设置高亮

    let currentHighlightDataIndex = transcriptIDIndex;
    setDispatchAction(transcriptChart, 'highlight', seriesIndex, currentHighlightDataIndex);
    updateData('formerTranscriptHighlightSeriesIndex', seriesIndex); // 更新旧的高亮元素的seriesIndex
    updateData('formerTranscriptHighlightDataIndex', currentHighlightDataIndex); // 更新旧的高亮元素的dataIndex


    let haplotype_table_container = document.querySelector('#haplotype_table_container'); // 获取相应id的表格容器
    updateTableContainer('haplotypePagination', searchKeywordMosaic, 1, haplotype_table_container); // 初始化表格

    let transcript_table_container = document.querySelector('#transcript_table_container'); // 获取相应id的表格容器
    updateTableContainer(transcriptPaginationTableType, transcriptSearchKeyword, 1, transcript_table_container); // 初始化表格
    let transcriptPaginationDataType = transcriptPaginationTableType + 'Data';
    // 由于 transcript table 有 transcriptPagination 和 allTranscriptPagination 两种类型，所以需要在每次更新表格之后重新设置事件监听器
    setUpPaginationEventListeners('#transcript_table_container', transcriptPaginationDataType);

    let haplotypeResultDetailsData = { type: haplotypeRawData.type, data: haplotypeRawData.data[haplotypeTableIndex] }; // 根据用户搜索的geneID的索引，获取第一条待展示的haplotype的信息
    let haplotype_result_details_container = document.querySelector('#haplotype_SNP_result_details_container'); // 获取haplotype_SNP的result details容器
    updateResultDetailsContainer(haplotypeResultDetailsData, haplotype_result_details_container); // 初始化result details容器

    let transcriptResultDetailsData = { type: transcriptRawData.type, data: splitTranscriptObjectData[transcriptIDIndex] }; // 根据用户搜索的transcriptID的索引，获取第一条待展示的可变剪接的信息
    let transcript_result_details_container = document.querySelector('#transcript_result_details_container'); // 获取transcript的result details容器
    updateResultDetailsContainer(transcriptResultDetailsData, transcript_result_details_container); // 初始化result details容器


    // 根据keywordType的类型，跳转到相应的页面位置
    // let jumpTargetElement = '';
    // if (keywordType === 'mosaic' || keywordType === 'gene') {
    //     // jumpTargetElement = document.getElementById('drawHaplotype');
    // } else if (keywordType === 'transcript') {
    //     jumpTargetElement = document.getElementById('haplotype_details');
    // }
    // if (jumpTargetElement) {
    //     //  'smooth' 选项会平滑地滚动到指定元素，而不是瞬间跳转，'center' 选项会将元素滚动到视口的中间( block: 'start' 为顶部 )
    //     jumpTargetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }
}

export { initialContentArea };