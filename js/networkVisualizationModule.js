// 网络图绘制模块
// Network Visualization Module for TF Regulatory Network

// 全局状态管理
const NetworkVisualizationState = {
    // 当前核心节点信息
    currentCoreNodeId: null,
    currentModuleId: null,
    currentNodeType: null,
    
    // 子网络信息（用于ID集合搜索）
    currentFocusNodeIds: [],     // 当前聚焦的节点ID列表
    networkType: 'core',         // 'core' 或 'subnetwork'
    
    // 网络数据
    networkData: null,           // 当前网络的完整数据
    currentFilterTopN: 100,      // 当前过滤的边数
    
    // ECharts实例
    chartInstance: null,
    
    // 表格状态
    edgesTableState: {
        currentPage: 1,
        pageSize: 10,
        searchKeyword: '',
        sortBy: 'weight',
        sortOrder: 'desc',
        totalRecords: 0,
        numPages: 0,
        currentData: []
    },
    
    // UI状态
    isVisible: false,
    isCollapsed: false,
    isLoading: false
};

// API基础URL
const API_BASE_URL = 'http://127.0.0.1:30004/searchDatabase';

// 模块初始化
window.NetworkVisualizationModule = {
    init: function() {
        console.log('Initializing Network Visualization Module...');
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 不在页面加载时初始化ECharts，等到显示网络容器时再初始化
        console.log('Network Visualization Module initialized (ECharts will be initialized when needed)');
        
        console.log('Network Visualization Module initialized');
    },
    
    // 确保ECharts实例已初始化
    ensureChartInitialized: function() {
        return new Promise((resolve) => {
            if (NetworkVisualizationState.chartInstance) {
                console.log('ECharts instance already exists');
                resolve();
                return;
            }
            
            console.log('Waiting for ECharts instance to be initialized...');
            const checkInterval = setInterval(() => {
                if (NetworkVisualizationState.chartInstance) {
                    console.log('ECharts instance is now available');
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50);
            
            // 最大等待时间为5秒
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!NetworkVisualizationState.chartInstance) {
                    console.warn('ECharts instance still not available after timeout, forcing initialization');
                    this.initializeChart();
                    setTimeout(() => {
                        resolve();
                    }, 100);
                } else {
                    resolve();
                }
            }, 5000);
        });
    },
    
    // 绑定事件监听器
    bindEvents: function() {
        // 监听绘制核心网络事件
        document.addEventListener('drawCoreNetwork', this.handleDrawCoreNetworkEvent.bind(this));
        
        // 监听绘制子网络事件（用于ID集合搜索）
        document.addEventListener('drawSubnetwork', this.handleDrawSubnetworkEvent.bind(this));
        
        // 监听模块选择事件
        document.addEventListener('moduleSelected', this.handleModuleSelectionChange.bind(this));
        
        // 绑定折叠/展开按钮
        this.bindCollapseEvents();
        
        // 绑定网络控制事件
        this.bindNetworkControlEvents();
        
        // 绑定表格事件
        this.bindTableEvents();
        
        // 绑定节点弹窗事件
        this.bindPopupEvents();
    },
    
    // 处理绘制核心网络事件
    handleDrawCoreNetworkEvent: async function(event) {
        const { moduleId, nodeId, nodeType } = event.detail;
        console.log('Drawing core network for:', { moduleId, nodeId, nodeType });
        console.log('Module ID type:', typeof moduleId, 'Value:', moduleId);
        
        // 更新状态
        NetworkVisualizationState.currentModuleId = moduleId;
        NetworkVisualizationState.currentCoreNodeId = nodeId;
        NetworkVisualizationState.currentNodeType = nodeType;
        NetworkVisualizationState.currentFocusNodeIds = [nodeId];
        NetworkVisualizationState.networkType = 'core';
        
        // 展开网络绘制板块（如果已折叠）
        this.expandNetworkContainer();
        
        // 显示网络图绘制板块并等待ECharts初始化完成
        await this.showNetworkContainer();
        
        // 滚动到网络图绘制板块
        this.scrollToNetworkContainer();
        
        // 加载网络数据并绘制
        this.loadAndDrawNetwork();
    },
    
    // 处理绘制子网络事件（用于ID集合搜索）
    handleDrawSubnetworkEvent: async function(event) {
        const { moduleId, nodeIds, sourceType } = event.detail;
        console.log('Drawing subnetwork for:', { moduleId, nodeIds, sourceType });
        console.log('Module ID type and value:', typeof moduleId, moduleId);
        console.log('NodeIds length:', nodeIds ? nodeIds.length : 0);
        
        // 检查moduleId是否有效
        if (moduleId === null || moduleId === undefined) {
            console.error('Invalid moduleId received:', moduleId);
            return;
        }
        
        // 更新状态
        NetworkVisualizationState.currentModuleId = moduleId;
        NetworkVisualizationState.currentCoreNodeId = null;
        NetworkVisualizationState.currentNodeType = null;
        NetworkVisualizationState.currentFocusNodeIds = nodeIds || [];
        NetworkVisualizationState.networkType = 'subnetwork';
        
        console.log('Updated network state:', {
            currentModuleId: NetworkVisualizationState.currentModuleId,
            currentModuleIdType: typeof NetworkVisualizationState.currentModuleId,
            currentFocusNodeIds: NetworkVisualizationState.currentFocusNodeIds,
            networkType: NetworkVisualizationState.networkType
        });
        
        // 展开网络绘制板块（如果已折叠）
        this.expandNetworkContainer();
        
        // 显示网络图绘制板块并等待ECharts初始化完成
        await this.showNetworkContainer();
        
        // 滚动到网络图绘制板块
        this.scrollToNetworkContainer();
        
        // 加载子网络数据并绘制
        this.loadAndDrawSubnetwork();
    },
    
    // 处理模块选择变更事件
    handleModuleSelectionChange: function(event) {
        const { moduleId } = event.detail;
        console.log('Module selection changed to:', moduleId);
        
        // 重置网络状态
        NetworkVisualizationState.currentCoreNodeId = null;
        NetworkVisualizationState.currentNodeType = null;
        NetworkVisualizationState.currentFocusNodeIds = [];
        NetworkVisualizationState.networkType = 'core';
        
        // 清空并隐藏网络绘制板块
        this.clearAndHideNetworkContainer();
    },
    
    // 显示网络图绘制板块
    showNetworkContainer: function() {
        return new Promise((resolve) => {
            const container = document.querySelector('.network_visualization_container');
            if (container) {
                container.style.display = 'block';
                NetworkVisualizationState.isVisible = true;
                
                // 确保ECharts已初始化，如果没有则现在初始化
                if (!NetworkVisualizationState.chartInstance) {
                    setTimeout(() => {
                        this.initializeChart();
                        // 等待一个额外的短暂延迟确保初始化完成
                        setTimeout(() => {
                            resolve();
                        }, 50);
                    }, 100);
                } else {
                    // 如果已经初始化，调整尺寸
                    setTimeout(() => {
                        if (NetworkVisualizationState.chartInstance) {
                            NetworkVisualizationState.chartInstance.resize();
                        }
                        resolve();
                    }, 100);
                }
                
                // 更新统计信息
                this.updateNetworkStats();
            } else {
                resolve();
            }
        });
    },
    
    // 滚动到网络图绘制板块
    scrollToNetworkContainer: function() {
        const container = document.querySelector('.network_visualization_container');
        if (container) {
            setTimeout(() => {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    },
    
    // 初始化ECharts图表
    initializeChart: function() {
        const chartContainer = document.getElementById('network_chart');
        if (chartContainer && typeof echarts !== 'undefined') {
            console.log('Initializing ECharts with container dimensions:', {
                width: chartContainer.clientWidth,
                height: chartContainer.clientHeight,
                offsetWidth: chartContainer.offsetWidth,
                offsetHeight: chartContainer.offsetHeight
            });
            
            // 确保容器有尺寸再初始化
            if (chartContainer.clientWidth === 0 || chartContainer.clientHeight === 0) {
                console.warn('ECharts container has zero dimensions, retrying...');
                setTimeout(() => {
                    this.initializeChart();
                }, 100);
                return;
            }
            
            try {
                NetworkVisualizationState.chartInstance = echarts.init(chartContainer);
                console.log('ECharts.init() called successfully, instance:', NetworkVisualizationState.chartInstance);
                
                // 绑定点击事件
                NetworkVisualizationState.chartInstance.on('click', this.handleChartNodeClick.bind(this));
                
                // 绑定窗口大小改变事件
                window.addEventListener('resize', () => {
                    if (NetworkVisualizationState.chartInstance) {
                        NetworkVisualizationState.chartInstance.resize();
                    }
                });
                
                console.log('ECharts instance initialized successfully');
            } catch (error) {
                console.error('Error initializing ECharts:', error);
                NetworkVisualizationState.chartInstance = null;
            }
        }
    },
    
    // 加载并绘制网络
    loadAndDrawNetwork: async function() {
        if (!NetworkVisualizationState.currentCoreNodeId || 
            NetworkVisualizationState.currentModuleId === null || 
            NetworkVisualizationState.currentModuleId === undefined) return;
        
        this.showChartLoading();
        
        // 确保ECharts实例已初始化
        await this.ensureChartInitialized();
        
        try {
            // 获取网络数据（不分页版本，用于绘图）
            const networkData = await this.fetchNetworkData();
            
            if (networkData) {
                NetworkVisualizationState.networkData = networkData;
                
                // 绘制网络图
                this.drawNetworkChart(networkData);
                
                // 加载表格数据
                this.loadEdgesTableData();
                
                // 更新统计信息
                this.updateNetworkStats();
            }
        } catch (error) {
            console.error('Error loading network data:', error);
            this.showChartError();
        }
    },
    
    // 获取网络数据
    fetchNetworkData: async function() {
        const url = `${API_BASE_URL}/getNetworkCoreTable/`;
        const params = new URLSearchParams({
            module_id: NetworkVisualizationState.currentModuleId,
            node_id: NetworkVisualizationState.currentCoreNodeId,
            filter_top_n: NetworkVisualizationState.currentFilterTopN
        });
        
        try {
            const response = await fetch(`${url}?${params}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            console.log('Network data received:', data);
            
            return data;
        } catch (error) {
            console.error('Error fetching network data:', error);
            
            // 返回模拟数据作为后备
            return this.getMockNetworkData();
        }
    },
    
    // 获取模拟网络数据
    getMockNetworkData: function() {
        const coreNodeId = NetworkVisualizationState.currentCoreNodeId;
        const coreNodeType = NetworkVisualizationState.currentNodeType || 'Gene';
        
        return {
            type: "networkCoreTable",
            module_id: NetworkVisualizationState.currentModuleId,
            node_id: coreNodeId,
            filter_top_n: NetworkVisualizationState.currentFilterTopN,
            totalRecords: 25,
            data: [
                {
                    source: coreNodeId,
                    source_type: coreNodeType,
                    target: "SGI001234.SO.002",
                    target_type: coreNodeType === "Gene" ? "TF" : "Gene",
                    weight: 0.95
                },
                {
                    source: "SGI001235.SO.003",
                    source_type: coreNodeType === "Gene" ? "TF" : "Gene",
                    target: coreNodeId,
                    target_type: coreNodeType,
                    weight: 0.87
                },
                {
                    source: coreNodeId,
                    source_type: coreNodeType,
                    target: "SGI001236.SO.004",
                    target_type: coreNodeType === "Gene" ? "TF" : "Gene",
                    weight: 0.82
                },
                {
                    source: "SGI001237.SO.005",
                    source_type: coreNodeType === "Gene" ? "TF" : "Gene",
                    target: coreNodeId,
                    target_type: coreNodeType,
                    weight: 0.78
                },
                {
                    source: coreNodeId,
                    source_type: coreNodeType,
                    target: "SGI001238.SO.006",
                    target_type: coreNodeType === "Gene" ? "TF" : "Gene",
                    weight: 0.74
                }
            ]
        };
    },
    
    // 加载并绘制子网络（用于ID集合搜索）
    loadAndDrawSubnetwork: async function() {
        console.log('loadAndDrawSubnetwork called with state:', {
            currentModuleId: NetworkVisualizationState.currentModuleId,
            currentFocusNodeIds: NetworkVisualizationState.currentFocusNodeIds,
            networkType: NetworkVisualizationState.networkType
        });
        
        if (!NetworkVisualizationState.currentFocusNodeIds.length || 
            NetworkVisualizationState.currentModuleId === null || 
            NetworkVisualizationState.currentModuleId === undefined) {
            console.warn('loadAndDrawSubnetwork: Missing required state', {
                focusNodeIdsLength: NetworkVisualizationState.currentFocusNodeIds.length,
                currentModuleId: NetworkVisualizationState.currentModuleId
            });
            return;
        }
        
        this.showChartLoading();
        
        // 确保ECharts实例已初始化
        await this.ensureChartInitialized();
        
        try {
            // 获取子网络数据（不分页版本，用于绘图）
            const subnetworkData = await this.fetchSubnetworkData();
            
            if (subnetworkData) {
                NetworkVisualizationState.networkData = subnetworkData;
                
                // 绘制子网络图
                this.drawSubnetworkChart(subnetworkData);
                
                // 加载表格数据
                this.loadSubnetworkEdgesTableData();
                
                // 更新统计信息
                this.updateSubnetworkStats();
            }
        } catch (error) {
            console.error('Error loading subnetwork data:', error);
            this.showChartError();
        }
    },
    
    // 获取子网络数据
    fetchSubnetworkData: async function() {
        const url = `${API_BASE_URL}/getNetworkSubnetworkTable/`;
        
        const requestData = {
            node_ids: NetworkVisualizationState.currentFocusNodeIds,
            module_id: NetworkVisualizationState.currentModuleId,
            filter_top_n: NetworkVisualizationState.currentFilterTopN
        };
        
        console.log('Fetching subnetwork data with request:', requestData);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                console.error(`Subnetwork API request failed: ${response.status} ${response.statusText}`);
                console.error('Request URL:', url);
                console.error('Request data:', requestData);
                
                // 尝试读取响应内容以获取更详细的错误信息
                try {
                    const errorText = await response.text();
                    console.error('API error response body:', errorText);
                } catch (e) {
                    console.error('Could not read error response body:', e);
                }
                
                throw new Error(`Subnetwork API response was not ok: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Subnetwork data received:', data);
            
            return data;
        } catch (error) {
            console.error('Error fetching subnetwork data:', error);
            console.error('Will use mock data as fallback for module:', NetworkVisualizationState.currentModuleId);
            
            // 返回模拟数据作为后备
            const mockData = this.getMockSubnetworkData();
            console.log('Generated mock subnetwork data:', mockData);
            return mockData;
        }
    },
    
    // 获取模拟子网络数据
    getMockSubnetworkData: function() {
        const focusNodeIds = NetworkVisualizationState.currentFocusNodeIds;
        const mockEdges = [];
        
        // 为每个聚焦节点创建一些连接
        focusNodeIds.forEach((nodeId, index) => {
            const nodeType = nodeId.includes('.SO.') ? 'Gene' : 'TF';
            const oppositeType = nodeType === 'Gene' ? 'TF' : 'Gene';
            
            // 聚焦节点之间的连接
            if (index < focusNodeIds.length - 1) {
                mockEdges.push({
                    source: nodeId,
                    source_type: nodeType,
                    target: focusNodeIds[index + 1],
                    target_type: focusNodeIds[index + 1].includes('.SO.') ? 'Gene' : 'TF',
                    weight: 0.92 - index * 0.05
                });
            }
            
            // 每个聚焦节点的一些邻接节点
            for (let i = 1; i <= 3; i++) {
                const targetId = `SGI${String(Math.floor(Math.random() * 10000)).padStart(6, '0')}.${nodeType === 'Gene' ? 'SS' : 'SO'}.${String(i).padStart(3, '0')}`;
                mockEdges.push({
                    source: nodeId,
                    source_type: nodeType,
                    target: targetId,
                    target_type: oppositeType,
                    weight: 0.85 - i * 0.1
                });
            }
        });
        
        return {
            type: "networkSubnetworkTable",
            module_id: NetworkVisualizationState.currentModuleId,
            input_node_count: focusNodeIds.length,
            found_node_count: focusNodeIds.length,
            found_nodes: focusNodeIds,
            not_found_nodes: [],
            filter_top_n: NetworkVisualizationState.currentFilterTopN,
            total_edges: mockEdges.length,
            data: mockEdges
        };
    },
    
    // 绘制子网络图
    drawSubnetworkChart: function(subnetworkData) {
        console.log('drawSubnetworkChart called with:', {
            chartInstance: !!NetworkVisualizationState.chartInstance,
            subnetworkData: !!subnetworkData,
            focusNodeIds: NetworkVisualizationState.currentFocusNodeIds
        });
        
        if (!NetworkVisualizationState.chartInstance) {
            console.error('Cannot draw subnetwork chart: missing chart instance');
            return;
        }
        
        if (!subnetworkData || !subnetworkData.data) {
            console.error('Cannot draw subnetwork chart: missing subnetwork data');
            return;
        }
        
        // 构建节点和边数据（使用修改版的buildNetworkData支持多个聚焦节点）
        const { nodes, links } = this.buildSubnetworkData(subnetworkData.data);
        
        // 配置ECharts选项
        const focusNodesText = NetworkVisualizationState.currentFocusNodeIds.length > 1 
            ? `${NetworkVisualizationState.currentFocusNodeIds.length} Selected Nodes`
            : NetworkVisualizationState.currentFocusNodeIds[0];
            
        const option = {
            title: {
                text: `Subnetwork for ${focusNodesText}`,
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#2d7a4f',
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.dataType === 'node') {
                        const isFocusNode = NetworkVisualizationState.currentFocusNodeIds.includes(params.data.name);
                        const focusText = isFocusNode ? '<br/><em style="color: #e67e22;">Focus Node</em>' : '';
                        return `<strong>${params.data.name}</strong><br/>Type: ${params.data.type}<br/>Connections: ${params.data.connections || 0}${focusText}<br/><em>Click for details</em>`;
                    } else if (params.dataType === 'edge') {
                        return `<strong>${params.data.source}</strong> → <strong>${params.data.target}</strong><br/>Weight: ${params.data.weight}`;
                    }
                }
            },
            series: [{
                name: 'Subnetwork',
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                roam: true,
                focusNodeAdjacency: true,
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                lineStyle: {
                    color: '#4fb479',
                    width: 2,
                    curveness: 0.1
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 4
                    }
                },
                force: {
                    repulsion: 1200,
                    gravity: 0.1,
                    edgeLength: 180,
                    layoutAnimation: true
                }
            }]
        };
        
        // 设置图表选项
        NetworkVisualizationState.chartInstance.setOption(option, true);
        
        // 确保图表正确调整尺寸
        setTimeout(() => {
            if (NetworkVisualizationState.chartInstance) {
                NetworkVisualizationState.chartInstance.resize();
            }
        }, 100);
        
        console.log(`Subnetwork chart drawn with ${nodes.length} nodes and ${links.length} edges`);
        
        // 等待2秒后隐藏loading动画
        setTimeout(() => {
            this.hideChartLoading();
            console.log('Loading animation hidden after 2 seconds delay');
        }, 2000);
    },
    
    // 构建子网络数据（支持多个聚焦节点）
    buildSubnetworkData: function(edgesData) {
        const nodeMap = new Map();
        const links = [];
        const focusNodeIds = NetworkVisualizationState.currentFocusNodeIds;
        
        // 构建边数据
        edgesData.forEach(edge => {
            // 添加节点到映射
            if (!nodeMap.has(edge.source)) {
                nodeMap.set(edge.source, {
                    id: edge.source,
                    name: edge.source,
                    type: edge.source_type,
                    connections: 0
                });
            }
            
            if (!nodeMap.has(edge.target)) {
                nodeMap.set(edge.target, {
                    id: edge.target,
                    name: edge.target,
                    type: edge.target_type,
                    connections: 0
                });
            }
            
            // 增加连接计数
            nodeMap.get(edge.source).connections++;
            nodeMap.get(edge.target).connections++;
            
            // 添加边
            links.push({
                source: edge.source,
                target: edge.target,
                weight: edge.weight,
                lineStyle: {
                    color: '#4fb479',
                    width: Math.max(1, edge.weight * 3) // 根据权重调整线条粗细
                }
            });
        });
        
        // 构建节点数据
        const nodes = Array.from(nodeMap.values()).map(node => {
            const isFocusNode = focusNodeIds.includes(node.id);
            const isTF = node.type === 'TF';
            
            // 聚焦节点和普通节点都按类型着色，但聚焦节点有特殊的视觉效果
            const baseColor = isTF ? '#dc3545' : '#0d6efd'; // TF红色，Gene蓝色
            
            return {
                id: node.id,
                name: node.name,
                type: node.type,
                connections: node.connections,
                symbolSize: isFocusNode ? 40 : (15 + node.connections * 2), // 聚焦节点更大
                itemStyle: {
                    color: baseColor,
                    borderWidth: isFocusNode ? 6 : 2, // 聚焦节点更粗的边框
                    borderColor: isFocusNode ? '#e67e22' : '#ffffff', // 聚焦节点橙色边框
                    shadowBlur: isFocusNode ? 20 : 0, // 聚焦节点添加阴影
                    shadowColor: isFocusNode ? 'rgba(230, 126, 34, 0.4)' : 'transparent',
                    shadowOffsetX: isFocusNode ? 3 : 0,
                    shadowOffsetY: isFocusNode ? 3 : 0,
                    opacity: isFocusNode ? 1 : 0.85 // 聚焦节点完全不透明
                },
                label: {
                    show: isFocusNode || node.connections > 2, // 显示聚焦节点或高连接节点的标签
                    fontSize: isFocusNode ? 16 : 10, // 聚焦节点标签更大
                    fontWeight: isFocusNode ? 'bold' : 'normal',
                    color: isFocusNode ? '#e67e22' : '#666666', // 聚焦节点标签橙色
                    fontFamily: isFocusNode ? 'Arial, sans-serif' : 'inherit'
                },
                emphasis: {
                    focus: 'adjacency',
                    itemStyle: {
                        borderWidth: isFocusNode ? 8 : 3,
                        shadowBlur: isFocusNode ? 25 : 10,
                        shadowColor: isFocusNode ? 'rgba(230, 126, 34, 0.6)' : 'rgba(0, 0, 0, 0.4)'
                    }
                }
            };
        });
        
        return { nodes, links };
    },
    
    // 绘制网络图
    drawNetworkChart: function(networkData) {
        console.log('drawNetworkChart called with:', {
            chartInstance: !!NetworkVisualizationState.chartInstance,
            networkData: !!networkData,
            networkDataData: networkData ? !!networkData.data : false,
            dataLength: networkData && networkData.data ? networkData.data.length : 0
        });
        
        if (!NetworkVisualizationState.chartInstance) {
            console.error('Cannot draw network chart: missing chart instance');
            console.log('Current state:', NetworkVisualizationState);
            return;
        }
        
        if (!networkData || !networkData.data) {
            console.error('Cannot draw network chart: missing network data');
            console.log('Network data:', networkData);
            return;
        }
        
        // 确保ECharts容器有正确的尺寸
        const chartContainer = document.getElementById('network_chart');
        if (chartContainer && (chartContainer.clientWidth === 0 || chartContainer.clientHeight === 0)) {
            console.warn('ECharts container has zero dimensions, resizing...');
            NetworkVisualizationState.chartInstance.resize();
        }
        
        // 构建节点和边数据
        const { nodes, links } = this.buildNetworkData(networkData.data);
        
        // 配置ECharts选项
        const option = {
            title: {
                text: `Regulatory Network for ${NetworkVisualizationState.currentCoreNodeId}`,
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#2d7a4f',
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.dataType === 'node') {
                        return `<strong>${params.data.name}</strong><br/>Type: ${params.data.type}<br/>Connections: ${params.data.connections || 0}<br/><em>Click for details</em>`;
                    } else if (params.dataType === 'edge') {
                        return `<strong>${params.data.source}</strong> → <strong>${params.data.target}</strong><br/>Weight: ${params.data.weight}`;
                    }
                }
            },
            series: [{
                name: 'Regulatory Network',
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                roam: true,
                focusNodeAdjacency: true,
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                lineStyle: {
                    color: '#4fb479',
                    width: 2,
                    curveness: 0.1
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 4
                    }
                },
                force: {
                    repulsion: 1000,
                    gravity: 0.1,
                    edgeLength: 150,
                    layoutAnimation: true
                }
            }]
        };
        
        // 设置图表选项
        NetworkVisualizationState.chartInstance.setOption(option, true);
        
        // 确保图表正确调整尺寸
        setTimeout(() => {
            if (NetworkVisualizationState.chartInstance) {
                NetworkVisualizationState.chartInstance.resize();
            }
        }, 100);
        
        console.log(`Network chart drawn with ${nodes.length} nodes and ${links.length} edges`);
        
        // 等待2秒后隐藏loading动画
        setTimeout(() => {
            this.hideChartLoading();
            console.log('Loading animation hidden after 2 seconds delay');
        }, 2000);
    },
    
    // 构建网络数据
    buildNetworkData: function(edgesData) {
        const nodeMap = new Map();
        const links = [];
        const coreNodeId = NetworkVisualizationState.currentCoreNodeId;
        
        // 构建边数据
        edgesData.forEach(edge => {
            // 添加节点到映射
            if (!nodeMap.has(edge.source)) {
                nodeMap.set(edge.source, {
                    id: edge.source,
                    name: edge.source,
                    type: edge.source_type,
                    connections: 0
                });
            }
            
            if (!nodeMap.has(edge.target)) {
                nodeMap.set(edge.target, {
                    id: edge.target,
                    name: edge.target,
                    type: edge.target_type,
                    connections: 0
                });
            }
            
            // 增加连接计数
            nodeMap.get(edge.source).connections++;
            nodeMap.get(edge.target).connections++;
            
            // 添加边
            links.push({
                source: edge.source,
                target: edge.target,
                weight: edge.weight,
                lineStyle: {
                    color: '#4fb479',
                    width: Math.max(1, edge.weight * 3) // 根据权重调整线条粗细
                }
            });
        });
        
        // 构建节点数据
        const nodes = Array.from(nodeMap.values()).map(node => {
            const isCoreNode = node.id === coreNodeId;
            const isTF = node.type === 'TF';
            
            // 核心节点和普通节点都按类型着色，但核心节点有特殊的视觉效果
            const baseColor = isTF ? '#dc3545' : '#0d6efd'; // TF红色，Gene蓝色
            
            return {
                id: node.id,
                name: node.name,
                type: node.type,
                connections: node.connections,
                symbolSize: isCoreNode ? 35 : (15 + node.connections * 2), // 核心节点更大，连接数越多越大
                itemStyle: {
                    color: baseColor,
                    borderWidth: isCoreNode ? 5 : 2, // 核心节点更粗的边框
                    borderColor: isCoreNode ? '#ffffff' : '#ffffff',
                    shadowBlur: isCoreNode ? 15 : 0, // 核心节点添加阴影
                    shadowColor: isCoreNode ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
                    shadowOffsetX: isCoreNode ? 2 : 0,
                    shadowOffsetY: isCoreNode ? 2 : 0,
                    opacity: isCoreNode ? 1 : 0.85 // 核心节点完全不透明，其他节点稍微透明
                },
                label: {
                    show: isCoreNode || node.connections > 2, // 只显示核心节点或高连接节点的标签
                    fontSize: isCoreNode ? 14 : 10, // 核心节点标签更大
                    fontWeight: isCoreNode ? 'bold' : 'normal',
                    color: isCoreNode ? '#2d2d2d' : '#666666', // 核心节点标签颜色更深
                    fontFamily: isCoreNode ? 'Arial, sans-serif' : 'inherit'
                },
                emphasis: {
                    focus: 'adjacency',
                    itemStyle: {
                        borderWidth: isCoreNode ? 6 : 3,
                        shadowBlur: isCoreNode ? 20 : 10,
                        shadowColor: 'rgba(0, 0, 0, 0.4)'
                    }
                }
            };
        });
        
        return { nodes, links };
    },
    
    // 处理图表节点点击事件
    handleChartNodeClick: function(params) {
        if (params.dataType === 'node') {
            const nodeId = params.data.id;
            const nodeType = params.data.type;
            
            console.log('Node clicked:', nodeId, nodeType);
            
            // 加载节点详情并显示弹窗
            this.loadNodeDetailsAndShowPopup(nodeId, nodeType);
        }
    },
    
    // 加载节点详情并显示弹窗
    loadNodeDetailsAndShowPopup: async function(nodeId, nodeType) {
        try {
            const nodeDetails = await this.fetchNodeDetails(nodeId);
            this.showNodePopup(nodeId, nodeType, nodeDetails);
        } catch (error) {
            console.error('Error loading node details:', error);
            this.showNodePopup(nodeId, nodeType, null);
        }
    },
    
    // 获取节点详情
    fetchNodeDetails: async function(nodeId) {
        const url = `${API_BASE_URL}/getNetworkNodeGoAnnotations/`;
        const params = new URLSearchParams({ node_id: nodeId });
        
        try {
            const response = await fetch(`${url}?${params}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            console.log('Node details received:', data);
            
            return data;
        } catch (error) {
            console.error('Error fetching node details:', error);
            
            // 返回模拟数据作为后备
            return {
                type: "nodeGoAnnotations",
                node_id: nodeId,
                node_type: nodeId.includes('TF') ? 'TF' : 'Gene',
                annotation_count: 3,
                data: [
                    {
                        accession: "GO:0005829",
                        description: "cytosol",
                        ontology: "CC"
                    },
                    {
                        accession: "GO:0016491",
                        description: "oxidoreductase activity",
                        ontology: "MF"
                    },
                    {
                        accession: "GO:0006355",
                        description: "regulation of transcription, DNA-templated",
                        ontology: "BP"
                    }
                ]
            };
        }
    },
    
    // 显示节点弹窗
    showNodePopup: function(nodeId, nodeType, nodeDetails) {
        const popup = document.getElementById('network_node_popup');
        const content = document.getElementById('popup_content');
        
        if (!popup || !content) return;
        
        // 构建弹窗内容
        let html = `
            <div class="node_basic_info">
                <div class="node_id_section">
                    <strong>Node ID:</strong> ${nodeId}
                </div>
                <div class="node_type_section">
                    <strong>Type:</strong> <span class="node_type_badge ${nodeType.toLowerCase()}">${nodeType}</span>
                </div>
            </div>
        `;
        
        // 如果不是当前核心节点，在GO注释上方显示绘制核心网络按钮
        if (nodeId !== NetworkVisualizationState.currentCoreNodeId) {
            html += `
                <div class="popup_actions">
                    <button class="draw_core_network_button" data-node-id="${nodeId}" data-node-type="${nodeType}">
                        <span class="network_icon">🕸️</span>
                        Draw Core Network for This Node
                    </button>
                </div>
            `;
        }
        
        if (nodeDetails && nodeDetails.data && nodeDetails.data.length > 0) {
            html += `
                <div class="node_annotations_section">
                    <h5>GO Annotations (${nodeDetails.annotation_count || nodeDetails.data.length})</h5>
                    <div class="annotations_list">
            `;
            
            nodeDetails.data.forEach(annotation => {
                html += `
                    <div class="annotation_item">
                        <div class="annotation_accession">
                            <a href="https://amigo.geneontology.org/amigo/term/${annotation.accession}" 
                               target="_blank" class="go_link">${annotation.accession}</a>
                        </div>
                        <div class="annotation_description">${annotation.description}</div>
                        <div class="annotation_ontology">
                            <span class="ontology_badge ${annotation.ontology.toLowerCase()}">${annotation.ontology}</span>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="node_annotations_section">
                    <p class="no_annotations">No GO annotations available for this node.</p>
                </div>
            `;
        }
        
        content.innerHTML = html;
        
        // 绑定绘制核心网络按钮事件
        const drawButton = content.querySelector('.draw_core_network_button');
        if (drawButton) {
            drawButton.addEventListener('click', () => {
                this.handlePopupDrawNetwork(nodeId, nodeType);
            });
        }
        
        // 显示弹窗
        popup.style.display = 'block';
    },
    
    // 处理弹窗中的绘制网络按钮
    handlePopupDrawNetwork: function(nodeId, nodeType) {
        // 关闭弹窗
        this.hideNodePopup();
        
        // 触发绘制核心网络事件
        const event = new CustomEvent('drawCoreNetwork', {
            detail: {
                moduleId: NetworkVisualizationState.currentModuleId,
                nodeId: nodeId,
                nodeType: nodeType,
                source: 'networkVisualization'
            }
        });
        document.dispatchEvent(event);
    },
    
    // 隐藏节点弹窗
    hideNodePopup: function() {
        const popup = document.getElementById('network_node_popup');
        if (popup) {
            popup.style.display = 'none';
        }
    },
    
    // 显示图表加载状态
    showChartLoading: function() {
        const loadingPlaceholder = document.querySelector('.chart_loading_placeholder');
        console.log('showChartLoading called, placeholder found:', !!loadingPlaceholder);
        if (loadingPlaceholder) {
            loadingPlaceholder.style.display = 'flex';
            loadingPlaceholder.classList.remove('hidden');
            loadingPlaceholder.innerHTML = `
                <div class="loading_spinner"></div>
                <p>Loading network data...</p>
            `;
            console.log('Loading placeholder displayed');
        }
        
        NetworkVisualizationState.isLoading = true;
    },
    
    // 隐藏图表加载状态
    hideChartLoading: function() {
        const loadingPlaceholder = document.querySelector('.chart_loading_placeholder');
        console.log('hideChartLoading called, placeholder found:', !!loadingPlaceholder);
        if (loadingPlaceholder) {
            loadingPlaceholder.classList.add('hidden');
            setTimeout(() => {
                loadingPlaceholder.style.display = 'none';
                console.log('Loading placeholder hidden with fade effect');
            }, 300); // 等待opacity过渡完成
        }
        
        NetworkVisualizationState.isLoading = false;
    },
    
    // 显示图表错误状态
    showChartError: function() {
        const loadingPlaceholder = document.querySelector('.chart_loading_placeholder');
        if (loadingPlaceholder) {
            loadingPlaceholder.style.display = 'flex';
            loadingPlaceholder.innerHTML = `
                <div style="color: #dc3545; font-size: 24px;">⚠️</div>
                <p style="color: #dc3545;">Error loading network data. Please try again.</p>
            `;
        }
    },
    
    // 更新网络统计信息
    updateNetworkStats: function() {
        // 更新核心节点ID
        const coreNodeElement = document.getElementById('network_core_node_id');
        if (coreNodeElement) {
            coreNodeElement.textContent = NetworkVisualizationState.currentCoreNodeId || 'None';
        }
        
        // 更新模块ID
        const moduleElement = document.getElementById('network_module_id');
        const moduleContainer = document.getElementById('network_module_container');
        if (moduleElement && moduleContainer) {
            moduleElement.textContent = NetworkVisualizationState.currentModuleId !== null ? 
                NetworkVisualizationState.currentModuleId : '-';
            moduleContainer.style.display = NetworkVisualizationState.currentModuleId !== null ? 'block' : 'none';
        }
        
        // 如果有网络数据，更新节点和边的数量
        if (NetworkVisualizationState.networkData) {
            const data = NetworkVisualizationState.networkData.data || [];
            const nodeIds = new Set();
            
            data.forEach(edge => {
                nodeIds.add(edge.source);
                nodeIds.add(edge.target);
            });
            
            // 更新节点数量
            const nodeCountElement = document.getElementById('network_node_count');
            const nodeCountContainer = document.getElementById('network_node_count_container');
            if (nodeCountElement && nodeCountContainer) {
                nodeCountElement.textContent = nodeIds.size.toLocaleString();
                nodeCountContainer.style.display = 'block';
            }
            
            // 更新边数量
            const edgeCountElement = document.getElementById('network_edge_count');
            const edgeCountContainer = document.getElementById('network_edge_count_container');
            if (edgeCountElement && edgeCountContainer) {
                edgeCountElement.textContent = data.length.toLocaleString();
                edgeCountContainer.style.display = 'block';
            }
        }
    },
    
    // 更新子网络统计信息
    updateSubnetworkStats: function() {
        // 更新核心节点ID为聚焦节点列表
        const coreNodeElement = document.getElementById('network_core_node_id');
        if (coreNodeElement) {
            if (NetworkVisualizationState.currentFocusNodeIds.length === 0) {
                coreNodeElement.textContent = 'None';
            } else if (NetworkVisualizationState.currentFocusNodeIds.length === 1) {
                coreNodeElement.textContent = NetworkVisualizationState.currentFocusNodeIds[0];
            } else {
                coreNodeElement.textContent = `${NetworkVisualizationState.currentFocusNodeIds.length} Selected Nodes`;
            }
        }
        
        // 更新模块ID
        const moduleElement = document.getElementById('network_module_id');
        const moduleContainer = document.getElementById('network_module_container');
        if (moduleElement && moduleContainer) {
            moduleElement.textContent = NetworkVisualizationState.currentModuleId !== null ? 
                NetworkVisualizationState.currentModuleId : '-';
            moduleContainer.style.display = NetworkVisualizationState.currentModuleId !== null ? 'block' : 'none';
        }
        
        // 如果有子网络数据，更新节点和边的数量
        if (NetworkVisualizationState.networkData) {
            const data = NetworkVisualizationState.networkData.data || [];
            const nodeIds = new Set();
            
            data.forEach(edge => {
                nodeIds.add(edge.source);
                nodeIds.add(edge.target);
            });
            
            // 更新节点数量
            const nodeCountElement = document.getElementById('network_node_count');
            const nodeCountContainer = document.getElementById('network_node_count_container');
            if (nodeCountElement && nodeCountContainer) {
                nodeCountElement.textContent = nodeIds.size.toLocaleString();
                nodeCountContainer.style.display = 'block';
            }
            
            // 更新边数量
            const edgeCountElement = document.getElementById('network_edge_count');
            const edgeCountContainer = document.getElementById('network_edge_count_container');
            if (edgeCountElement && edgeCountContainer) {
                edgeCountElement.textContent = data.length.toLocaleString();
                edgeCountContainer.style.display = 'block';
            }
        }
    },
    
    // 绑定折叠/展开事件
    bindCollapseEvents: function() {
        const collapseButton = document.querySelector('.network_visualization_container .collapse_button');
        if (collapseButton) {
            collapseButton.addEventListener('click', () => {
                const content = document.querySelector('.network_visualization_content');
                const icon = collapseButton.querySelector('.collapse_icon');
                const text = collapseButton.querySelector('.collapse_text');
                
                if (content) {
                    const isCollapsed = content.classList.contains('collapsed');
                    
                    if (isCollapsed) {
                        content.classList.remove('collapsed');
                        collapseButton.setAttribute('data-collapsed', 'false');
                        icon.textContent = '▼';
                        text.textContent = 'Collapse';
                    } else {
                        content.classList.add('collapsed');
                        collapseButton.setAttribute('data-collapsed', 'true');
                        icon.textContent = '▶';
                        text.textContent = 'Expand';
                    }
                    
                    NetworkVisualizationState.isCollapsed = !isCollapsed;
                }
            });
        }
    },
    
    // 绑定网络控制事件
    bindNetworkControlEvents: function() {
        // 绑定过滤滑块事件
        const filterSlider = document.getElementById('network_edge_filter');
        const filterValueDisplay = document.getElementById('filter_value_display');
        
        if (filterSlider && filterValueDisplay) {
            filterSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                filterValueDisplay.textContent = value;
                
                // 去抖动更新网络
                this.debounceFilterUpdate(value);
            });
        }
        
        // 绑定下载图表按钮事件
        const downloadChartButton = document.getElementById('download_network_chart');
        if (downloadChartButton) {
            downloadChartButton.addEventListener('click', this.handleDownloadChart.bind(this));
        }
    },
    
    // 去抖动过滤更新
    debounceFilterUpdate: function(value) {
        if (this.filterUpdateTimeout) {
            clearTimeout(this.filterUpdateTimeout);
        }
        
        this.filterUpdateTimeout = setTimeout(() => {
            NetworkVisualizationState.currentFilterTopN = value;
            
            // 根据当前网络类型选择相应的加载函数
            if (NetworkVisualizationState.networkType === 'subnetwork') {
                this.loadAndDrawSubnetwork();
            } else {
                this.loadAndDrawNetwork();
            }
        }, 500);
    },
    
    // 处理下载图表
    handleDownloadChart: function() {
        if (!NetworkVisualizationState.chartInstance) return;
        
        const url = NetworkVisualizationState.chartInstance.getDataURL({
            type: 'png',
            backgroundColor: '#fff',
            pixelRatio: 2
        });
        
        const link = document.createElement('a');
        link.download = `network_${NetworkVisualizationState.currentCoreNodeId}_module_${NetworkVisualizationState.currentModuleId}.png`;
        link.href = url;
        link.click();
        
        console.log('Network chart downloaded');
    },
    
    // 绑定弹窗事件
    bindPopupEvents: function() {
        const closeButton = document.getElementById('popup_close_btn');
        if (closeButton) {
            closeButton.addEventListener('click', this.hideNodePopup.bind(this));
        }
        
        // 点击弹窗外部关闭弹窗
        const popup = document.getElementById('network_node_popup');
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.hideNodePopup();
                }
            });
        }
    },
    
    // ==================== 表格功能 ====================
    
    // 绑定表格事件
    bindTableEvents: function() {
        // 绑定搜索事件
        this.bindTableSearchEvents();
        
        // 绑定排序事件
        this.bindTableSortEvents();
        
        // 绑定分页事件
        this.bindTablePaginationEvents();
        
        // 绑定下载事件
        this.bindTableDownloadEvents();
    },
    
    // 加载边表格数据（通用函数，根据网络类型选择）
    loadEdgesTableData: async function() {
        if (NetworkVisualizationState.networkType === 'subnetwork') {
            return this.loadSubnetworkEdgesTableData();
        } else {
            return this.loadCoreNetworkEdgesTableData();
        }
    },
    
    // 加载核心网络边表格数据
    loadCoreNetworkEdgesTableData: async function() {
        if (!NetworkVisualizationState.currentCoreNodeId || 
            NetworkVisualizationState.currentModuleId === null || 
            NetworkVisualizationState.currentModuleId === undefined) return;
        
        const state = NetworkVisualizationState.edgesTableState;
        this.showTableLoading();
        
        try {
            const tableData = await this.fetchCoreNetworkEdgesTableData();
            
            if (tableData) {
                // 更新状态
                state.currentData = tableData.data || [];
                state.totalRecords = tableData.totalRecords || 0;
                state.numPages = tableData.numPages || 0;
                
                // 渲染表格
                this.renderEdgesTable();
                
                // 更新分页
                this.updateEdgesPagination();
            }
        } catch (error) {
            console.error('Error loading edges table data:', error);
            this.showTableError();
        }
    },
    
    // 获取核心网络边表格数据
    fetchCoreNetworkEdgesTableData: async function() {
        const state = NetworkVisualizationState.edgesTableState;
        const url = `${API_BASE_URL}/getNetworkCoreTableByPage/`;
        const params = new URLSearchParams({
            module_id: NetworkVisualizationState.currentModuleId,
            node_id: NetworkVisualizationState.currentCoreNodeId,
            filter_top_n: NetworkVisualizationState.currentFilterTopN,
            page: state.currentPage,
            pageSize: state.pageSize,
            searchKeyword: state.searchKeyword,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder
        });
        
        try {
            const response = await fetch(`${url}?${params}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            console.log('Edges table data received:', data);
            
            return data;
        } catch (error) {
            console.error('Error fetching edges table data:', error);
            
            // 返回模拟数据作为后备
            return this.getMockEdgesTableData();
        }
    },
    
    // 获取模拟边表格数据
    getMockEdgesTableData: function() {
        const state = NetworkVisualizationState.edgesTableState;
        const coreNodeId = NetworkVisualizationState.currentCoreNodeId;
        const coreNodeType = NetworkVisualizationState.currentNodeType || 'Gene';
        
        const mockData = [];
        for (let i = 0; i < 50; i++) {
            const isSource = i % 2 === 0;
            mockData.push({
                source: isSource ? coreNodeId : `SGI${String(1000 + i).padStart(6, '0')}.SO.${String(i % 10).padStart(3, '0')}`,
                source_type: isSource ? coreNodeType : (coreNodeType === 'Gene' ? 'TF' : 'Gene'),
                target: isSource ? `SGI${String(1000 + i).padStart(6, '0')}.SO.${String(i % 10).padStart(3, '0')}` : coreNodeId,
                target_type: isSource ? (coreNodeType === 'Gene' ? 'TF' : 'Gene') : coreNodeType,
                weight: (0.9 - i * 0.01).toFixed(3)
            });
        }
        
        // 根据搜索关键词过滤
        let filteredData = mockData;
        if (state.searchKeyword) {
            const keyword = state.searchKeyword.toLowerCase();
            filteredData = mockData.filter(edge =>
                edge.source.toLowerCase().includes(keyword) ||
                edge.target.toLowerCase().includes(keyword) ||
                edge.source_type.toLowerCase().includes(keyword) ||
                edge.target_type.toLowerCase().includes(keyword)
            );
        }
        
        // 排序
        filteredData.sort((a, b) => {
            let aVal = a[state.sortBy];
            let bVal = b[state.sortBy];
            
            if (state.sortBy === 'weight') {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }
            
            if (state.sortOrder === 'desc') {
                return bVal > aVal ? 1 : -1;
            } else {
                return aVal > bVal ? 1 : -1;
            }
        });
        
        // 分页
        const startIndex = (state.currentPage - 1) * state.pageSize;
        const endIndex = startIndex + state.pageSize;
        const pageData = filteredData.slice(startIndex, endIndex);
        
        return {
            type: "networkCoreTablePagination",
            numPages: Math.ceil(filteredData.length / state.pageSize),
            currentPage: state.currentPage,
            pageSize: state.pageSize,
            totalRecords: filteredData.length,
            module_id: NetworkVisualizationState.currentModuleId,
            node_id: coreNodeId,
            filter_top_n: NetworkVisualizationState.currentFilterTopN,
            searchKeyword: state.searchKeyword,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
            data: pageData
        };
    },
    
    // 加载子网络边表格数据
    loadSubnetworkEdgesTableData: async function() {
        if (!NetworkVisualizationState.currentFocusNodeIds.length || 
            NetworkVisualizationState.currentModuleId === null || 
            NetworkVisualizationState.currentModuleId === undefined) return;
        
        const state = NetworkVisualizationState.edgesTableState;
        this.showTableLoading();
        
        try {
            const tableData = await this.fetchSubnetworkEdgesTableData();
            
            if (tableData) {
                // 更新状态
                state.currentData = tableData.data || [];
                state.totalRecords = tableData.totalRecords || 0;
                state.numPages = tableData.numPages || 0;
                
                // 渲染表格
                this.renderEdgesTable();
                
                // 更新分页
                this.updateEdgesPagination();
            }
        } catch (error) {
            console.error('Error loading subnetwork edges table data:', error);
            this.showTableError();
        }
    },
    
    // 获取子网络边表格数据
    fetchSubnetworkEdgesTableData: async function() {
        const state = NetworkVisualizationState.edgesTableState;
        const url = `${API_BASE_URL}/getNetworkSubnetworkTableByPage/`;
        
        const requestData = {
            node_ids: NetworkVisualizationState.currentFocusNodeIds,
            module_id: NetworkVisualizationState.currentModuleId,
            filter_top_n: NetworkVisualizationState.currentFilterTopN,
            page: state.currentPage,
            pageSize: state.pageSize,
            searchKeyword: state.searchKeyword,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder
        };
        
        console.log('Fetching subnetwork edges table data with request:', requestData);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                console.error(`Subnetwork edges table API request failed: ${response.status} ${response.statusText}`);
                console.error('Request URL:', url);
                console.error('Request data:', requestData);
                
                // 尝试读取响应内容以获取更详细的错误信息
                try {
                    const errorText = await response.text();
                    console.error('API error response body:', errorText);
                } catch (e) {
                    console.error('Could not read error response body:', e);
                }
                
                throw new Error(`Subnetwork edges table API response was not ok: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Subnetwork edges table data received:', data);
            
            return data;
        } catch (error) {
            console.error('Error fetching subnetwork edges table data:', error);
            console.error('Will use mock edges table data as fallback for module:', NetworkVisualizationState.currentModuleId);
            
            // 返回模拟数据作为后备
            const mockData = this.getMockSubnetworkEdgesTableData();
            console.log('Generated mock subnetwork edges table data:', mockData);
            return mockData;
        }
    },
    
    // 获取模拟子网络边表格数据
    getMockSubnetworkEdgesTableData: function() {
        const state = NetworkVisualizationState.edgesTableState;
        const focusNodeIds = NetworkVisualizationState.currentFocusNodeIds;
        
        const mockData = [];
        
        // 为每个聚焦节点生成边数据
        focusNodeIds.forEach((nodeId, nodeIndex) => {
            const nodeType = nodeId.includes('.SO.') ? 'Gene' : 'TF';
            const oppositeType = nodeType === 'Gene' ? 'TF' : 'Gene';
            
            // 聚焦节点之间的连接
            if (nodeIndex < focusNodeIds.length - 1) {
                mockData.push({
                    source: nodeId,
                    source_type: nodeType,
                    target: focusNodeIds[nodeIndex + 1],
                    target_type: focusNodeIds[nodeIndex + 1].includes('.SO.') ? 'Gene' : 'TF',
                    weight: (0.92 - nodeIndex * 0.05).toFixed(3)
                });
            }
            
            // 每个聚焦节点的邻接节点
            for (let i = 1; i <= 10; i++) {
                const targetId = `SGI${String(Math.floor(Math.random() * 10000)).padStart(6, '0')}.${nodeType === 'Gene' ? 'SS' : 'SO'}.${String(i).padStart(3, '0')}`;
                mockData.push({
                    source: nodeId,
                    source_type: nodeType,
                    target: targetId,
                    target_type: oppositeType,
                    weight: (0.85 - i * 0.05).toFixed(3)
                });
            }
        });
        
        // 根据搜索关键词过滤
        let filteredData = mockData;
        if (state.searchKeyword) {
            const keyword = state.searchKeyword.toLowerCase();
            filteredData = mockData.filter(edge =>
                edge.source.toLowerCase().includes(keyword) ||
                edge.target.toLowerCase().includes(keyword) ||
                edge.source_type.toLowerCase().includes(keyword) ||
                edge.target_type.toLowerCase().includes(keyword)
            );
        }
        
        // 排序
        filteredData.sort((a, b) => {
            let aVal = a[state.sortBy];
            let bVal = b[state.sortBy];
            
            if (state.sortBy === 'weight') {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }
            
            if (state.sortOrder === 'desc') {
                return bVal > aVal ? 1 : -1;
            } else {
                return aVal > bVal ? 1 : -1;
            }
        });
        
        // 分页
        const startIndex = (state.currentPage - 1) * state.pageSize;
        const endIndex = startIndex + state.pageSize;
        const pageData = filteredData.slice(startIndex, endIndex);
        
        return {
            type: "networkSubnetworkTablePagination",
            numPages: Math.ceil(filteredData.length / state.pageSize),
            currentPage: state.currentPage,
            pageSize: state.pageSize,
            totalRecords: filteredData.length,
            module_id: NetworkVisualizationState.currentModuleId,
            input_node_count: focusNodeIds.length,
            found_node_count: focusNodeIds.length,
            found_nodes: focusNodeIds,
            not_found_nodes: [],
            filter_top_n: NetworkVisualizationState.currentFilterTopN,
            searchKeyword: state.searchKeyword,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
            data: pageData
        };
    },
    
    // 渲染边表格
    renderEdgesTable: function() {
        const tbody = document.getElementById('edges_table_body');
        if (!tbody) return;
        
        const state = NetworkVisualizationState.edgesTableState;
        
        if (state.currentData.length === 0) {
            tbody.innerHTML = `
                <tr class="no_data_row">
                    <td colspan="5">
                        <div class="no_data_placeholder">
                            <p>No edge data available</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        state.currentData.forEach(edge => {
            html += `
                <tr>
                    <td>${edge.source}</td>
                    <td><span class="node_type_badge ${edge.source_type.toLowerCase()}">${edge.source_type}</span></td>
                    <td>${edge.target}</td>
                    <td><span class="node_type_badge ${edge.target_type.toLowerCase()}">${edge.target_type}</span></td>
                    <td><span class="weight_value">${parseFloat(edge.weight).toFixed(15)}</span></td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
        // 隐藏加载状态
        this.hideTableLoading();
    },
    
    // 显示表格加载状态
    showTableLoading: function() {
        const tbody = document.getElementById('edges_table_body');
        if (tbody) {
            tbody.innerHTML = `
                <tr class="loading_row">
                    <td colspan="5">
                        <div class="loading_placeholder">
                            <div class="loading_spinner"></div>
                            <p>Loading edge data...</p>
                        </div>
                    </td>
                </tr>
            `;
        }
    },
    
    // 隐藏表格加载状态
    hideTableLoading: function() {
        // 加载状态通过渲染表格来隐藏
    },
    
    // 显示表格错误状态
    showTableError: function() {
        const tbody = document.getElementById('edges_table_body');
        if (tbody) {
            tbody.innerHTML = `
                <tr class="error_row">
                    <td colspan="5">
                        <div class="error_placeholder">
                            <p style="color: #dc3545;">Error loading edge data. Please try again.</p>
                        </div>
                    </td>
                </tr>
            `;
        }
    },
    
    // 绑定表格搜索事件
    bindTableSearchEvents: function() {
        const searchInput = document.getElementById('edges_search_input');
        const clearButton = document.getElementById('clear_edges_search');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    NetworkVisualizationState.edgesTableState.searchKeyword = e.target.value;
                    NetworkVisualizationState.edgesTableState.currentPage = 1;
                    this.loadEdgesTableData();
                }, 300);
            });
        }
        
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    NetworkVisualizationState.edgesTableState.searchKeyword = '';
                    NetworkVisualizationState.edgesTableState.currentPage = 1;
                    this.loadEdgesTableData();
                }
            });
        }
    },
    
    // 绑定表格排序事件
    bindTableSortEvents: function() {
        // 绑定表头点击排序
        const tableHeaders = document.querySelectorAll('#edges_table .sortable');
        tableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortField = header.getAttribute('data-sort');
                this.handleTableSort(sortField);
            });
        });
        
        // 绑定排序控件
        const sortSelect = document.getElementById('edges_sort_select');
        const sortOrderButton = document.getElementById('edges_sort_order');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                NetworkVisualizationState.edgesTableState.sortBy = e.target.value;
                NetworkVisualizationState.edgesTableState.currentPage = 1;
                this.loadEdgesTableData();
                this.updateTableSortIndicators();
            });
        }
        
        if (sortOrderButton) {
            sortOrderButton.addEventListener('click', () => {
                const currentOrder = NetworkVisualizationState.edgesTableState.sortOrder;
                NetworkVisualizationState.edgesTableState.sortOrder = currentOrder === 'asc' ? 'desc' : 'asc';
                sortOrderButton.setAttribute('data-order', NetworkVisualizationState.edgesTableState.sortOrder);
                NetworkVisualizationState.edgesTableState.currentPage = 1;
                this.loadEdgesTableData();
                this.updateTableSortIndicators();
            });
        }
    },
    
    // 处理表格排序
    handleTableSort: function(sortField) {
        const state = NetworkVisualizationState.edgesTableState;
        
        if (state.sortBy === sortField) {
            // 切换排序顺序
            state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            // 新的排序字段
            state.sortBy = sortField;
            state.sortOrder = 'desc'; // 默认降序
        }
        
        state.currentPage = 1;
        this.loadEdgesTableData();
        this.updateTableSortIndicators();
        
        // 同步更新排序控件
        const sortSelect = document.getElementById('edges_sort_select');
        const sortOrderButton = document.getElementById('edges_sort_order');
        
        if (sortSelect) {
            sortSelect.value = state.sortBy;
        }
        
        if (sortOrderButton) {
            sortOrderButton.setAttribute('data-order', state.sortOrder);
        }
    },
    
    // 更新表格排序指示器
    updateTableSortIndicators: function() {
        const state = NetworkVisualizationState.edgesTableState;
        const headers = document.querySelectorAll('#edges_table .sortable');
        
        headers.forEach(header => {
            const sortField = header.getAttribute('data-sort');
            const indicator = header.querySelector('.sort_indicator');
            
            if (indicator) {
                if (sortField === state.sortBy) {
                    indicator.textContent = state.sortOrder === 'asc' ? '↑' : '↓';
                    indicator.style.opacity = '1';
                } else {
                    indicator.textContent = '';
                    indicator.style.opacity = '0.3';
                }
            }
        });
    },
    
    // 绑定表格分页事件
    bindTablePaginationEvents: function() {
        // 绑定页面大小选择
        const pageSizeSelect = document.getElementById('edges_page_size');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                NetworkVisualizationState.edgesTableState.pageSize = parseInt(e.target.value);
                NetworkVisualizationState.edgesTableState.currentPage = 1;
                this.loadEdgesTableData();
            });
        }
        
        // 绑定页面导航按钮
        const firstPageBtn = document.getElementById('edges_first_page');
        const prevPageBtn = document.getElementById('edges_prev_page');
        const nextPageBtn = document.getElementById('edges_next_page');
        const lastPageBtn = document.getElementById('edges_last_page');
        
        if (firstPageBtn) {
            firstPageBtn.addEventListener('click', () => {
                if (NetworkVisualizationState.edgesTableState.currentPage > 1) {
                    NetworkVisualizationState.edgesTableState.currentPage = 1;
                    this.loadEdgesTableData();
                }
            });
        }
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (NetworkVisualizationState.edgesTableState.currentPage > 1) {
                    NetworkVisualizationState.edgesTableState.currentPage--;
                    this.loadEdgesTableData();
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                const state = NetworkVisualizationState.edgesTableState;
                if (state.currentPage < state.numPages) {
                    state.currentPage++;
                    this.loadEdgesTableData();
                }
            });
        }
        
        if (lastPageBtn) {
            lastPageBtn.addEventListener('click', () => {
                const state = NetworkVisualizationState.edgesTableState;
                if (state.currentPage < state.numPages) {
                    state.currentPage = state.numPages;
                    this.loadEdgesTableData();
                }
            });
        }
        
        // 绑定页面跳转
        const pageJumpInput = document.getElementById('edges_page_jump');
        const jumpButton = document.getElementById('edges_jump_btn');
        
        if (pageJumpInput && jumpButton) {
            const handleJump = () => {
                const page = parseInt(pageJumpInput.value);
                const state = NetworkVisualizationState.edgesTableState;
                
                if (page >= 1 && page <= state.numPages && page !== state.currentPage) {
                    state.currentPage = page;
                    this.loadEdgesTableData();
                }
                
                pageJumpInput.value = '';
            };
            
            jumpButton.addEventListener('click', handleJump);
            pageJumpInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleJump();
                }
            });
        }
    },
    
    // 更新边表格分页
    updateEdgesPagination: function() {
        const state = NetworkVisualizationState.edgesTableState;
        
        // 更新分页信息
        const startElement = document.getElementById('edges_page_start');
        const endElement = document.getElementById('edges_page_end');
        const totalElement = document.getElementById('edges_total_records');
        
        if (startElement && endElement && totalElement) {
            const start = (state.currentPage - 1) * state.pageSize + 1;
            const end = Math.min(state.currentPage * state.pageSize, state.totalRecords);
            
            startElement.textContent = state.totalRecords > 0 ? start : 0;
            endElement.textContent = end;
            totalElement.textContent = state.totalRecords.toLocaleString();
        }
        
        // 更新页面跳转输入框
        const pageJumpInput = document.getElementById('edges_page_jump');
        if (pageJumpInput) {
            pageJumpInput.setAttribute('max', state.numPages);
        }
        
        // 更新导航按钮状态
        this.updateEdgesPaginationButtons();
        
        // 更新页码按钮
        this.updateEdgesPageNumbers();
    },
    
    // 更新边表格分页按钮状态
    updateEdgesPaginationButtons: function() {
        const state = NetworkVisualizationState.edgesTableState;
        
        const firstPageBtn = document.getElementById('edges_first_page');
        const prevPageBtn = document.getElementById('edges_prev_page');
        const nextPageBtn = document.getElementById('edges_next_page');
        const lastPageBtn = document.getElementById('edges_last_page');
        
        const isFirstPage = state.currentPage <= 1;
        const isLastPage = state.currentPage >= state.numPages;
        
        if (firstPageBtn) {
            firstPageBtn.disabled = isFirstPage;
            firstPageBtn.style.opacity = isFirstPage ? '0.5' : '1';
        }
        
        if (prevPageBtn) {
            prevPageBtn.disabled = isFirstPage;
            prevPageBtn.style.opacity = isFirstPage ? '0.5' : '1';
        }
        
        if (nextPageBtn) {
            nextPageBtn.disabled = isLastPage;
            nextPageBtn.style.opacity = isLastPage ? '0.5' : '1';
        }
        
        if (lastPageBtn) {
            lastPageBtn.disabled = isLastPage;
            lastPageBtn.style.opacity = isLastPage ? '0.5' : '1';
        }
    },
    
    // 更新边表格页码按钮
    updateEdgesPageNumbers: function() {
        const state = NetworkVisualizationState.edgesTableState;
        const pageNumbersContainer = document.getElementById('edges_page_numbers');
        
        if (!pageNumbersContainer) return;
        
        let html = '';
        const currentPage = state.currentPage;
        const totalPages = state.numPages;
        
        // 计算显示的页码范围
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        
        // 调整范围以保持5个页码
        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 4);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - 4);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage;
            html += `
                <button class="page_number_button ${isActive ? 'active' : ''}" 
                        data-page="${i}" ${isActive ? 'disabled' : ''}>
                    ${i}
                </button>
            `;
        }
        
        pageNumbersContainer.innerHTML = html;
        
        // 绑定页码按钮事件
        const pageButtons = pageNumbersContainer.querySelectorAll('.page_number_button');
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const page = parseInt(button.getAttribute('data-page'));
                if (page !== state.currentPage) {
                    state.currentPage = page;
                    this.loadEdgesTableData();
                }
            });
        });
    },
    
    // 绑定表格下载事件
    bindTableDownloadEvents: function() {
        const downloadButton = document.getElementById('edges_download_btn');
        if (downloadButton) {
            downloadButton.addEventListener('click', this.handleEdgesTableDownload.bind(this));
        }
    },
    
    // 处理边表格下载
    handleEdgesTableDownload: async function() {
        // 检查是否有可下载的网络数据
        const hasNetworkData = (NetworkVisualizationState.currentCoreNodeId !== null) || 
                              (NetworkVisualizationState.currentFocusNodeIds.length > 0);
        
        if (!hasNetworkData || 
            NetworkVisualizationState.currentModuleId === null || 
            NetworkVisualizationState.currentModuleId === undefined) {
            console.warn('No network data to download');
            return;
        }
        
        const state = NetworkVisualizationState.edgesTableState;
        
        // 根据网络类型选择不同的下载方法
        if (NetworkVisualizationState.networkType === 'subnetwork') {
            await this.downloadSubnetworkTable(state);
        } else {
            await this.downloadCoreNetworkTable(state);
        }
    },
    
    // 下载核心网络表格
    downloadCoreNetworkTable: async function(state) {
        const requestData = {
            module_id: NetworkVisualizationState.currentModuleId,
            node_id: NetworkVisualizationState.currentCoreNodeId,
            filter_top_n: NetworkVisualizationState.currentFilterTopN,
            searchKeyword: state.searchKeyword,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
            format: 'csv'
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/downloadNetworkCoreTable/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `network_edges_module_${NetworkVisualizationState.currentModuleId}_core_${NetworkVisualizationState.currentCoreNodeId}.csv`;
                link.click();
                window.URL.revokeObjectURL(url);
                
                console.log('Core network table downloaded successfully');
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Error downloading core network table:', error);
            
            // 后备方案：生成本地CSV
            this.downloadEdgesTableLocal();
        }
    },
    
    // 下载子网络表格
    downloadSubnetworkTable: async function(state) {
        const requestData = {
            node_ids: NetworkVisualizationState.currentFocusNodeIds,
            module_id: NetworkVisualizationState.currentModuleId,
            filter_top_n: NetworkVisualizationState.currentFilterTopN,
            searchKeyword: state.searchKeyword,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
            format: 'csv'
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/downloadNetworkSubnetworkTable/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `subnetwork_edges_module_${NetworkVisualizationState.currentModuleId}_nodes_${NetworkVisualizationState.currentFocusNodeIds.length}.csv`;
                link.click();
                window.URL.revokeObjectURL(url);
                
                console.log('Subnetwork table downloaded successfully');
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Error downloading subnetwork table:', error);
            
            // 后备方案：生成本地CSV
            this.downloadEdgesTableLocal();
        }
    },
    
    // 本地下载边表格
    downloadEdgesTableLocal: function() {
        const state = NetworkVisualizationState.edgesTableState;
        const data = state.currentData;
        
        if (data.length === 0) {
            console.warn('No data to download');
            return;
        }
        
        // 生成CSV内容
        let csvContent = 'Source,Source Type,Target,Target Type,Weight\n';
        data.forEach(edge => {
            csvContent += `"${edge.source}","${edge.source_type}","${edge.target}","${edge.target_type}",${edge.weight}\n`;
        });
        
        // 下载文件
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `network_edges_module_${NetworkVisualizationState.currentModuleId}_core_${NetworkVisualizationState.currentCoreNodeId}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        console.log('Edges table downloaded locally');
    },
    
    // 展开网络绘制板块
    expandNetworkContainer: function() {
        const container = document.querySelector('.network_visualization_container');
        if (container) {
            container.classList.remove('collapsed');
            const collapseButton = document.querySelector('.network_visualization_container .collapse_button');
            if (collapseButton) {
                collapseButton.setAttribute('data-collapsed', 'false');
                const icon = collapseButton.querySelector('.collapse_icon');
                const text = collapseButton.querySelector('.collapse_text');
                if (icon) icon.textContent = '▼';
                if (text) text.textContent = 'Collapse';
            }
        }
    },
    
    // 清空并隐藏网络绘制板块
    clearAndHideNetworkContainer: function() {
        const container = document.querySelector('.network_visualization_container');
        if (container) {
            console.log('Clearing and hiding network container');
            
            // 隐藏容器
            container.style.display = 'none';
            NetworkVisualizationState.isVisible = false;
            
            // 清空状态数据
            NetworkVisualizationState.networkData = null;
            NetworkVisualizationState.currentCoreNodeId = null;
            NetworkVisualizationState.currentModuleId = null;
            NetworkVisualizationState.currentNodeType = null;
            
            // 重置表格状态
            NetworkVisualizationState.edgesTableState = {
                currentPage: 1,
                pageSize: 10,
                searchKeyword: '',
                sortBy: 'weight',
                sortOrder: 'desc',
                totalRecords: 0,
                numPages: 0,
                currentData: []
            };
            
            // 清空图表
            if (NetworkVisualizationState.chartInstance) {
                NetworkVisualizationState.chartInstance.clear();
            }
            
            // 隐藏节点弹窗
            this.hideNodePopup();
            
            // 显示默认的加载占位符
            const loadingPlaceholder = document.querySelector('.chart_loading_placeholder');
            if (loadingPlaceholder) {
                loadingPlaceholder.style.display = 'flex';
                loadingPlaceholder.classList.remove('hidden');
                loadingPlaceholder.innerHTML = `
                    <div class="loading_spinner"></div>
                    <p>Click "Draw Core Network" to visualize regulatory relationships...</p>
                `;
            }
            
            // 清空边表格
            const tbody = document.getElementById('edges_table_body');
            if (tbody) {
                tbody.innerHTML = `
                    <tr class="loading_row">
                        <td colspan="5">
                            <div class="loading_placeholder">
                                <div class="loading_spinner"></div>
                                <p>Draw a network to view edge information...</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
            
            // 重置分页信息
            this.resetPaginationDisplay();
            
            // 更新统计信息
            this.updateNetworkStats();
        }
    },
    
    // 重置分页显示
    resetPaginationDisplay: function() {
        const startElement = document.getElementById('edges_page_start');
        const endElement = document.getElementById('edges_page_end');
        const totalElement = document.getElementById('edges_total_records');
        
        if (startElement) startElement.textContent = '0';
        if (endElement) endElement.textContent = '0';
        if (totalElement) totalElement.textContent = '0';
        
        // 清空页码按钮
        const pageNumbersContainer = document.getElementById('edges_page_numbers');
        if (pageNumbersContainer) {
            pageNumbersContainer.innerHTML = '';
        }
        
        // 禁用导航按钮
        const navButtons = ['edges_first_page', 'edges_prev_page', 'edges_next_page', 'edges_last_page'];
        navButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = true;
                button.style.opacity = '0.5';
            }
        });
        
        // 重置页面跳转输入框
        const pageJumpInput = document.getElementById('edges_page_jump');
        if (pageJumpInput) {
            pageJumpInput.value = '';
            pageJumpInput.setAttribute('max', '1');
        }
    }
};

// 导出模块用于其他文件引用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.NetworkVisualizationModule;
} 