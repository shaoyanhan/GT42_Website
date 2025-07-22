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
    nodeIdSearch: {
        nodeId: '',
        searchResults: null,
        isSearching: false
    },
    shortestPathSearch: {
        sourceNodeId: '',
        targetNodeId: '',
        commonModulesResults: null,
        selectedModuleId: null,
        pathsResults: null,
        currentPathIndex: 0,
        isSearchingModules: false,
        isSearchingPaths: false
    },
    idSetSearch: {
        idList: [],
        searchResults: null,
        selectedModuleId: null,
        isSearching: false
    },
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
        setupNodeIdSearchEvents();
        setupShortestPathSearchEvents();
        setupIdSetSearchEvents();
        
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
            const collapseIcon = collapseButton.querySelector('.collapse_icon');
            const collapseText = collapseButton.querySelector('.collapse_text');
            
            if (isCollapsed) {
                // 展开
                searchContent.classList.remove('collapsed');
                collapseButton.dataset.collapsed = 'false';
                if (collapseIcon) collapseIcon.textContent = '▼';
                if (collapseText) collapseText.textContent = 'Collapse';
            } else {
                // 折叠
                searchContent.classList.add('collapsed');
                collapseButton.dataset.collapsed = 'true';
                if (collapseIcon) collapseIcon.textContent = '▶';
                if (collapseText) collapseText.textContent = 'Expand';
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
 * 设置节点ID搜索事件
 */
function setupNodeIdSearchEvents() {
    const searchInput = document.getElementById('node_id_search_input');
    const searchButton = document.getElementById('node_id_search_button');
    const clearButton = document.getElementById('node_id_clear_button');
    
    if (searchInput) {
        // 回车键搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeNodeIdSearch();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', executeNodeIdSearch);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearNodeIdSearch);
    }
    
    // 示例节点ID点击事件
    const exampleNodeIds = document.querySelectorAll('.node_id_example_section .example_node_id');
    exampleNodeIds.forEach(nodeId => {
        nodeId.addEventListener('click', () => {
            const nodeIdValue = nodeId.getAttribute('data-value');
            if (nodeIdValue && searchInput) {
                console.log(`Filling search input with example node ID: ${nodeIdValue}`);
                searchInput.value = nodeIdValue;
                
                // 触发搜索
                executeNodeIdSearch();
            }
        });
    });
}

/**
 * 执行节点ID搜索
 */
async function executeNodeIdSearch() {
    const searchInput = document.getElementById('node_id_search_input');
    const nodeId = searchInput.value.trim();
    
    if (!nodeId) {
        alert('Please enter a node ID');
        return;
    }
    
    console.log(`Executing node ID search with node ID: ${nodeId}`);
    
    // 取消之前的搜索请求
    if (MultiSearchState.searchAbortController) {
        MultiSearchState.searchAbortController.abort();
    }
    
    // 创建新的AbortController
    MultiSearchState.searchAbortController = new AbortController();
    
    // 更新状态
    MultiSearchState.nodeIdSearch.nodeId = nodeId;
    MultiSearchState.nodeIdSearch.isSearching = true;
    MultiSearchState.isSearching = true;
    
    try {
        await loadNodeIdSearchData();
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error executing node ID search:', error);
            showSearchError('Failed to execute search. Please try again.');
        }
    } finally {
        MultiSearchState.nodeIdSearch.isSearching = false;
        MultiSearchState.isSearching = false;
    }
}

/**
 * 清除节点ID搜索
 */
function clearNodeIdSearch() {
    const searchInput = document.getElementById('node_id_search_input');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    // 取消正在进行的搜索
    if (MultiSearchState.searchAbortController) {
        MultiSearchState.searchAbortController.abort();
    }
    
    // 重置状态
    MultiSearchState.nodeIdSearch = {
        nodeId: '',
        searchResults: null,
        isSearching: false
    };
    
    // 隐藏搜索结果
    hideSearchResults();
    
    console.log('Node ID search cleared');
}

/**
 * 加载节点ID搜索数据
 */
async function loadNodeIdSearchData() {
    console.log('Loading node ID search data...', MultiSearchState.nodeIdSearch);
    
    const { nodeId } = MultiSearchState.nodeIdSearch;
    
    if (!nodeId) {
        hideSearchResults();
        return;
    }
    
    // 显示加载状态
    showNodeIdSearchLoading();
    
    try {
        // 构建API URL
        const params = new URLSearchParams({
            node_id: nodeId
        });
        
        const apiUrl = `${API_BASE_URL}/searchNodeInModules/?${params}`;
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
        MultiSearchState.nodeIdSearch.searchResults = data;
        
        // 显示搜索结果
        displayNodeIdSearchResults(data);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Search request aborted');
            return;
        }
        
        console.warn('API request failed, using mock data:', error);
        
        // 使用模拟数据
        const mockData = generateMockNodeIdSearchData();
        MultiSearchState.nodeIdSearch.searchResults = mockData;
        
        displayNodeIdSearchResults(mockData);
    }
}

/**
 * 生成模拟节点ID搜索数据
 */
function generateMockNodeIdSearchData() {
    const { nodeId } = MultiSearchState.nodeIdSearch;
    
    // 模拟数据：假设输入的节点存在于某些模块中
    const mockModuleIds = [1, 5, 12, 20];
    const nodeType = nodeId.includes('TF') ? 'TF' : 'Gene';
    
    return {
        type: "nodeInModules",
        node_id: nodeId,
        node_type: nodeType,
        module_count: mockModuleIds.length,
        module_ids: mockModuleIds
    };
}

/**
 * 显示节点ID搜索加载状态
 */
