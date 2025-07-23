// TF Regulatory Network 主模块
// 转录因子调控网络页面的主要JavaScript功能

// 全局状态管理
const TfNetworkState = {
    allModules: [],           // 所有模块数据
    filteredModules: [],      // 过滤后的模块数据
    selectedModuleId: null,   // 当前选中的模块ID
    searchKeyword: '',        // 搜索关键词
    sortBy: 'module_id',      // 排序字段
    sortOrder: 'asc',         // 排序顺序
    isLoading: false          // 加载状态
};

// API基础URL
const API_BASE_URL = 'http://127.0.0.1:30004/searchDatabase';

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('TF Regulatory Network page loaded');
    
    // 初始化模块选择板块
    initModuleSelection();
    
    // 初始化功能注释信息板块
    if (typeof window.FunctionalAnnotationModule !== 'undefined') {
        window.FunctionalAnnotationModule.init();
    }
    
    // 初始化模块节点信息板块
    if (typeof window.ModuleNodesModule !== 'undefined') {
        window.ModuleNodesModule.init();
    }
    
    // 初始化网络图绘制板块
    if (typeof window.NetworkVisualizationModule !== 'undefined') {
        window.NetworkVisualizationModule.init();
    }
    
    // 初始化多功能搜索模块
    if (typeof window.MultiSearchModule !== 'undefined') {
        window.MultiSearchModule.init();
    }
    
    // 检查URL参数并处理自动搜索
    handleUrlParameters();
});

// ==================== 模块选择板块功能 ====================

/**
 * 初始化模块选择板块
 */
function initModuleSelection() {
    console.log('Initializing module selection...');
    
    // 绑定事件监听器
    bindModuleSelectionEvents();
    
    // 加载模块数据
    loadNetworkModules();
}

/**
 * 绑定模块选择板块的事件监听器
 */
function bindModuleSelectionEvents() {
    // 折叠/展开按钮
    const collapseButton = document.querySelector('.module_selection_container .collapse_button');
    if (collapseButton) {
        collapseButton.addEventListener('click', toggleModuleSelectionCollapse);
    }
    
    // 搜索输入框
    const searchInput = document.getElementById('module_search_input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleModuleSearch, 300));
    }
    
    // 清除搜索按钮
    const clearSearchButton = document.getElementById('clear_module_search');
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', clearModuleSearch);
    }
    
    // 排序选择器
    const sortSelect = document.getElementById('module_sort_select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleModuleSortChange);
    }
    
    // 排序顺序按钮
    const sortOrderButton = document.getElementById('module_sort_order');
    if (sortOrderButton) {
        sortOrderButton.addEventListener('click', toggleModuleSortOrder);
    }
    
    // 监听来自搜索模块的模块选择事件
    document.addEventListener('selectModuleFromSearch', handleSelectModuleFromSearch);
}

/**
 * 加载网络模块数据
 */
