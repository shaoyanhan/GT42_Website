import { showCustomAlert } from './showCustomAlert.js';

// ==================== Constants ====================

const API_BASE = 'http://localhost:30004/searchDatabase';

const TABLE_COLUMNS = [
    { field: 'phytohormone',             label: 'Phytohormone' },
    { field: 'tf_family',                label: 'TF Family' },
    { field: 'protein_id',               label: 'Protein ID' },
    { field: 'confidence_level',         label: 'Confidence Level' },
    { field: 'iptm',                     label: 'ipTM' },
    { field: 'ptm_all',                  label: 'pTM All' },
    { field: 'ptm_protein',              label: 'pTM Protein' },
    { field: 'ptm_ligand',              label: 'pTM Ligand' },
    { field: 'fraction_disordered',      label: 'Fraction Disordered' },
    { field: 'has_clash',                label: 'Has Clash' },
    { field: 'ranking_score',            label: 'Ranking Score' },
    { field: 'plddt_ligand_avg',         label: 'pLDDT Ligand Avg' },
    { field: 'plddt_protein_avg',        label: 'pLDDT Protein Avg' },
    { field: 'plddt_pocket_protein_avg', label: 'pLDDT Pocket Avg' },
    { field: 'pae_protein_base_min',     label: 'PAE Protein Min' },
    { field: 'pae_pocket_min_avg',       label: 'PAE Pocket Avg' }
];