function showNodeIdSearchLoading() {
    const resultsContainer = document.getElementById('search_results_container');
    
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <div class="search_results_header">
                <h4 class="search_results_title">
                    <span class="title_icon">🆔</span>
                    Node ID Search Results
                </h4>
            </div>
            <div class="loading_placeholder">
                <div class="loading_spinner"></div>
                <p>Searching for node ID in modules...</p>
            </div>
        `;
    }
}

/**
 * 显示节点ID搜索结果
 */
function displayNodeIdSearchResults(data) {
    console.log('Displaying node ID search results:', data);
    
    const resultsContainer = document.getElementById('search_results_container');
    
    if (!resultsContainer) {
        console.error('Search results container not found');
        return;
    }
    
    // 检查是否找到结果
    if (!data.module_ids || data.module_ids.length === 0) {
        // 显示未找到结果的信息
        resultsContainer.innerHTML = `
            <div class="search_results_header">
                <h4 class="search_results_title">
                    <span class="title_icon">🆔</span>
                    Node ID Search Results
                </h4>
            </div>
            <div class="no_results_placeholder">
                <div class="no_results_icon">🔍</div>
                <h3>No Results Found</h3>
                <p>Node ID "${data.node_id}" was not found in any network modules.</p>
                <p>Please check the node ID format and try again.</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
        return;
    }
    
    // 构建结果HTML
    const resultsHTML = `
        <div class="search_results_header">
            <h4 class="search_results_title">
                <span class="title_icon">🆔</span>
                Node ID Search Results
            </h4>
        </div>
        
        <div class="node_id_search_results">
            <div class="node_info_card">
                <div class="node_info_header">
                    <h5 class="node_info_title">
                        <span class="node_icon">🧬</span>
                        Node Information
                    </h5>
                </div>
                <div class="node_info_content">
                    <div class="node_info_item">
                        <span class="info_label">Node ID:</span>
                        <span class="info_value node_id_value">${data.node_id}</span>
                    </div>
                    <div class="node_info_item">
                        <span class="info_label">Node Type:</span>
                        <span class="info_value">
                            <span class="node_type_badge ${data.node_type.toLowerCase()}">${data.node_type}</span>
                        </span>
                    </div>
                    <div class="node_info_item">
                        <span class="info_label">Found in Modules:</span>
                        <span class="info_value module_count_value">${data.module_count} modules</span>
                    </div>
                </div>
            </div>
            
            <div class="modules_results_card">
                <div class="modules_results_header">
                    <h5 class="modules_results_title">
                        <span class="modules_icon">📊</span>
                        Available Network Modules
                    </h5>
                    <p class="modules_results_description">
                        Click on any module to explore its regulatory network with "${data.node_id}" as the core node.
                    </p>
                </div>
                <div class="modules_grid_container">
                    <div class="modules_grid">
                        ${data.module_ids.map(moduleId => `
                            <div class="module_result_card clickable" onclick="selectModuleFromNodeIdSearch(${moduleId}, '${data.node_id}', '${data.node_type}')">
                                <div class="module_result_header">
                                    <span class="module_result_id">Module ${moduleId}</span>
                                </div>
                                <div class="module_result_action">
                                    <span class="action_icon">🕸️</span>
                                    <span class="action_text">Draw Core Network</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.style.display = 'block';
    
    // 滚动到结果区域
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * 从节点ID搜索结果中选择模块
 */
window.selectModuleFromNodeIdSearch = async function(moduleId, nodeId, nodeType) {
    console.log(`Selecting module ${moduleId} from node ID search - Node: ${nodeId} (${nodeType})`);
    
    try {
        // 1. 选择模块（触发模块选择面板和相关面板的更新）
        if (window.TfNetworkUtils && window.TfNetworkUtils.selectModule) {
            window.TfNetworkUtils.selectModule(moduleId);
        } else {
            console.warn('TfNetworkUtils.selectModule not available, falling back to custom event');
            const event = new CustomEvent('moduleSelected', {
                detail: { 
                    moduleId, 
                    moduleData: { 
                        module_id: moduleId,
                        node_count: 0,
                        edge_count: 0
                    },
                    source: 'node_id_search'
                }
            });
            
            document.dispatchEvent(event);
        }
        
        // 2. 等待其他面板加载完成，然后直接绘制核心网络
        setTimeout(async () => {
            console.log(`Drawing core network for node ${nodeId} in module ${moduleId}`);
            
            // 触发绘制核心网络事件
            const drawNetworkEvent = new CustomEvent('drawCoreNetwork', {
                detail: {
                    nodeId: nodeId,
                    moduleId: moduleId,
                    nodeType: nodeType,
                    source: 'node_id_search'
                }
            });
            
            document.dispatchEvent(drawNetworkEvent);
            
            // 3. 确保网络可视化面板展开并滚动到该面板
            setTimeout(() => {
                const networkContainer = document.querySelector('.network_visualization_container');
                if (networkContainer) {
                    // 确保面板是展开的
                    const collapseButton = networkContainer.querySelector('.collapse_button');
                    if (collapseButton && collapseButton.dataset.collapsed === 'true') {
                        collapseButton.click(); // 展开面板
                    }
                    
                    // 滚动到网络面板
                    networkContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    console.log('Scrolled to network visualization panel');
                }
            }, 500); // 再等待500ms确保网络绘制完成
            
        }, 1500); // 等待1.5秒让模块选择和功能注释面板加载完成
        
    } catch (error) {
        console.error('Error selecting module from node ID search:', error);
        alert('Failed to select module and draw network. Please try again.');
    }
};

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
        const modulesDisplay = generateModulesDisplay(item.module_ids, item.accession, item.ontology);
        
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
function generateModulesDisplay(moduleIds, accession, ontology) {
    if (!moduleIds || moduleIds.length === 0) {
        return '<span style="color: #718096;">-</span>';
    }
    
    const maxVisible = 3;
    const visibleModules = moduleIds.slice(0, maxVisible);
    const hasMore = moduleIds.length > maxVisible;
    
    let html = `<div class="modules_list">`;
    
    visibleModules.forEach(moduleId => {
        html += `<span class="module_pill clickable" onclick="selectModuleFromSearch(${moduleId}, '${accession}', '${ontology}')" title="Click to select Module ${moduleId}">${moduleId}</span>`;
    });
    
    if (hasMore) {
        html += `<button class="modules_more_button" onclick="showModuleSelectionModal('${accession}', [${moduleIds.join(',')}], '${ontology}')">
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
window.showModuleSelectionModal = function(searchContext, moduleIds, ontology) {
    console.log('Showing module selection modal:', { searchContext, moduleIds, ontology });
    
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
            `<button class="module_button" onclick="selectModuleFromSearch(${moduleId}, '${searchContext}', '${ontology}')">
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
window.selectModuleFromSearch = async function(moduleId, searchContext, ontology) {
    console.log(`Selecting module ${moduleId} from search context: ${searchContext}, ontology: ${ontology}`);
    
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
        
        // 等待功能注释板块加载完成，然后切换到指定Tab并填充搜索关键词
        setTimeout(() => {
            if (window.FunctionalAnnotationModule && window.FunctionalAnnotationModule.switchToTabAndSearch) {
                // 使用新的接口切换到指定Tab并执行搜索
                window.FunctionalAnnotationModule.switchToTabAndSearch(ontology || 'BP', MultiSearchState.annotationSearch.searchKeyword);
            } else {
                console.warn('FunctionalAnnotationModule.switchToTabAndSearch not available, falling back to old method');
                // 备用方案：使用原有的搜索方法（只能搜索默认的BP Tab）
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
            }
        }, 1000); // 等待1秒让其他板块加载完成
        
    } catch (error) {
        console.error('Error selecting module from search:', error);
        alert('Failed to select module. Please try again.');
    }
};

/**
 * =========================
 * 最短路径搜索功能实现
 * =========================
 */

/**
 * 设置最短路径搜索事件
 */
function setupShortestPathSearchEvents() {
    const sourceInput = document.getElementById('source_node_input');
    const targetInput = document.getElementById('target_node_input');
    const swapButton = document.getElementById('swap_nodes_button');
    const exampleButton = document.getElementById('path_example_button');
    const searchButton = document.getElementById('shortest_path_search_button');
    const clearButton = document.getElementById('shortest_path_clear_button');
    
    // 输入框回车键搜索
    if (sourceInput) {
        sourceInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeShortestPathSearch();
            }
        });
    }
    
    if (targetInput) {
        targetInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeShortestPathSearch();
            }
        });
    }
    
    // 交换按钮事件
    if (swapButton) {
        swapButton.addEventListener('click', swapSourceAndTarget);
    }
    
    // 示例按钮事件
    if (exampleButton) {
        exampleButton.addEventListener('click', fillExampleNodes);
    }
    
    // 搜索按钮事件
    if (searchButton) {
        searchButton.addEventListener('click', executeShortestPathSearch);
    }
    
    // 清除按钮事件
    if (clearButton) {
        clearButton.addEventListener('click', clearShortestPathSearch);
    }
}

