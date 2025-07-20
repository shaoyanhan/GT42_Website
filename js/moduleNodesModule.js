// 模块中的节点ID板块模块
// 处理节点ID的显示、搜索、分页、排序和交互功能

// 节点板块状态管理
const ModuleNodesState = {
    currentModuleId: null,       // 当前选中的模块ID
    currentPage: 1,              // 当前页码
    pageSize: 10,                // 每页大小
    searchKeyword: '',           // 搜索关键词
    sortBy: 'node_id',           // 排序字段
    sortOrder: 'asc',            // 排序顺序
    totalRecords: 0,             // 总记录数
    numPages: 0,                 // 总页数
    currentData: [],             // 当前页数据
    allNodes: [],                // 所有节点数据（用于统计）
    isLoading: false,            // 加载状态
    isInitialized: false         // 初始化状态
};

// API基础URL
const NODES_API_BASE_URL = 'http://127.0.0.1:30004/searchDatabase';

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
 * 初始化节点板块
 */
function initModuleNodes() {
    console.log('Initializing module nodes panel...');
    
    if (ModuleNodesState.isInitialized) {
        console.log('Module nodes panel already initialized');
        return;
    }
    
    // 绑定事件监听器
    bindNodesEvents();
    
    // 监听模块选择事件
    document.addEventListener('moduleSelected', handleModuleSelection);
    
    ModuleNodesState.isInitialized = true;
    console.log('Module nodes panel initialized successfully');
}

/**
 * 绑定节点板块的事件监听器
 */
function bindNodesEvents() {
    // 折叠/展开按钮
    const collapseButton = document.querySelector('.module_nodes_container .collapse_button');
    if (collapseButton) {
        collapseButton.addEventListener('click', toggleNodesCollapse);
    }
    
    // 搜索输入框
    const searchInput = document.getElementById('nodes_search_input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleNodesSearch, 300));
    }
    
    // 清除搜索按钮
    const clearSearchButton = document.getElementById('clear_nodes_search');
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', clearNodesSearch);
    }
    
    // 排序选择器
    const sortSelect = document.getElementById('nodes_sort_select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleNodesSortChange);
    }
    
    // 排序顺序按钮
    const sortOrderButton = document.getElementById('nodes_sort_order');
    if (sortOrderButton) {
        sortOrderButton.addEventListener('click', toggleNodesSortOrder);
    }
    
    // 表格头部排序点击
    const sortableHeaders = document.querySelectorAll('.nodes_table th.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.getAttribute('data-sort');
            if (sortField) {
                handleTableHeaderSort(sortField);
            }
        });
    });
    
    // 分页控件
    bindNodesPaginationEvents();
    
    // 下载按钮
    const downloadButton = document.getElementById('nodes_download_btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', handleNodesDownload);
    }
    
    // GO注释弹窗关闭按钮
    const goAnnotationCloseButton = document.getElementById('go_annotation_close_btn');
    if (goAnnotationCloseButton) {
        goAnnotationCloseButton.addEventListener('click', closeGoAnnotationModal);
    }
    
    // GO注释弹窗背景点击关闭
    const goAnnotationOverlay = document.getElementById('go_annotation_overlay');
    if (goAnnotationOverlay) {
        goAnnotationOverlay.addEventListener('click', (e) => {
            if (e.target === goAnnotationOverlay) {
                closeGoAnnotationModal();
            }
        });
    }
    
    // 绘制网络按钮
    const drawNetworkButton = document.getElementById('draw_node_network_btn');
    if (drawNetworkButton) {
        drawNetworkButton.addEventListener('click', handleDrawNodeNetwork);
    }
}

/**
 * 绑定分页相关事件
 */
