
function validateSearchForm(searchKeyword) {
    // var input = document.getElementById('search_input').value;

    var mosaicPattern = /^GT42G\d{6}$/;
    var genePattern = /^GT42G\d{1,6}\.[A-Z]{2}\.\d{1,2}$/;
    var transcriptPattern = /^GT42G\d{1,6}\.[A-Z]{2}\.\d{1,2}\.\d{1,2}$/;

    if (mosaicPattern.test(searchKeyword)) {
        // 输入符合mosaicID的格式
        alert("Valid mosaicID format");
        // 在这里添加代码来处理有效的mosaicID
    } else if (genePattern.test(searchKeyword)) {
        // 输入符合geneID的格式
        alert("Valid geneID format");
        // 在这里添加代码来处理有效的geneID
    } else if (transcriptPattern.test(searchKeyword)) {
        // 输入符合transcriptID的格式
        alert("Valid transcriptID format");
        // 在这里添加代码来处理有效的transcriptID
    } else {
        // 输入不符合任何已知的格式
        alert("Invalid ID format. Please enter a valid ID.");
        return false;
    }
    return true;
}




export { validateSearchForm };
