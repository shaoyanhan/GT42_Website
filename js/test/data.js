// 用于绘图和数据处理的全局变量
// 不能将数据定义放在main.js中，因为会导致main.js和echartsOptionHaplotype.js、echartsOptionTranscript.js之间的循环依赖问题
// let haplotypeData = [["GT42G000001", "GT42G000001.SO.0", "mosaic", 5420, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.1", "haplotype1", 5124, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.2", "haplotype2", 4634, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.3", "haplotype3", 4965, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.4", "haplotype4", 4965, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.5", "haplotype5", 4965, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.6", "haplotype6", 4965, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.7", "haplotype7", 4965, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.8", "haplotype8", 4965, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.9", "haplotype9", 4965, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.10", "haplotype10", 4965, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.11", "haplotype11", 5124, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.12", "haplotype12", 4634, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.13", "haplotype13", 4965, "ATCGATCG"],];


// let SNPData = [['GT42G000001', 'mosaic', 17, 'A/C', '10045/5210', '5921/1705', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#050f2c'],
// ['GT42G000001', 'mosaic', 32, 'C/G', '8346/3244', '2133/4543', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#003666'],
// ['GT42G000001', 'mosaic', 45, 'G/T', '10045/5210', '5921/1705', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#050f2c'],
// ['GT42G000001', 'mosaic', 56, 'T/A', '8346/3244', '2133/4543', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#003666'],
// ['GT42G000002', 'mosaic', 675, 'A/C/G', '10045/3410', '7521/1705', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#050f2c'],
// ['GT42G000002', 'mosaic', 175, 'A/G/C', '34045/5210', '5921/1755', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#050f2c'],
// ['GT42G000002', 'mosaic', 325, 'C/G/G', '8346/3444', '2133/7543', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#003666'],
// ['GT42G000002', 'mosaic', 455, 'G/G/T', '10045/3410', '7521/1705', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#050f2c'],
// ['GT42G000002', 'mosaic', 565, 'T/A/G', '8346/3244', '7533/4543', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#003666'],
// ['GT42G000002', 'mosaic', 675, 'A/G/C', '34045/5210', '5921/1755', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#050f2c'],];


// let transcriptData = [
//     { value: ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.0', 'haplotype', 1, 1, 140, 140, '1 - 140', 140], itemStyle: { color: 'black' } },
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.1', 'transcript1', 1, 1, 20, 20, '1 - 40', 40],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.1', 'transcript1', 0, 20, 30, 10, '1 - 40', 40],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.1', 'transcript1', 1, 30, 40, 10, '1 - 40', 40],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.2', 'transcript2', 0, 20, 30, 10, '20 - 50', 30],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.2', 'transcript2', 1, 30, 50, 20, '20 - 50', 30],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.3', 'transcript3', 1, 50, 80, 30, '50 - 80', 30],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.3', 'transcript3', 0, 80, 90, 10, '50 - 80', 30],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.3', 'transcript3', 1, 90, 100, 10, '50 - 80', 30],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.4', 'transcript4', 1, 100, 110, 10, '100 - 130', 30],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.4', 'transcript4', 0, 110, 120, 10, '100 - 130', 30],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.4', 'transcript4', 1, 120, 130, 10, '100 - 130', 30],
//     ['GT42G000001', 'GT42G000001.SO.1', 'GT42G000001.SO.1.5', 'transcript5', 1, 130, 140, 10, '130 - 140', 10],
// ];

let haplotypeData = [];
let SNPData = [];
let transcriptData = [];
let haplotypePaginationData = [];
let SNPPaginationData = [];
let transcriptPaginationData = [];

// 定义API请求的前缀
let apiPrefix = {
    IP: 'http://127.0.0.1:8080/',
    app: 'searchDatabase/',
    haplotype: 'getHaplotypeTable/',
    SNP: 'getSNPTable/',
    transcript: 'getTranscriptTable/',
    haplotypePagination: 'getHaplotypeTableByPage/',
    SNPPagination: 'getSNPTableByPage/',
    transcriptPagination: 'getTranscriptTableByPage/',
    parameter: {
        searchKeyword: 'searchKeyword=',
        page: 'page=',
    }
}
// 定义更新函数的映射关系, 从名称映射到函数
const updateDataFunctions = {
    haplotype: updateHaplotypeData,
    SNP: updateSNPData,
    transcript: updateTranscriptData,
    haplotypePagination: updateHaplotypePaginationData,
    SNPPagination: updateSNPPaginationData,
    transcriptPagination: updateTranscriptPaginationData,
};

const getDataFunctions = {
    haplotype: getHaplotypeData, // [{geneID: 'GT42G000001', ...}, {geneID: 'GT42G000002', ...} ...]
    SNP: getSNPData,
    transcript: getTranscriptData,
    haplotypePagination: getHaplotypePaginationData, // {data: [{geneID: 'GT42G000001', ...}, {geneID: 'GT42G000002', ...} ...], numPages: 1, currentPage: 1, pageSize: 10, totalRecords: 1}
    SNPPagination: getSNPPaginationData,
    transcriptPagination: getTranscriptPaginationData,
    haplotypeDataArray: getHaplotypeDataArray, // [['GT42G000001', ...], ['GT42G000002', ...] ...]
    SNPDataArray: getSNPDataArray,
    transcriptDataArray: getTranscriptDataArray,
};

// 更新数据，因为在ES6模块中，通过import导入的变量是只读的，不能被重新赋值。
function updateHaplotypeData(newData) {
    haplotypeData = newData;
}
function updateSNPData(newData) {
    SNPData = newData;
}
function updateTranscriptData(newData) {
    transcriptData = newData;
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

// 获取对象数组数据
function getHaplotypeData() {
    return haplotypeData;
}
function getSNPData() {
    return SNPData;
}
function getTranscriptData() {
    return transcriptData;
}
function getHaplotypePaginationData() {
    return haplotypePaginationData;
}
function getSNPPaginationData() {
    return SNPPaginationData;
}
function getTranscriptPaginationData() {
    return transcriptPaginationData;
}


// 获取二维数组数据
function getHaplotypeDataArray() {
    return haplotypeData.map(element => Object.values(element));
}
function getSNPDataArray() {
    return SNPData.map(element => Object.values(element));
}
function getTranscriptDataArray() {
    return transcriptData.map(element => Object.values(element));
    // let extractData = transcriptData.map(element => Object.values(element));
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
    }
}



// 请求全部数据
async function fetchAllData(type, searchKeyword) {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + apiPrefix[type] + '?' +
            apiPrefix.parameter.searchKeyword + searchKeyword;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        return data;
    } catch (error) {
        console.error(`${type}数据加载失败:`, error);
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
    }
}

function updateData(type, data) {
    // 从映射中获取数据集对应的更新函数并调用它
    const func = updateDataFunctions[type];
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

export {
    getHaplotypeData, getSNPData, getTranscriptData,
    getHaplotypeDataArray, getSNPDataArray, getTranscriptDataArray,
    fetchData, fetchAllData, fetchPaginationData, updateData, getData
};
