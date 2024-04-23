// 用于绘图和数据处理的全局变量
// 不能将数据定义放在main.js中，因为会导致main.js和echartsOptionHaplotype.js、echartsOptionTranscript.js之间的循环依赖问题


// {
//     "type": "haplotype",
//         "data": [
//             {
//                 "mosaicID": "GT42G000002",
//                 "geneID": "GT42G000002.SO.0",
//                 "areaType": "mosaic",
//                 "length": 5420,
//                 "nucleotideSequence": "ATCGATCG",
//                 "id": 6
//             },
//         ]
// }
let haplotypeRawData = [];
let SNPRawData = [];
let transcriptRawData = [];
let mosaicTPMRawData = [];
let xenologousTPMRawData = [];
let geneTPMRawData = [];
let transcriptTPMRawData = [];


// [
//     {
//          "mosaicID": "GT42G000002",
//          "geneID": "GT42G000002.SO.0",
//          "areaType": "mosaic",
//          "length": 5420,
//          "nucleotideSequence": "ATCGATCG",
//     },
// ]
let haplotypeObjectData = [];
let SNPObjectData = [];
let transcriptObjectData = [];
let mosaicTPMObjectData = [];
let xenologousTPMObjectData = [];
let geneTPMObjectData = [];
let transcriptTPMObjectData = [];


// [
//     ["GT42G000002", "GT42G000002.SO.0", "mosaic", 5420, "ATCGATCG"],
// ]
let haplotypeArrayData = [];
let SNPArrayData = [];
let transcriptArrayData = [];

// [
//     ["ID", num, num ...],
// ]
let mosaicTPMArrayData = [];
let xenologousTPMArrayData = [];
let geneTPMArrayData = [];
let transcriptTPMArrayData = [];


/*
{
    "numPages": 1,
    "currentPage": 1,
    "pageSize": 10,
    "totalRecords": 4,
    "searchKeyword": "GT42G000001",
    "type": "haplotypePagination",
    "data": [
        {
            "mosaicID": "GT42G000001",
            "geneID": "GT42G000001.SO.0",
            "areaType": "mosaic",
            "length": 5420,
            "nucleotideSequence": "ATCGATCG",
            "id": 1
        },
    ]
}
*/
let haplotypePaginationData = [];
let SNPPaginationData = [];
let transcriptPaginationData = [];


/*
$vars: (3) ['seriesName', 'name', 'value']
borderColor: undefined
color: "#003666"
componentIndex: 1
componentSubType: "scatter"
componentType: "series"
data: (9) ['GT42G000001', 'mosaic', 32, 'C/G', '8346/3244', '2133/4543', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#003666', 2]
dataIndex:1
dataTyp: undefined
dimensionNames: (9) ['value', 'y', 'x', 'value0', 'value1', 'value2', 'value3', 'value4', 'value5']
encode: {y: Array(1), x: Array(1)}
event: {type: 'click', event: PointerEvent, target: i, topTarget: i, cancelBubble: false, …}
name: "mosaic"
seriesId: "\u0000SNP\u00000"
seriesIndex: 1
seriesName: "SNP"
seriesType: "scatter"
type: "click"
value: (9) ['GT42G000001', 'mosaic', 32, 'C/G', '8346/3244', '2133/4543', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#003666', 2]
[[Prototype]]: Object
*/
let haplotypeEchartParamsData = {};
let SNPEchartParamsData = {};
let transcriptEchartParamsData = {};

// 用于记录转录本图像中的外显子的上一个焦点元素所对应的dataIndex
let formerTranscriptHighlightIndex = -1;

// 与PreviousID和NextID组件相关的一系列参数
let currentGenome = 'GT42'; // 记录Select Genome选择框的当前值
let currentIDIndex = 1; // 记录当前ID在next_id_table中的索引
let nextSearchID = 'GT42G000001'; // 记录next_id_table中currentIDIndex索引所对应的ID
let previousSearchID = 'GT42G000001'; // 记录上一个搜索的ID


