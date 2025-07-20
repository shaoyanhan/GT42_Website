// 功能注释信息板块模块
// 处理GO功能注释的显示、搜索、分页、排序和交互功能

// 功能注释板块状态管理
const FunctionalAnnotationState = {
    currentModuleId: null,       // 当前选中的模块ID
    currentOntology: 'BP',       // 当前选中的本体类型 (BP/MF/CC)
    tabStates: {                 // 各标签页独立状态
        BP: {
            currentPage: 1,
            pageSize: 10,
            searchKeyword: '',
            sortBy: 'id_count',
            sortOrder: 'desc',
            totalRecords: 0,
            numPages: 0,
            currentData: []
        },
        MF: {
            currentPage: 1,
            pageSize: 10,
            searchKeyword: '',
            sortBy: 'id_count',
            sortOrder: 'desc',
            totalRecords: 0,
            numPages: 0,
            currentData: []
        },
        CC: {
            currentPage: 1,
            pageSize: 10,
            searchKeyword: '',
            sortBy: 'id_count',
            sortOrder: 'desc',
            totalRecords: 0,
            numPages: 0,
            currentData: []
        }
    },
    tabCounts: {                 // 各标签页数量统计
        BP: 0,
        MF: 0, 
        CC: 0
    },
    isLoading: false,            // 加载状态
    isInitialized: false         // 初始化状态
};

/**
 * 获取当前标签页的状态
 */
function getCurrentTabState() {
    return FunctionalAnnotationState.tabStates[FunctionalAnnotationState.currentOntology];
}

/**
 * 重置指定标签页的状态
 */
function resetTabState(ontology) {
    FunctionalAnnotationState.tabStates[ontology] = {
        currentPage: 1,
        pageSize: 10,
        searchKeyword: '',
        sortBy: 'id_count',
        sortOrder: 'desc',
        totalRecords: 0,
        numPages: 0,
        currentData: []
    };
}

/**
 * 保存当前UI状态到对应的标签页状态
 */
function saveCurrentUIState() {
    const currentTab = getCurrentTabState();
    
    // 保存搜索关键词
    const searchInput = document.getElementById('annotation_search_input');
    if (searchInput) {
        currentTab.searchKeyword = searchInput.value.trim();
    }
    
    // 保存排序状态
    const sortSelect = document.getElementById('annotation_sort_select');
    if (sortSelect) {
        currentTab.sortBy = sortSelect.value;
    }
    
    const sortOrderButton = document.getElementById('annotation_sort_order');
    if (sortOrderButton) {
        currentTab.sortOrder = sortOrderButton.getAttribute('data-order') || 'desc';
    }
    
    // 保存每页大小
    const pageSizeSelect = document.getElementById('annotation_page_size');
    if (pageSizeSelect) {
        currentTab.pageSize = parseInt(pageSizeSelect.value) || 10;
    }
    
    // 页码在分页相关函数中已经实时更新，不需要在这里保存
}

/**
 * 从标签页状态恢复UI状态
 */
function restoreUIState() {
    const currentTab = getCurrentTabState();
    
    // 恢复搜索框
    const searchInput = document.getElementById('annotation_search_input');
    if (searchInput) {
        searchInput.value = currentTab.searchKeyword || '';
    }
    
    // 恢复排序选择器
    const sortSelect = document.getElementById('annotation_sort_select');
    if (sortSelect) {
        sortSelect.value = currentTab.sortBy || 'id_count';
    }
    
    // 恢复排序顺序按钮
    const sortOrderButton = document.getElementById('annotation_sort_order');
    if (sortOrderButton) {
        sortOrderButton.setAttribute('data-order', currentTab.sortOrder || 'desc');
    }
    
    // 恢复每页大小选择器
    const pageSizeSelect = document.getElementById('annotation_page_size');
    if (pageSizeSelect) {
        pageSizeSelect.value = currentTab.pageSize || 10;
    }
    
    // 清空页码跳转输入框
    const pageJumpInput = document.getElementById('annotation_page_jump');
    if (pageJumpInput) {
        pageJumpInput.value = '';
    }
    
    // 恢复标签页激活状态
    document.querySelectorAll('.annotation_tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[data-ontology="${FunctionalAnnotationState.currentOntology}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// API基础URL
const ANNOTATION_API_BASE_URL = 'http://127.0.0.1:30004/searchDatabase';

// ==================== 工具函数 ====================

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 格式化数字（带千位分隔符）
 */
function formatNumberWithCommas(num) {
    if (typeof num !== 'number') {
        return num.toString();
    }
    return num.toLocaleString();
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// ==================== 主要功能函数 ====================

/**
 * 初始化功能注释信息板块
 */
function initFunctionalAnnotation() {
    console.log('Initializing functional annotation module...');
    
    // 绑定事件监听器
    bindFunctionalAnnotationEvents();
    
    // 监听模块选择变化事件
    document.addEventListener('moduleSelected', handleModuleSelectionChange);
    
    FunctionalAnnotationState.isInitialized = true;
    console.log('Functional annotation module initialized');
}

/**
 * 绑定功能注释板块的事件监听器
 */
function bindFunctionalAnnotationEvents() {
    // 折叠/展开按钮
    const functionalContainer = document.querySelector('.functional_annotation_container');
    if (functionalContainer) {
        const collapseButton = functionalContainer.querySelector('.collapse_button');
        if (collapseButton) {
            collapseButton.addEventListener('click', toggleFunctionalAnnotationCollapse);
        }
    }
    
    // Tab切换
    const tabs = document.querySelectorAll('.annotation_tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', handleTabSwitch);
    });
    
    // 搜索框
    const searchInput = document.getElementById('annotation_search_input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleAnnotationSearch, 300));
    }
    
    // 清除搜索按钮
    const clearSearchButton = document.getElementById('clear_annotation_search');
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', clearAnnotationSearch);
    }
    
    // 排序控件
    const sortSelect = document.getElementById('annotation_sort_select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleAnnotationSortChange);
    }
    
    const sortOrderButton = document.getElementById('annotation_sort_order');
    if (sortOrderButton) {
        sortOrderButton.addEventListener('click', toggleAnnotationSortOrder);
    }
    
    // 下载按钮
    const downloadButton = document.getElementById('annotation_download_btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', handleAnnotationDownload);
    }
    
    // 分页控件
    bindAnnotationPaginationEvents();
    
    // 弹窗相关事件
    bindModalEvents();
    
    // 初始化ID List按钮事件
    bindIdListButtonEvents();
}

