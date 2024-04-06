import { fetchPaginationData } from './data.js';

function updateTable(data) {
    const tableBody = document.getElementById('haplotype_table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';  // 清空当前表格
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.mosaicID}</td>
                        <td>${row.geneID}</td>
                        <td>${row.geneType}</td>
                        <td>${row.length}</td>
                        <td>${row.nucleotideSequence}</td>`;  // 根据你的数据模型调整
        tableBody.appendChild(tr);
    });
}

function updateFooterNotes(numPages, currentPage, pageSize, totalRecords) {
    console.log(numPages, currentPage, pageSize);
    const footerNotes = document.getElementById('footer_notes');
    footerNotes.innerHTML = '';  // 清空当前页码信息

    // 计算当前页的开始和结束记录号
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalRecords);

    // 创建一个span元素，显示当前页的记录号信息
    const noteSpan = document.createElement('span');
    noteSpan.innerText = `Showing ${start} to ${end} of ${totalRecords} entries`;
    footerNotes.appendChild(noteSpan);
}


function updatePagination(numPages, currentPage) {
    const paginationDiv = document.getElementById('pagination_container');
    paginationDiv.innerHTML = '';  // 清空当前分页导航

    // 添加Previous按钮
    if (currentPage > 1) { // 如果不是第一页，显示Previous按钮
        const prevLink = document.createElement('a');
        prevLink.href = '#';
        prevLink.innerText = 'Previous';
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            fetchPaginationData('haplotypePagination', 'GT42G000001', currentPage - 1);
        });
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

    // 生成页码链接
    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.innerText = i;
        pageLink.className = currentPage === i ? 'active' : ''; // 之后利用css高亮当前页按钮

        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            fetchPaginationData('haplotypePagination', 'GT42G000001', i);
        });
        paginationDiv.appendChild(pageLink);
    }

    // 添加Next按钮
    if (currentPage < numPages) { // 如果不是最后一页，显示Next按钮
        const nextLink = document.createElement('a');
        nextLink.href = '#';
        nextLink.innerText = 'Next';
        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            fetchPaginationData('haplotypePagination', 'GT42G000001', currentPage + 1);
        });
        paginationDiv.appendChild(nextLink);
    }
}

export { updateTable, updateFooterNotes, updatePagination };