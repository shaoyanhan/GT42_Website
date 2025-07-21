/**
 * 多功能搜索模块 - Multi-Function Search Module
 * 处理四种搜索功能：注释文本搜索、节点ID搜索、最短路径搜索、ID集合搜索
 */

// 多功能搜索状态管理
const MultiSearchState = {
    currentFunction: 'annotation_text',
    annotationSearch: {
        currentPage: 1,
        pageSize: 10,
        searchKeyword: '',
        sortBy: 'module_count',
        sortOrder: 'desc',
        totalRecords: 0,
        numPages: 0,
        currentData: []
    },
    // 其他搜索功能的状态将在后续实现
    isSearching: false,
    searchAbortController: null
};

// API基础URL
const API_BASE_URL = 'http://127.0.0.1:30004/searchDatabase';

/**
 * 初始化多功能搜索模块
 */
function initializeMultiSearch() {
    console.log('Initializing Multi-Function Search module...');
    
    try {
        // 设置事件监听器
        setupFunctionTabEvents();
        setupCollapseEvents();
        setupAnnotationSearchEvents();
        
        // 初始化默认功能（注释文本搜索）
        switchSearchFunction('annotation_text');
        
        console.log('Multi-Function Search module initialized successfully');
    } catch (error) {
        console.error('Error initializing Multi-Function Search module:', error);
    }
}

/**
 * 设置功能选择标签事件
 */
function setupFunctionTabEvents() {
    const functionTabs = document.querySelectorAll('.function_tab');
    
    functionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const functionType = tab.dataset.function;
            switchSearchFunction(functionType);
        });
    });
}

/**
 * 设置折叠/展开事件
 */
function setupCollapseEvents() {
    const collapseButton = document.querySelector('.multi_search_container .collapse_button');
    const searchContent = document.querySelector('.multi_search_content');
    
    if (collapseButton && searchContent) {
        collapseButton.addEventListener('click', () => {
            const isCollapsed = collapseButton.dataset.collapsed === 'true';
            
            if (isCollapsed) {
                // 展开
                searchContent.classList.remove('collapsed');
                collapseButton.dataset.collapsed = 'false';
                collapseButton.querySelector('.collapse_text').textContent = 'Collapse';
            } else {
                // 折叠
                searchContent.classList.add('collapsed');
                collapseButton.dataset.collapsed = 'true';
                collapseButton.querySelector('.collapse_text').textContent = 'Expand';
            }
        });
    }
}

/**
 * 切换搜索功能
 */
function switchSearchFunction(functionType) {
    console.log(`Switching to search function: ${functionType}`);
    
    // 更新状态
    MultiSearchState.currentFunction = functionType;
    
    // 更新标签样式
    document.querySelectorAll('.function_tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.function === functionType) {
            tab.classList.add('active');
        }
    });
    
    // 显示对应的输入区域
    document.querySelectorAll('.search_input_section').forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(`${functionType}_search`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // 清除搜索结果
    hideSearchResults();
    
    console.log(`Switched to ${functionType} search function`);
}

/**
 * 设置注释文本搜索事件
 */
function setupAnnotationSearchEvents() {
    const searchInput = document.getElementById('multi_annotation_search_input');
    const searchButton = document.getElementById('multi_annotation_search_button');
    const clearButton = document.getElementById('multi_annotation_clear_button');
    
    if (searchInput) {
        // 回车键搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeAnnotationSearch();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', executeAnnotationSearch);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearAnnotationSearch);
    }
    
    // 示例关键词点击事件
    const exampleKeywords = document.querySelectorAll('.annotation_example_section .example_keyword');
    exampleKeywords.forEach(keyword => {
        keyword.addEventListener('click', () => {
            const keywordValue = keyword.getAttribute('data-value');
            if (keywordValue && searchInput) {
                console.log(`Filling search input with example keyword: ${keywordValue}`);
                searchInput.value = keywordValue;
                
                // 触发搜索
                executeAnnotationSearch();
            }
        });
    });
}

