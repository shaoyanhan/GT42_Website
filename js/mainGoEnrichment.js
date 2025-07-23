import { fetchPostData } from './data.js';
import { showCustomAlert } from './showCustomAlert.js';
import { copyTextToClipboard } from './copyTextToClipboard.js';

// 全局变量
let currentResults = null;
let isAnalysisRunning = false;

// 表格管理器对象，用于管理每个表格的状态
const tableManagers = {
    bp: null,
    mf: null,
    cc: null
};

// DOM元素
const geneListInput = document.getElementById('gene_list_input');
const fileInput = document.getElementById('file_input');
const clearButton = document.getElementById('clear_gene_list');
const exampleButton = document.getElementById('example_button');
const uploadButton = document.getElementById('upload_button');
const submitButton = document.getElementById('submit_analysis');
const resetButton = document.getElementById('reset_form');
const loadingOverlay = document.getElementById('loading_overlay');
const resultsContainer = document.getElementById('go_enrichment_results_container');

// 参数输入元素
const pvalueCutoff = document.getElementById('pvalue_cutoff');
const qvalueCutoff = document.getElementById('qvalue_cutoff');
const adjustMethod = document.getElementById('adjust_method');
const minGSSize = document.getElementById('min_gs_size');
const maxGSSize = document.getElementById('max_gs_size');

// 基因ID弹窗元素
const geneIdsModal = document.getElementById('gene_ids_modal');
const geneIdsModalTitle = document.getElementById('gene_ids_modal_title');
const geneIdsList = document.getElementById('gene_ids_list');
const geneIdsModalClose = document.getElementById('gene_ids_modal_close');
const copyGenesButton = document.getElementById('copy_genes_button');

// 示例基因列表（50个基因）
const exampleGeneList = [
    'SGI000001.SO.004',
    'SGI000001.SO.006',
    'SGI000001.SO.007',
    'SGI000001.SO.008',
    'SGI000001.SO.009',
    'SGI000001.SO.010',
    'SGI000001.SO.011',
    'SGI000001.SO.012',
    'SGI000001.SO.013',
    'SGI000001.SO.014',
    'SGI000001.SO.015',
    'SGI000001.SS.002',
    'SGI000001.SS.007',
    'SGI000001.SS.010',
    'SGI000002.SO.001',
    'SGI000002.SO.005',
    'SGI000002.SO.006',
    'SGI000002.SO.010',
    'SGI000002.SS.001',
    'SGI000002.SS.002',
    'SGI000003.SO.002',
    'SGI000003.SO.003',
    'SGI000003.SO.006',
    'SGI000003.SO.007',
    'SGI000003.SO.008',
    'SGI000003.SO.009',
    'SGI000003.SO.010',
    'SGI000003.SO.011',
    'SGI000003.SS.001',
    'SGI000003.SS.003',
    'SGI000003.SS.005',
    'SGI000003.SS.007',
    'SGI000003.SS.011',
    'SGI000004.SO.001',
    'SGI000004.SO.002',
    'SGI000004.SO.003',
    'SGI000004.SO.004',
    'SGI000004.SO.006',
    'SGI000004.SO.007',
    'SGI000004.SO.011',
    'SGI000004.SO.012',
    'SGI000004.SO.013',
    'SGI000004.SO.014',
    'SGI000004.SO.018',
    'SGI000004.SO.020',
    'SGI000004.SO.021',
    'SGI000004.SO.023',
    'SGI000004.SO.024',
    'SGI000004.SS.002',
    'SGI000005.SO.001',
    'SGI000005.SO.002',
    'SGI000005.SO.003',
    'SGI000005.SO.004',
    'SGI000005.SO.005',
    'SGI000005.SO.006',
    'SGI000005.SO.007',
    'SGI000005.SO.008',
    'SGI000005.SO.010',
    'SGI000005.SO.011',
    'SGI000005.SO.012',
    'SGI000005.SO.013',
    'SGI000005.SO.014',
    'SGI000005.SO.015',
    'SGI000005.SO.018',
    'SGI000005.SS.005',
    'SGI000005.SS.006',
    'SGI000005.SS.007',
    'SGI000005.SS.008',
    'SGI000006.SO.005',
    'SGI000006.SS.002',
    'SGI000006.SS.003',
    'SGI000006.SS.006',
    'SGI000006.SS.007',
    'SGI000006.SS.008',
    'SGI000006.SS.010',
    'SGI000007.SO.006',
    'SGI000007.SO.007',
    'SGI000007.SS.004',
    'SGI000008.SO.006',
    'SGI000009.SO.004',
    'SGI000009.SO.005',
    'SGI000009.SO.014',
    'SGI000009.SS.002',
    'SGI000009.SS.004',
    'SGI000010.SO.005',
    'SGI000010.SO.006',
    'SGI000010.SO.008',
    'SGI000010.SO.009',
    'SGI000010.SO.010',
    'SGI000010.SO.011',
    'SGI000010.SO.012',
    'SGI000010.SO.014',
    'SGI000010.SO.015',
    'SGI000010.SO.016',
    'SGI000010.SS.004',
    'SGI000011.SO.003',
    'SGI000011.SO.005',
    'SGI000011.SO.006',
    'SGI000011.SO.007',
    'SGI000011.SO.009'
];