/**
 * 绑定ID List按钮事件（使用事件委托）
 */
function bindIdListButtonEvents() {
    const tableBody = document.getElementById('annotation_table_body');
    if (!tableBody) return;
    
    // 移除现有的事件监听器（避免重复绑定）
    tableBody.removeEventListener('click', handleIdListButtonClick);
    
    // 添加事件委托
    tableBody.addEventListener('click', handleIdListButtonClick);
}

/**
 * 处理ID List按钮点击事件
 */
function handleIdListButtonClick(event) {
    const button = event.target.closest('.id_list_button');
    if (!button) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // 从data属性获取数据
    const accession = button.getAttribute('data-accession');
    const description = button.getAttribute('data-description');
    const tfIdsJson = button.getAttribute('data-tf-ids');
    const geneIdsJson = button.getAttribute('data-gene-ids');
    
    try {
        // 解析JSON数据
        const tfIds = JSON.parse(tfIdsJson || '[]');
        const geneIds = JSON.parse(geneIdsJson || '[]');
        
        console.log('Showing ID list modal for:', accession, description, tfIds, geneIds);
        
        // 显示弹窗
        showIdListModal(accession, description, tfIds, geneIds);
    } catch (error) {
        console.error('Error parsing ID list data:', error);
        console.error('Raw data:', { accession, description, tfIdsJson, geneIdsJson });
    }
}

/**
 * 绑定分页控件事件
 */
function bindAnnotationPaginationEvents() {
    // 每页数量选择
    const pageSizeSelect = document.getElementById('annotation_page_size');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', handlePageSizeChange);
    }
    
    // 导航按钮
    const firstPageButton = document.getElementById('annotation_first_page');
    const prevPageButton = document.getElementById('annotation_prev_page');
    const nextPageButton = document.getElementById('annotation_next_page');
    const lastPageButton = document.getElementById('annotation_last_page');
    
    if (firstPageButton) firstPageButton.addEventListener('click', () => goToPage(1));
    if (prevPageButton) prevPageButton.addEventListener('click', goToPreviousPage);
    if (nextPageButton) nextPageButton.addEventListener('click', goToNextPage);
    if (lastPageButton) lastPageButton.addEventListener('click', () => goToPage(getCurrentTabState().numPages));
    
    // 页码跳转
    const pageJumpInput = document.getElementById('annotation_page_jump');
    const jumpButton = document.getElementById('annotation_jump_btn');
    
    if (pageJumpInput) {
        pageJumpInput.addEventListener('keypress', handlePageJumpKeyPress);
    }
    if (jumpButton) {
        jumpButton.addEventListener('click', handlePageJump);
    }
}

/**
 * 绑定弹窗事件
 */
function bindModalEvents() {
    // 弹窗关闭
    const overlay = document.getElementById('id_list_overlay');
    const closeButton = document.getElementById('id_list_close_btn');
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeIdListModal();
            }
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closeIdListModal);
    }
    
    // 绘制核心网络按钮
    const drawNetworkButton = document.getElementById('draw_core_network_btn');
    if (drawNetworkButton) {
        drawNetworkButton.addEventListener('click', handleDrawCoreNetwork);
    }
}

/**
 * 处理模块选择变化
 */