async function loadNetworkModules() {
    console.log('Loading network modules...');
    
    try {
        TfNetworkState.isLoading = true;
        updateLoadingState(true);
        
        const response = await fetch(`${API_BASE_URL}/getNetworkModulesInfo/?searchKeyword=all`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Network modules loaded:', data);
        
        // 根据API返回的数据结构处理
        if (data.type === 'allNetworkModules' && Array.isArray(data.data)) {
            TfNetworkState.allModules = data.data;
        } else if (data.type === 'singleNetworkModule' && data.data) {
            // 如果返回单个模块，转换为数组
            TfNetworkState.allModules = [data.data];
        } else {
            // 如果API结构不匹配，创建模拟数据用于测试
            console.warn('Unexpected API response structure, using mock data');
            TfNetworkState.allModules = generateMockModuleData();
        }
        
        // 更新统计信息
        updateModuleStats();
        
        // 初始化过滤和排序
        applyModuleFiltersAndSort();
        
    } catch (error) {
        console.error('Error loading network modules:', error);
        showErrorMessage('Failed to load network modules. Please try again.');
        
        // 使用模拟数据作为后备
        TfNetworkState.allModules = generateMockModuleData();
        updateModuleStats();
        applyModuleFiltersAndSort();
    } finally {
        TfNetworkState.isLoading = false;
        updateLoadingState(false);
    }
}

/**
 * 生成模拟模块数据（用于测试）
 */
function generateMockModuleData() {
    const mockData = [];
    // 从0开始，确保包含模块0进行测试
    for (let i = 0; i <= 60; i++) {
        mockData.push({
            id: i + 1,
            module_id: i,
            node_count: Math.floor(Math.random() * 2000) + 100,
            edge_count: Math.floor(Math.random() * 50000) + 1000
        });
    }
    return mockData;
}

/**
 * 更新模块统计信息
 */
function updateModuleStats() {
    const totalModulesElement = document.getElementById('total_modules_count');
    const selectedModuleElement = document.getElementById('selected_module_id');
    const nodesContainer = document.getElementById('selected_module_nodes_container');
    const edgesContainer = document.getElementById('selected_module_edges_container');
    const nodesCountElement = document.getElementById('selected_module_nodes_count');
    const edgesCountElement = document.getElementById('selected_module_edges_count');
    
    if (totalModulesElement) {
        totalModulesElement.textContent = TfNetworkState.allModules.length;
    }
    
    if (selectedModuleElement) {
        // 正确处理数值0的情况
        selectedModuleElement.textContent = TfNetworkState.selectedModuleId !== null ? TfNetworkState.selectedModuleId : 'None';
    }
    
    // 更新选中模块的详细统计信息
    if (TfNetworkState.selectedModuleId !== null) {
        const selectedModule = getModuleData(TfNetworkState.selectedModuleId);
        
        if (selectedModule && nodesCountElement && edgesCountElement) {
            // 显示详细的nodes和edges数量（带千位分隔符）
            nodesCountElement.textContent = formatNumberWithCommas(selectedModule.node_count);
            edgesCountElement.textContent = formatNumberWithCommas(selectedModule.edge_count);
            
            // 显示统计容器
            if (nodesContainer) nodesContainer.style.display = 'block';
            if (edgesContainer) edgesContainer.style.display = 'block';
        }
    } else {
        // 隐藏详细统计信息
        if (nodesContainer) nodesContainer.style.display = 'none';
        if (edgesContainer) edgesContainer.style.display = 'none';
    }
}

/**
 * 折叠/展开模块选择板块
 */
function toggleModuleSelectionCollapse() {
    const collapseButton = document.querySelector('.module_selection_container .collapse_button');
    const content = document.querySelector('.module_selection_content');
    const collapseText = document.querySelector('.module_selection_container .collapse_text');
    
    if (!collapseButton || !content || !collapseText) return;
    
    const isCollapsed = collapseButton.getAttribute('data-collapsed') === 'true';
    const collapseIcon = collapseButton.querySelector('.collapse_icon');
    
    if (isCollapsed) {
        // 展开
        collapseButton.setAttribute('data-collapsed', 'false');
        content.classList.remove('collapsed');
        if (collapseIcon) collapseIcon.textContent = '▼';
        collapseText.textContent = 'Collapse';
    } else {
        // 折叠
        collapseButton.setAttribute('data-collapsed', 'true');
        content.classList.add('collapsed');
        if (collapseIcon) collapseIcon.textContent = '▶';
        collapseText.textContent = 'Expand';
    }
}

/**
 * 处理模块搜索
 */
function handleModuleSearch(event) {
    const keyword = event.target.value.trim().toLowerCase();
    TfNetworkState.searchKeyword = keyword;
    console.log('Module search keyword:', keyword);
    
    applyModuleFiltersAndSort();
}

/**
 * 清除搜索
 */
function clearModuleSearch() {
    const searchInput = document.getElementById('module_search_input');
    if (searchInput) {
        searchInput.value = '';
        TfNetworkState.searchKeyword = '';
        applyModuleFiltersAndSort();
    }
}

/**
 * 处理排序字段改变
 */
function handleModuleSortChange(event) {
    TfNetworkState.sortBy = event.target.value;
    console.log('Module sort by:', TfNetworkState.sortBy);
    
    applyModuleFiltersAndSort();
}

/**
 * 切换排序顺序
 */
function toggleModuleSortOrder() {
    const sortOrderButton = document.getElementById('module_sort_order');
    if (!sortOrderButton) return;
    
    const currentOrder = sortOrderButton.getAttribute('data-order');
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    
    sortOrderButton.setAttribute('data-order', newOrder);
    sortOrderButton.textContent = newOrder === 'asc' ? '↑' : '↓';
    
    TfNetworkState.sortOrder = newOrder;
    console.log('Module sort order:', TfNetworkState.sortOrder);
    
    applyModuleFiltersAndSort();
}

/**
 * 应用过滤和排序
 */
function applyModuleFiltersAndSort() {
    let filteredData = [...TfNetworkState.allModules];
    
    // 应用搜索过滤
    if (TfNetworkState.searchKeyword) {
        filteredData = filteredData.filter(module => {
            const keyword = TfNetworkState.searchKeyword;
            return (
                module.module_id.toString().includes(keyword) ||
                module.node_count.toString().includes(keyword) ||
                module.edge_count.toString().includes(keyword)
            );
        });
    }
    
    // 应用排序
    filteredData.sort((a, b) => {
        let valueA = a[TfNetworkState.sortBy];
        let valueB = b[TfNetworkState.sortBy];
        
        // 数字比较
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return TfNetworkState.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        }
        
        // 字符串比较
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
        
        if (TfNetworkState.sortOrder === 'asc') {
            return valueA.localeCompare(valueB);
        } else {
            return valueB.localeCompare(valueA);
        }
    });
    
    TfNetworkState.filteredModules = filteredData;
    renderModuleGrid();
}