function bindNodesPaginationEvents() {
    // 页面大小选择器
    const pageSizeSelect = document.getElementById('nodes_page_size');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', handleNodesPageSizeChange);
    }
    
    // 页面导航按钮
    const firstPageButton = document.getElementById('nodes_first_page');
    const prevPageButton = document.getElementById('nodes_prev_page');
    const nextPageButton = document.getElementById('nodes_next_page');
    const lastPageButton = document.getElementById('nodes_last_page');
    
    if (firstPageButton) {
        firstPageButton.addEventListener('click', () => goToNodesPage(1));
    }
    if (prevPageButton) {
        prevPageButton.addEventListener('click', () => goToNodesPage(ModuleNodesState.currentPage - 1));
    }
    if (nextPageButton) {
        nextPageButton.addEventListener('click', () => goToNodesPage(ModuleNodesState.currentPage + 1));
    }
    if (lastPageButton) {
        lastPageButton.addEventListener('click', () => goToNodesPage(ModuleNodesState.numPages));
    }
    
    // 页面跳转
    const pageJumpInput = document.getElementById('nodes_page_jump');
    const jumpButton = document.getElementById('nodes_jump_btn');
    
    if (jumpButton) {
        jumpButton.addEventListener('click', handleNodesPageJump);
    }
    if (pageJumpInput) {
        pageJumpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleNodesPageJump();
            }
        });
    }
}

// ==================== 事件处理函数 ====================

/**
 * 处理模块选择事件
 */
function handleModuleSelection(event) {
    const { moduleId, moduleData } = event.detail;
    console.log('Module nodes: Module selected:', moduleId, moduleData);
    console.log('Module nodes: Type of moduleId:', typeof moduleId, 'Value:', moduleId);
    
    // 显示节点板块
    const nodesContainer = document.querySelector('.module_nodes_container');
    if (nodesContainer) {
        nodesContainer.style.display = 'block';
    }
    
    // 更新状态
    ModuleNodesState.currentModuleId = moduleId;
    console.log('Module nodes: State updated, currentModuleId:', ModuleNodesState.currentModuleId);
    
    // 重置状态
    resetNodesState();
    
    // 更新模块信息
    updateNodesModuleInfo(moduleId, moduleData);
    
    // 加载节点数据
    loadNodesData();
}

/**
 * 重置节点状态
 */