function handleModuleSelectionChange(event) {
    const moduleId = event.detail.moduleId;
    console.log('Functional annotation: Module selection changed to:', moduleId);
    
    if (moduleId !== null && moduleId !== undefined) {
        // 显示功能注释信息板块
        showFunctionalAnnotationContainer();
        
        // 重置状态
        FunctionalAnnotationState.currentModuleId = moduleId;
        
        // 重置所有标签页状态
        resetTabState('BP');
        resetTabState('MF');
        resetTabState('CC');
        
        // 重置到BP标签页
        FunctionalAnnotationState.currentOntology = 'BP';
        
        // 更新模块信息显示
        updateModuleInfoDisplay(moduleId);
        
        // 恢复UI状态到初始状态
        restoreUIState();
        
        // 加载注释数据
        loadAnnotationData();
    }
}

/**
 * 显示功能注释信息板块
 */
function showFunctionalAnnotationContainer() {
    const container = document.querySelector('.functional_annotation_container');
    if (container) {
        container.style.display = 'block';
        // 滚动到板块位置
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

/**
 * 更新模块信息显示
 */
function updateModuleInfoDisplay(moduleId) {
    const moduleIdElement = document.getElementById('annotation_module_id');
    if (moduleIdElement) {
        moduleIdElement.textContent = moduleId;
    }
    
    // 隐藏统计信息，等待数据加载后显示
    const totalTermsContainer = document.getElementById('annotation_total_terms_container');
    const totalGenesContainer = document.getElementById('annotation_total_genes_container');
    
    if (totalTermsContainer) totalTermsContainer.style.display = 'none';
    if (totalGenesContainer) totalGenesContainer.style.display = 'none';
}

/**
 * 加载注释数据
 */
async function loadAnnotationData() {
    if (FunctionalAnnotationState.currentModuleId === null || FunctionalAnnotationState.currentModuleId === undefined) return;
    
    console.log('Loading annotation data for module:', FunctionalAnnotationState.currentModuleId);
    
    const currentTab = getCurrentTabState();
    
    try {
        FunctionalAnnotationState.isLoading = true;
        updateAnnotationLoadingState(true);
        
        const params = new URLSearchParams({
            module_id: FunctionalAnnotationState.currentModuleId,
            ontology: FunctionalAnnotationState.currentOntology,
            page: currentTab.currentPage,
            pageSize: currentTab.pageSize,
            sortBy: currentTab.sortBy,
            sortOrder: currentTab.sortOrder
        });
        
        if (currentTab.searchKeyword) {
            params.append('searchKeyword', currentTab.searchKeyword);
        }
        
        const response = await fetch(`${ANNOTATION_API_BASE_URL}/getNetworkModuleGoAnnotationTableByPage/?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Annotation data loaded:', data);
        
        // 处理API返回的数据
        if (data.type === 'networkModuleGoAnnotationPagination') {
            currentTab.currentData = data.data || [];
            currentTab.totalRecords = data.totalRecords || 0;
            currentTab.numPages = data.numPages || 0;
            currentTab.currentPage = data.currentPage || 1;
            
            // 更新表格
            updateAnnotationTable();
            updateAnnotationPagination();
            
            // 第一次加载时，更新所有Tab的数量统计
            if (currentTab.currentPage === 1 && !currentTab.searchKeyword) {
                await loadTabCounts();
            }
            
        } else {
            // API结构不匹配，使用模拟数据
            console.warn('Unexpected API response structure, using mock data');
            loadMockAnnotationData();
        }
        
    } catch (error) {
        console.error('Error loading annotation data:', error);
        showAnnotationError('Failed to load annotation data. Please try again.');
        
        // 使用模拟数据作为后备
        loadMockAnnotationData();
    } finally {
        FunctionalAnnotationState.isLoading = false;
        updateAnnotationLoadingState(false);
    }
}

/**
 * 加载各个Tab的数量统计
 */
async function loadTabCounts() {
    const ontologies = ['BP', 'MF', 'CC'];
    
    for (const ontology of ontologies) {
        try {
            const params = new URLSearchParams({
                module_id: FunctionalAnnotationState.currentModuleId,
                ontology: ontology,
                page: 1,
                pageSize: 1
            });
            
            const response = await fetch(`${ANNOTATION_API_BASE_URL}/getNetworkModuleGoAnnotationTableByPage/?${params}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.type === 'networkModuleGoAnnotationPagination') {
                    FunctionalAnnotationState.tabCounts[ontology] = data.totalRecords || 0;
                }
            } else {
                // 使用模拟数据
                FunctionalAnnotationState.tabCounts[ontology] = Math.floor(Math.random() * 100) + 10;
            }
        } catch (error) {
            console.error(`Error loading ${ontology} count:`, error);
            FunctionalAnnotationState.tabCounts[ontology] = Math.floor(Math.random() * 100) + 10;
        }
    }
    
    // 更新Tab显示
    updateTabCounts();
    updateStatisticsDisplay();
}

