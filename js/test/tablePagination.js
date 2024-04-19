import { fetchPaginationData, getData, updateData } from './data.js';
import { createClickToCopyHandler } from './copyTextToClipboard.js';

// 更新表格的函数映射
let updateTableFunctions = {
    haplotype_table_container: updateHaplotypeTable,
    SNP_table_container: updateSNPTable,
    transcript_table_container: updateTranscriptTable,
};

// 更新haplotype表格
function updateHaplotypeTable(data, container) {
    container.innerHTML = '';  // 清空当前表格
    data.forEach(row => {
        const tr = document.createElement('tr');
        // 给核苷酸序列设置为点击复制按钮，附带自定义的data_属性，用于存储实际要复制的数据。
        tr.innerHTML = `<td>${row.mosaicID}</td>
                        <td>${row.geneID}</td>
                        <td>${row.areaType}</td>
                        <td>${row.length}</td>
                        <td><button class="copy_button" data_sequence="${row.nucleotideSequence}">Click to Copy</button></td>`;
        container.appendChild(tr);
    });
}

// 更新SNP表格
function updateSNPTable(data, container) {
    container.innerHTML = '';  // 清空当前表格
    data.forEach(row => {
        const tr = document.createElement('tr');
        // 给核苷酸序列设置为点击复制按钮，附带自定义的data_属性，用于存储实际要复制的数据。
        tr.innerHTML = `<td>${row.mosaicID}</td>
                        <td>${row.SNPSite}</td>
                        <td>${row.SNPType}</td>
                        <td>${row.IsoSeqEvidence}</td>
                        <td>${row.RNASeqEvidence}</td>
                        <td>${row.haplotypeSNP}</td>
                        <td>
                            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${row.color}"></div>
                        </td>`;
        container.appendChild(tr);
    });
}

// 更新transcript表格，表格头为mosaicID, geneID, transcriptID, transcriptIndex, areaType, start, end, length, transcriptRange, transcriptLength, proteinSequence, nucleotideSequence，最后两列为点击复制按钮
function updateTranscriptTable(data, container) {
    container.innerHTML = '';  // 清空当前表格
    data.forEach(row => {
        const tr = document.createElement('tr');
        // 给核苷酸序列设置为点击复制按钮，附带自定义的data_属性，用于存储实际要复制的数据。
        tr.innerHTML = `<td>${row.mosaicID}</td>
                        <td>${row.geneID}</td>
                        <td>${row.transcriptID}</td>
                        <td>${row.transcriptIndex}</td>
                        <td>${row.areaType}</td>
                        <td>${row.start}</td>
                        <td>${row.end}</td>
                        <td>${row.length}</td>
                        <td>${row.transcriptRange}</td>
                        <td>${row.transcriptLength}</td>
                        <td><button class="copy_button" data_sequence="${row.nucleotideSequence}">Click to Copy</button></td>
                        <td><button class="copy_button" data_sequence="${row.proteinSequence}">Click to Copy</button></td>`;
        container.appendChild(tr);
    });
}




// 更新表格的通用函数
function updateTable(data, container) {
    const tableBody = container.querySelector('tbody');
    const updateFunction = updateTableFunctions[container.id];
    if (updateFunction) {
        updateFunction(data, tableBody);
    } else {   // 如果没有对应的更新函数，输出错误信息
        console.error(`未知的表格类型: ${container.id}`);
    }
}

// 更新表格底部的脚注信息
function updateFooterNotes(numPages, currentPage, pageSize, totalRecords, container) {
    console.log(numPages, currentPage, pageSize);
    const footerNotes = container.querySelector('.footer_notes');
    footerNotes.innerHTML = '';  // 清空当前页码信息

    // 计算当前页的开始和结束记录号
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalRecords);

    // 创建一个span元素，显示当前页的记录号信息
    const noteSpan = document.createElement('span');
    noteSpan.innerText = `Showing ${start} to ${end} of ${totalRecords} entries`;
    footerNotes.appendChild(noteSpan);
}