const DEFAULT_SORT_RULES = [
    { field: 'confidence_level', order: 'asc' },
    { field: 'phytohormone',     order: 'asc' },
    { field: 'tf_family',        order: 'asc' }
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const CONFIDENCE_TOOLTIP_HTML =
    '<div class="conf_tooltip_row"><span class="conf_color_block" style="background:#4fb479;"></span><strong>High:</strong> ipTM [0.8,&nbsp;1), pLDDT Ligand [90,&nbsp;100], pLDDT Pocket [90,&nbsp;100], PAE [0,&nbsp;5]</div>' +
    '<div class="conf_tooltip_row"><span class="conf_color_block" style="background:#f0ad4e;"></span><strong>Medium:</strong> ipTM [0.6,&nbsp;0.8), pLDDT Ligand [70,&nbsp;90), pLDDT Pocket [70,&nbsp;90), PAE [0,&nbsp;5]</div>' +
    '<div class="conf_tooltip_row"><span class="conf_color_block" style="background:#e96a6a;"></span><strong>Low:</strong> Otherwise</div>' +
    '<div class="conf_tooltip_note">* Has Clash = 0</div>';

// ==================== State ====================

const TableState = {
    searchParams: null,
    sortRules: [...DEFAULT_SORT_RULES],
    page: 1,
    pageSize: 10,
    totalPages: 0,
    totalRows: 0,
    records: [],
    isVisible: false,
    isLoading: false
};

// ==================== DOM References ====================

let panelEl, overlayEl, tbodyEl, paginationInfoEl, paginationNavEl,
    pageSizeSelectEl, pageInputEl, confidenceTooltipEl;

function cacheDom() {
    panelEl           = document.getElementById('docking_table_panel');
    overlayEl         = document.getElementById('table_loading_overlay');
    tbodyEl           = document.getElementById('docking_table_body');
    paginationInfoEl  = document.getElementById('table_pagination_info');
    paginationNavEl   = document.getElementById('table_pagination_nav');
    pageSizeSelectEl  = document.getElementById('table_page_size_select');
    pageInputEl       = document.getElementById('table_page_input');
    confidenceTooltipEl = document.getElementById('confidence_tooltip');
}

// ==================== Visibility & Loading ====================

function showPanel() {
    if (!TableState.isVisible) {
        panelEl.style.display = '';
        TableState.isVisible = true;
        requestAnimationFrame(() => panelEl.classList.add('visible'));
    }
}

function showTableLoading(show) {
    TableState.isLoading = show;
    if (show) {
        overlayEl.classList.add('active');
    } else {
        overlayEl.classList.remove('active');
    }
}

// ==================== Data Fetching ====================

async function fetchTableData() {
    const body = buildRequestBody();

    const response = await fetch(`${API_BASE}/getDockingSummaryTableByPage/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    if (json.code !== 200) throw new Error(json.msg || 'Unknown API error');

    return json.data;
}

function buildRequestBody() {
    const body = {
        page: TableState.page,
        page_size: TableState.pageSize
    };

    const params = TableState.searchParams;
    if (params.protein_id) body.protein_id = params.protein_id;
    if (params.phytohormone && params.phytohormone.length > 0) body.phytohormone = params.phytohormone;
    if (params.tf_family && params.tf_family.length > 0) body.tf_family = params.tf_family;

    if (TableState.sortRules.length > 0) body.sort = TableState.sortRules;

    return body;
}

async function loadAndRender() {
    showTableLoading(true);

    try {
        const data = await fetchTableData();
        TableState.records    = data.records;
        TableState.totalPages = data.meta.total_pages;
        TableState.totalRows  = data.meta.total_rows;
        TableState.page       = data.meta.current_page;

        renderTableBody(data.records);
        renderPagination();
        updateScrollMode();
    } catch (err) {
        console.error('[Docking Table] Fetch failed:', err);
        showCustomAlert('Failed to load table data. Please try again.', 'error');
    } finally {
        showTableLoading(false);
        document.dispatchEvent(new CustomEvent('dockingSearchCompleted'));
    }
}

// ==================== Table Rendering ====================

function renderTableBody(records) {
    tbodyEl.innerHTML = '';

    if (!records || records.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = TABLE_COLUMNS.length;
        td.className = 'table_empty_msg';
        td.textContent = 'No docking results found for the given criteria.';
        tr.appendChild(td);
        tbodyEl.appendChild(tr);
        return;
    }

    records.forEach(row => {
        const tr = document.createElement('tr');

        TABLE_COLUMNS.forEach(col => {
            const td = document.createElement('td');
            const value = row[col.field];

            if (col.field === 'protein_id') {
                const link = document.createElement('span');
                link.className = 'protein_id_link';
                link.textContent = value;
                link.dataset.proteinId = value;
                link.dataset.phytohormone = row.phytohormone;
                link.title = 'Click to see docking structures!';
                td.appendChild(link);
            } else if (col.field === 'confidence_level') {
                const badge = document.createElement('span');
                badge.className = `confidence_badge confidence_${value.toLowerCase()}`;
                badge.textContent = value;
                td.appendChild(badge);
            } else if (col.field === 'phytohormone') {
                td.textContent = formatPhytohormoneName(value);
            } else {
                td.textContent = value ?? '';
            }

            tr.appendChild(td);
        });

        tbodyEl.appendChild(tr);
    });
}

function formatPhytohormoneName(snakeName) {
    return snakeName
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function updateScrollMode() {
    const wrapper = document.getElementById('docking_table_scroll_wrapper');
    if (TableState.records.length > 10) {
        wrapper.classList.add('scrollable');
    } else {
        wrapper.classList.remove('scrollable');
    }
}

// ==================== Sorting ====================

function handleSortClick(field) {
    const existingIdx = TableState.sortRules.findIndex(r => r.field === field);

    if (existingIdx === -1) {
        TableState.sortRules.push({ field, order: 'asc' });
    } else {
        const current = TableState.sortRules[existingIdx];
        if (current.order === 'asc') {
            current.order = 'desc';
        } else {
            TableState.sortRules.splice(existingIdx, 1);
        }
    }

    renderSortIndicators();
    TableState.page = 1;
    loadAndRender();
}

function renderSortIndicators() {
    document.querySelectorAll('#docking_table_head th').forEach(th => {
        const field = th.dataset.field;
        if (!field) return;

        const indicator = th.querySelector('.sort_indicator');
        if (!indicator) return;

        const ruleIdx = TableState.sortRules.findIndex(r => r.field === field);

        indicator.classList.remove('asc', 'desc');
        const badge = indicator.querySelector('.sort_priority');
        if (badge) badge.textContent = '';

        if (ruleIdx !== -1) {
            indicator.classList.add(TableState.sortRules[ruleIdx].order);
            if (badge && TableState.sortRules.length > 1) {
                badge.textContent = ruleIdx + 1;
            }
        }
    });
}

// ==================== Pagination ====================

function renderPagination() {
    const { page, pageSize, totalRows, totalPages } = TableState;
    const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalRows);

    paginationInfoEl.textContent =
        `Showing ${start.toLocaleString()}-${end.toLocaleString()} of ${totalRows.toLocaleString()} records`;

    renderPageButtons();

    if (pageInputEl) {
        pageInputEl.value = page;
        pageInputEl.max = totalPages;
    }
    if (pageSizeSelectEl) {
        pageSizeSelectEl.value = pageSize;
    }
}

function renderPageButtons() {
    const { page, totalPages } = TableState;
    paginationNavEl.innerHTML = '';

    addNavButton('«', 1, page === 1);
    addNavButton('‹', page - 1, page === 1);

    const pages = getPageNumbers(page, totalPages);
    pages.forEach(p => {
        if (p === '...') {
            const span = document.createElement('span');
            span.className = 'page_ellipsis';
            span.textContent = '...';
            paginationNavEl.appendChild(span);
        } else {
            const btn = document.createElement('button');
            btn.className = 'page_btn' + (p === page ? ' active' : '');
            btn.textContent = p;
            btn.addEventListener('click', () => goToPage(p));
            paginationNavEl.appendChild(btn);
        }
    });

    addNavButton('›', page + 1, page === totalPages || totalPages === 0);
    addNavButton('»', totalPages, page === totalPages || totalPages === 0);
}

function addNavButton(label, targetPage, disabled) {
    const btn = document.createElement('button');
    btn.className = 'page_nav_btn';
    btn.textContent = label;
    btn.disabled = disabled;
    if (!disabled) {
        btn.addEventListener('click', () => goToPage(targetPage));
    }
    paginationNavEl.appendChild(btn);
}

function getPageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [];
    pages.push(1);

    if (current > 4) pages.push('...');

    const rangeStart = Math.max(2, current - 2);
    const rangeEnd   = Math.min(total - 1, current + 2);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (current < total - 3) pages.push('...');

    pages.push(total);
    return pages;
}

function goToPage(p) {
    if (p < 1 || p > TableState.totalPages || p === TableState.page) return;
    TableState.page = p;
    loadAndRender();
}

function handlePageSizeChange(newSize) {
    TableState.pageSize = parseInt(newSize, 10);
    TableState.page = 1;
    loadAndRender();
}

function submitPageInput() {
    const val = parseInt(pageInputEl.value, 10);
    if (isNaN(val)) {
        pageInputEl.value = TableState.page;
        return;
    }
    goToPage(Math.max(1, Math.min(val, TableState.totalPages)));
}

function handlePageInputKeydown(e) {
    if (e.key !== 'Enter') return;
    submitPageInput();
}

// ==================== CSV Download ====================

async function handleDownload() {
    const downloadBtn = document.getElementById('table_download_btn');
    if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.classList.add('downloading');
    }

    try {
        const body = {};
        const params = TableState.searchParams;
        if (params.protein_id) body.protein_id = params.protein_id;
        if (params.phytohormone && params.phytohormone.length > 0) body.phytohormone = params.phytohormone;
        if (params.tf_family && params.tf_family.length > 0) body.tf_family = params.tf_family;
        if (TableState.sortRules.length > 0) body.sort = TableState.sortRules;
        body.format = 'csv';

        const response = await fetch(`${API_BASE}/downloadDockingSummaryTable/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const csvText = await response.text();
        const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'docking_summary.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        showCustomAlert('CSV downloaded successfully!', 'normal');
    } catch (err) {
        console.error('[Docking Table] Download failed:', err);
        showCustomAlert('Failed to download CSV. Please try again.', 'error');
    } finally {
        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.classList.remove('downloading');
        }
    }
}