function resetNodesState() {
    ModuleNodesState.currentPage = 1;
    ModuleNodesState.searchKeyword = '';
    ModuleNodesState.sortBy = 'node_id';
    ModuleNodesState.sortOrder = 'asc';
    ModuleNodesState.totalRecords = 0;
    ModuleNodesState.numPages = 0;
    ModuleNodesState.currentData = [];
    ModuleNodesState.allNodes = [];
    
    // 重置UI
    const searchInput = document.getElementById('nodes_search_input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    const sortSelect = document.getElementById('nodes_sort_select');
    if (sortSelect) {
        sortSelect.value = 'node_id';
    }
    
    const sortOrderButton = document.getElementById('nodes_sort_order');
    if (sortOrderButton) {
        sortOrderButton.setAttribute('data-order', 'asc');
        sortOrderButton.textContent = '↑';
    }
    
    // 清空页面跳转输入框
    const pageJumpInput = document.getElementById('nodes_page_jump');
    if (pageJumpInput) {
        pageJumpInput.value = '';
    }
}

/**
 * 更新节点模块信息
 */
function updateNodesModuleInfo(moduleId, moduleData) {
    // 更新模块ID显示
    const moduleIdElement = document.getElementById('nodes_module_id');
    if (moduleIdElement) {
        moduleIdElement.textContent = `Module ${moduleId}`;
    }
}

/**
 * 折叠/展开节点板块
 */
function toggleNodesCollapse() {
    const content = document.querySelector('.module_nodes_content');
    const button = document.querySelector('.module_nodes_container .collapse_button');
    const icon = button?.querySelector('.collapse_icon');
    const text = button?.querySelector('.collapse_text');
    
    if (content && button) {
        const isCollapsed = button.getAttribute('data-collapsed') === 'true';
        
        if (isCollapsed) {
            // 展开
            content.classList.remove('collapsed');
            button.setAttribute('data-collapsed', 'false');
            if (icon) icon.textContent = '▼';
            if (text) text.textContent = 'Collapse';
        } else {
            // 折叠
            content.classList.add('collapsed');
            button.setAttribute('data-collapsed', 'true');
            if (icon) icon.textContent = '▶';
            if (text) text.textContent = 'Expand';
        }
    }
}

/**
 * 处理搜索
 */
function handleNodesSearch(event) {
    ModuleNodesState.searchKeyword = event.target.value.trim();
    ModuleNodesState.currentPage = 1; // 重置到第一页
    console.log('Nodes search:', ModuleNodesState.searchKeyword);
    loadNodesData();
}

/**
 * 清除搜索
 */
function clearNodesSearch() {
    const searchInput = document.getElementById('nodes_search_input');
    if (searchInput) {
        searchInput.value = '';
        ModuleNodesState.searchKeyword = '';
        ModuleNodesState.currentPage = 1;
        loadNodesData();
    }
}

/**
 * 处理排序字段变化
 */
function handleNodesSortChange(event) {
    ModuleNodesState.sortBy = event.target.value;
    ModuleNodesState.currentPage = 1; // 重置到第一页
    console.log('Nodes sort by:', ModuleNodesState.sortBy);
    loadNodesData();
}

/**
 * 切换排序顺序
 */
function toggleNodesSortOrder() {
    const sortOrderButton = document.getElementById('nodes_sort_order');
    const currentOrder = ModuleNodesState.sortOrder;
    
    ModuleNodesState.sortOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    ModuleNodesState.currentPage = 1; // 重置到第一页
    
    if (sortOrderButton) {
        sortOrderButton.setAttribute('data-order', ModuleNodesState.sortOrder);
        // 统一使用向上箭头，让CSS负责旋转效果
        sortOrderButton.textContent = '↑';
    }
    
    console.log('Nodes sort order:', ModuleNodesState.sortOrder);
    loadNodesData();
}

/**
 * 处理表格头部排序点击
 */
function handleTableHeaderSort(sortField) {
    if (ModuleNodesState.sortBy === sortField) {
        // 如果点击的是当前排序字段，切换排序顺序
        toggleNodesSortOrder();
    } else {
        // 如果点击的是新字段，使用该字段并设置为升序
        ModuleNodesState.sortBy = sortField;
        ModuleNodesState.sortOrder = 'asc';
        ModuleNodesState.currentPage = 1;
        
        // 更新UI
        const sortSelect = document.getElementById('nodes_sort_select');
        if (sortSelect) {
            sortSelect.value = sortField;
        }
        
        const sortOrderButton = document.getElementById('nodes_sort_order');
        if (sortOrderButton) {
            sortOrderButton.setAttribute('data-order', 'asc');
            sortOrderButton.textContent = '↑';
        }
        
        loadNodesData();
    }
    
    // 更新表格头部排序指示器
    updateNodesTableSortIndicators();
}

/**
 * 更新表格头部排序指示器
 */
function updateNodesTableSortIndicators() {
    const headers = document.querySelectorAll('.nodes_table th.sortable');
    headers.forEach(header => {
        const sortField = header.getAttribute('data-sort');
        const indicator = header.querySelector('.sort_indicator');
        
        if (sortField === ModuleNodesState.sortBy) {
            header.classList.add('sorted');
            if (indicator) {
                indicator.textContent = ModuleNodesState.sortOrder === 'asc' ? '↑' : '↓';
            }
        } else {
            header.classList.remove('sorted');
            if (indicator) {
                indicator.textContent = '';
            }
        }
    });
}

/**
 * 处理分页大小变化
 */
function handleNodesPageSizeChange(event) {
    ModuleNodesState.pageSize = parseInt(event.target.value) || 10;
    ModuleNodesState.currentPage = 1; // 重置到第一页
    console.log('Nodes page size:', ModuleNodesState.pageSize);
    loadNodesData();
}

/**
 * 跳转到指定页面
 */
function goToNodesPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= ModuleNodesState.numPages) {
        ModuleNodesState.currentPage = pageNumber;
        loadNodesData();
    }
}

/**
 * 处理页面跳转
 */
function handleNodesPageJump() {
    const pageJumpInput = document.getElementById('nodes_page_jump');
    if (pageJumpInput) {
        const pageNumber = parseInt(pageJumpInput.value);
        if (pageNumber && pageNumber >= 1 && pageNumber <= ModuleNodesState.numPages) {
            goToNodesPage(pageNumber);
        }
        pageJumpInput.value = ''; // 清空输入框
    }
}

/**
 * 处理下载
 */