/**
 * 交换source和target输入框的内容
 */
function swapSourceAndTarget() {
    const sourceInput = document.getElementById('source_node_input');
    const targetInput = document.getElementById('target_node_input');
    
    if (sourceInput && targetInput) {
        const sourceValue = sourceInput.value;
        const targetValue = targetInput.value;
        
        // 添加交换动画效果
        sourceInput.style.transform = 'translateX(10px)';
        targetInput.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            sourceInput.value = targetValue;
            targetInput.value = sourceValue;
            
            // 重置动画
            sourceInput.style.transform = '';
            targetInput.style.transform = '';
            
            console.log('Swapped source and target node IDs');
        }, 150);
    }
}

/**
 * 填充示例节点ID
 */
function fillExampleNodes() {
    const sourceInput = document.getElementById('source_node_input');
    const targetInput = document.getElementById('target_node_input');
    
    if (sourceInput && targetInput) {
        sourceInput.value = 'SGI006524.SO.004';
        targetInput.value = 'SGI009824.SS.003';
        
        console.log('Filled example node IDs');
        
        // 自动触发搜索
        executeShortestPathSearch();
    }
}

/**
 * 执行最短路径搜索
 */
async function executeShortestPathSearch() {
    const sourceInput = document.getElementById('source_node_input');
    const targetInput = document.getElementById('target_node_input');
    
    if (!sourceInput || !targetInput) {
        console.error('Search input elements not found');
        return;
    }
    
    const sourceNodeId = sourceInput.value.trim();
    const targetNodeId = targetInput.value.trim();
    
    if (!sourceNodeId || !targetNodeId) {
        alert('Please enter both source and target node IDs');
        return;
    }
    
    if (sourceNodeId === targetNodeId) {
        alert('Source and target node IDs cannot be the same');
        return;
    }
    
    console.log(`Executing shortest path search: ${sourceNodeId} -> ${targetNodeId}`);
    
    // 更新状态
    MultiSearchState.shortestPathSearch.sourceNodeId = sourceNodeId;
    MultiSearchState.shortestPathSearch.targetNodeId = targetNodeId;
    MultiSearchState.shortestPathSearch.isSearchingModules = true;
    MultiSearchState.shortestPathSearch.commonModulesResults = null;
    MultiSearchState.shortestPathSearch.pathsResults = null;
    
    try {
        // 第一步：搜索两个节点的共同模块
        const response = await fetch(`${API_BASE_URL}/searchTwoNodesCommonModules/?node_id1=${encodeURIComponent(sourceNodeId)}&node_id2=${encodeURIComponent(targetNodeId)}`);
        
        let data;
        if (response.ok) {
            data = await response.json();
            console.log('Common modules search response:', data);
        } else {
            console.warn('API request failed, using mock data');
            data = generateMockCommonModulesData(sourceNodeId, targetNodeId);
        }
        
        // 更新状态
        MultiSearchState.shortestPathSearch.commonModulesResults = data;
        MultiSearchState.shortestPathSearch.isSearchingModules = false;
        
        // 显示搜索结果
        displayShortestPathResults(data);
        
    } catch (error) {
        console.error('Error in shortest path search:', error);
        
        // 使用模拟数据作为备选
        const mockData = generateMockCommonModulesData(sourceNodeId, targetNodeId);
        MultiSearchState.shortestPathSearch.commonModulesResults = mockData;
        MultiSearchState.shortestPathSearch.isSearchingModules = false;
        
        displayShortestPathResults(mockData);
    }
}

/**
 * 生成模拟共同模块数据
 */
function generateMockCommonModulesData(nodeId1, nodeId2) {
    return {
        "type": "twoNodesCommonModules",
        "node_id1": nodeId1,
        "node_id1_type": "Gene",
        "node_id2": nodeId2,
        "node_id2_type": "TF",
        "common_module_count": 2,
        "common_module_ids": [1, 5]
    };
}

/**
 * 显示最短路径搜索结果
 */
function displayShortestPathResults(data) {
    const resultsContainer = document.getElementById('search_results_container');
    if (!resultsContainer) return;
    
    // 创建结果HTML
    const resultsHTML = createShortestPathResultsHTML(data);
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.style.display = 'block';
    
    // 设置事件委托（只需要设置一次）
    setupCommonModuleEventDelegation();
    
    console.log('Displayed shortest path search results');
}

/**
 * 创建最短路径搜索结果HTML
 */