/**
 * 生成模拟注释数据
 */
function loadMockAnnotationData() {
    const currentTab = getCurrentTabState();
    const mockData = [];
    const descriptions = [
        'cellular protein modification process',
        'regulation of transcription, DNA-templated',
        'protein phosphorylation',
        'signal transduction',
        'metabolic process',
        'cell cycle',
        'DNA repair',
        'protein transport',
        'oxidation-reduction process',
        'response to stress'
    ];
    
    const totalRecords = Math.floor(Math.random() * 200) + 50;
    const startIndex = (currentTab.currentPage - 1) * currentTab.pageSize;
    const endIndex = Math.min(startIndex + currentTab.pageSize, totalRecords);
    
    for (let i = startIndex; i < endIndex; i++) {
        const tfCount = Math.floor(Math.random() * 10);
        const geneCount = Math.floor(Math.random() * 50) + 5;
        
        mockData.push({
            accession: `GO:${String(Math.floor(Math.random() * 999999)).padStart(7, '0')}`,
            description: descriptions[i % descriptions.length],
            id_count: tfCount + geneCount,
            tf_ids: Array.from({length: tfCount}, (_, j) => `TF${String(i * 10 + j).padStart(6, '0')}.SO.001`),
            gene_ids: Array.from({length: geneCount}, (_, j) => `SGI${String(i * 50 + j).padStart(6, '0')}.SO.008`)
        });
    }
    
    currentTab.currentData = mockData;
    currentTab.totalRecords = totalRecords;
    currentTab.numPages = Math.ceil(totalRecords / currentTab.pageSize);
    
    // 模拟Tab数量（只在首次加载时初始化）
    if (FunctionalAnnotationState.tabCounts.BP === 0 && FunctionalAnnotationState.tabCounts.MF === 0 && FunctionalAnnotationState.tabCounts.CC === 0) {
        FunctionalAnnotationState.tabCounts.BP = Math.floor(Math.random() * 100) + 30;
        FunctionalAnnotationState.tabCounts.MF = Math.floor(Math.random() * 80) + 20;
        FunctionalAnnotationState.tabCounts.CC = Math.floor(Math.random() * 60) + 15;
        updateTabCounts();
        updateStatisticsDisplay();
    }
    
    updateAnnotationTable();
    updateAnnotationPagination();
}

/**
 * 更新注释表格
 */