/**
 * 执行注释文本搜索
 */
async function executeAnnotationSearch() {
    const searchInput = document.getElementById('multi_annotation_search_input');
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        alert('Please enter search keywords');
        return;
    }
    
    console.log(`Executing annotation search with keyword: ${keyword}`);
    
    // 取消之前的搜索请求
    if (MultiSearchState.searchAbortController) {
        MultiSearchState.searchAbortController.abort();
    }
    
    // 创建新的AbortController
    MultiSearchState.searchAbortController = new AbortController();
    
    // 重置状态并开始搜索
    MultiSearchState.annotationSearch.searchKeyword = keyword;
    MultiSearchState.annotationSearch.currentPage = 1;
    MultiSearchState.isSearching = true;
    
    try {
        await loadAnnotationSearchData();
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error executing annotation search:', error);
            showSearchError('Failed to execute search. Please try again.');
        }
    } finally {
        MultiSearchState.isSearching = false;
    }
}

/**
 * 清除注释文本搜索
 */
function clearAnnotationSearch() {
    const searchInput = document.getElementById('multi_annotation_search_input');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    // 取消正在进行的搜索
    if (MultiSearchState.searchAbortController) {
        MultiSearchState.searchAbortController.abort();
    }
    
    // 重置状态
    MultiSearchState.annotationSearch = {
        currentPage: 1,
        pageSize: 10,
        searchKeyword: '',
        sortBy: 'module_count',
        sortOrder: 'desc',
        totalRecords: 0,
        numPages: 0,
        currentData: []
    };
    
    // 隐藏搜索结果
    hideSearchResults();
    
    console.log('Annotation search cleared');
}

/**
 * 加载注释搜索数据
 */