// 表格管理器类
class TableManager {
    constructor(category) {
        this.category = category;
        this.data = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.searchQuery = '';
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.searchInput = document.getElementById(`${this.category}_search`);
        this.pageSizeSelect = document.getElementById(`${this.category}_page_size`);
        this.downloadButton = document.getElementById(`${this.category}_download`);
        this.tableBody = document.getElementById(`${this.category}_table_body`);
        this.paginationInfo = document.getElementById(`${this.category}_pagination_info`);
        this.paginationControls = document.getElementById(`${this.category}_pagination_controls`);
        this.table = document.getElementById(`${this.category}_table`);
        this.noResults = document.getElementById(`${this.category}_no_results`);
        this.loading = document.getElementById(`${this.category}_loading`);
        this.chartsContainer = document.getElementById(`${this.category}_charts_container`);
        this.barChartElement = document.getElementById(`${this.category}_bar_chart`);
        this.bubbleChartElement = document.getElementById(`${this.category}_bubble_chart`);
        
        // 初始化ECharts实例
        this.barChart = null;
        this.bubbleChart = null;
        
        // 设置响应式监听器（只设置一次）
        this.setupResizeListener();
    }
    
    setupEventListeners() {
        // 搜索输入
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterData();
            this.currentPage = 1;
            this.renderTable();
        });
        
        // 页面大小选择
        this.pageSizeSelect.addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
        });
        
        // 下载按钮
        this.downloadButton.addEventListener('click', () => {
            this.downloadTSV();
        });
        
        // 表头排序
        this.table.querySelectorAll('th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.getAttribute('data-sort');
                this.sort(column);
            });
        });
    }
    
    setData(data) {
        this.data = data || [];
        this.filterData();
        this.currentPage = 1;
        this.renderTable();
        this.renderCharts();
    }
    
    filterData() {
        if (!this.searchQuery) {
            this.filteredData = [...this.data];
        } else {
            this.filteredData = this.data.filter(row => {
                return Object.values(row).some(value => {
                    if (value === null || value === undefined) return false;
                    return value.toString().toLowerCase().includes(this.searchQuery);
                });
            });
        }
    }
    
    sort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        // 更新表头样式
        this.table.querySelectorAll('th.sortable').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        
        const activeHeader = this.table.querySelector(`th[data-sort="${column}"]`);
        if (activeHeader) {
            activeHeader.classList.add(`sort-${this.sortDirection}`);
        }
        
        this.filteredData.sort((a, b) => {
            let aValue = a[column];
            let bValue = b[column];
            
            // 处理特殊的排序列
            if (column === 'GeneRatio' || column === 'BgRatio') {
                // 对于分数字符串，只比较分子
                aValue = parseInt(aValue.split('/')[0]);
                bValue = parseInt(bValue.split('/')[0]);
            } else if (typeof aValue === 'string' && !isNaN(parseFloat(aValue))) {
                // 数值字符串转换为数字
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }
            
            // 处理null值
            if (aValue === null || aValue === undefined) aValue = -Infinity;
            if (bValue === null || bValue === undefined) bValue = -Infinity;
            
            if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        this.currentPage = 1;
        this.renderTable();
    }
    
    renderTable() {
        if (this.data.length === 0) {
            this.showNoResults();
            return;
        }
        
        this.hideNoResults();
        
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.filteredData.slice(startIndex, endIndex);
        
        this.tableBody.innerHTML = '';
        
        pageData.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="https://amigo.geneontology.org/amigo/term/${result.ID}" target="_blank">${result.ID}</a></td>
                <td title="${result.Description}">${result.Description}</td>
                <td class="numeric">${result.GeneRatio}</td>
                <td class="numeric">${result.BgRatio}</td>
                <td class="numeric">${result.RichFactor.toFixed(4)}</td>
                <td class="numeric">${result.FoldEnrichment.toFixed(2)}</td>
                <td class="numeric">${result.zScore.toFixed(3)}</td>
                <td class="numeric">${formatPValue(result.pvalue)}</td>
                <td class="numeric">${formatPValue(result['p.adjust'])}</td>
                <td class="numeric">${formatPValue(result.qvalue)}</td>
                <td class="numeric">${result.Count}</td>
                <td class="gene_ids_cell" data-gene-ids="${result.geneID}">${result.geneID}</td>
            `;
            
            // 添加基因ID点击事件
            const geneIdsCell = row.querySelector('.gene_ids_cell');
            geneIdsCell.addEventListener('click', () => {
                showGeneIdsModal(result.geneID, result.ID);
            });
            
            this.tableBody.appendChild(row);
        });
        
        this.renderPagination();
    }
    
    renderPagination() {
        const totalItems = this.filteredData.length;
        const totalPages = Math.ceil(totalItems / this.pageSize);
        
        // 更新信息显示
        const startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
        const endItem = Math.min(this.currentPage * this.pageSize, totalItems);
        
        this.paginationInfo.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} entries`;
        
        // 生成分页控件
        this.paginationControls.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // 上一页按钮
        const prevButton = this.createPaginationButton('‹', this.currentPage - 1, this.currentPage === 1);
        this.paginationControls.appendChild(prevButton);
        
        // 页码按钮
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 第一页和省略号
        if (startPage > 1) {
            this.paginationControls.appendChild(this.createPaginationButton('1', 1));
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination_ellipsis';
                ellipsis.textContent = '...';
                this.paginationControls.appendChild(ellipsis);
            }
        }
        
        // 页码按钮
        for (let i = startPage; i <= endPage; i++) {
            const button = this.createPaginationButton(i.toString(), i, false, i === this.currentPage);
            this.paginationControls.appendChild(button);
        }
        
        // 最后一页和省略号
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination_ellipsis';
                ellipsis.textContent = '...';
                this.paginationControls.appendChild(ellipsis);
            }
            this.paginationControls.appendChild(this.createPaginationButton(totalPages.toString(), totalPages));
        }
        
        // 下一页按钮
        const nextButton = this.createPaginationButton('›', this.currentPage + 1, this.currentPage === totalPages);
        this.paginationControls.appendChild(nextButton);
        
        // 页码输入框
        const jumpContainer = document.createElement('div');
        jumpContainer.style.display = 'flex';
        jumpContainer.style.alignItems = 'center';
        jumpContainer.style.gap = '5px';
        jumpContainer.style.marginLeft = '15px';
        
        const jumpLabel = document.createElement('span');
        jumpLabel.textContent = 'Go to:';
        jumpLabel.style.fontSize = '14px';
        jumpLabel.style.color = '#666';
        
        const jumpInput = document.createElement('input');
        jumpInput.type = 'number';
        jumpInput.min = '1';
        jumpInput.max = totalPages.toString();
        jumpInput.className = 'pagination_input';
        jumpInput.placeholder = this.currentPage.toString();
        
        jumpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const page = parseInt(jumpInput.value);
                if (page >= 1 && page <= totalPages) {
                    this.currentPage = page;
                    this.renderTable();
                }
                jumpInput.value = '';
            }
        });
        
        jumpContainer.appendChild(jumpLabel);
        jumpContainer.appendChild(jumpInput);
        this.paginationControls.appendChild(jumpContainer);
    }
    
    createPaginationButton(text, page, disabled = false, active = false) {
        const button = document.createElement('button');
        button.className = 'pagination_button';
        button.textContent = text;
        button.disabled = disabled;
        
        if (active) {
            button.classList.add('active');
        }
        
        if (!disabled) {
            button.addEventListener('click', () => {
                this.currentPage = page;
                this.renderTable();
            });
        }
        
        return button;
    }
    
    downloadTSV() {
        if (this.filteredData.length === 0) {
            showCustomAlert('No data to download', 'error');
            return;
        }
        
        const headers = [
            'GO ID', 'Description', 'Gene Ratio', 'Bg Ratio', 'Rich Factor',
            'Fold Enrichment', 'z-Score', 'P-value', 'P.adjust', 'qvalue', 'Count', 'Gene IDs'
        ];
        
        const rows = [headers.join('\t')];
        
        this.filteredData.forEach(result => {
            const row = [
                result.ID,
                result.Description,
                result.GeneRatio,
                result.BgRatio,
                result.RichFactor.toFixed(4),
                result.FoldEnrichment.toFixed(2),
                result.zScore.toFixed(3),
                result.pvalue,
                result['p.adjust'],
                result.qvalue,
                result.Count,
                result.geneID
            ];
            rows.push(row.join('\t'));
        });
        
        const tsvContent = rows.join('\n');
        const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `go_enrichment_${this.category}_results.tsv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showCustomAlert(`${this.category.toUpperCase()} results downloaded successfully`, 'normal');
    }
    
    showNoResults() {
        this.tableBody.style.display = 'none';
        this.noResults.style.display = 'block';
        this.paginationInfo.textContent = 'Showing 0 to 0 of 0 entries';
        this.paginationControls.innerHTML = '';
        this.chartsContainer.style.display = 'none';
    }
    
    hideNoResults() {
        this.tableBody.style.display = 'table-row-group';
        this.noResults.style.display = 'none';
    }
    
    showLoading() {
        this.loading.style.display = 'block';
        this.tableBody.style.display = 'none';
        this.noResults.style.display = 'none';
    }
    
    hideLoading() {
        this.loading.style.display = 'none';
    }
    
    // 渲染图表
    renderCharts() {
        if (this.data.length === 0) {
            this.chartsContainer.style.display = 'none';
            return;
        }
        
        this.chartsContainer.style.display = 'block';
        
        // 使用requestAnimationFrame确保DOM完全渲染
        requestAnimationFrame(() => {
            // 准备数据
            const barData = this.prepareBarData();
            const bubbleData = this.prepareBubbleData();
            
            // 创建图表
            this.createBarChart(barData);
            this.createBubbleChart(bubbleData);
        });
    }
    

    
    // 强制设置容器尺寸
    forceContainerSize() {
        if (this.barChartElement) {
            this.barChartElement.style.width = '100%';
            this.barChartElement.style.height = '450px';
            this.barChartElement.style.minWidth = '300px';
            this.barChartElement.style.display = 'block';
        }
        if (this.bubbleChartElement) {
            this.bubbleChartElement.style.width = '100%';
            this.bubbleChartElement.style.height = '450px';
            this.bubbleChartElement.style.minWidth = '300px';
            this.bubbleChartElement.style.display = 'block';
        }
        
        // 强制重绘
        if (this.chartsContainer) {
            this.chartsContainer.style.display = 'block';
        }
        
        console.log('Forced container sizes set');
    }
    
    // 设置响应式监听器
    setupResizeListener() {
        // 使用防抖来优化性能
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.resizeCharts();
            }, 100);
        };
        
        window.addEventListener('resize', handleResize);
    }
    
    // 调整图表尺寸
    resizeCharts() {
        // 检查容器是否可见
        const isVisible = this.chartsContainer && this.chartsContainer.style.display !== 'none' &&
                         this.chartsContainer.offsetParent !== null;
        
        if (!isVisible) {
            return;
        }
        
        try {
            // 检查容器尺寸
            const barRect = this.barChartElement ? this.barChartElement.getBoundingClientRect() : null;
            const bubbleRect = this.bubbleChartElement ? this.bubbleChartElement.getBoundingClientRect() : null;
            
            // 如果容器尺寸太小，强制设置尺寸
            if (barRect && (barRect.width < 100 || barRect.height < 100)) {
                console.warn('Chart container too small, forcing resize');
                this.forceContainerSize();
            }
            
            if (this.barChart) {
                this.barChart.resize();
            }
            if (this.bubbleChart) {
                this.bubbleChart.resize();
            }
        } catch (error) {
            console.warn('Error resizing charts:', error);
        }
    }
    
    // 准备柱状图数据（按-log p.adjust排序）
    prepareBarData() {
        const data = [...this.data];
        return data
            .filter(item => item['p.adjust'] != null && item['p.adjust'] > 0)
            .map(item => ({
                ...item,
                logPAdjust: -Math.log10(item['p.adjust']),
                shortDescription: this.truncateText(item.Description, 40)
            }))
            .sort((a, b) => a.logPAdjust - b.logPAdjust);
    }
    
    // 准备气泡图数据（按Count排序）
    prepareBubbleData() {
        const data = [...this.data];
        return data
            .map(item => ({
                ...item,
                geneRatioValue: this.parseGeneRatio(item.GeneRatio),
                logPAdjust: item['p.adjust'] && item['p.adjust'] > 0 ? -Math.log10(item['p.adjust']) : 0,
                shortDescription: this.truncateText(item.Description, 40)
            }))
            .sort((a, b) => a.Count - b.Count);
    }
    
    // 解析基因比例字符串 "24/48" -> 0.5
    parseGeneRatio(ratioStr) {
        if (!ratioStr || typeof ratioStr !== 'string') return 0;
        const parts = ratioStr.split('/');
        if (parts.length !== 2) return 0;
        const numerator = parseFloat(parts[0]);
        const denominator = parseFloat(parts[1]);
        return denominator > 0 ? numerator / denominator : 0;
    }
    
    // 截断文本
    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    // 创建柱状图
    createBarChart(data) {
        if (this.barChart) {
            this.barChart.dispose();
        }
        
        // 确保容器有有效尺寸
        let rect = this.barChartElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            console.warn('Bar chart container has invalid size, forcing size...', rect);
            this.forceContainerSize();
            // 强制刷新尺寸
            rect = this.barChartElement.getBoundingClientRect();
        }
        
        try {
            this.barChart = echarts.init(this.barChartElement);
            this.setBarChartOption(data);
        } catch (error) {
            console.error('Error initializing bar chart:', error);
        }
    }
    
    // 设置柱状图配置
    setBarChartOption(data) {
        if (!this.barChart) return;
        
        const option = {
            backgroundColor: 'transparent',
            title: {
                text: `${this.category.toUpperCase()} Bar Chart`,
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#488a63'
                }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#4fb479',
                borderWidth: 1,
                textStyle: {
                    color: '#333'
                },
                formatter: function(params) {
                    const item = data[params[0].dataIndex];
                    return `
                        <div style="max-width: 300px;">
                            <strong style="color: #488a63;">${item.ID}</strong><br/>
                            <strong>Description:</strong><br/>
                            ${item.Description}<br/>
                            <strong>Gene Ratio:</strong> ${item.GeneRatio}<br/>
                            <strong>Bg Ratio:</strong> ${item.BgRatio}<br/>
                            <strong>Rich Factor:</strong> ${item.RichFactor.toFixed(4)}<br/>
                            <strong>Fold Enrichment:</strong> ${item.FoldEnrichment.toFixed(2)}<br/>
                            <strong>z-Score:</strong> ${item.zScore.toFixed(3)}<br/>
                            <strong>P-value:</strong> ${formatPValue(item.pvalue)}<br/>
                            <strong>P.adjust:</strong> ${formatPValue(item['p.adjust'])}<br/>
                            <strong>qvalue:</strong> ${formatPValue(item.qvalue)}<br/>
                            <strong>Count:</strong> ${item.Count}
                        </div>
                    `;
                }
            },
            grid: {
                left: '30%',
                right: '15%',
                top: '15%',
                bottom: '15%',
                containLabel: false
            },
            xAxis: {
                type: 'value',
                name: 'Gene Count',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#488a63'
                },
                axisLine: {
                    lineStyle: {
                        color: '#4fb479'
                    }
                },
                axisLabel: {
                    color: '#666'
                }
            },
            yAxis: {
                type: 'category',
                data: data.map(item => item.shortDescription),
                axisLabel: {
                    color: '#666',
                    fontSize: 12,
                    width: 150,
                    overflow: 'truncate'
                },
                axisLine: {
                    lineStyle: {
                        color: '#4fb479'
                    }
                }
            },
            visualMap: {
                min: Math.min(...data.map(item => item.logPAdjust)),
                max: Math.max(...data.map(item => item.logPAdjust)),
                calculable: true,
                realtime: false,
                inRange: {
                    color: ['#34678C', '#2CA680', '#E0E12F']
                },
                right: '1%',
                top: 'center',
                orient: 'vertical',
                text: ['-log10(p.adj)', ''],
                textStyle: {
                    color: '#666',
                    fontSize: 12
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    left: '2%',
                    top: 'center',
                    orient: 'vertical',
                    width: 15,
                    height: '60%',
                    start: 100,
                    end: 70,
                    brushSelect: false,
                    handleStyle: {
                        color: '#4fb479'
                    },
                    textStyle: {
                        color: '#666'
                    }
                },
                {
                    type: 'inside',
                    yAxisIndex: 0,
                    start: 100,
                    end: 70,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true,
                    moveOnMouseWheel: false
                }
            ],
            toolbox: {
                feature: {
                    saveAsImage: {
                        name: `go_enrichment_${this.category}_bar_chart`,
                        pixelRatio: 2,
                        backgroundColor: '#fff'
                    }
                },
                right: '8%',
                top: '8%',
                iconStyle: {
                    borderColor: '#4fb479'
                }
            },
            series: [
                {
                    name: 'Gene Count',
                    type: 'bar',
                    data: data.map(item => ({
                        value: item.Count,
                        itemStyle: {
                            color: this.getColorByValue(item.logPAdjust, data)
                        }
                    })),
                    barWidth: '60%',
                    animationDuration: 1000,
                    animationEasing: 'cubicOut'
                }
            ]
        };
        
        this.barChart.setOption(option);
    }
    
    // 创建气泡图
    createBubbleChart(data) {
        if (this.bubbleChart) {
            this.bubbleChart.dispose();
        }
        
        // 确保容器有有效尺寸
        let rect = this.bubbleChartElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            console.warn('Bubble chart container has invalid size, forcing size...', rect);
            this.forceContainerSize();
            // 强制刷新尺寸
            rect = this.bubbleChartElement.getBoundingClientRect();
        }
        
        try {
            this.bubbleChart = echarts.init(this.bubbleChartElement);
            this.setBubbleChartOption(data);
        } catch (error) {
            console.error('Error initializing bubble chart:', error);
        }
    }
    
    // 设置气泡图配置
    setBubbleChartOption(data) {
        if (!this.bubbleChart) return;
        
        const option = {
            backgroundColor: 'transparent',
            title: {
                text: `${this.category.toUpperCase()} Bubble Chart`,
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#488a63'
                }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#4fb479',
                borderWidth: 1,
                textStyle: {
                    color: '#333'
                },
                formatter: function(params) {
                    const item = data[params.dataIndex];
                    return `
                        <div style="max-width: 300px;">
                            <strong style="color: #488a63;">${item.ID}</strong><br/>
                            <strong>Description:</strong><br/>
                            ${item.Description}<br/>
                            <strong>Gene Ratio:</strong> ${item.GeneRatio}<br/>
                            <strong>Bg Ratio:</strong> ${item.BgRatio}<br/>
                            <strong>Rich Factor:</strong> ${item.RichFactor.toFixed(4)}<br/>
                            <strong>Fold Enrichment:</strong> ${item.FoldEnrichment.toFixed(2)}<br/>
                            <strong>z-Score:</strong> ${item.zScore.toFixed(3)}<br/>
                            <strong>P-value:</strong> ${formatPValue(item.pvalue)}<br/>
                            <strong>P.adjust:</strong> ${formatPValue(item['p.adjust'])}<br/>
                            <strong>qvalue:</strong> ${formatPValue(item.qvalue)}<br/>
                            <strong>Count:</strong> ${item.Count}
                        </div>
                    `;
                }
            },
            grid: {
                left: '30%',
                right: '15%',
                top: '15%',
                bottom: '15%',
                containLabel: false
            },
            xAxis: {
                type: 'value',
                name: 'Gene Ratio',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#488a63'
                },

                axisLine: {
                    lineStyle: {
                        color: '#4fb479'
                    }
                },
                axisLabel: {
                    color: '#666'
                }
            },
            yAxis: {
                type: 'category',
                data: data.map(item => item.shortDescription),
                axisLabel: {
                    color: '#666',
                    fontSize: 12,
                    width: 150,
                    overflow: 'truncate'
                },
                axisLine: {
                    lineStyle: {
                        color: '#4fb479'
                    }
                }
            },
            visualMap: {
                min: Math.min(...data.map(item => item.logPAdjust)),
                max: Math.max(...data.map(item => item.logPAdjust)),
                calculable: true,
                realtime: false,
                inRange: {
                    color: ['#34678C', '#2CA680', '#E0E12F']
                },
                right: '1%',
                top: 'center',
                orient: 'vertical',
                text: ['-log10(p.adj)', ''],
                textStyle: {
                    color: '#666',
                    fontSize: 12
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    left: '2%',
                    top: 'center',
                    orient: 'vertical',
                    width: 15,
                    height: '60%',
                    start: 100,
                    end: 70,
                    brushSelect: false,
                    handleStyle: {
                        color: '#4fb479'
                    },
                    textStyle: {
                        color: '#666'
                    }
                },
                {
                    type: 'inside',
                    yAxisIndex: 0,
                    start: 100,
                    end: 70,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true,
                    moveOnMouseWheel: false
                }
            ],
            toolbox: {
                feature: {
                    saveAsImage: {
                        name: `go_enrichment_${this.category}_bubble_chart`,
                        pixelRatio: 2,
                        backgroundColor: '#fff'
                    }
                },
                right: '8%',
                top: '8%',
                iconStyle: {
                    borderColor: '#4fb479'
                }
            },
            series: [
                {
                    name: 'GO Terms',
                    type: 'scatter',
                    data: data.map((item, index) => [
                        item.geneRatioValue,
                        index,
                        item.Count,
                        item.logPAdjust
                    ]),
                                         symbolSize: function(dataValue) {
                         // dataValue[2] 是 Count 值
                         const minSize = 8;
                         const maxSize = 40;
                         const allCounts = data.map(item => item.Count);
                         const minCount = Math.min(...allCounts);
                         const maxCount = Math.max(...allCounts);
                         const range = maxCount - minCount;
                         if (range === 0) return (minSize + maxSize) / 2;
                         return minSize + (maxSize - minSize) * (dataValue[2] - minCount) / range;
                     },
                    itemStyle: {
                        color: function(params) {
                            // params.data[3] 是 logPAdjust 值
                            return this.getColorByValue(params.data[3], data);
                        }.bind(this),
                        borderColor: '#4fb479',
                        borderWidth: 1,
                        opacity: 0.8
                    },
                    emphasis: {
                        itemStyle: {
                            opacity: 1,
                            borderWidth: 2
                        }
                    },
                    animationDuration: 1000,
                    animationEasing: 'cubicOut'
                }
            ]
        };
        
        this.bubbleChart.setOption(option);
    }
    
    // 根据值获取颜色
    getColorByValue(value, data) {
        const min = Math.min(...data.map(item => item.logPAdjust));
        const max = Math.max(...data.map(item => item.logPAdjust));
        const ratio = (value - min) / (max - min);
        
        if (ratio <= 0.5) {
            // 从蓝色到绿色
            const r = Math.round(52 + (44 - 52) * ratio * 2);
            const g = Math.round(103 + (166 - 103) * ratio * 2);
            const b = Math.round(140 + (128 - 140) * ratio * 2);
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            // 从绿色到黄色
            const r = Math.round(44 + (224 - 44) * (ratio - 0.5) * 2);
            const g = Math.round(166 + (225 - 166) * (ratio - 0.5) * 2);
            const b = Math.round(128 + (47 - 128) * (ratio - 0.5) * 2);
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
}

// 显示基因ID弹窗
function showGeneIdsModal(geneIds, goId) {
    const geneArray = geneIds.split('/');
    geneIdsModalTitle.textContent = `Gene IDs for ${goId} (${geneArray.length} genes)`;
    
    geneIdsList.innerHTML = '';
    geneArray.forEach(geneId => {
        const geneItem = document.createElement('span');
        geneItem.className = 'gene_id_item';
        geneItem.textContent = geneId.trim();
        geneIdsList.appendChild(geneItem);
    });
    
    // 设置复制按钮事件
    copyGenesButton.onclick = () => {
        copyTextToClipboard(geneIds.replace(/\//g, '\n'));
        showCustomAlert('Gene IDs copied to clipboard', 'normal');
    };
    
    geneIdsModal.classList.add('show');
}

// 隐藏基因ID弹窗
function hideGeneIdsModal() {
    geneIdsModal.classList.remove('show');
}

// 初始化函数
function initializeGoEnrichment() {
    setupEventListeners();
    setupDragAndDrop();
    setupParameterValidation();
    setupModalEvents();
    initializeTableManagers();
    updateSubmitButtonState();
    console.log('GO Enrichment Analysis page initialized');
}

// 初始化表格管理器
function initializeTableManagers() {
    tableManagers.bp = new TableManager('bp');
    tableManagers.mf = new TableManager('mf');
    tableManagers.cc = new TableManager('cc');
}

// 设置弹窗事件
function setupModalEvents() {
    geneIdsModalClose.addEventListener('click', hideGeneIdsModal);
    
    geneIdsModal.addEventListener('click', (e) => {
        if (e.target === geneIdsModal) {
            hideGeneIdsModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && geneIdsModal.classList.contains('show')) {
            hideGeneIdsModal();
        }
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 基因列表输入
    geneListInput.addEventListener('input', handleGeneListInput);
    geneListInput.addEventListener('paste', handleGeneListPaste);
    
    // 清除按钮
    clearButton.addEventListener('click', clearGeneList);
    
    // 示例按钮
    exampleButton.addEventListener('click', loadExampleGenes);
    
    // 上传按钮
    uploadButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    
    // 提交和重置按钮
    submitButton.addEventListener('click', handleSubmitAnalysis);
    resetButton.addEventListener('click', handleResetForm);
    
    // 参数输入验证
    [pvalueCutoff, qvalueCutoff, minGSSize, maxGSSize].forEach(input => {
        input.addEventListener('input', () => {
            validateParameters();
            updateSubmitButtonState();
        });
        input.addEventListener('blur', () => {
            validateParameters();
            updateSubmitButtonState();
        });
    });
    
    // 标签页切换
    setupTabSwitching();
}

// 设置拖拽功能
function setupDragAndDrop() {
    geneListInput.addEventListener('dragover', (e) => {
        e.preventDefault();
        geneListInput.classList.add('drag_over');
    });
    
    geneListInput.addEventListener('dragleave', (e) => {
        e.preventDefault();
        geneListInput.classList.remove('drag_over');
    });
    
    geneListInput.addEventListener('drop', handleFileDrop);
}

// 处理文件拖拽
function handleFileDrop(e) {
    e.preventDefault();
    geneListInput.classList.remove('drag_over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

// 处理文件上传
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

// 处理文件内容
function processFile(file) {
    if (!file.type.includes('text') && !file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
        showCustomAlert('Please upload a text file (.txt or .csv)', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const geneList = parseGeneListFromFile(content);
        
        if (geneList.length === 0) {
            showCustomAlert('No valid gene IDs found in the file', 'error');
            return;
        }
        
        geneListInput.value = geneList.join('\n');
        updateSubmitButtonState();
        showCustomAlert(`Successfully loaded ${geneList.length} gene IDs from file`, 'normal');
    };
    
    reader.onerror = function() {
        showCustomAlert('Error reading file', 'error');
    };
    
    reader.readAsText(file);
}

// 从文件内容解析基因列表
function parseGeneListFromFile(content) {
    const lines = content.split('\n');
    const geneList = [];
    
    for (let line of lines) {
        line = line.trim();
        // 跳过空行和注释行
        if (line && !line.startsWith('#') && !line.startsWith('>')) {
            // 如果是CSV格式，只取第一列
            const parts = line.split(/[,\t]/);
            const geneId = parts[0].trim();
            if (geneId && isValidGeneId(geneId)) {
                geneList.push(geneId);
            }
        }
    }
    
    return geneList;
}

// 验证基因ID格式
function isValidGeneId(geneId) {
    // 简单的基因ID格式验证
    return /^[A-Za-z0-9._-]+$/.test(geneId) && geneId.length > 0;
}

function handleGeneListInput() {
    updateSubmitButtonState();
}

function handleGeneListPaste(e) {
    // 延迟处理以确保粘贴内容已经被处理
    setTimeout(() => {
        const text = geneListInput.value;
        const processedGenes = parseGeneListFromText(text);
        geneListInput.value = processedGenes.join('\n');
        updateSubmitButtonState();
    }, 100);
}

function parseGeneListFromText(text) {
    const lines = text.split(/[\n\r\t,;|\s]+/);
    const geneList = [];
    
    for (let line of lines) {
        line = line.trim();
        if (line && isValidGeneId(line)) {
            geneList.push(line);
        }
    }
    
    return geneList;
}

function clearGeneList() {
    geneListInput.value = '';
    updateSubmitButtonState();
    showCustomAlert('Gene list cleared', 'normal');
}

function loadExampleGenes() {
    geneListInput.value = exampleGeneList.join('\n');
    updateSubmitButtonState();
    showCustomAlert(`Loaded ${exampleGeneList.length} example genes`, 'normal');
}

function setupParameterValidation() {
    // 初始验证
    validateParameters();
}

function validateParameters() {
    let allValid = true;
    
    // 验证pvalue cutoff (0-1)
    const pvalue = parseFloat(pvalueCutoff.value);
    if (isNaN(pvalue) || pvalue < 0 || pvalue > 1) {
        pvalueCutoff.classList.add('invalid');
        pvalueCutoff.classList.remove('valid');
        allValid = false;
    } else {
        pvalueCutoff.classList.add('valid');
        pvalueCutoff.classList.remove('invalid');
    }
    
    // 验证qvalue cutoff (0-1)
    const qvalue = parseFloat(qvalueCutoff.value);
    if (isNaN(qvalue) || qvalue < 0 || qvalue > 1) {
        qvalueCutoff.classList.add('invalid');
        qvalueCutoff.classList.remove('valid');
        allValid = false;
    } else {
        qvalueCutoff.classList.add('valid');
        qvalueCutoff.classList.remove('invalid');
    }
    
    // 验证minGSSize (正整数)
    const minSize = parseInt(minGSSize.value);
    if (isNaN(minSize) || minSize < 1) {
        minGSSize.classList.add('invalid');
        minGSSize.classList.remove('valid');
        allValid = false;
    } else {
        minGSSize.classList.add('valid');
        minGSSize.classList.remove('invalid');
    }
    
    // 验证maxGSSize (正整数，且大于等于minGSSize)
    const maxSize = parseInt(maxGSSize.value);
    if (isNaN(maxSize) || maxSize < 1 || maxSize < minSize) {
        maxGSSize.classList.add('invalid');
        maxGSSize.classList.remove('valid');
        allValid = false;
    } else {
        maxGSSize.classList.add('valid');
        maxGSSize.classList.remove('invalid');
    }
    
    return allValid;
}

function updateSubmitButtonState() {
    const geneList = parseGeneListFromText(geneListInput.value);
    const hasGenes = geneList.length > 0;
    const parametersValid = validateParameters();
    
    if (hasGenes && parametersValid && !isAnalysisRunning) {
        submitButton.disabled = false;
        submitButton.classList.remove('disabled');
    } else {
        submitButton.disabled = true;
        submitButton.classList.add('disabled');
    }
}

async function handleSubmitAnalysis() {
    if (isAnalysisRunning) {
        showCustomAlert('Analysis is already running', 'error');
        return;
    }
    
    const geneList = parseGeneListFromText(geneListInput.value);
    
    if (geneList.length === 0) {
        showCustomAlert('Please enter at least one gene ID', 'error');
        return;
    }
    
    if (!validateParameters()) {
        showCustomAlert('Please correct the parameter values', 'error');
        return;
    }
    
    // 准备POST数据
    const postData = {
        geneList: geneList,
        pvalueCutoff: pvalueCutoff.value,
        qvalueCutoff: qvalueCutoff.value,
        adjustMethod: adjustMethod.value,
        minGSSize: minGSSize.value,
        maxGSSize: maxGSSize.value
    };
    
    console.log('Submitting GO enrichment analysis with parameters:', postData);
    
    // 显示加载状态
    showLoadingState();
    
    try {
        // 发送请求
        const response = await fetchPostData('getEnrichmentResults', postData);
        console.log('GO enrichment analysis response:', response);
        
        if (response && response.state === 'SUCCESS') {
            currentResults = response.data;
            displayResults(response.data, geneList.length, postData);
            hideLoadingState();
            showCustomAlert('GO enrichment analysis completed successfully!', 'normal');
        } else {
            throw new Error('Analysis failed or returned no results');
        }
        
    } catch (error) {
        console.error('Error in GO enrichment analysis:', error);
        hideLoadingState();
        showCustomAlert('Analysis failed. Please try again.', 'error');
    }
}

// 显示加载状态
function showLoadingState() {
    isAnalysisRunning = true;
    loadingOverlay.classList.add('active');
    updateSubmitButtonState();
    
    // 隐藏之前的结果展示区域
    if (resultsContainer.style.display !== 'none') {
        resultsContainer.style.display = 'none';
        resultsContainer.classList.remove('fade_in');
    }
    
    // 清除之前的结果数据和重置表格状态
    Object.values(tableManagers).forEach(manager => {
        if (manager) {
            manager.setData([]); // 清除数据
            manager.showLoading(); // 显示加载状态
            manager.chartsContainer.style.display = 'none'; // 隐藏图表
        }
    });
    
    // 重置标签计数
    document.getElementById('bp_count').textContent = '0';
    document.getElementById('mf_count').textContent = '0';
    document.getElementById('cc_count').textContent = '0';
    
    // 禁用所有输入
    geneListInput.disabled = true;
    submitButton.disabled = true;
    resetButton.disabled = true;
    [pvalueCutoff, qvalueCutoff, adjustMethod, minGSSize, maxGSSize].forEach(input => {
        input.disabled = true;
    });
}

// 隐藏加载状态
function hideLoadingState() {
    isAnalysisRunning = false;
    loadingOverlay.classList.remove('active');
    
    // 隐藏表格加载状态
    Object.values(tableManagers).forEach(manager => {
        if (manager) {
            manager.hideLoading();
        }
    });
    
    // 重新启用输入
    geneListInput.disabled = false;
    resetButton.disabled = false;
    [pvalueCutoff, qvalueCutoff, adjustMethod, minGSSize, maxGSSize].forEach(input => {
        input.disabled = false;
    });
    
    updateSubmitButtonState();
}

// 显示结果
function displayResults(data, geneCount, parameters) {
    // 更新摘要信息
    document.getElementById('gene_count_summary').innerHTML = `Total genes analyzed: <strong>${geneCount}</strong>`;
    
    const paramSummary = `Parameters: p≤${parameters.pvalueCutoff}, q≤${parameters.qvalueCutoff}, ${parameters.adjustMethod}, GS:[${parameters.minGSSize}-${parameters.maxGSSize}]`;
    document.getElementById('parameters_summary').innerHTML = paramSummary;
    
    // 更新标签计数
    document.getElementById('bp_count').textContent = data.bp ? data.bp.length : 0;
    document.getElementById('mf_count').textContent = data.mf ? data.mf.length : 0;
    document.getElementById('cc_count').textContent = data.cc ? data.cc.length : 0;
    
    // 使用表格管理器设置数据
    tableManagers.bp.setData(data.bp || []);
    tableManagers.mf.setData(data.mf || []);
    tableManagers.cc.setData(data.cc || []);
    
    // 显示结果容器
    resultsContainer.style.display = 'block';
    resultsContainer.classList.add('fade_in');
    
    // 确保所有图表都能正确显示尺寸
    setTimeout(() => {
        Object.values(tableManagers).forEach(manager => {
            if (manager && manager.barChart && manager.bubbleChart) {
                manager.resizeCharts();
            }
        });
    }, 200);
    
    // 滚动到结果区域
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// 格式化p值显示
function formatPValue(value) {
    if (value === null || value === undefined) {
        return 'N/A';
    }
    if (value < 0.001) {
        return value.toExponential(2);
    }
    return value.toFixed(4);
}

// 设置标签页切换
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab_button');
    const tabContents = document.querySelectorAll('.tab_content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // 移除所有active类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加active类到当前标签
            button.classList.add('active');
            document.getElementById(`${targetTab}_content`).classList.add('active');
            
            // 切换标签页后，调整当前显示的图表尺寸
            // 使用两次requestAnimationFrame确保CSS布局完全完成
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const manager = tableManagers[targetTab];
                    if (manager && manager.barChart && manager.bubbleChart) {
                        manager.resizeCharts();
                    }
                });
            });
        });
    });
}

// 处理表单重置
function handleResetForm() {
    if (isAnalysisRunning) {
        if (!confirm('Analysis is currently running. Are you sure you want to reset?')) {
            return;
        }
    }
    
    // 重置所有输入
    geneListInput.value = '';
    pvalueCutoff.value = '0.05';
    qvalueCutoff.value = '0.2';
    adjustMethod.value = 'BH';
    minGSSize.value = '5';
    maxGSSize.value = '500';
    
    // 清除验证样式
    [pvalueCutoff, qvalueCutoff, minGSSize, maxGSSize].forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    
    // 重置表格管理器
    Object.values(tableManagers).forEach(manager => {
        if (manager) {
            manager.setData([]);
            // 清理图表
            if (manager.barChart) {
                manager.barChart.dispose();
                manager.barChart = null;
            }
            if (manager.bubbleChart) {
                manager.bubbleChart.dispose();
                manager.bubbleChart = null;
            }
        }
    });
    
    // 隐藏结果
    resultsContainer.style.display = 'none';
    
    // 重置状态
    currentResults = null;
    isAnalysisRunning = false;
    hideLoadingState();
    
    // 重置标签页到第一个
    document.querySelectorAll('.tab_button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab_content').forEach(content => content.classList.remove('active'));
    document.querySelector('.tab_button[data-tab="bp"]').classList.add('active');
    document.getElementById('bp_content').classList.add('active');
    
    updateSubmitButtonState();
    showCustomAlert('Form reset successfully', 'normal');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeGoEnrichment);

// 导出主要函数（如果需要）
export { initializeGoEnrichment };