// 定义API请求的前缀
let apiPrefix = {
    IP: 'http://127.0.0.1:8080/',

    app: 'searchDatabase/',

    haplotype: 'getHaplotypeTable/',
    SNP: 'getSNPTable/',
    transcript: 'getTranscriptTable/',
    mosaicTPM: 'getMosaicTPMTable/',
    xenologousTPM: 'getXenologousTPMTable/',
    geneTPM: 'getGeneTPMTable/',
    transcriptTPM: 'getTranscriptTPMTable/',

    haplotypePagination: 'getHaplotypeTableByPage/',
    SNPPagination: 'getSNPTableByPage/',
    transcriptPagination: 'getTranscriptTableByPage/',

    validateGenomeID: 'validateGenomeID/',

    GT42NextID: 'getGT42NextID/',

    parameter: {
        searchKeyword: 'searchKeyword=',
        page: 'page=',
        genomeID: 'genomeID=',
        currentIDIndex: 'currentIDIndex=',
    }
}
// 定义更新函数的映射关系, 从名称映射到函数
const updateDataFunctions = {
    haplotype: updateHaplotypeData,
    SNP: updateSNPData,
    transcript: updateTranscriptData,
    mosaicTPM: updateMosaicTPMData,
    xenologousTPM: updateXenologousTPMData,
    geneTPM: updateGeneTPMData,
    transcriptTPM: updateTranscriptTPMData,

    haplotypePagination: updateHaplotypePaginationData,
    SNPPagination: updateSNPPaginationData,
    transcriptPagination: updateTranscriptPaginationData,

    haplotypeEchartParams: updateHaplotypeEchartParamsData,
    SNPEchartParams: updateSNPEchartParamsData,
    transcriptEchartParams: updateTranscriptEchartParamsData,

    formerTranscriptHighlightIndex: updateFormerTranscriptHighlightIndex,

    nextIDData: updateNextIDData,
    currentGenome: updateCurrentGenome,
    currentIDIndex: updateCurrentIDIndex,
    nextSearchID: updateNextSearchID,
};

// 定义获取数据的映射关系, 从名称映射到函数
const getDataFunctions = {
    haplotypeRawData: getHaplotypeRawData,
    SNPRawData: getSNPRawData,
    transcriptRawData: getTranscriptRawData,
    mosaicTPMRawData: getMosaicTPMRawData,
    xenologousTPMRawData: getXenologousTPMRawData,
    geneTPMRawData: getGeneTPMRawData,
    transcriptTPMRawData: getTranscriptTPMRawData,

    haplotypeObjectData: getHaplotypeObjectData,
    SNPObjectData: getSNPObjectData,
    transcriptObjectData: getTranscriptObjectData,
    mosaicTPMObjectData: getMosaicTPMObjectData,
    xenologousTPMObjectData: getXenologousTPMObjectData,
    geneTPMObjectData: getGeneTPMObjectData,
    transcriptTPMObjectData: getTranscriptTPMObjectData,

    haplotypeArrayData: getHaplotypeArrayData,
    SNPArrayData: getSNPArrayData,
    transcriptArrayData: getTranscriptArrayData,
    mosaicTPMArrayData: getMosaicTPMArrayData,
    xenologousTPMArrayData: getXenologousTPMArrayData,
    geneTPMArrayData: getGeneTPMArrayData,
    transcriptTPMArrayData: getTranscriptTPMArrayData,

    haplotypePaginationData: getHaplotypePaginationData,
    SNPPaginationData: getSNPPaginationData,
    transcriptPaginationData: getTranscriptPaginationData,

    haplotypeEchartParamsData: getHaplotypeEchartParamsData,
    SNPEchartParamsData: getSNPEchartParamsData,
    transcriptEchartParamsData: getTranscriptEchartParamsData,

    formerTranscriptHighlightIndex: getFormerTranscriptHighlightIndex,

    currentGenome: getCurrentGenome,
    currentIDIndex: getCurrentIDIndex,
    nextSearchID: getNextSearchID,
    previousSearchID: getPreviousSearchID,

};

// 将对象数组转换为二维数组
function objectToArray(data) {
    return data.map(element => Object.values(element));
}

// 更新数据，因为在ES6模块中，通过import导入的变量是只读的，不能被重新赋值。
function updateHaplotypeData(newData) {
    haplotypeRawData = newData;
    haplotypeObjectData = newData.data;
    haplotypeArrayData = objectToArray(newData.data);
}
function updateSNPData(newData) {
    console.log(newData);
    SNPRawData = newData;
    SNPObjectData = newData.data;
    SNPArrayData = objectToArray(newData.data);
}
function updateTranscriptData(newData) {
    transcriptRawData = newData;
    transcriptObjectData = newData.data;
    transcriptArrayData = objectToArray(newData.data);
}
function updateMosaicTPMData(newData) {
    mosaicTPMRawData = newData;
    mosaicTPMObjectData = newData.data;
    mosaicTPMArrayData = objectToArray(newData.data);
}
function updateXenologousTPMData(newData) {
    xenologousTPMRawData = newData;
    xenologousTPMObjectData = newData.data;
    // 将object转换为数组并去除每个元素的mosaicID列
    xenologousTPMArrayData = objectToArray(newData.data).map(element => element.slice(1));
}
function updateGeneTPMData(newData) {
    geneTPMRawData = newData;
    geneTPMObjectData = newData.data;
    // 将object转换为数组并去除每个元素的mosaicID和xenologous列
    geneTPMArrayData = objectToArray(newData.data).map(element => element.slice(2));
}
function updateTranscriptTPMData(newData) {
    transcriptTPMRawData = newData;
    transcriptTPMObjectData = newData.data;
    // 将object转换为数组并去除每个元素的mosaicID、xenologous和gene列
    transcriptTPMArrayData = objectToArray(newData.data).map(element => element.slice(3));
}