// 更新分页导航
function updatePagination(numPages, currentPage, container) {
    const paginationDiv = container.querySelector('.pagination_container');
    paginationDiv.innerHTML = '';  // 清空当前分页导航

    // 添加Previous按钮
    if (currentPage > 1) { // 如果不是第一页，显示Previous按钮
        const prevLink = document.createElement('a');
        prevLink.href = '#';
        prevLink.innerText = 'Previous';
        paginationDiv.appendChild(prevLink);
    }

    // 计算开始和结束页码
    let startPage = Math.max(currentPage - 1, 1);
    let endPage = Math.min(currentPage + 1, numPages);

    // 如果当前页是第一页或第二页，确保显示3个页码（前提是总页数足够）
    if (currentPage <= 2) {
        startPage = 1;
        endPage = Math.min(3, numPages);
    }

    // 如果当前页是最后一页或倒数第二页，确保显示3个页码（前提是总页数足够）
    if (currentPage >= numPages - 1) {
        endPage = numPages;
        startPage = Math.max(numPages - 2, 1);
    }

    // 如果第一个页数标签不是1，在Previous按钮后添加第一页的页码，并随后添加省略号
    if (startPage != 1) {
        const firstPageLink = document.createElement('a');
        firstPageLink.href = '#';
        firstPageLink.innerText = 1;
        paginationDiv.appendChild(firstPageLink);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            paginationDiv.appendChild(ellipsis);
        }
    }

    // 生成3个主要页码链接
    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.innerText = i;
        pageLink.className = currentPage === i ? 'active' : ''; // 之后利用css高亮当前页按钮
        paginationDiv.appendChild(pageLink);
    }

    // 如果最后一个页数标签不是最后一页，在最后一个页数标签前添加省略号，并添加最后一页的页码
    if (endPage != numPages) {
        if (endPage < numPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            paginationDiv.appendChild(ellipsis);
        }
        const lastPageLink = document.createElement('a');
        lastPageLink.href = '#';
        lastPageLink.innerText = numPages;
        paginationDiv.appendChild(lastPageLink);
    }

    // 添加Next按钮
    if (currentPage < numPages) { // 如果不是最后一页，显示Next按钮
        const nextLink = document.createElement('a');
        nextLink.href = '#';
        nextLink.innerText = 'Next';
        paginationDiv.appendChild(nextLink);
    }
}

// 更新整个表格容器
function updateTableContainer(type, searchKeyword, page, container) {
    fetchPaginationData(type, searchKeyword, page).then(newPaginationDataObject => {
        updateData(type, newPaginationDataObject);
        updateTable(newPaginationDataObject.data, container);
        updateFooterNotes(newPaginationDataObject.numPages, newPaginationDataObject.currentPage, newPaginationDataObject.pageSize, newPaginationDataObject.totalRecords, container);
        updatePagination(newPaginationDataObject.numPages, newPaginationDataObject.currentPage, container);
    });
}

// 使用一个工厂函数来为每个分页组件生成事件处理器，以便能够处理特定的数据和容器。
// dataType 只有在点击页码组件的时候才用到，因为获取旧的分页数据对象需要用到它
function createPaginationClickHandler(container, dataType) {
    return function (event) {
        event.preventDefault(); // 阻止默认行为, 否则每次点击页码会刷新页面
        const target = event.target;
        if (target.tagName === 'A') {
            const pageText = target.innerText;
            const oldPaginationDataObject = getData(dataType);
            const { type, searchKeyword, currentPage } = oldPaginationDataObject; // 使用了 JavaScript 的解构赋值语法，它能够从oldPaginationDataObject对象中匹配出具有相同名称的键

            let newPage;
            if (pageText === 'Previous') {
                newPage = currentPage - 1; // 后端已确保不会低于1
            } else if (pageText === 'Next') {
                newPage = currentPage + 1; // 后端已确保不会超出最大页数
            } else {
                newPage = parseInt(pageText);
            }
            updateTableContainer(type, searchKeyword, newPage, container);
        }
    };
}

function setUpPaginationEventListeners(containerSelector, dataType) {
    const container = document.querySelector(containerSelector); // 获取表格容器结构
    // console.log(container);
    if (!container) {
        console.error('Pagination container not found!');
        return;
    }
    const paginationClickHandler = createPaginationClickHandler(container, dataType); // 生成该容器的事件处理器
    container.addEventListener('click', paginationClickHandler); // 为容器添加事件监听器
    const clickToCopyHandler = createClickToCopyHandler(); // 生成点击复制按钮的事件处理器
    container.addEventListener('click', clickToCopyHandler);
}


export { updateTableContainer, setUpPaginationEventListeners }; 