/**
 * 渲染模块网格
 */
function renderModuleGrid() {
    const moduleGrid = document.getElementById('module_grid');
    if (!moduleGrid) return;
    
    // 清空现有内容
    moduleGrid.innerHTML = '';
    
    if (TfNetworkState.filteredModules.length === 0) {
        // 显示无结果状态
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no_modules_found';
        noResultsDiv.innerHTML = `
            <p>No modules found matching your search criteria.</p>
        `;
        moduleGrid.appendChild(noResultsDiv);
        return;
    }
    
    // 渲染模块卡片
    TfNetworkState.filteredModules.forEach(module => {
        const moduleCard = createModuleCard(module);
        moduleGrid.appendChild(moduleCard);
    });
    
    console.log(`Rendered ${TfNetworkState.filteredModules.length} modules`);
}

/**
 * 创建模块卡片
 */
function createModuleCard(module) {
    const card = document.createElement('div');
    card.className = 'module_card fade_in';
    card.setAttribute('data-module-id', module.module_id);
    
    // 检查是否为选中状态
    if (TfNetworkState.selectedModuleId === module.module_id) {
        card.classList.add('selected');
    }
    
    card.innerHTML = `
        <div class="module_id">
            <span class="module_id_badge">M${module.module_id}</span>
            Module ${module.module_id}
        </div>
        <div class="module_stats_grid">
            <div class="module_stat">
                <span class="module_stat_label">Nodes</span>
                <span class="module_stat_value">${formatNumber(module.node_count)}</span>
            </div>
            <div class="module_stat">
                <span class="module_stat_label">Edges</span>
                <span class="module_stat_value">${formatNumber(module.edge_count)}</span>
            </div>
        </div>
    `;
    
    // 添加点击事件
    card.addEventListener('click', () => selectModule(module.module_id));
    
    return card;
}

/**
 * 选择模块
 */
function selectModule(moduleId) {
    console.log('Selecting module:', moduleId);
    
    // 更新状态
    const previousSelectedId = TfNetworkState.selectedModuleId;
    TfNetworkState.selectedModuleId = moduleId;
    
    // 更新UI
    updateModuleCardSelection(previousSelectedId, moduleId);
    updateModuleStats();
    
    // 通知其他板块更新
    notifyModuleSelectionChanged(moduleId);
    
    // 滚动到选中的卡片
    scrollToSelectedModule(moduleId);
}

/**
 * 更新模块卡片选中状态
 */
function updateModuleCardSelection(previousId, currentId) {
    // 移除之前的选中状态
    if (previousId !== null && previousId !== undefined) {
        const previousCard = document.querySelector(`[data-module-id="${previousId}"]`);
        if (previousCard) {
            previousCard.classList.remove('selected');
        }
    }
    
    // 添加当前的选中状态
    if (currentId !== null && currentId !== undefined) {
        const currentCard = document.querySelector(`[data-module-id="${currentId}"]`);
        if (currentCard) {
            currentCard.classList.add('selected');
        }
    }
}

/**
 * 滚动到选中的模块
 */