async function loadAnnotationSearchData() {
    console.log('Loading annotation search data...', MultiSearchState.annotationSearch);
    
    const { searchKeyword, currentPage, pageSize, sortBy, sortOrder } = MultiSearchState.annotationSearch;
    
    if (!searchKeyword) {
        hideSearchResults();
        return;
    }
    
    // 显示加载状态
    showSearchLoading();
    
    try {
        // 构建API URL
        const params = new URLSearchParams({
            searchKeyword,
            page: currentPage.toString(),
            pageSize: pageSize.toString(),
            sortBy,
            sortOrder
        });
        
        const apiUrl = `${API_BASE_URL}/searchGoAnnotationsGlobally/?${params}`;
        console.log('Fetching from API:', apiUrl);
        
        const response = await fetch(apiUrl, {
            signal: MultiSearchState.searchAbortController?.signal
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // 更新状态
        MultiSearchState.annotationSearch.totalRecords = data.totalRecords || 0;
        MultiSearchState.annotationSearch.numPages = data.numPages || 0;
        MultiSearchState.annotationSearch.currentData = data.data || [];
        
        // 显示搜索结果
        displayAnnotationSearchResults(data);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Search request aborted');
            return;
        }
        
        console.warn('API request failed, using mock data:', error);
        
        // 使用模拟数据
        const mockData = generateMockAnnotationSearchData();
        MultiSearchState.annotationSearch.totalRecords = mockData.totalRecords;
        MultiSearchState.annotationSearch.numPages = mockData.numPages;
        MultiSearchState.annotationSearch.currentData = mockData.data;
        
        displayAnnotationSearchResults(mockData);
    }
}

/**
 * 生成模拟注释搜索数据
 */
function generateMockAnnotationSearchData() {
    const { searchKeyword, currentPage, pageSize, sortBy, sortOrder } = MultiSearchState.annotationSearch;
    
    const mockData = [
        {
            accession: "GO:0006355",
            description: "regulation of transcription, DNA-templated",
            ontology: "BP",
            node_count: 25,
            module_count: 8,
            module_ids: [1, 3, 5, 8, 12, 15, 20, 25]
        },
        {
            accession: "GO:0003700",
            description: "DNA-binding transcription factor activity",
            ontology: "MF",
            node_count: 18,
            module_count: 6,
            module_ids: [2, 5, 8, 12, 18, 22]
        },
        {
            accession: "GO:0005634",
            description: "nucleus",
            ontology: "CC",
            node_count: 42,
            module_count: 12,
            module_ids: [1, 2, 3, 5, 7, 8, 10, 12, 15, 18, 20, 25]
        },
        {
            accession: "GO:0045944",
            description: "positive regulation of transcription by RNA polymerase II",
            ontology: "BP",
            node_count: 15,
            module_count: 5,
            module_ids: [3, 8, 12, 15, 20]
        },
        {
            accession: "GO:0000981",
            description: "DNA-binding transcription factor activity, RNA polymerase II-specific",
            ontology: "MF",
            node_count: 12,
            module_count: 4,
            module_ids: [5, 8, 12, 20]
        }
    ];
    
    // 过滤包含搜索关键词的数据
    const filteredData = mockData.filter(item => 
        item.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.accession.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    
    // 排序
    filteredData.sort((a, b) => {
        let aVal, bVal;
        
        switch (sortBy) {
            case 'module_count':
                aVal = a.module_count;
                bVal = b.module_count;
                break;
            case 'accession':
                aVal = a.accession;
                bVal = b.accession;
                break;
            case 'description':
                aVal = a.description;
                bVal = b.description;
                break;
            default:
                aVal = a.module_count;
                bVal = b.module_count;
        }
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (sortOrder === 'desc') {
            return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
        } else {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
    });
    
    // 分页
    const totalRecords = filteredData.length;
    const numPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    return {
        type: "goAnnotationGlobalSearchPagination",
        numPages,
        currentPage,
        pageSize,
        totalRecords,
        searchKeyword,
        sortBy,
        sortOrder,
        data: pageData
    };
}

/**
 * 显示搜索加载状态
 */
function showSearchLoading() {
    const resultsContainer = document.getElementById('search_results_container');
    
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <div class="search_results_header">
                <h4 class="search_results_title">
                    <span class="title_icon">📝</span>
                    Annotation Text Search Results
                </h4>
            </div>
            <div class="loading_placeholder">
                <div class="loading_spinner"></div>
                <p>Searching GO annotations...</p>
            </div>
        `;
    }
}

/**
 * 显示搜索错误
 */
function showSearchError(message) {
    const resultsContainer = document.getElementById('search_results_container');
    
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <div class="search_results_header">
                <h4 class="search_results_title">
                    <span class="title_icon">❌</span>
                    Search Error
                </h4>
            </div>
            <div class="error_placeholder">
                <p>${message}</p>
                <button class="search_submit_button" onclick="executeAnnotationSearch()">
                    <span class="search_icon">🔄</span>
                    Retry Search
                </button>
            </div>
        `;
    }
}

/**
 * 隐藏搜索结果
 */
function hideSearchResults() {
    const resultsContainer = document.getElementById('search_results_container');
    
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
    }
}

/**
 * 显示注释搜索结果
 */
function displayAnnotationSearchResults(data) {
    console.log('Displaying annotation search results:', data);
    
    const resultsContainer = document.getElementById('search_results_container');
    
    if (!resultsContainer) {
        console.error('Search results container not found');
        return;
    }
    
    // 构建结果HTML
    const resultsHTML = `
        <div class="search_results_header">
            <h4 class="search_results_title">
                <span class="title_icon">📝</span>
                Annotation Text Search Results
            </h4>
            <div class="search_results_info">
                <div class="search_result_stat">
                    <span class="stat_label">Search Keyword:</span>
                    <span class="stat_value">"${data.searchKeyword}"</span>
                </div>
                <div class="search_result_stat">
                    <span class="stat_label">Total Results:</span>
                    <span class="stat_value">${data.totalRecords.toLocaleString()}</span>
                </div>
                <div class="search_result_stat">
                    <span class="stat_label">Current Page:</span>
                    <span class="stat_value">${data.currentPage}/${data.numPages}</span>
                </div>
            </div>
        </div>
        
        <div class="search_results_table_container">
            <div class="search_results_toolbar">
                <div class="search_results_controls">
                    <div class="sort_container">
                        <label for="annotation_results_sort">Sort by:</label>
                        <select id="annotation_results_sort" class="search_results_sort_select">
                            <option value="module_count" ${data.sortBy === 'module_count' ? 'selected' : ''}>Module Count</option>
                            <option value="description" ${data.sortBy === 'description' ? 'selected' : ''}>Description</option>
                            <option value="accession" ${data.sortBy === 'accession' ? 'selected' : ''}>GO Accession</option>
                        </select>
                        <button class="sort_order_button" id="annotation_results_sort_order" data-order="${data.sortOrder}">
                            ${data.sortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="search_results_table_scroll_container">
                <table class="search_results_table">
                    <thead>
                        <tr>
                            <th class="sortable" data-sort="accession">
                                Accession
                                <span class="sort_indicator ${data.sortBy === 'accession' ? data.sortOrder : ''}"></span>
                            </th>
                            <th class="sortable" data-sort="description">
                                Description
                                <span class="sort_indicator ${data.sortBy === 'description' ? data.sortOrder : ''}"></span>
                            </th>
                            <th class="no_sort">Ontology</th>
                            <th class="sortable" data-sort="module_count">
                                Module Count
                                <span class="sort_indicator ${data.sortBy === 'module_count' ? data.sortOrder : ''}"></span>
                            </th>
                            <th class="no_sort">Modules</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateAnnotationSearchTableRows(data.data)}
                    </tbody>
                </table>
            </div>
            
            ${generateSearchResultsPagination(data)}
        </div>
    `;
    
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.style.display = 'block';
    
    // 设置事件监听器
    setupAnnotationSearchResultsEvents();
    
    // 确保DOM更新后再更新排序UI - 使用稍微长一点的延迟确保DOM完全渲染
    setTimeout(() => {
        updateSortUI();
    }, 100);
    
    // 滚动到结果区域
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * 生成注释搜索表格行
 */
function generateAnnotationSearchTableRows(data) {
    if (!data || data.length === 0) {
        return `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #718096;">
                    No matching annotations found
                </td>
            </tr>
        `;
    }
    
    return data.map(item => {
        const modulesDisplay = generateModulesDisplay(item.module_ids, item.accession);
        
        return `
            <tr>
                <td>
                    <a href="https://amigo.geneontology.org/amigo/term/${item.accession}" 
                       target="_blank" class="go_accession_link">
                        ${item.accession}
                    </a>
                </td>
                <td>${item.description}</td>
                <td>
                    <span class="ontology_badge ${item.ontology}">${item.ontology}</span>
                </td>
                <td>${item.module_count}</td>
                <td>${modulesDisplay}</td>
            </tr>
        `;
    }).join('');
}

/**
 * 生成模块显示
 */
function generateModulesDisplay(moduleIds, accession) {
    if (!moduleIds || moduleIds.length === 0) {
        return '<span style="color: #718096;">-</span>';
    }
    
    const maxVisible = 3;
    const visibleModules = moduleIds.slice(0, maxVisible);
    const hasMore = moduleIds.length > maxVisible;
    
    let html = `<div class="modules_list">`;
    
    visibleModules.forEach(moduleId => {
        html += `<span class="module_pill">${moduleId}</span>`;
    });
    
    if (hasMore) {
        html += `<button class="modules_more_button" onclick="showModuleSelectionModal('${accession}', [${moduleIds.join(',')}])">
            +${moduleIds.length - maxVisible} more
        </button>`;
    }
    
    html += `</div>`;
    
    return html;
}

/**
 * 生成搜索结果分页
 */
function generateSearchResultsPagination(data) {
    if (data.numPages <= 1) {
        return '';
    }
    
    return `
        <div class="search_results_pagination_container">
            <div class="pagination_info">
                <span>Showing ${((data.currentPage - 1) * data.pageSize) + 1}-${Math.min(data.currentPage * data.pageSize, data.totalRecords)} of ${data.totalRecords.toLocaleString()} results</span>
            </div>
            <div class="pagination_controls">
                <div class="page_size_container">
                    <label for="annotation_results_page_size">Show:</label>
                    <select id="annotation_results_page_size" class="page_size_select">
                        <option value="10" ${data.pageSize === 10 ? 'selected' : ''}>10</option>
                        <option value="25" ${data.pageSize === 25 ? 'selected' : ''}>25</option>
                        <option value="50" ${data.pageSize === 50 ? 'selected' : ''}>50</option>
                        <option value="100" ${data.pageSize === 100 ? 'selected' : ''}>100</option>
                    </select>
                    <span>per page</span>
                </div>
                <div class="page_navigation">
                    <button class="nav_button" id="annotation_results_first_page" title="First page" ${data.currentPage === 1 ? 'disabled' : ''}>«</button>
                    <button class="nav_button" id="annotation_results_prev_page" title="Previous page" ${data.currentPage === 1 ? 'disabled' : ''}>‹</button>
                    ${generatePageNumbers(data)}
                    <button class="nav_button" id="annotation_results_next_page" title="Next page" ${data.currentPage === data.numPages ? 'disabled' : ''}>›</button>
                    <button class="nav_button" id="annotation_results_last_page" title="Last page" ${data.currentPage === data.numPages ? 'disabled' : ''}>»</button>
                </div>
                <div class="page_jump_container">
                    <label for="annotation_results_page_jump">Go to page:</label>
                    <input type="number" id="annotation_results_page_jump" class="page_jump_input" min="1" max="${data.numPages}" value="${data.currentPage}">
                    <button class="jump_button" id="annotation_results_jump_btn">Go</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * 生成页码按钮
 */
function generatePageNumbers(data) {
    const { currentPage, numPages } = data;
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(numPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    let html = '<div class="page_numbers">';
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page_number_button ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    html += '</div>';
    
    return html;
}

/**
 * 设置注释搜索结果事件监听器
 */
function setupAnnotationSearchResultsEvents() {
    // 表格排序
    document.querySelectorAll('.search_results_table th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const sortBy = th.dataset.sort;
            handleAnnotationSearchSort(sortBy);
        });
    });
    
    // 排序控件
    const sortSelect = document.getElementById('annotation_results_sort');
    const sortOrderBtn = document.getElementById('annotation_results_sort_order');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sortBy = sortSelect.value;
            handleAnnotationSearchSort(sortBy);
        });
    }
    
    if (sortOrderBtn) {
        sortOrderBtn.addEventListener('click', () => {
            const currentOrder = MultiSearchState.annotationSearch.sortOrder;
            const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
            
            // 直接更新按钮显示和状态
            sortOrderBtn.setAttribute('data-order', newOrder);
            sortOrderBtn.textContent = newOrder === 'asc' ? '↑' : '↓';
            
            // 更新状态
            MultiSearchState.annotationSearch.sortOrder = newOrder;
            
            console.log('Search results sort order changed to:', newOrder, 'Arrow:', sortOrderBtn.textContent);
            
            loadAnnotationSearchData();
        });
    }
    
    // 分页控件
    setupAnnotationSearchPaginationEvents();
}

/**
 * 更新排序UI元素
 */
function updateSortUI() {
    const sortSelect = document.getElementById('annotation_results_sort');
    const sortOrderBtn = document.getElementById('annotation_results_sort_order');
    
    if (sortSelect) {
        sortSelect.value = MultiSearchState.annotationSearch.sortBy;
    }
    
    if (sortOrderBtn) {
        // 直接按照主模块的方式更新按钮
        sortOrderBtn.setAttribute('data-order', MultiSearchState.annotationSearch.sortOrder);
        sortOrderBtn.textContent = MultiSearchState.annotationSearch.sortOrder === 'asc' ? '↑' : '↓';
        
        console.log('Search results sort UI updated - Order:', MultiSearchState.annotationSearch.sortOrder, 'Arrow:', sortOrderBtn.textContent);
    }
    
    // 更新表头排序指示器
    const tableHeaders = document.querySelectorAll('.search_results_table th.sortable');
    tableHeaders.forEach(header => {
        const sortIndicator = header.querySelector('.sort_indicator');
        if (sortIndicator) {
            const headerSort = header.dataset.sort;
            if (headerSort === MultiSearchState.annotationSearch.sortBy) {
                sortIndicator.className = `sort_indicator ${MultiSearchState.annotationSearch.sortOrder}`;
            } else {
                sortIndicator.className = 'sort_indicator';
            }
        }
    });
}

/**
 * 处理注释搜索排序
 */
function handleAnnotationSearchSort(sortBy) {
    console.log(`Sorting annotation search results by: ${sortBy}`);
    
    // 如果点击的是当前排序字段，切换排序方向
    if (MultiSearchState.annotationSearch.sortBy === sortBy) {
        MultiSearchState.annotationSearch.sortOrder = 
            MultiSearchState.annotationSearch.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        // 切换到新的排序字段，使用默认排序方向
        MultiSearchState.annotationSearch.sortBy = sortBy;
        MultiSearchState.annotationSearch.sortOrder = 
            sortBy === 'module_count' ? 'desc' : 'asc';
    }
    
    // 重置到第一页
    MultiSearchState.annotationSearch.currentPage = 1;
    
    // 更新排序UI
    updateSortUI();
    
    // 重新加载数据
    loadAnnotationSearchData();
}

/**
 * 设置注释搜索分页事件
 */
function setupAnnotationSearchPaginationEvents() {
    // 页码按钮
    document.querySelectorAll('.page_number_button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            handleAnnotationSearchPageChange(page);
        });
    });
    
    // 导航按钮
    const firstBtn = document.getElementById('annotation_results_first_page');
    const prevBtn = document.getElementById('annotation_results_prev_page');
    const nextBtn = document.getElementById('annotation_results_next_page');
    const lastBtn = document.getElementById('annotation_results_last_page');
    
    if (firstBtn) {
        firstBtn.addEventListener('click', () => handleAnnotationSearchPageChange(1));
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newPage = Math.max(1, MultiSearchState.annotationSearch.currentPage - 1);
            handleAnnotationSearchPageChange(newPage);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newPage = Math.min(MultiSearchState.annotationSearch.numPages, MultiSearchState.annotationSearch.currentPage + 1);
            handleAnnotationSearchPageChange(newPage);
        });
    }
    
    if (lastBtn) {
        lastBtn.addEventListener('click', () => handleAnnotationSearchPageChange(MultiSearchState.annotationSearch.numPages));
    }
    
    // 页面跳转
    const jumpInput = document.getElementById('annotation_results_page_jump');
    const jumpBtn = document.getElementById('annotation_results_jump_btn');
    
    if (jumpInput) {
        jumpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const page = parseInt(jumpInput.value);
                if (page >= 1 && page <= MultiSearchState.annotationSearch.numPages) {
                    handleAnnotationSearchPageChange(page);
                }
            }
        });
    }
    
    if (jumpBtn) {
        jumpBtn.addEventListener('click', () => {
            const page = parseInt(jumpInput.value);
            if (page >= 1 && page <= MultiSearchState.annotationSearch.numPages) {
                handleAnnotationSearchPageChange(page);
            }
        });
    }
    
    // 页面大小变更
    const pageSizeSelect = document.getElementById('annotation_results_page_size');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', () => {
            const newPageSize = parseInt(pageSizeSelect.value);
            MultiSearchState.annotationSearch.pageSize = newPageSize;
            MultiSearchState.annotationSearch.currentPage = 1; // 重置到第一页
            loadAnnotationSearchData();
        });
    }
}

/**
 * 处理注释搜索页面变更
 */
function handleAnnotationSearchPageChange(page) {
    console.log(`Changing annotation search page to: ${page}`);
    
    if (page < 1 || page > MultiSearchState.annotationSearch.numPages) {
        return;
    }
    
    MultiSearchState.annotationSearch.currentPage = page;
    loadAnnotationSearchData();
}

/**
 * 显示模块选择弹窗
 */
window.showModuleSelectionModal = function(searchContext, moduleIds) {
    console.log('Showing module selection modal:', { searchContext, moduleIds });
    
    const overlay = document.getElementById('module_selection_overlay');
    const modal = document.getElementById('module_selection_modal');
    const contextSpan = document.getElementById('modal_search_context');
    const countSpan = document.getElementById('modal_module_count');
    const gridContainer = document.getElementById('module_buttons_grid');
    
    if (!overlay || !modal) {
        console.error('Module selection modal elements not found');
        return;
    }
    
    // 更新弹窗内容
    if (contextSpan) {
        contextSpan.textContent = searchContext;
    }
    
    if (countSpan) {
        countSpan.textContent = moduleIds.length;
    }
    
    if (gridContainer) {
        gridContainer.innerHTML = moduleIds.map(moduleId => 
            `<button class="module_button" onclick="selectModuleFromSearch(${moduleId}, '${searchContext}')">
                Module ${moduleId}
            </button>`
        ).join('');
    }
    
    // 显示弹窗
    overlay.classList.add('active');
    
    // 设置关闭事件
    const closeBtn = document.getElementById('module_selection_close_btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            overlay.classList.remove('active');
        };
    }
    
    // 点击背景关闭
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    };
};

/**
 * 从搜索结果中选择模块
 */
window.selectModuleFromSearch = async function(moduleId, searchContext) {
    console.log(`Selecting module ${moduleId} from search context: ${searchContext}`);
    
    // 关闭弹窗
    const overlay = document.getElementById('module_selection_overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    try {
        // 使用主模块选择板块的selectModule函数
        if (window.TfNetworkUtils && window.TfNetworkUtils.selectModule) {
            window.TfNetworkUtils.selectModule(moduleId);
        } else {
            console.warn('TfNetworkUtils.selectModule not available, falling back to custom event');
            // 备用方案：触发模块选择事件
            const event = new CustomEvent('moduleSelected', {
                detail: { 
                    moduleId, 
                    moduleData: { 
                        module_id: moduleId,
                        node_count: 0,
                        edge_count: 0
                    },
                    source: 'search'
                }
            });
            
            document.dispatchEvent(event);
        }
        
        // 等待功能注释板块加载完成，然后填充搜索关键词
        setTimeout(() => {
            const annotationSearchInput = document.querySelector('.functional_annotation_container .annotation_search_input');
            if (annotationSearchInput && MultiSearchState.annotationSearch.searchKeyword) {
                annotationSearchInput.value = MultiSearchState.annotationSearch.searchKeyword;
                
                // 触发搜索事件
                const searchEvent = new Event('input', { bubbles: true });
                annotationSearchInput.dispatchEvent(searchEvent);
                
                // 滚动到功能注释板块
                const annotationContainer = document.querySelector('.functional_annotation_container');
                if (annotationContainer) {
                    annotationContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 1000); // 等待1秒让其他板块加载完成
        
    } catch (error) {
        console.error('Error selecting module from search:', error);
        alert('Failed to select module. Please try again.');
    }
};

// 将模块暴露到全局作用域，与其他模块保持一致
window.MultiSearchModule = {
    init: initializeMultiSearch
};

// 将必要的函数暴露到全局作用域
window.executeAnnotationSearch = executeAnnotationSearch; 