function updateHaplotypePaginationData(newData) {
    haplotypePaginationData = newData;
}
function updateSNPPaginationData(newData) {
    SNPPaginationData = newData;
}
function updateTranscriptPaginationData(newData) {
    transcriptPaginationData = newData;
}

function updateHaplotypeEchartParamsData(newData) {
    haplotypeEchartParamsData = newData;
}
function updateSNPEchartParamsData(newData) {
    SNPEchartParamsData = newData;
}
function updateTranscriptEchartParamsData(newData) {
    transcriptEchartParamsData = newData;
}

function updateFormerTranscriptHighlightIndex(newData) {
    formerTranscriptHighlightIndex = newData;
}


function updateCurrentGenome(newData) {
    currentGenome = newData;
}
function updateCurrentIDIndex(newData) {
    currentIDIndex = newData;
}
function updateNextSearchID(newData) {
    nextSearchID = newData;
}
// 由于接收的格式是{'status': 'success', 'id': 1, 'nextID': GT42G00001 , 'type': mosaic}，因此可以使用这个函数一次性更新currentIDIndex、previousSearchID和nextSearchID
function updateNextIDData(newData) {
    updateCurrentIDIndex(newData.id);
    previousSearchID = nextSearchID; // 保存上一个搜索的ID
    nextSearchID = newData.nextID; // 更新下一个搜索的ID
}



// 获取原始数据
function getHaplotypeRawData() {
    return _.cloneDeep(haplotypeRawData);
}
function getSNPRawData() {
    return _.cloneDeep(SNPRawData);
}
function getTranscriptRawData() {
    return _.cloneDeep(transcriptRawData);
}
function getMosaicTPMRawData() {
    return _.cloneDeep(mosaicTPMRawData);
}
function getXenologousTPMRawData() {
    return _.cloneDeep(xenologousTPMRawData);
}
function getGeneTPMRawData() {
    return _.cloneDeep(geneTPMRawData);
}
function getTranscriptTPMRawData() {
    return _.cloneDeep(transcriptTPMRawData);
}

// 获取对象数据
function getHaplotypeObjectData() {
    return _.cloneDeep(haplotypeObjectData);
}
function getSNPObjectData() {
    return _.cloneDeep(SNPObjectData);
}
function getTranscriptObjectData() {
    return _.cloneDeep(transcriptObjectData);
}
function getMosaicTPMObjectData() {
    return _.cloneDeep(mosaicTPMObjectData);
}
function getXenologousTPMObjectData() {
    return _.cloneDeep(xenologousTPMObjectData);
}
function getGeneTPMObjectData() {
    return _.cloneDeep(geneTPMObjectData);
}
function getTranscriptTPMObjectData() {
    return _.cloneDeep(transcriptTPMObjectData);
}

// 获取二维数组数据
function getHaplotypeArrayData() {
    return _.cloneDeep(haplotypeArrayData);
}
function getSNPArrayData() {
    return _.cloneDeep(SNPArrayData);
}
function getTranscriptArrayData() {
    return _.cloneDeep(transcriptArrayData);
}
function getMosaicTPMArrayData() {
    return _.cloneDeep(mosaicTPMArrayData);
}
function getXenologousTPMArrayData() {
    return _.cloneDeep(xenologousTPMArrayData);
}
function getGeneTPMArrayData() {
    return _.cloneDeep(geneTPMArrayData);
}
function getTranscriptTPMArrayData() {
    return _.cloneDeep(transcriptTPMArrayData);
}

// 获取分页数据
function getHaplotypePaginationData() {
    return _.cloneDeep(haplotypePaginationData);
}
function getSNPPaginationData() {
    return _.cloneDeep(SNPPaginationData);
}
function getTranscriptPaginationData() {
    return _.cloneDeep(transcriptPaginationData);
}