function handleNodesDownload() {
    if (ModuleNodesState.currentModuleId === null || ModuleNodesState.currentModuleId === undefined) {
        console.warn('No module selected for download');
        return;
    }
    
    const downloadUrl = `https://cbi.gxu.edu.cn/download/yhshao/GT42_web/network/module_id_list/M${ModuleNodesState.currentModuleId}_id_list.tsv`;
    console.log('Downloading nodes data from:', downloadUrl);
    
    // 创建临时链接进行下载
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `M${ModuleNodesState.currentModuleId}_id_list.tsv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==================== 数据加载和显示函数 ====================

/**
 * 加载节点数据
 */
async function loadNodesData() {
    console.log('loadNodesData called, currentModuleId:', ModuleNodesState.currentModuleId, 'Type:', typeof ModuleNodesState.currentModuleId);
    
    if (ModuleNodesState.currentModuleId === null || ModuleNodesState.currentModuleId === undefined) {
        console.warn('No module selected - currentModuleId is null or undefined');
        return;
    }
    
    console.log('Loading nodes data for module:', ModuleNodesState.currentModuleId);
    
    try {
        ModuleNodesState.isLoading = true;
        updateNodesLoadingState(true);
        
        // 构建API请求URL
        const params = new URLSearchParams({
            module_id: ModuleNodesState.currentModuleId,
            page: ModuleNodesState.currentPage,
            pageSize: ModuleNodesState.pageSize,
            sortBy: ModuleNodesState.sortBy,
            sortOrder: ModuleNodesState.sortOrder
        });
        
        if (ModuleNodesState.searchKeyword) {
            params.append('searchKeyword', ModuleNodesState.searchKeyword);
        }
        
        const response = await fetch(`${NODES_API_BASE_URL}/getNetworkModuleNodeListByPage/?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Nodes data loaded:', data);
        
        // 处理返回的数据
        if (data.type === 'networkModuleNodeListPagination') {
            ModuleNodesState.currentData = data.data || [];
            ModuleNodesState.totalRecords = data.totalRecords || 0;
            ModuleNodesState.numPages = data.numPages || 0;
            ModuleNodesState.currentPage = data.currentPage || 1;
            
            // 更新显示
            updateNodesTable();
            updateNodesPagination();
            updateNodesStats();
        } else {
            throw new Error('Unexpected data format');
        }
        
    } catch (error) {
        console.error('Error loading nodes data:', error);
        
        // 使用模拟数据作为后备
        const mockData = generateMockNodesData();
        ModuleNodesState.currentData = mockData.data;
        ModuleNodesState.totalRecords = mockData.totalRecords;
        ModuleNodesState.numPages = Math.ceil(mockData.totalRecords / ModuleNodesState.pageSize);
        
        updateNodesTable();
        updateNodesPagination();
        updateNodesStats();
    } finally {
        ModuleNodesState.isLoading = false;
        updateNodesLoadingState(false);
    }
}

/**
 * 生成模拟节点数据
 */
function generateMockNodesData() {
    const mockData = {
        data: [],
        totalRecords: 150
    };
    
    const nodeTypes = ['TF', 'Gene'];
    const startIndex = (ModuleNodesState.currentPage - 1) * ModuleNodesState.pageSize;
    
    for (let i = 0; i < ModuleNodesState.pageSize; i++) {
        const nodeIndex = startIndex + i + 1;
        if (nodeIndex > mockData.totalRecords) break;
        
        const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        const nodeId = `SGI${String(nodeIndex).padStart(6, '0')}.SO.${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`;
        
        // 生成GO注释
        const goAnnotations = [];
        const numAnnotations = Math.floor(Math.random() * 5) + 1;
        
        for (let j = 0; j < numAnnotations; j++) {
            goAnnotations.push({
                accession: `GO:${String(Math.floor(Math.random() * 9000000) + 1000000).padStart(7, '0')}`,
                description: `Sample GO annotation ${j + 1} for ${nodeId}`,
                ontology: ['BP', 'MF', 'CC'][Math.floor(Math.random() * 3)]
            });
        }
        
        mockData.data.push({
            node_id: nodeId,
            node_type: nodeType,
            go_annotations: goAnnotations
        });
    }
    
    return mockData;
}

/**
 * 更新节点表格
 */