function updateAnnotationTable() {
    const tableBody = document.getElementById('annotation_table_body');
    if (!tableBody) return;
    
    const currentTab = getCurrentTabState();
    
    if (currentTab.currentData.length === 0) {
        tableBody.innerHTML = `
            <tr class="no_data_row">
                <td colspan="4">
                    <div class="no_data_placeholder">
                        <p>No GO annotations found for the current search criteria.</p>
                    </div>
                </td>
            </tr>
        `;
        // 即使没有数据也要绑定事件（为了清理现有事件）
        bindIdListButtonEvents();
        return;
    }
    
    const rows = currentTab.currentData.map((annotation, index) => {
        const totalIds = (annotation.tf_ids?.length || 0) + (annotation.gene_ids?.length || 0);
        
        return `
            <tr>
                <td>${escapeHtml(annotation.description)}</td>
                <td>
                    <a href="https://amigo.geneontology.org/amigo/term/${annotation.accession}" 
                       target="_blank" 
                       class="go_accession_link">
                        ${annotation.accession}
                    </a>
                </td>
                <td>
                    <span class="id_count_badge">${totalIds}</span>
                </td>
                <td>
                    <button class="id_list_button" 
                            data-annotation-index="${index}"
                            data-accession="${annotation.accession}"
                            data-description="${escapeHtml(annotation.description)}"
                            data-tf-ids="${escapeHtml(JSON.stringify(annotation.tf_ids || []))}"
                            data-gene-ids="${escapeHtml(JSON.stringify(annotation.gene_ids || []))}">
                        <span>📋</span>
                        View IDs
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = rows;
    
    // 重新绑定ID List按钮事件
    bindIdListButtonEvents();
}

/**
 * 更新分页信息
 */
function updateAnnotationPagination() {
    const currentTab = getCurrentTabState();
    
    // 更新分页信息显示
    const pageStart = document.getElementById('annotation_page_start');
    const pageEnd = document.getElementById('annotation_page_end');
    const totalRecords = document.getElementById('annotation_total_records');
    
    const startRecord = (currentTab.currentPage - 1) * currentTab.pageSize + 1;
    const endRecord = Math.min(currentTab.currentPage * currentTab.pageSize, currentTab.totalRecords);
    
    if (pageStart) pageStart.textContent = currentTab.totalRecords > 0 ? startRecord : 0;
    if (pageEnd) pageEnd.textContent = endRecord;
    if (totalRecords) totalRecords.textContent = currentTab.totalRecords;
    
    // 更新导航按钮状态
    updateNavigationButtons();
    
    // 更新页码按钮
    updatePageNumbers();
}

/**
 * 更新导航按钮状态
 */
function updateNavigationButtons() {
    const currentTab = getCurrentTabState();
    const firstPageButton = document.getElementById('annotation_first_page');
    const prevPageButton = document.getElementById('annotation_prev_page');
    const nextPageButton = document.getElementById('annotation_next_page');
    const lastPageButton = document.getElementById('annotation_last_page');
    
    const isFirstPage = currentTab.currentPage <= 1;
    const isLastPage = currentTab.currentPage >= currentTab.numPages;
    
    if (firstPageButton) firstPageButton.disabled = isFirstPage;
    if (prevPageButton) prevPageButton.disabled = isFirstPage;
    if (nextPageButton) nextPageButton.disabled = isLastPage;
    if (lastPageButton) lastPageButton.disabled = isLastPage;
}

/**
 * 更新页码按钮
 */
function updatePageNumbers() {
    const currentTab = getCurrentTabState();
    const pageNumbersContainer = document.getElementById('annotation_page_numbers');
    if (!pageNumbersContainer) return;
    
    const currentPage = currentTab.currentPage;
    const numPages = currentTab.numPages;
    
    // 计算显示的页码范围
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(numPages, currentPage + 2);
    
    // 调整范围以保持固定数量的页码按钮
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(numPages, startPage + 4);
        } else if (endPage === numPages) {
            startPage = Math.max(1, endPage - 4);
        }
    }
    
    let buttonsHtml = '';
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        buttonsHtml += `
            <button class="page_number_button ${isActive ? 'active' : ''}" 
                    onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    pageNumbersContainer.innerHTML = buttonsHtml;
}

/**
 * 更新Tab数量显示
 */
function updateTabCounts() {
    const bpCount = document.getElementById('bp_count');
    const mfCount = document.getElementById('mf_count');
    const ccCount = document.getElementById('cc_count');
    
    if (bpCount) bpCount.textContent = FunctionalAnnotationState.tabCounts.BP || '-';
    if (mfCount) mfCount.textContent = FunctionalAnnotationState.tabCounts.MF || '-';
    if (ccCount) ccCount.textContent = FunctionalAnnotationState.tabCounts.CC || '-';
}

/**
 * 更新统计信息显示
 */
function updateStatisticsDisplay() {
    const totalTermsContainer = document.getElementById('annotation_total_terms_container');
    const totalGenesContainer = document.getElementById('annotation_total_genes_container');
    const totalTermsElement = document.getElementById('annotation_total_terms');
    const totalGenesElement = document.getElementById('annotation_total_genes');
    
    const totalTerms = Object.values(FunctionalAnnotationState.tabCounts).reduce((sum, count) => sum + count, 0);
    
    if (totalTermsElement) {
        totalTermsElement.textContent = formatNumberWithCommas(totalTerms);
    }
    if (totalTermsContainer) {
        totalTermsContainer.style.display = 'block';
    }
    
    // 基因数量需要根据实际数据计算，这里使用估算值
    const estimatedGenes = Math.floor(totalTerms * 2.5);
    if (totalGenesElement) {
        totalGenesElement.textContent = formatNumberWithCommas(estimatedGenes);
    }
    if (totalGenesContainer) {
        totalGenesContainer.style.display = 'block';
    }
}

// ==================== 事件处理函数 ====================

/**
 * 折叠/展开功能注释板块
 */
function toggleFunctionalAnnotationCollapse() {
    const container = document.querySelector('.functional_annotation_container');
    if (!container) return;
    
    const collapseButton = container.querySelector('.collapse_button');
    const content = container.querySelector('.functional_annotation_content');
    const collapseText = container.querySelector('.collapse_text');
    
    if (!collapseButton || !content || !collapseText) return;
    
    const isCollapsed = collapseButton.getAttribute('data-collapsed') === 'true';
    
    if (isCollapsed) {
        // 展开
        collapseButton.setAttribute('data-collapsed', 'false');
        content.classList.remove('collapsed');
        collapseText.textContent = 'Collapse';
    } else {
        // 折叠
        collapseButton.setAttribute('data-collapsed', 'true');
        content.classList.add('collapsed');
        collapseText.textContent = 'Expand';
    }
}

/**
 * 处理Tab切换
 */
function handleTabSwitch(event) {
    const clickedTab = event.currentTarget;
    const newOntology = clickedTab.getAttribute('data-ontology');
    
    if (newOntology === FunctionalAnnotationState.currentOntology) return;
    
    console.log('Switching from', FunctionalAnnotationState.currentOntology, 'to', newOntology);
    console.log('Current page size before switch:', getCurrentTabState().pageSize);
    
    // 保存当前标签页的UI状态
    saveCurrentUIState();
    
    // 切换到新的标签页
    FunctionalAnnotationState.currentOntology = newOntology;
    
    // 更新Tab显示状态
    document.querySelectorAll('.annotation_tab').forEach(tab => {
        tab.classList.remove('active');
    });
    clickedTab.classList.add('active');
    
    // 恢复新标签页的状态
    restoreUIState();
    
    console.log('Page size after switch to', newOntology, ':', getCurrentTabState().pageSize);
    
    // 重新加载数据
    loadAnnotationData();
}

/**
 * 处理搜索
 */
function handleAnnotationSearch(event) {
    const searchKeyword = event.target.value.trim();
    const currentTab = getCurrentTabState();
    
    if (searchKeyword === currentTab.searchKeyword) return;
    
    currentTab.searchKeyword = searchKeyword;
    currentTab.currentPage = 1;
    
    // 清空页码跳转输入框
    const pageJumpInput = document.getElementById('annotation_page_jump');
    if (pageJumpInput) {
        pageJumpInput.value = '';
    }
    
    console.log('Searching annotations with keyword:', searchKeyword);
    loadAnnotationData();
}

/**
 * 清除搜索
 */
function clearAnnotationSearch() {
    const searchInput = document.getElementById('annotation_search_input');
    const currentTab = getCurrentTabState();
    
    if (searchInput) {
        searchInput.value = '';
        currentTab.searchKeyword = '';
        currentTab.currentPage = 1;
        loadAnnotationData();
    }
}

/**
 * 处理排序字段变化
 */
function handleAnnotationSortChange(event) {
    const sortBy = event.target.value;
    const currentTab = getCurrentTabState();
    
    if (sortBy === currentTab.sortBy) return;
    
    currentTab.sortBy = sortBy;
    currentTab.currentPage = 1;
    
    loadAnnotationData();
}

/**
 * 切换排序顺序
 */
function toggleAnnotationSortOrder() {
    const currentTab = getCurrentTabState();
    const currentOrder = currentTab.sortOrder;
    currentTab.sortOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    currentTab.currentPage = 1;
    
    // 更新按钮显示
    const sortOrderButton = document.getElementById('annotation_sort_order');
    if (sortOrderButton) {
        sortOrderButton.setAttribute('data-order', currentTab.sortOrder);
    }
    
    loadAnnotationData();
}

/**
 * 处理下载
 */
function handleAnnotationDownload() {
    if (FunctionalAnnotationState.currentModuleId === null || FunctionalAnnotationState.currentModuleId === undefined) return;
    
    const moduleId = FunctionalAnnotationState.currentModuleId;
    const ontology = FunctionalAnnotationState.currentOntology;
    
    // 构建下载URL
    const downloadUrl = `https://cbi.gxu.edu.cn/download/yhshao/GT42_web/network/module_go_annotation/M${moduleId}_go_annotation_${ontology}.tsv`;
    
    console.log('Downloading annotation file:', downloadUrl);
    
    // 创建临时链接进行下载
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `M${moduleId}_go_annotation_${ontology}.tsv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==================== 分页相关函数 ====================

/**
 * 处理每页数量变化
 */
function handlePageSizeChange(event) {
    const newPageSize = parseInt(event.target.value);
    const currentTab = getCurrentTabState();
    
    if (newPageSize === currentTab.pageSize) return;
    
    console.log(`Changing page size for ${FunctionalAnnotationState.currentOntology} from ${currentTab.pageSize} to ${newPageSize}`);
    
    // 只更新当前标签页的设置
    currentTab.pageSize = newPageSize;
    currentTab.currentPage = 1; // 重置到第一页
    
    // 重新计算当前标签页的页数
    if (currentTab.totalRecords > 0) {
        currentTab.numPages = Math.ceil(currentTab.totalRecords / newPageSize);
    }
    
    // 清空页码跳转输入框
    const pageJumpInput = document.getElementById('annotation_page_jump');
    if (pageJumpInput) {
        pageJumpInput.value = '';
    }
    
    loadAnnotationData();
}

/**
 * 跳转到指定页面
 */
function goToPage(pageNumber) {
    const currentTab = getCurrentTabState();
    
    if (pageNumber < 1 || pageNumber > currentTab.numPages) return;
    if (pageNumber === currentTab.currentPage) return;
    
    currentTab.currentPage = pageNumber;
    loadAnnotationData();
}

/**
 * 跳转到上一页
 */
function goToPreviousPage() {
    const currentTab = getCurrentTabState();
    if (currentTab.currentPage > 1) {
        goToPage(currentTab.currentPage - 1);
    }
}

/**
 * 跳转到下一页
 */
function goToNextPage() {
    const currentTab = getCurrentTabState();
    if (currentTab.currentPage < currentTab.numPages) {
        goToPage(currentTab.currentPage + 1);
    }
}

/**
 * 处理页码跳转按键
 */
function handlePageJumpKeyPress(event) {
    if (event.key === 'Enter') {
        handlePageJump();
    }
}

/**
 * 处理页码跳转
 */
function handlePageJump() {
    const currentTab = getCurrentTabState();
    const pageJumpInput = document.getElementById('annotation_page_jump');
    if (!pageJumpInput) return;
    
    const pageNumber = parseInt(pageJumpInput.value);
    
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > currentTab.numPages) {
        alert(`Please enter a valid page number between 1 and ${currentTab.numPages}`);
        pageJumpInput.value = '';
        return;
    }
    
    goToPage(pageNumber);
    pageJumpInput.value = '';
}

// ==================== 弹窗相关函数 ====================

/**
 * 显示ID列表弹窗
 */
function showIdListModal(accession, description, tfIds, geneIds) {
    console.log('Showing ID list modal for:', accession);
    
    // 更新弹窗内容
    updateModalContent(accession, description, tfIds, geneIds);
    
    // 显示弹窗
    const overlay = document.getElementById('id_list_overlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
}

/**
 * 更新弹窗内容
 */
function updateModalContent(accession, description, tfIds, geneIds) {
    // 更新GO term信息
    const modalAccession = document.getElementById('modal_go_accession');
    const modalDescription = document.getElementById('modal_go_description');
    
    if (modalAccession) {
        modalAccession.textContent = accession;
        modalAccession.href = `https://amigo.geneontology.org/amigo/term/${accession}`;
    }
    
    if (modalDescription) {
        modalDescription.textContent = description;
    }
    
    // 更新ID列表
    updateIdLists(tfIds, geneIds);
    
    // 隐藏详细信息区域
    const detailsContainer = document.getElementById('selected_id_details');
    if (detailsContainer) {
        detailsContainer.style.display = 'none';
    }
}

/**
 * 更新ID列表
 */
function updateIdLists(tfIds, geneIds) {
    // 更新TF数量
    const tfCountElement = document.getElementById('tf_count');
    if (tfCountElement) {
        tfCountElement.textContent = tfIds.length;
    }
    
    // 更新Gene数量
    const geneCountElement = document.getElementById('gene_count');
    if (geneCountElement) {
        geneCountElement.textContent = geneIds.length;
    }
    
    // 更新TF列表
    const tfListContainer = document.getElementById('tf_ids_list');
    if (tfListContainer) {
        if (tfIds.length > 0) {
            tfListContainer.innerHTML = tfIds.map(id => 
                `<span class="id_item" onclick="selectNodeId('${id}')">${id}</span>`
            ).join('');
        } else {
            tfListContainer.innerHTML = '<p style="color: #999; text-align: center;">No TF IDs found</p>';
        }
    }
    
    // 更新Gene列表
    const geneListContainer = document.getElementById('gene_ids_list');
    if (geneListContainer) {
        if (geneIds.length > 0) {
            geneListContainer.innerHTML = geneIds.map(id => 
                `<span class="id_item" onclick="selectNodeId('${id}')">${id}</span>`
            ).join('');
        } else {
            geneListContainer.innerHTML = '<p style="color: #999; text-align: center;">No Gene IDs found</p>';
        }
    }
}

/**
 * 选择节点ID
 */
async function selectNodeId(nodeId) {
    console.log('Selected node ID:', nodeId);
    
    // 更新选中状态
    document.querySelectorAll('.id_item').forEach(item => {
        item.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
    
    // 显示详细信息容器
    const detailsContainer = document.getElementById('selected_id_details');
    if (detailsContainer) {
        detailsContainer.style.display = 'block';
    }
    
    // 更新选中ID名称
    const selectedIdName = document.getElementById('selected_id_name');
    if (selectedIdName) {
        selectedIdName.textContent = nodeId;
    }
    
    // 显示绘制核心网络按钮
    const drawNetworkButton = document.getElementById('draw_core_network_btn');
    if (drawNetworkButton) {
        drawNetworkButton.style.display = 'flex';
        drawNetworkButton.setAttribute('data-node-id', nodeId);
    }
    
    // 加载ID注释信息
    await loadNodeAnnotations(nodeId);
}

/**
 * 加载节点注释信息
 */
async function loadNodeAnnotations(nodeId) {
    const annotationsContainer = document.getElementById('id_annotations_content');
    if (!annotationsContainer) return;
    
    // 显示加载状态
    annotationsContainer.innerHTML = `
        <div class="loading_placeholder">
            <div class="loading_spinner"></div>
            <p>Loading annotations...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`${ANNOTATION_API_BASE_URL}/getNetworkNodeGoAnnotations/?node_id=${nodeId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Node annotations loaded:', data);
        
        if (data.type === 'nodeGoAnnotations') {
            updateNodeAnnotationsDisplay(data);
        } else {
            // 使用模拟数据
            updateNodeAnnotationsDisplay(generateMockNodeAnnotations(nodeId));
        }
        
    } catch (error) {
        console.error('Error loading node annotations:', error);
        updateNodeAnnotationsDisplay(generateMockNodeAnnotations(nodeId));
    }
}

/**
 * 更新节点注释显示
 */
function updateNodeAnnotationsDisplay(data) {
    const annotationsContainer = document.getElementById('id_annotations_content');
    if (!annotationsContainer) return;
    
    if (!data.data || data.data.length === 0) {
        annotationsContainer.innerHTML = '<p style="color: #999; text-align: center;">No annotations found for this ID.</p>';
        return;
    }
    
    // 按本体类型分组
    const groupedAnnotations = {
        BP: data.data.filter(ann => ann.ontology === 'BP'),
        MF: data.data.filter(ann => ann.ontology === 'MF'),
        CC: data.data.filter(ann => ann.ontology === 'CC')
    };
    
    const ontologyNames = {
        BP: 'Biological Process',
        MF: 'Molecular Function',
        CC: 'Cellular Component'
    };
    
    let html = '';
    
    Object.keys(groupedAnnotations).forEach(ontology => {
        const annotations = groupedAnnotations[ontology];
        if (annotations.length > 0) {
            html += `
                <div class="annotation_category">
                    <div class="category_header">${ontologyNames[ontology]} (${annotations.length})</div>
                    <div class="category_items">
                        ${annotations.map(ann => `
                            <div class="annotation_item">
                                <div class="annotation_accession">${ann.accession}</div>
                                <div class="annotation_description">${escapeHtml(ann.description)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });
    
    if (html) {
        annotationsContainer.innerHTML = html;
    } else {
        annotationsContainer.innerHTML = '<p style="color: #999; text-align: center;">No annotations found for this ID.</p>';
    }
}

/**
 * 生成模拟节点注释数据
 */
function generateMockNodeAnnotations(nodeId) {
    const mockAnnotations = [
        { accession: 'GO:0006355', description: 'regulation of transcription, DNA-templated', ontology: 'BP' },
        { accession: 'GO:0003677', description: 'DNA binding', ontology: 'MF' },
        { accession: 'GO:0005634', description: 'nucleus', ontology: 'CC' },
        { accession: 'GO:0045449', description: 'regulation of transcription', ontology: 'BP' },
        { accession: 'GO:0003700', description: 'DNA-binding transcription factor activity', ontology: 'MF' }
    ];
    
    // 随机选择部分注释
    const selectedAnnotations = mockAnnotations.slice(0, Math.floor(Math.random() * 4) + 2);
    
    return {
        type: 'nodeGoAnnotations',
        node_id: nodeId,
        node_type: nodeId.includes('.SO.001') ? 'TF' : 'Gene',
        annotation_count: selectedAnnotations.length,
        data: selectedAnnotations
    };
}

/**
 * 关闭ID列表弹窗
 */
function closeIdListModal() {
    const overlay = document.getElementById('id_list_overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }
}

/**
 * 处理绘制核心网络
 */
function handleDrawCoreNetwork() {
    const drawNetworkButton = document.getElementById('draw_core_network_btn');
    if (!drawNetworkButton) return;
    
    const nodeId = drawNetworkButton.getAttribute('data-node-id');
    if (!nodeId) return;
    
    console.log('Drawing core network for node:', nodeId);
    
    // 关闭弹窗
    closeIdListModal();
    
    // 发送绘制核心网络事件
    const event = new CustomEvent('drawCoreNetwork', {
        detail: { 
            moduleId: FunctionalAnnotationState.currentModuleId,
            nodeId: nodeId 
        }
    });
    document.dispatchEvent(event);
    
    // 滚动到网络图绘制区域（将来实现）
    // scrollToNetworkVisualization();
}

// ==================== 辅助函数 ====================

/**
 * 更新加载状态
 */
function updateAnnotationLoadingState(isLoading) {
    const tableBody = document.getElementById('annotation_table_body');
    if (!tableBody) return;
    
    if (isLoading) {
        tableBody.innerHTML = `
            <tr class="loading_row">
                <td colspan="4">
                    <div class="loading_placeholder">
                        <div class="loading_spinner"></div>
                        <p>Loading GO annotations...</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

/**
 * 显示错误信息
 */
function showAnnotationError(message) {
    const tableBody = document.getElementById('annotation_table_body');
    if (!tableBody) return;
    
    tableBody.innerHTML = `
        <tr class="no_data_row">
            <td colspan="4">
                <div class="error_placeholder">
                    <p style="color: #e96a6a;">⚠️ ${message}</p>
                </div>
            </td>
        </tr>
    `;
}

// 导出全局函数供HTML使用
window.showIdListModal = showIdListModal;
window.selectNodeId = selectNodeId;
window.goToPage = goToPage;

// 导出模块函数
window.FunctionalAnnotationModule = {
    init: initFunctionalAnnotation,
    getState: () => FunctionalAnnotationState,
    loadData: loadAnnotationData
};

console.log('Functional annotation module loaded'); 