// 获取echart参数数据
function getHaplotypeEchartParamsData() {
    return _.cloneDeep(haplotypeEchartParamsData);
}
function getSNPEchartParamsData() {
    return _.cloneDeep(SNPEchartParamsData);
}
function getTranscriptEchartParamsData() {
    return _.cloneDeep(transcriptEchartParamsData);
}

function getFormerTranscriptHighlightIndex() {
    return _.cloneDeep(formerTranscriptHighlightIndex);
}

function getCurrentGenome() {
    return _.cloneDeep(currentGenome);
}
function getCurrentIDIndex() {
    return _.cloneDeep(currentIDIndex);
}
function getNextSearchID() {
    return _.cloneDeep(nextSearchID);
}
function getPreviousSearchID() {
    return _.cloneDeep(previousSearchID);
}



// 数据请求, 相当于axios.get(url).then(response => response.data).catch(error => console.error('数据请求失败:', error));
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('数据请求失败:', error);
        throw error; // 重新抛出错误，让调用者处理
    }
}


// 请求全部数据
async function fetchRawData(type, searchKeyword) {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + apiPrefix[type] + '?' +
            apiPrefix.parameter.searchKeyword + searchKeyword;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        return data;
    } catch (error) {
        console.error(`${type}数据加载失败:`, error);
        return { type: type, data: [] }; // 返回一个空数据结构
    }
}

// 请求分页数据
async function fetchPaginationData(type, searchKeyword, page = 1) {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + apiPrefix[type] + '?' +
            apiPrefix.parameter.searchKeyword + searchKeyword + '&' +
            apiPrefix.parameter.page + page;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        // console.log(data);
        return data;
    } catch (error) {
        console.error(`${type}数据加载失败:`, error);
        return { numPages: 0, currentPage: 0, pageSize: 1, totalRecords: 0, searchKeyword: searchKeyword, type: type, data: [{}] }; // 返回一页空数据
    }
}

// 请求genomeIDList数据
async function fetchGenomeIDList() {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + 'getGenomeIDList/';
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        return data;
    } catch (error) {
        console.error('genomeIDList数据加载失败:', error);
        return { type: 'genomeIDList', data: [] }; // 返回一个空数据结构
    }
}

// 请求下一个genomeID
async function fetchNextSearchIDData(type, currentIDIndex) {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + apiPrefix[type] + '?' +
            apiPrefix.parameter.currentIDIndex + currentIDIndex;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        return data;
    } catch (error) {
        console.error(`${type}数据加载失败:`, error);
        return {}; // 返回一个空数据结构
    }
}

function updateData(type, data) {
    // 从映射中获取数据集对应的更新函数并调用它
    const func = updateDataFunctions[type];
    // console.log(type)
    // console.log(func);
    if (func) {
        func(data);
    } else {
        console.error(`未知的数据类型: ${type}`);
    }
}

function getData(type) {
    const func = getDataFunctions[type];
    if (func) {
        return func();
    } else {
        console.error(`未知的数据类型: ${type}`);
    }
}

// 验证genomeID是否合法
async function validateGenomeID(genomeID) {
    try {
        const dataRequestUrl = `${apiPrefix.IP}${apiPrefix.app}${apiPrefix.validateGenomeID}?${apiPrefix.parameter.genomeID}${genomeID}`;
        console.log(dataRequestUrl);
        const response = await fetch(dataRequestUrl);
        if (!response.ok) { // response.ok是一个布尔值，它在响应的状态码是200-299范围内时为true，表示请求成功了；在其他情况下是false，表示请求失败。
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const validateResult = await response.json();
        return validateResult;
    } catch (error) {
        console.error('Genome ID验证失败:', error);
        // 这里可以更新UI来向用户显示具体的错误信息
    }
}

function getCurrentPageName() {
    // 通过URL路径名来判断当前是哪个页面, 这里好像是弱匹配，即Full和full都会匹配到FullLengthTranscriptome
    const pathName = window.location.pathname;
    if (pathName.includes('index.html')) {
        return 'index';
    } else if (pathName.includes('fullLengthTranscriptome.html')) {
        return 'FullLengthTranscriptome';
    } else if (pathName.includes('geneExpressionProfile.html')) {
        return 'GeneExpressionProfile';
    } else if (pathName.includes('coExpressionNetwork.html')) {
        return 'CoExpressionNetwork';
    } else {
        return 'default';
    }
}


export { fetchRawData, fetchPaginationData, fetchGenomeIDList, fetchNextSearchIDData, updateData, getData, validateGenomeID, getCurrentPageName };