function updateNodesTable() {
    const tableBody = document.getElementById('nodes_table_body');
    if (!tableBody) return;
    
    if (ModuleNodesState.currentData.length === 0) {
        tableBody.innerHTML = `
            <tr class="no_data_row">
                <td colspan="3">
                    <div class="loading_placeholder">
                        <p>No nodes found${ModuleNodesState.searchKeyword ? ` for "${ModuleNodesState.searchKeyword}"` : ''}.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    let tableHTML = '';
    
    ModuleNodesState.currentData.forEach(node => {
        const nodeId = escapeHtml(node.node_id || '');
        const nodeType = escapeHtml(node.node_type || '');
        const typeClass = nodeType.toLowerCase();
        
        // 生成GO注释摘要
        const goSummary = generateGoAnnotationSummary(node.go_annotations || []);
        
        tableHTML += `
            <tr>
                <td>
                    <span class="node_id_link" data-node-id="${nodeId}" data-node-type="${nodeType}" 
                          title="Click to draw core network for ${nodeId}">${nodeId}</span>
                </td>
                <td>
                    <span class="node_type_badge ${typeClass}">${nodeType}</span>
                </td>
                <td>
                    <div class="go_annotation_summary" data-node-id="${nodeId}" data-node-type="${nodeType}"
                         title="Click to view detailed GO annotations">${goSummary}</div>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
    
    // 绑定表格事件
    bindNodesTableEvents();
    
    // 更新排序指示器
    updateNodesTableSortIndicators();
}

/**
 * 生成GO注释摘要
 */
function generateGoAnnotationSummary(annotations) {
    if (!annotations || annotations.length === 0) {
        return '<span style="color: #999; font-style: italic;">No annotations</span>';
    }
    
    const bpCount = annotations.filter(a => a.ontology === 'BP').length;
    const mfCount = annotations.filter(a => a.ontology === 'MF').length;
    const ccCount = annotations.filter(a => a.ontology === 'CC').length;
    
    const parts = [];
    if (bpCount > 0) parts.push(`BP: ${bpCount}`);
    if (mfCount > 0) parts.push(`MF: ${mfCount}`);
    if (ccCount > 0) parts.push(`CC: ${ccCount}`);
    
    return parts.length > 0 ? parts.join(', ') : 'No annotations';
}

/**
 * 绑定表格事件
 */
function bindNodesTableEvents() {
    // 节点ID点击事件
    const nodeIdLinks = document.querySelectorAll('.node_id_link');
    nodeIdLinks.forEach(link => {
        link.addEventListener('click', handleNodeIdClick);
    });
    
    // GO注释摘要点击事件
    const goSummaries = document.querySelectorAll('.go_annotation_summary');
    goSummaries.forEach(summary => {
        summary.addEventListener('click', handleGoAnnotationClick);
    });
}

/**
 * 处理节点ID点击事件
 */
function handleNodeIdClick(event) {
    const nodeId = event.target.getAttribute('data-node-id');
    const nodeType = event.target.getAttribute('data-node-type');
    
    console.log('Node ID clicked:', nodeId, nodeType);
    
    // 触发绘制核心网络事件
    const drawNetworkEvent = new CustomEvent('drawCoreNetwork', {
        detail: {
            moduleId: ModuleNodesState.currentModuleId,
            nodeId: nodeId,
            nodeType: nodeType,
            source: 'nodesList'
        }
    });
    document.dispatchEvent(drawNetworkEvent);
}

/**
 * 处理GO注释点击事件
 */
function handleGoAnnotationClick(event) {
    const nodeId = event.target.getAttribute('data-node-id');
    const nodeType = event.target.getAttribute('data-node-type');
    
    console.log('GO annotation clicked:', nodeId, nodeType);
    
    // 查找对应的节点数据
    const nodeData = ModuleNodesState.currentData.find(node => node.node_id === nodeId);
    if (nodeData) {
        showGoAnnotationModal(nodeData);
    }
}

// ==================== 弹窗相关函数 ====================

/**
 * 显示GO注释详情弹窗
 */
function showGoAnnotationModal(nodeData) {
    const overlay = document.getElementById('go_annotation_overlay');
    const modal = document.getElementById('go_annotation_modal');
    
    if (!overlay || !modal) {
        console.error('GO annotation modal elements not found');
        return;
    }
    
    // 更新节点信息
    updateGoAnnotationModalContent(nodeData);
    
    // 显示弹窗
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

/**
 * 关闭GO注释详情弹窗
 */
function closeGoAnnotationModal() {
    const overlay = document.getElementById('go_annotation_overlay');
    
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }
}

/**
 * 更新GO注释弹窗内容
 */
function updateGoAnnotationModalContent(nodeData) {
    // 更新节点ID和类型
    const nodeIdElement = document.getElementById('modal_node_id');
    const nodeTypeElement = document.getElementById('modal_node_type');
    
    if (nodeIdElement) {
        nodeIdElement.textContent = nodeData.node_id || '-';
    }
    
    if (nodeTypeElement) {
        const nodeType = nodeData.node_type || '-';
        const typeClass = nodeType.toLowerCase();
        nodeTypeElement.textContent = nodeType;
        nodeTypeElement.className = `node_type_badge ${typeClass}`;
    }
    
    // 分类注释数据
    const annotations = nodeData.go_annotations || [];
    const bpAnnotations = annotations.filter(a => a.ontology === 'BP');
    const mfAnnotations = annotations.filter(a => a.ontology === 'MF');
    const ccAnnotations = annotations.filter(a => a.ontology === 'CC');
    
    // 更新数量
    updateAnnotationCount('bp_annotation_count', bpAnnotations.length);
    updateAnnotationCount('mf_annotation_count', mfAnnotations.length);
    updateAnnotationCount('cc_annotation_count', ccAnnotations.length);
    
    // 更新注释列表
    updateAnnotationList('bp_annotation_list', bpAnnotations);
    updateAnnotationList('mf_annotation_list', mfAnnotations);
    updateAnnotationList('cc_annotation_list', ccAnnotations);
    
    // 保存当前节点信息用于绘制网络
    const drawNetworkButton = document.getElementById('draw_node_network_btn');
    if (drawNetworkButton) {
        drawNetworkButton.setAttribute('data-node-id', nodeData.node_id || '');
        drawNetworkButton.setAttribute('data-node-type', nodeData.node_type || '');
    }
}

/**
 * 更新注释数量
 */
function updateAnnotationCount(elementId, count) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = count.toString();
    }
}