function scrollToSelectedModule(moduleId) {
    const selectedCard = document.querySelector(`[data-module-id="${moduleId}"]`);
    const scrollContainer = document.querySelector('.module_grid_scroll_container');
    
    if (selectedCard && scrollContainer) {
        const cardRect = selectedCard.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        if (cardRect.top < containerRect.top || cardRect.bottom > containerRect.bottom) {
            selectedCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}

/**
 * 通知其他板块模块选择已改变
 */
function notifyModuleSelectionChanged(moduleId) {
    console.log('Module selection changed to:', moduleId);
    
    // 查找对应的模块数据
    const moduleData = TfNetworkState.allModules.find(module => module.module_id === moduleId);
    
    // 发送自定义事件
    const event = new CustomEvent('moduleSelected', {
        detail: { 
            moduleId: moduleId,
            moduleData: moduleData
        }
    });
    document.dispatchEvent(event);
}

/**
 * 更新加载状态
 */
function updateLoadingState(isLoading) {
    const moduleGrid = document.getElementById('module_grid');
    if (!moduleGrid) return;
    
    if (isLoading) {
        moduleGrid.innerHTML = `
            <div class="loading_placeholder">
                <div class="loading_spinner"></div>
                <p>Loading network modules...</p>
            </div>
        `;
    }
}

/**
 * 显示错误消息
 */
function showErrorMessage(message) {
    const moduleGrid = document.getElementById('module_grid');
    if (!moduleGrid) return;
    
    moduleGrid.innerHTML = `
        <div class="no_modules_found">
            <p style="color: #e96a6a;">⚠️ ${message}</p>
        </div>
    `;
}

// ==================== URL参数处理 ====================
// 支持通过URL参数自动触发搜索功能
// 使用方法：tfRegulatoryNetwork.html?searchKeyword=SGI000001.SO.001

/**
 * 处理URL参数
 */
function handleUrlParameters() {
    console.log('Checking URL parameters...');
    
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const searchKeyword = urlParams.get('searchKeyword');
    
    if (searchKeyword && searchKeyword.trim()) {
        console.log('Found searchKeyword parameter:', searchKeyword);
        
        // 验证搜索关键词格式（基本验证）
        const trimmedKeyword = searchKeyword.trim();
        if (trimmedKeyword.length > 0) {
            // 更新页面标题以反映搜索状态
            const originalTitle = document.title;
            document.title = `GT42 - Searching for ${trimmedKeyword}`;
            
            // 等待多功能搜索模块完全加载后再执行
            setTimeout(() => {
                triggerNodeIdSearchFromUrl(trimmedKeyword);
                
                // 搜索完成后恢复原标题
                setTimeout(() => {
                    document.title = originalTitle;
                }, 3000);
            }, 500);
        } else {
            console.warn('Empty searchKeyword parameter, using default initialization');
        }
    } else {
        console.log('No valid searchKeyword parameter found, using default initialization');
    }
}

/**
 * 获取当前URL参数
 */
function getCurrentUrlParameters() {
    return new URLSearchParams(window.location.search);
}

/**
 * 更新URL参数而不刷新页面
 */
function updateUrlParameter(key, value) {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set(key, value);
    } else {
        url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url);
}

/**
 * 从URL参数触发节点ID搜索
 */
function triggerNodeIdSearchFromUrl(nodeId) {
    console.log('Triggering node ID search from URL parameter:', nodeId);
    
    try {
        // 检查多功能搜索模块是否已加载
        if (typeof window.MultiSearchModule === 'undefined') {
            console.error('MultiSearchModule not loaded yet, retrying...');
            setTimeout(() => triggerNodeIdSearchFromUrl(nodeId), 500);
            return;
        }
        
        // 1. 切换到节点ID搜索标签页
        const nodeIdTab = document.querySelector('[data-function="node_id"]');
        if (nodeIdTab) {
            nodeIdTab.click();
            console.log('Switched to node ID search tab');
        } else {
            console.error('Node ID search tab not found, retrying...');
            setTimeout(() => triggerNodeIdSearchFromUrl(nodeId), 300);
            return;
        }
        
        // 2. 填入搜索关键词
        const searchInput = document.getElementById('node_id_search_input');
        if (searchInput) {
            searchInput.value = nodeId;
            console.log('Filled search input with:', nodeId);
            
            // 触发input事件以确保任何监听器被调用
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.error('Node ID search input not found, retrying...');
            setTimeout(() => triggerNodeIdSearchFromUrl(nodeId), 300);
            return;
        }
        
        // 3. 等待一小段时间确保UI更新完成，然后触发搜索
        setTimeout(() => {
            const searchButton = document.getElementById('node_id_search_button');
            if (searchButton) {
                searchButton.click();
                console.log('Triggered node ID search');
                
                // 显示用户提示
                showAutoSearchNotification(nodeId);
                
                // 可选：自动滚动到搜索结果区域
                setTimeout(() => {
                    const searchResultsContainer = document.getElementById('search_results_container');
                    if (searchResultsContainer && searchResultsContainer.style.display !== 'none') {
                        searchResultsContainer.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }
                }, 1000);
                
            } else {
                console.error('Node ID search button not found');
            }
        }, 200);
        
    } catch (error) {
        console.error('Error triggering node ID search from URL:', error);
    }
}

/**
 * 显示自动搜索通知
 */
function showAutoSearchNotification(nodeId) {
    // 创建一个简单的通知提示
    const notification = document.createElement('div');
    notification.className = 'auto_search_notification';
    notification.innerHTML = `
        <div class="notification_content">
            <span class="notification_icon">🔍</span>
            <span class="notification_text">Automatically searching for node: <strong>${nodeId}</strong></span>
        </div>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .auto_search_notification .notification_content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .auto_search_notification .notification_icon {
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

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
 * 格式化数字显示（缩略形式）
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * 格式化数字显示（带千位分隔符）
 */
function formatNumberWithCommas(num) {
    if (typeof num !== 'number') {
        return num.toString();
    }
    return num.toLocaleString();
}

/**
 * 获取当前选中的模块ID
 */
function getSelectedModuleId() {
    return TfNetworkState.selectedModuleId;
}

/**
 * 获取模块数据
 */
function getModuleData(moduleId) {
    return TfNetworkState.allModules.find(module => module.module_id === moduleId);
}

/**
 * 处理来自搜索模块的模块选择事件
 */
function handleSelectModuleFromSearch(event) {
    const { moduleId } = event.detail;
    console.log('Received module selection from search:', moduleId);
    
    if (moduleId !== null && moduleId !== undefined) {
        // 添加短暂延迟确保模块卡片已渲染
        setTimeout(() => {
            // 检查模块卡片是否存在
            const moduleCard = document.querySelector(`[data-module-id="${moduleId}"]`);
            console.log('Looking for module card:', moduleId, 'Found:', !!moduleCard);
            
            if (!moduleCard) {
                console.warn('Module card not found, ensuring modules are loaded...');
                // 如果模块卡片不存在，强制重新加载模块数据
                loadNetworkModules().then(() => {
                    // 再次尝试选择
                    setTimeout(() => {
                        selectModule(moduleId);
                    }, 100);
                });
            } else {
                // 直接选择模块
                selectModule(moduleId);
            }
            
            console.log(`Module ${moduleId} selected from search`);
        }, 200);
    }
}

// 导出全局函数供其他模块使用
window.TfNetworkUtils = {
    getSelectedModuleId,
    getModuleData,
    selectModule,
    triggerNodeIdSearchFromUrl,
    handleUrlParameters,
    getCurrentUrlParameters,
    updateUrlParameter
};

console.log('TF Regulatory Network main module loaded');

// ==================== 使用示例 ====================
/*
URL参数搜索功能使用示例：

1. 基本用法：
   tfRegulatoryNetwork.html?searchKeyword=SGI000001.SO.001

2. 程序化调用：
   // 手动触发节点ID搜索
   window.TfNetworkUtils.triggerNodeIdSearchFromUrl('SGI000001.SO.001');
   
   // 更新URL参数
   window.TfNetworkUtils.updateUrlParameter('searchKeyword', 'SGI000001.SO.001');
   
   // 获取当前URL参数
   const params = window.TfNetworkUtils.getCurrentUrlParameters();
   console.log('Current searchKeyword:', params.get('searchKeyword'));

3. 清除URL参数：
   window.TfNetworkUtils.updateUrlParameter('searchKeyword', null);

注意：
- 搜索功能会自动切换到"节点ID搜索"标签页
- 搜索结果会显示在页面的搜索结果区域
- 会显示友好的搜索通知提示
- 支持自动滚动到搜索结果区域
*/