function createShortestPathResultsHTML(data) {
    const { node_id1, node_id1_type, node_id2, node_id2_type, common_module_count, common_module_ids } = data;
    
    return `
        <div class="shortest_path_results">
            <div class="path_search_info">
                <h4 style="margin: 0 0 16px 0; color: #2d3748; display: flex; align-items: center; gap: 8px;">
                    <span>🛤️</span>
                    Common Modules Search Results
                </h4>
                
                <div class="path_search_summary">
                    <div class="path_summary_item">
                        <div class="path_summary_label">Source Node</div>
                        <div class="path_summary_value">${node_id1}</div>
                        <div class="path_summary_label">${node_id1_type}</div>
                    </div>
                    <div class="path_summary_item">
                        <div class="path_summary_label">Target Node</div>
                        <div class="path_summary_value">${node_id2}</div>
                        <div class="path_summary_label">${node_id2_type}</div>
                    </div>
                    <div class="path_summary_item">
                        <div class="path_summary_label">Common Modules</div>
                        <div class="path_summary_value">${common_module_count}</div>
                    </div>
                </div>
                
                ${common_module_count > 0 ? `
                    <div class="common_modules_list">
                        <h5 style="margin: 0 0 8px 0; color: #4a5568;">
                            Click a module to find shortest paths:
                        </h5>
                        <div class="common_modules_grid">
                            ${common_module_ids.map(moduleId => `
                                <button class="common_module_button" data-module-id="${moduleId}">
                                    Module ${moduleId}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : `
                    <div style="text-align: center; color: #e53e3e; margin-top: 16px;">
                        <p><strong>No common modules found</strong></p>
                        <p>These two nodes do not appear together in any network module.</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// 标记是否已经设置了事件委托
let isCommonModuleEventDelegationSetup = false;

/**
 * 设置共同模块按钮事件委托（只需要设置一次）
 */
function setupCommonModuleEventDelegation() {
    if (isCommonModuleEventDelegationSetup) {
        console.log('Common module event delegation already setup');
        return;
    }
    
    const resultsContainer = document.getElementById('search_results_container');
    if (resultsContainer) {
        // 使用事件委托绑定点击事件
        resultsContainer.addEventListener('click', async (event) => {
            // 检查点击的是否是共同模块按钮
            if (event.target.classList.contains('common_module_button') || 
                event.target.closest('.common_module_button')) {
                
                const button = event.target.classList.contains('common_module_button') 
                    ? event.target 
                    : event.target.closest('.common_module_button');
                
                if (button && button.dataset.moduleId) {
                    const moduleId = parseInt(button.dataset.moduleId);
                    console.log(`Module button ${moduleId} clicked via delegation`);
                    await searchShortestPathsInModule(moduleId);
                }
            }
        });
        
        isCommonModuleEventDelegationSetup = true;
        console.log('Setup common module event delegation');
    }
}

/**
 * 绑定共同模块按钮事件（兼容性保留）
 */
function bindCommonModuleEvents() {
    // 现在只需要确保事件委托已设置
    setupCommonModuleEventDelegation();
}

/**
 * 显示最短路径搜索加载遮罩
 */
function showPathSearchLoading(moduleId, sourceId, targetId) {
    // 创建遮罩HTML
    const loadingHTML = `
        <div class="path_search_loading_overlay" id="path_search_loading_overlay">
            <div class="path_search_loading_content">
                <div class="path_search_loading_spinner"></div>
                <h4 class="path_search_loading_title">Searching Shortest Paths</h4>
                <p class="path_search_loading_message">
                    Finding regulatory paths in the network...
                </p>
                <div class="path_search_loading_details">
                    <strong>Module:</strong> ${moduleId}<br>
                    <strong>From:</strong> ${sourceId}<br>
                    <strong>To:</strong> ${targetId}
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
    
    // 禁用搜索控件
    const searchContainer = document.querySelector('.multi_search_container');
    if (searchContainer) {
        searchContainer.classList.add('search_controls_disabled');
    }
    
    console.log('Showing path search loading overlay');
}

/**
 * 隐藏最短路径搜索加载遮罩
 */
function hidePathSearchLoading() {
    const loadingOverlay = document.getElementById('path_search_loading_overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
    
    // 启用搜索控件
    const searchContainer = document.querySelector('.multi_search_container');
    if (searchContainer) {
        searchContainer.classList.remove('search_controls_disabled');
    }
    
    console.log('Hidden path search loading overlay');
}

/**
 * 在指定模块中搜索最短路径
 */
async function searchShortestPathsInModule(moduleId) {
    console.log(`Searching shortest paths in module ${moduleId}`);
    
    const { sourceNodeId, targetNodeId } = MultiSearchState.shortestPathSearch;
    
    // 显示加载遮罩
    showPathSearchLoading(moduleId, sourceNodeId, targetNodeId);
    
    // 更新状态
    MultiSearchState.shortestPathSearch.selectedModuleId = moduleId;
    MultiSearchState.shortestPathSearch.isSearchingPaths = true;
    MultiSearchState.shortestPathSearch.pathsResults = null;
    MultiSearchState.shortestPathSearch.currentPathIndex = 0;
    
    try {
        // 请求最短路径数据
        const response = await fetch(`${API_BASE_URL}/getNetworkShortestPaths/?module_id=${moduleId}&source_node_id=${encodeURIComponent(sourceNodeId)}&target_node_id=${encodeURIComponent(targetNodeId)}`);
        
        let data;
        if (response.ok) {
            data = await response.json();
            console.log('Shortest paths response:', data);
        } else {
            console.warn('API request failed, using mock data');
            data = generateMockShortestPathsData(moduleId, sourceNodeId, targetNodeId);
        }
        
        // 更新状态
        MultiSearchState.shortestPathSearch.pathsResults = data;
        MultiSearchState.shortestPathSearch.isSearchingPaths = false;
        
        // 隐藏加载遮罩
        hidePathSearchLoading();
        
        // 显示路径结果
        displayPathsVisualization(data);
        
    } catch (error) {
        console.error('Error searching shortest paths:', error);
        
        // 使用模拟数据
        const mockData = generateMockShortestPathsData(moduleId, sourceNodeId, targetNodeId);
        MultiSearchState.shortestPathSearch.pathsResults = mockData;
        MultiSearchState.shortestPathSearch.isSearchingPaths = false;
        
        // 隐藏加载遮罩
        hidePathSearchLoading();
        
        displayPathsVisualization(mockData);
    }
}

/**
 * 生成模拟最短路径数据
 */
function generateMockShortestPathsData(moduleId, sourceNodeId, targetNodeId) {
    return {
        "type": "networkShortestPaths",
        "module_id": moduleId,
        "source_node_id": sourceNodeId,
        "source_node_type": "Gene",
        "target_node_id": targetNodeId,
        "target_node_type": "TF",
        "path_found": true,
        "shortest_distance": 2,
        "path_count": 2,
        "paths": [
            [
                {"node_id": sourceNodeId, "node_type": "Gene"},
                {"node_id": "SGI000100.SO.002", "node_type": "TF"},
                {"node_id": targetNodeId, "node_type": "TF"}
            ],
            [
                {"node_id": sourceNodeId, "node_type": "Gene"},
                {"node_id": "SGI000200.SO.003", "node_type": "Gene"},
                {"node_id": targetNodeId, "node_type": "TF"}
            ]
        ]
    };
}

/**
 * 显示路径可视化
 */
function displayPathsVisualization(data) {
    const resultsContainer = document.getElementById('search_results_container');
    if (!resultsContainer) return;
    
    // 获取现有的共同模块结果HTML
    const existingResults = resultsContainer.querySelector('.shortest_path_results');
    if (!existingResults) return;
    
    // 清除现有的路径可视化容器（如果存在）
    const existingPathsContainer = existingResults.querySelector('.paths_visualization_container');
    if (existingPathsContainer) {
        existingPathsContainer.remove();
    }
    
    // 创建路径可视化HTML
    const pathsVisualizationHTML = createPathsVisualizationHTML(data);
    
    // 添加到现有结果中
    existingResults.innerHTML += pathsVisualizationHTML;
    
    // 绑定路径可视化事件
    bindPathsVisualizationEvents(data);
    
    console.log('Displayed paths visualization');
}

/**
 * 创建路径可视化HTML
 */
function createPathsVisualizationHTML(data) {
    const { module_id, path_found, shortest_distance, path_count, paths } = data;
    
    // 使用当前状态中的节点ID，确保切换后显示正确的方向
    const currentSourceId = MultiSearchState.shortestPathSearch.sourceNodeId;
    const currentTargetId = MultiSearchState.shortestPathSearch.targetNodeId;
    
    if (!path_found) {
        return `
            <div class="paths_visualization_container">
                <div class="paths_viz_header">
                    <h4 class="paths_viz_title">
                        <span>🚫</span>
                        No Paths Found in Module ${module_id}
                    </h4>
                    <div class="paths_viz_controls">
                        <button class="path_download_button" id="download_paths_btn" disabled style="opacity: 0.5;">
                            <span>📥</span>
                            Download Paths
                        </button>
                    </div>
                </div>
                
                <div class="no_paths_info">
                    <div class="no_paths_message">
                        <div class="no_paths_icon">🛤️</div>
                        <h5 class="no_paths_title">No shortest path exists from ${currentSourceId} to ${currentTargetId}</h5>
                        <p class="no_paths_description">
                            Since this is a directed regulatory network, paths have directionality. You can try swapping the Source and Target node order.
                        </p>
                    </div>
                    
                    <div class="no_paths_actions">
                        <button class="swap_and_retry_button" id="swap_and_retry_btn" 
                                data-module-id="${module_id}"
                                data-source="${currentSourceId}" 
                                data-target="${currentTargetId}">
                            <span class="swap_icon">⇄</span>
                            Try reverse direction: ${currentTargetId} → ${currentSourceId}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="paths_visualization_container">
            <div class="paths_viz_header">
                <h4 class="paths_viz_title">
                    <span>🛤️</span>
                    Shortest Paths in Module ${module_id}
                </h4>
                
                <div class="paths_viz_controls">
                    <button class="path_download_button" id="download_paths_btn">
                        <span>📥</span>
                        Download Paths
                    </button>
                </div>
            </div>
            
            <div class="paths_summary_info">
                <div class="paths_summary_item">
                    <div class="paths_summary_label">Path Distance</div>
                    <div class="paths_summary_value">${shortest_distance}</div>
                </div>
                <div class="paths_summary_item">
                    <div class="paths_summary_label">Total Paths</div>
                    <div class="paths_summary_value">${path_count}</div>
                </div>
                <div class="paths_summary_item">
                    <div class="paths_summary_label">Current Path</div>
                    <div class="paths_summary_value"><span id="current_path_num">1</span> / ${path_count}</div>
                </div>
            </div>
            
            <div class="path_canvas_container">
                <div class="path_canvas" id="path_canvas">
                    <!-- 路径将在这里动态渲染 -->
                </div>
            </div>
            
            <div class="paths_navigation_bottom">
                <button class="path_nav_button" id="prev_path_btn" ${path_count <= 1 ? 'disabled' : ''}>
                    ← Previous Path
                </button>
                <button class="path_nav_button" id="next_path_btn" ${path_count <= 1 ? 'disabled' : ''}>
                    Next Path →
                </button>
            </div>
            
            <div class="path_node_annotations" id="path_node_annotations" style="display: none;">
                <!-- 节点注释信息将在这里显示 -->
            </div>
        </div>
    `;
}

/**
 * 绑定路径可视化事件
 */
function bindPathsVisualizationEvents(data) {
    const prevBtn = document.getElementById('prev_path_btn');
    const nextBtn = document.getElementById('next_path_btn');
    const downloadBtn = document.getElementById('download_paths_btn');
    const swapAndRetryBtn = document.getElementById('swap_and_retry_btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigatePath(-1, data));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigatePath(1, data));
    }
    
    if (downloadBtn && !downloadBtn.disabled) {
        downloadBtn.addEventListener('click', () => downloadShortestPaths(data));
    }
    
    if (swapAndRetryBtn) {
        swapAndRetryBtn.addEventListener('click', () => handleSwapAndRetry(swapAndRetryBtn));
    }
    
    // 如果找到了路径，渲染第一条路径
    if (data.path_found) {
        renderCurrentPath(data);
    }
}

/**
 * 导航路径（前进/后退）
 */
function navigatePath(direction, data) {
    const currentIndex = MultiSearchState.shortestPathSearch.currentPathIndex;
    const pathCount = data.path_count;
    
    let newIndex = currentIndex + direction;
    
    // 循环导航
    if (newIndex < 0) {
        newIndex = pathCount - 1;
    } else if (newIndex >= pathCount) {
        newIndex = 0;
    }
    
    MultiSearchState.shortestPathSearch.currentPathIndex = newIndex;
    
    // 更新UI
    const currentPathNum = document.getElementById('current_path_num');
    if (currentPathNum) {
        currentPathNum.textContent = newIndex + 1;
    }
    
    // 渲染新路径
    renderCurrentPath(data);
    
    console.log(`Navigated to path ${newIndex + 1}`);
}

/**
 * 渲染当前路径
 */
function renderCurrentPath(data) {
    const canvas = document.getElementById('path_canvas');
    if (!canvas) return;
    
    const currentIndex = MultiSearchState.shortestPathSearch.currentPathIndex;
    const currentPath = data.paths[currentIndex];
    
    if (!currentPath) return;
    
    // 创建路径HTML
    let pathHTML = '<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">';
    
    currentPath.forEach((node, index) => {
        const nodeTypeClass = node.node_type === 'TF' ? 'tf_node' : 'gene_node';
        
        pathHTML += `
            <div class="path_node" data-node-id="${node.node_id}" data-node-type="${node.node_type}">
                <div class="path_node_circle ${nodeTypeClass}">
                    ${node.node_type === 'TF' ? 'TF' : 'G'}
                </div>
                <div class="path_node_id">${node.node_id}</div>
            </div>
        `;
        
        // 添加箭头（除了最后一个节点）
        if (index < currentPath.length - 1) {
            pathHTML += '<div class="path_arrow">→</div>';
        }
    });
    
    pathHTML += '</div>';
    canvas.innerHTML = pathHTML;
    
    // 绑定节点点击事件
    bindPathNodeEvents();
}

/**
 * 绑定路径节点事件
 */
function bindPathNodeEvents() {
    const pathNodes = document.querySelectorAll('.path_node');
    
    pathNodes.forEach(node => {
        node.addEventListener('click', async () => {
            const nodeId = node.dataset.nodeId;
            const nodeType = node.dataset.nodeType;
            
            console.log(`Clicked path node: ${nodeId} (${nodeType})`);
            
            // 获取节点注释信息
            await displayPathNodeAnnotations(nodeId, nodeType);
        });
    });
}

/**
 * 显示路径节点注释信息
 */
async function displayPathNodeAnnotations(nodeId, nodeType) {
    const annotationsContainer = document.getElementById('path_node_annotations');
    if (!annotationsContainer) return;
    
    try {
        // 请求节点注释信息
        const response = await fetch(`${API_BASE_URL}/getNetworkNodeGoAnnotations/?node_id=${encodeURIComponent(nodeId)}`);
        
        let data;
        if (response.ok) {
            data = await response.json();
        } else {
            // 使用模拟数据
            data = generateMockNodeAnnotations(nodeId, nodeType);
        }
        
        // 显示注释信息
        const annotationsHTML = createPathNodeAnnotationsHTML(data);
        annotationsContainer.innerHTML = annotationsHTML;
        annotationsContainer.style.display = 'block';
        
        // 滚动到注释区域
        annotationsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error fetching node annotations:', error);
        
        // 使用模拟数据
        const mockData = generateMockNodeAnnotations(nodeId, nodeType);
        const annotationsHTML = createPathNodeAnnotationsHTML(mockData);
        annotationsContainer.innerHTML = annotationsHTML;
        annotationsContainer.style.display = 'block';
    }
}

/**
 * 生成模拟节点注释数据
 */
function generateMockNodeAnnotations(nodeId, nodeType) {
    return {
        "type": "nodeGoAnnotations",
        "node_id": nodeId,
        "node_type": nodeType,
        "annotation_count": 2,
        "data": [
            {
                "accession": "GO:0005829",
                "description": "cytosol",
                "ontology": "CC"
            },
            {
                "accession": "GO:0016491",
                "description": "oxidoreductase activity",
                "ontology": "MF"
            }
        ]
    };
}

/**
 * 创建路径节点注释HTML
 */
function createPathNodeAnnotationsHTML(data) {
    const { node_id, node_type, annotation_count, data: annotations } = data;
    
    // 按ontology分组
    const groupedAnnotations = {
        'BP': annotations.filter(ann => ann.ontology === 'BP'),
        'MF': annotations.filter(ann => ann.ontology === 'MF'),
        'CC': annotations.filter(ann => ann.ontology === 'CC')
    };
    
    return `
        <div class="go_annotations_elegant">
            <div class="go_annotations_header">
                <span style="font-size: 24px;">📖</span>
                <h5 class="go_annotations_title">GO Annotations for ${node_id}</h5>
                <span class="go_annotations_badge">${node_type}</span>
            </div>
            
            ${annotation_count > 0 ? `
                <div class="go_annotations_grid">
                    ${Object.entries(groupedAnnotations).map(([ontology, anns]) => {
                        if (anns.length === 0) return '';
                        
                        const ontologyInfo = {
                            'BP': { name: 'Biological Process', icon: '🧬' },
                            'MF': { name: 'Molecular Function', icon: '⚙️' },
                            'CC': { name: 'Cellular Component', icon: '🏠' }
                        };
                        
                        const info = ontologyInfo[ontology];
                        
                        return `
                            <div class="go_annotation_category">
                                <div class="go_category_header">
                                    <span class="go_category_icon">${info.icon}</span>
                                    <h6 class="go_category_title">${info.name}</h6>
                                    <span class="go_category_count">${anns.length}</span>
                                </div>
                                ${anns.map(ann => `
                                    <div class="go_annotation_item">
                                        <a href="https://amigo.geneontology.org/amigo/term/${ann.accession}" 
                                           target="_blank" 
                                           class="go_annotation_accession">
                                            ${ann.accession}
                                        </a>
                                        <p class="go_annotation_description">
                                            ${ann.description}
                                        </p>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : `
                <div class="go_no_annotations">
                    <p>No GO annotations available for this node.</p>
                </div>
            `}
        </div>
    `;
}

/**
 * 下载最短路径数据
 */
function downloadShortestPaths(data) {
    const { module_id, paths } = data;
    
    // 使用当前状态中的节点ID
    const currentSourceId = MultiSearchState.shortestPathSearch.sourceNodeId;
    const currentTargetId = MultiSearchState.shortestPathSearch.targetNodeId;
    
    // 创建CSV数据
    let csvContent = 'Path_Index,Step,Node_ID,Node_Type\n';
    
    paths.forEach((path, pathIndex) => {
        path.forEach((node, stepIndex) => {
            csvContent += `${pathIndex + 1},${stepIndex + 1},${node.node_id},${node.node_type}\n`;
        });
    });
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shortest_paths_${currentSourceId}_to_${currentTargetId}_module_${module_id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log('Downloaded shortest paths data');
}

/**
 * 处理切换ID并重试
 */
async function handleSwapAndRetry(button) {
    const moduleId = parseInt(button.dataset.moduleId);
    const originalSource = button.dataset.source;
    const originalTarget = button.dataset.target;
    
    console.log(`Swapping IDs and retrying: ${originalTarget} -> ${originalSource} in module ${moduleId}`);
    
    // 更新前端输入框
    const sourceInput = document.getElementById('source_node_input');
    const targetInput = document.getElementById('target_node_input');
    
    if (sourceInput && targetInput) {
        // 添加切换动画效果
        sourceInput.style.transform = 'translateX(10px)';
        targetInput.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            sourceInput.value = originalTarget;
            targetInput.value = originalSource;
            
            // 重置动画
            sourceInput.style.transform = '';
            targetInput.style.transform = '';
        }, 150);
    }
    
    // 更新状态
    MultiSearchState.shortestPathSearch.sourceNodeId = originalTarget;
    MultiSearchState.shortestPathSearch.targetNodeId = originalSource;
    
    // 更新共同模块搜索结果状态
    if (MultiSearchState.shortestPathSearch.commonModulesResults) {
        MultiSearchState.shortestPathSearch.commonModulesResults.node_id1 = originalTarget;
        MultiSearchState.shortestPathSearch.commonModulesResults.node_id2 = originalSource;
        
        // 重新生成共同模块搜索结果HTML以反映新的ID顺序
        const resultsContainer = document.getElementById('search_results_container');
        if (resultsContainer) {
            const resultsHTML = createShortestPathResultsHTML(MultiSearchState.shortestPathSearch.commonModulesResults);
            resultsContainer.innerHTML = resultsHTML;
            
            // 确保事件委托已设置（事件委托在容器上，所以重新生成HTML后仍然有效）
            setupCommonModuleEventDelegation();
        }
    }
    
    // 等待动画完成后重新搜索
    setTimeout(async () => {
        try {
            // 显示加载状态
            button.textContent = 'Swapping direction and searching...';
            button.disabled = true;
            
            // 清除现有的路径可视化容器（如果存在）
            const existingPathsContainer = document.querySelector('.paths_visualization_container');
            if (existingPathsContainer) {
                existingPathsContainer.remove();
            }
            
            // 重新搜索路径
            await searchShortestPathsInModule(moduleId);
            
        } catch (error) {
            console.error('Error in swap and retry:', error);
            
            // 确保隐藏加载遮罩
            hidePathSearchLoading();
            
            // 恢复按钮状态
            button.innerHTML = `
                <span class="swap_icon">⇄</span>
                Try reverse direction: ${originalSource} → ${originalTarget}
            `;
            button.disabled = false;
        }
    }, 200);
}

/**
 * 清除最短路径搜索
 */
function clearShortestPathSearch() {
    const sourceInput = document.getElementById('source_node_input');
    const targetInput = document.getElementById('target_node_input');
    
    if (sourceInput) sourceInput.value = '';
    if (targetInput) targetInput.value = '';
    
    // 重置状态
    MultiSearchState.shortestPathSearch = {
        sourceNodeId: '',
        targetNodeId: '',
        commonModulesResults: null,
        selectedModuleId: null,
        pathsResults: null,
        currentPathIndex: 0,
        isSearchingModules: false,
        isSearchingPaths: false
    };
    
    // 隐藏搜索结果
    hideSearchResults();
    
    console.log('Cleared shortest path search');
}

// 将模块暴露到全局作用域，与其他模块保持一致
window.MultiSearchModule = {
    init: initializeMultiSearch
};

/**
 * 设置ID集合搜索事件
 */
function setupIdSetSearchEvents() {
    console.log('Setting up ID set search events...');
    
    const textarea = document.getElementById('id_set_textarea');
    const searchButton = document.getElementById('id_set_search_button');
    const clearButton = document.getElementById('id_set_clear_button');
    const fileUpload = document.getElementById('id_file_upload');
    const exampleButton = document.getElementById('id_set_example_button_new');
    
    if (searchButton) {
        searchButton.addEventListener('click', executeIdSetSearch);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearIdSetSearch);
    }
    
    if (fileUpload) {
        fileUpload.addEventListener('change', handleIdFileUpload);
    }
    
    if (exampleButton) {
        exampleButton.addEventListener('click', fillIdSetExample);
    }
    
    if (textarea) {
        // 回车键搜索（仅在按下Ctrl+Enter时）
        textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                executeIdSetSearch();
            }
        });
    }
    
    console.log('ID set search events set up successfully');
}

/**
 * 执行ID集合搜索
 */
async function executeIdSetSearch() {
    const textarea = document.getElementById('id_set_textarea');
    const searchButton = document.getElementById('id_set_search_button');
    
    if (!textarea) {
        console.error('ID set textarea not found');
        return;
    }
    
    const inputText = textarea.value.trim();
    if (!inputText) {
        alert('Please enter ID list or upload a file');
        return;
    }
    
    // 解析输入的ID列表
    const idList = parseIdList(inputText);
    if (idList.length === 0) {
        alert('No valid IDs found in the input');
        return;
    }
    
    console.log('Executing ID set search with:', idList);
    
    // 更新状态
    MultiSearchState.idSetSearch.idList = idList;
    MultiSearchState.idSetSearch.isSearching = true;
    
    // 更新UI
    if (searchButton) {
        searchButton.disabled = true;
        searchButton.innerHTML = '<span class="search_icon">⏳</span> Searching...';
    }
    
    try {
        // 调用API进行模块分类
        const results = await classifyNodesByModules(idList);
        
        // 更新状态
        MultiSearchState.idSetSearch.searchResults = results;
        MultiSearchState.idSetSearch.isSearching = false;
        
        // 显示搜索结果
        displayIdSetSearchResults(results);
        
        console.log('ID set search completed successfully');
        
    } catch (error) {
        console.error('Error in ID set search:', error);
        
        // 使用模拟数据
        const mockResults = getMockIdSetResults(idList);
        MultiSearchState.idSetSearch.searchResults = mockResults;
        displayIdSetSearchResults(mockResults);
        
        // 显示错误提示但继续显示模拟结果
        showTemporaryMessage('API unavailable, showing example results', 'warning');
        
    } finally {
        // 恢复UI状态
        MultiSearchState.idSetSearch.isSearching = false;
        if (searchButton) {
            searchButton.disabled = false;
            searchButton.innerHTML = '<span class="search_icon">🔍</span> Search';
        }
    }
}

/**
 * 解析ID列表输入
 */
function parseIdList(inputText) {
    // 支持换行符、逗号、空格等分隔符
    const ids = inputText
        .split(/[\n,\s\t]+/)
        .map(id => id.trim())
        .filter(id => id.length > 0)
        .filter(id => /^SGI\d+\.(SO|SS)\.?\d*/.test(id)); // 简单的ID格式验证
    
    // 去重
    return [...new Set(ids)];
}

/**
 * 处理文件上传
 */
function handleIdFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('Processing uploaded file:', file.name);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const textarea = document.getElementById('id_set_textarea');
        if (textarea) {
            // 如果已有内容，询问是否替换
            if (textarea.value.trim()) {
                if (confirm('Replace existing content with file content?')) {
                    textarea.value = content;
                } else {
                    textarea.value += '\n' + content;
                }
            } else {
                textarea.value = content;
            }
        }
        
        console.log('File content loaded into textarea');
    };
    
    reader.readAsText(file);
}