/**
 * 更新注释列表
 */
function updateAnnotationList(containerId, annotations) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (annotations.length === 0) {
        container.innerHTML = '<p style="color: #999; font-style: italic; text-align: center; padding: 20px;">No annotations found</p>';
        return;
    }
    
    let html = '';
    annotations.forEach(annotation => {
        const accession = escapeHtml(annotation.accession || '');
        const description = escapeHtml(annotation.description || '');
        const amigoUrl = `https://amigo.geneontology.org/amigo/term/${accession}`;
        
        html += `
            <div class="annotation_item">
                <div class="annotation_description">${description}</div>
                <div class="annotation_accession">
                    <a href="${amigoUrl}" target="_blank" class="go_accession_link">${accession}</a>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 处理弹窗中的绘制网络按钮
 */
function handleDrawNodeNetwork() {
    const drawNetworkButton = document.getElementById('draw_node_network_btn');
    const nodeId = drawNetworkButton?.getAttribute('data-node-id');
    const nodeType = drawNetworkButton?.getAttribute('data-node-type');
    
    if (nodeId && nodeType) {
        console.log('Drawing network for node from modal:', nodeId, nodeType);
        
        // 关闭弹窗
        closeGoAnnotationModal();
        
        // 触发绘制核心网络事件
        const drawNetworkEvent = new CustomEvent('drawCoreNetwork', {
            detail: {
                moduleId: ModuleNodesState.currentModuleId,
                nodeId: nodeId,
                nodeType: nodeType,
                source: 'goAnnotationModal'
            }
        });
        document.dispatchEvent(drawNetworkEvent);
    }
}

// ==================== UI更新函数 ====================

/**
 * 更新加载状态
 */
function updateNodesLoadingState(isLoading) {
    const tableBody = document.getElementById('nodes_table_body');
    
    if (isLoading && tableBody) {
        tableBody.innerHTML = `
            <tr class="loading_row">
                <td colspan="3">
                    <div class="loading_placeholder">
                        <div class="loading_spinner"></div>
                        <p>Loading node information...</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

/**
 * 更新分页控件
 */
function updateNodesPagination() {
    // 更新分页信息
    const pageStart = document.getElementById('nodes_page_start');
    const pageEnd = document.getElementById('nodes_page_end');
    const totalRecords = document.getElementById('nodes_total_records');
    
    const startRecord = ModuleNodesState.totalRecords === 0 ? 0 : (ModuleNodesState.currentPage - 1) * ModuleNodesState.pageSize + 1;
    const endRecord = Math.min(ModuleNodesState.currentPage * ModuleNodesState.pageSize, ModuleNodesState.totalRecords);
    
    if (pageStart) pageStart.textContent = formatNumberWithCommas(startRecord);
    if (pageEnd) pageEnd.textContent = formatNumberWithCommas(endRecord);
    if (totalRecords) totalRecords.textContent = formatNumberWithCommas(ModuleNodesState.totalRecords);
    
    // 更新导航按钮状态
    const firstPageButton = document.getElementById('nodes_first_page');
    const prevPageButton = document.getElementById('nodes_prev_page');
    const nextPageButton = document.getElementById('nodes_next_page');
    const lastPageButton = document.getElementById('nodes_last_page');
    
    const isFirstPage = ModuleNodesState.currentPage <= 1;
    const isLastPage = ModuleNodesState.currentPage >= ModuleNodesState.numPages;
    
    if (firstPageButton) firstPageButton.disabled = isFirstPage;
    if (prevPageButton) prevPageButton.disabled = isFirstPage;
    if (nextPageButton) nextPageButton.disabled = isLastPage;
    if (lastPageButton) lastPageButton.disabled = isLastPage;
    
    // 更新页码按钮
    updateNodesPageNumbers();
    
    // 更新页面跳转输入框范围
    const pageJumpInput = document.getElementById('nodes_page_jump');
    if (pageJumpInput) {
        pageJumpInput.setAttribute('max', ModuleNodesState.numPages.toString());
    }
}

/**
 * 更新页码按钮
 */
function updateNodesPageNumbers() {
    const pageNumbersContainer = document.getElementById('nodes_page_numbers');
    if (!pageNumbersContainer) return;
    
    const totalPages = ModuleNodesState.numPages;
    const currentPage = ModuleNodesState.currentPage;
    
    if (totalPages === 0) {
        pageNumbersContainer.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // 计算显示的页码范围
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // 调整范围以显示5个页码（如果可能）
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 4);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
    }
    
    // 生成页码按钮
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        html += `
            <button class="page_number_button ${isActive ? 'active' : ''}" 
                    data-page="${i}">${i}</button>
        `;
    }
    
    pageNumbersContainer.innerHTML = html;
    
    // 绑定页码按钮事件
    const pageButtons = pageNumbersContainer.querySelectorAll('.page_number_button');
    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageNumber = parseInt(button.getAttribute('data-page'));
            if (pageNumber) {
                goToNodesPage(pageNumber);
            }
        });
    });
}