// ==================== Confidence Tooltip ====================

let tooltipHideTimer = null;

function positionConfidenceTooltip() {
    const confTh = document.querySelector('th[data-field="confidence_level"]');
    if (!confTh) return;

    const thRect = confTh.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();

    confidenceTooltipEl.style.left = `${thRect.left - panelRect.left}px`;
    confidenceTooltipEl.style.top  = 'auto';
    confidenceTooltipEl.style.bottom = `${panelRect.bottom - thRect.top + 6}px`;
}

function showConfidenceTooltip() {
    clearTimeout(tooltipHideTimer);
    positionConfidenceTooltip();
    confidenceTooltipEl.classList.add('visible');
}

function scheduleHideConfidenceTooltip() {
    tooltipHideTimer = setTimeout(() => {
        confidenceTooltipEl.classList.remove('visible');
    }, 150);
}

function cancelHideConfidenceTooltip() {
    clearTimeout(tooltipHideTimer);
}

// ==================== Protein ID Click ====================

function handleProteinIdClick(e) {
    const link = e.target.closest('.protein_id_link');
    if (!link) return;

    const rowData = findRowByProteinIdAndHormone(link.dataset.proteinId, link.dataset.phytohormone);
    document.dispatchEvent(new CustomEvent('dockingProteinSelected', {
        detail: {
            protein_id: link.dataset.proteinId,
            phytohormone: link.dataset.phytohormone,
            rowData
        }
    }));
}

function findRowByProteinIdAndHormone(proteinId, phytohormone) {
    return TableState.records.find(
        r => r.protein_id === proteinId && r.phytohormone === phytohormone
    ) || null;
}

// ==================== Event Binding ====================

function bindEvents() {
    document.addEventListener('dockingSearchTriggered', (e) => {
        TableState.searchParams = e.detail;
        TableState.page = 1;
        TableState.sortRules = [...DEFAULT_SORT_RULES];

        showPanel();
        renderSortIndicators();
        loadAndRender();
    });

    document.getElementById('docking_table_head').addEventListener('click', (e) => {
        if (e.target.closest('.confidence_tooltip')) return;
        const th = e.target.closest('th[data-field]');
        if (!th) return;
        handleSortClick(th.dataset.field);
    });

    tbodyEl.addEventListener('click', handleProteinIdClick);

    document.getElementById('table_download_btn')
        .addEventListener('click', handleDownload);

    pageSizeSelectEl.addEventListener('change', (e) => {
        handlePageSizeChange(e.target.value);
    });

    pageInputEl.addEventListener('keydown', handlePageInputKeydown);

    document.getElementById('page_go_btn')
        .addEventListener('click', submitPageInput);

    const confTh = document.querySelector('th[data-field="confidence_level"]');
    confTh.addEventListener('mouseenter', showConfidenceTooltip);
    confTh.addEventListener('mouseleave', scheduleHideConfidenceTooltip);
    confidenceTooltipEl.addEventListener('mouseenter', cancelHideConfidenceTooltip);
    confidenceTooltipEl.addEventListener('mouseleave', scheduleHideConfidenceTooltip);
}

// ==================== Init ====================

function initTablePanel() {
    cacheDom();
    bindEvents();
    renderSortIndicators();
}

export { initTablePanel };