/**
 * 调用模块分类API
 */
async function classifyNodesByModules(nodeIds) {
    const url = `${API_BASE_URL}/classifyNodesByModules/`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ node_ids: nodeIds })
    });
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * 显示ID集合搜索结果
 */
function displayIdSetSearchResults(results) {
    console.log('Displaying ID set search results:', results);
    
    const resultsContainer = document.getElementById('search_results_container');
    if (!resultsContainer) {
        console.error('Search results container not found');
        return;
    }
    
    const resultHTML = createIdSetResultsHTML(results);
    resultsContainer.innerHTML = resultHTML;
    resultsContainer.style.display = 'block';
    
    // 设置事件监听器
    setupIdSetResultsEventListeners();
}

/**
 * 创建ID集合搜索结果HTML
 */
function createIdSetResultsHTML(results) {
    if (!results || !results.modules || Object.keys(results.modules).length === 0) {
        return `
            <div class="search_results_section">
                <div class="results_header">
                    <h4 class="results_title">
                        <span class="results_icon">❌</span>
                        No Results Found
                    </h4>
                </div>
                <div class="no_results_content">
                    <p>No valid IDs found in any modules. Please check your input and try again.</p>
                </div>
            </div>
        `;
    }
    
    const foundCount = results.found_nodes || 0;
    const totalCount = results.total_input_nodes || 0;
    const moduleCount = results.module_count || 0;
    const notFoundNodes = results.not_found_nodes || [];
    
    return `
        <div class="search_results_section">
            <div class="results_header">
                <h4 class="results_title">
                    <span class="results_icon">📊</span>
                    ID Set Classification Results
                </h4>
                <div class="results_summary">
                    <span class="summary_item">
                        <strong>Found:</strong> ${foundCount}/${totalCount} IDs
                    </span>
                    <span class="summary_item">
                        <strong>Modules:</strong> ${moduleCount}
                    </span>
                </div>
            </div>
            
            ${notFoundNodes.length > 0 ? `
                <div class="not_found_section">
                    <h5 class="section_subtitle">
                        <span class="subtitle_icon">⚠️</span>
                        Not Found IDs (${notFoundNodes.length})
                    </h5>
                    <div class="not_found_ids">
                        ${notFoundNodes.map(id => `<span class="not_found_id">${id}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="modules_results_section">
                <h5 class="section_subtitle">
                    <span class="subtitle_icon">🎯</span>
                    Available Modules with Matching IDs
                </h5>
                <div class="modules_grid_container">
                    <div class="modules_grid">
                        ${Object.values(results.modules).map(module => `
                        <div class="module_result_card" data-module-id="${module.module_id}">
                            <div class="module_card_header">
                                <h6 class="module_card_title">Module ${module.module_id}</h6>
                                <span class="module_card_count">${module.node_count} IDs</span>
                            </div>
                            <div class="module_card_content">
                                <div class="module_nodes_preview_container">
                                    <div class="module_nodes_preview_scroll">
                                        ${module.nodes.map(node => `
                                            <span class="node_preview ${node.node_type === 'TF' ? 'tf_node' : 'gene_node'}" title="${node.node_id}">
                                                ${node.node_id}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            <div class="module_card_actions">
                                <button class="module_select_button" data-module-id="${module.module_id}">
                                    <span class="action_icon">🕸️</span>
                                    Draw Subnetwork
                                </button>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 设置ID集合搜索结果事件监听器
 */
function setupIdSetResultsEventListeners() {
    // 模块选择按钮事件
    document.querySelectorAll('.module_select_button').forEach(button => {
        button.addEventListener('click', handleModuleSelectionForIdSet);
    });
}

/**
 * 处理模块选择（ID集合搜索）
 */
async function handleModuleSelectionForIdSet(event) {
    const button = event.currentTarget;
    const moduleId = parseInt(button.dataset.moduleId);
    
    if (isNaN(moduleId)) {
        console.error('Invalid module ID');
        return;
    }
    
    console.log('Selected module for ID set:', moduleId, 'Type:', typeof moduleId);
    console.log('Current search results:', MultiSearchState.idSetSearch.searchResults);
    
    // 更新状态
    MultiSearchState.idSetSearch.selectedModuleId = moduleId;
    
    // 更新按钮状态
    button.disabled = true;
    button.innerHTML = '<span class="action_icon">⏳</span> Processing...';
    
    try {
        // 1. 触发主模块选择板块更新
        const moduleSelectEvent = new CustomEvent('selectModuleFromSearch', {
            detail: { moduleId: moduleId }
        });
        document.dispatchEvent(moduleSelectEvent);
        
        // 2. 等待短暂时间让模块选择完成
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 3. 绘制子网络
        await drawSubnetworkForIdSet(moduleId);
        
        console.log('Module selection and subnetwork drawing completed');
        
    } catch (error) {
        console.error('Error in module selection for ID set:', error);
        alert('Error drawing subnetwork. Please try again.');
        
    } finally {
        // 恢复按钮状态
        button.disabled = false;
        button.innerHTML = '<span class="action_icon">🕸️</span> Draw Subnetwork';
    }
}

/**
 * 绘制ID集合的子网络
 */
async function drawSubnetworkForIdSet(moduleId) {
    const idList = MultiSearchState.idSetSearch.idList;
    const results = MultiSearchState.idSetSearch.searchResults;
    
    if (!results || !results.modules) {
        throw new Error('Search results not found');
    }
    
    // 确保moduleId被正确处理（处理字符串键和数字键的情况）
    const moduleData = results.modules[moduleId] || results.modules[String(moduleId)];
    
    if (!moduleData) {
        console.error('Available modules:', Object.keys(results.modules));
        throw new Error(`Module data not found for module ID: ${moduleId}`);
    }
    const moduleNodeIds = moduleData.nodes.map(node => node.node_id);
    
    console.log('Drawing subnetwork for module:', moduleId, 'with IDs:', moduleNodeIds);
    console.log('Module data used:', moduleData);
    
    // 触发绘制子网络事件
    const drawSubnetworkEvent = new CustomEvent('drawSubnetwork', {
        detail: {
            moduleId: moduleId,
            nodeIds: moduleNodeIds,
            sourceType: 'idSet' // 标识这是来自ID集合搜索
        }
    });
    
    console.log('Dispatching drawSubnetwork event with detail:', drawSubnetworkEvent.detail);
    document.dispatchEvent(drawSubnetworkEvent);
    console.log('drawSubnetwork event dispatched successfully');
    
    // 滚动到网络可视化板块
    setTimeout(() => {
        const networkContainer = document.querySelector('.network_visualization_container');
        if (networkContainer) {
            networkContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }, 100);
}

/**
 * 填充ID集合示例
 */
function fillIdSetExample() {
    const textarea = document.getElementById('id_set_textarea');
    if (!textarea) return;
    
    const exampleIds = [
        'SGI001901.SS.006',
        'SGI000027.SO.008',
        'SGI000027.SO.010',
        'SGI000027.SO.011',
        'SGI000027.SO.012',
        'SGI000027.SO.013',
        'SGI000027.SS.002',
        'SGI000027.SS.003',
        'SGI000027.SS.004'
    ];
    
    textarea.value = exampleIds.join('\n');
    console.log('Filled ID set example');
}

/**
 * 清除ID集合搜索
 */
function clearIdSetSearch() {
    const textarea = document.getElementById('id_set_textarea');
    const fileUpload = document.getElementById('id_file_upload');
    
    if (textarea) textarea.value = '';
    if (fileUpload) fileUpload.value = '';
    
    // 重置状态
    MultiSearchState.idSetSearch = {
        idList: [],
        searchResults: null,
        selectedModuleId: null,
        isSearching: false
    };
    
    // 隐藏搜索结果
    hideSearchResults();
    
    console.log('Cleared ID set search');
}

/**
 * 显示临时消息
 */
function showTemporaryMessage(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // 创建临时消息元素
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'warning' ? '#f59e0b' : '#10b981'};
        color: white;
        border-radius: 6px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(messageElement);
    
    // 3秒后自动移除
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 3000);
}

/**
 * 获取模拟ID集合搜索结果
 */
function getMockIdSetResults(idList) {
    // 模拟分类结果
    const mockResults = {
        type: "nodeModuleClassification",
        total_input_nodes: idList.length,
        found_nodes: Math.min(idList.length, idList.length - 1),
        not_found_nodes: idList.length > 3 ? [idList[idList.length - 1]] : [],
        module_count: Math.min(3, Math.ceil(idList.length / 2)),
        modules: {}
    };
    
    // 为前几个ID创建模块（包含module 0以支持测试）
    const availableModules = [0, 5, 12, 23, 41];
    let moduleIndex = 0;
    
    for (let i = 0; i < Math.min(3, Math.ceil(idList.length / 2)); i++) {
        const moduleId = availableModules[moduleIndex++];
        const moduleNodeCount = Math.min(3, idList.length - i);
        const moduleNodes = [];
        
        for (let j = 0; j < moduleNodeCount && (i * 2 + j) < idList.length - 1; j++) {
            const nodeId = idList[i * 2 + j];
            moduleNodes.push({
                node_id: nodeId,
                node_type: nodeId.includes('.SO.') ? 'Gene' : 'TF'
            });
        }
        
        mockResults.modules[moduleId] = {
            module_id: moduleId,
            node_count: moduleNodes.length,
            nodes: moduleNodes
        };
    }
    
    return mockResults;
}

// 将必要的函数暴露到全局作用域
window.executeAnnotationSearch = executeAnnotationSearch; 