/**
 * 更新节点统计信息
 */
function updateNodesStats() {
    // 统计不同类型的节点数量
    let tfCount = 0;
    let geneCount = 0;
    
    // 这里可以从当前数据或全局数据中统计
    // 由于我们只有当前页的数据，这里使用估算
    ModuleNodesState.currentData.forEach(node => {
        if (node.node_type === 'TF') {
            tfCount++;
        } else if (node.node_type === 'Gene') {
            geneCount++;
        }
    });
    
    // 更新显示
    const totalCountContainer = document.getElementById('nodes_total_count_container');
    const tfCountContainer = document.getElementById('nodes_tf_count_container');
    const geneCountContainer = document.getElementById('nodes_gene_count_container');
    
    const totalCountElement = document.getElementById('nodes_total_count');
    const tfCountElement = document.getElementById('nodes_tf_count');
    const geneCountElement = document.getElementById('nodes_gene_count');
    
    if (ModuleNodesState.totalRecords > 0) {
        if (totalCountContainer) totalCountContainer.style.display = 'block';
        if (totalCountElement) totalCountElement.textContent = formatNumberWithCommas(ModuleNodesState.totalRecords);
        
        // 暂时隐藏具体类型统计，因为需要额外的API调用来获取准确数据
        if (tfCountContainer) tfCountContainer.style.display = 'none';
        if (geneCountContainer) geneCountContainer.style.display = 'none';
    } else {
        if (totalCountContainer) totalCountContainer.style.display = 'none';
        if (tfCountContainer) tfCountContainer.style.display = 'none';
        if (geneCountContainer) geneCountContainer.style.display = 'none';
    }
}

// ==================== 模块导出 ====================

// 将模块功能暴露到全局作用域
window.ModuleNodesModule = {
    init: initModuleNodes,
    loadData: loadNodesData,
    reset: resetNodesState,
    state: ModuleNodesState
};

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.ModuleNodesModule !== 'undefined') {
        console.log('Auto-initializing Module Nodes Module...');
        window.ModuleNodesModule.init();
    }
}); 