// 将后端返回的数据转换为前端需要的数据格式
// 例如：
// [
//         {
//             "mosaicID": "GT42G000001",
//             "geneID": "GT42G000001.SO.0",
//             "geneType": "mosaic",
//             "length": 5420,
//             "Sequence": "ATCGATCG"
//         },
//         {
//             "mosaicID": "GT42G000001",
//             "geneID": "GT42G000001.SO.1",
//             "geneType": "haplotype1",
//             "length": 5420,
//             "Sequence": "ATCGATCG"
//         },
// ]
// 转换为
// [["GT42G000001", "GT42G000001.SO.0", "mosaic", 5420, "ATCGATCG"],
// ["GT42G000001", "GT42G000001.SO.1", "haplotype1", 5124, "ATCGATCG"]]
function transformData(data) {
    var transformedData = [];
    data.forEach(element => {
        var row = Object.values(element);  // 提取对象的所有值
        transformedData.push(row);  // 将值数组添加到结果数组中
    });
    return transformedData;
}


// 定义一个通用的 AJAX 请求函数，返回一个 Promise 对象, 用于并行请求，
// 因为 haplotypeData 和 SNPData 存储于两个数据表中，但是需要同时获取
function ajaxPromise(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url, data: data, type: 'GET', dataType: 'json',
            success: function (data) { resolve(data); },
            error: function (jqXHR, textStatus, errorThrown) { reject(textStatus + ' ' + errorThrown); }
        });
    });
}

// 直接将函数添加到 window 对象上可能会导致全局命名空间的污染，
// 因此将函数添加到一个命名空间对象中，然后将命名空间对象添加到全局对象中。
// 首先检查 window.myApp 是否已经存在。如果不存在，我们将其设置为一个空对象 {}。
const myGlobalFunctions = window.myGlobalFunctions || {};

// 将函数添加到 myApp 对象中
myGlobalFunctions.transformData = transformData;
myGlobalFunctions.ajaxPromise = ajaxPromise;

// 将 myApp 对象添加到全局对象中，通过window.myGlobalFunctions.函数名来调用函数
window.myGlobalFunctions = myGlobalFunctions;