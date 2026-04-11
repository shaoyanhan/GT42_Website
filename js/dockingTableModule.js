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

const COLUMN_TOOLTIPS = {
    phytohormone:
        '<p class="th_tooltip_desc">Name of the small-molecule phytohormone used as the ligand in this molecular docking analysis.</p>',

    tf_family:
        '<p class="th_tooltip_desc">Family classification of the transcription factor employed as the receptor protein in this molecular docking analysis.</p>',

    protein_id:
        '<p class="th_tooltip_desc">Unique identifier of the transcription factor protein used as the receptor in this molecular docking analysis.</p>',

    confidence_level:
        '<div class="conf_tooltip_row"><span class="conf_color_block" style="background:#4fb479;"></span><strong>High:</strong> ipTM [0.8,&nbsp;1), pLDDT Ligand [90,&nbsp;100], pLDDT Pocket [90,&nbsp;100], PAE [0,&nbsp;5]</div>' +
        '<div class="conf_tooltip_row"><span class="conf_color_block" style="background:#f0ad4e;"></span><strong>Medium:</strong> ipTM [0.6,&nbsp;0.8), pLDDT Ligand [70,&nbsp;90), pLDDT Pocket [70,&nbsp;90), PAE [0,&nbsp;5]</div>' +
        '<div class="conf_tooltip_row"><span class="conf_color_block" style="background:#e96a6a;"></span><strong>Low:</strong> Otherwise</div>' +
        '<div class="conf_tooltip_note">* Has Clash = 0</div>',

    iptm:
        '<p class="th_tooltip_desc">' +
        '<strong>ipTM</strong> (Interface Predicted Template Modeling Score) measures the structural prediction accuracy of the contact interface between the protein and the ligand. ' +
        'Range: 0 to 1. ' +
        'A value &gt; 0.8 indicates high confidence in the predicted interface; ' +
        'a value &lt; 0.6 suggests the interface prediction may be unreliable; ' +
        'values between 0.6 and 0.8 fall in an ambiguous zone and should be interpreted in conjunction with other metrics.' +
        '</p>',

    ptm_all:
        '<p class="th_tooltip_desc">' +
        'Global <strong>pTM</strong> (Predicted Template Modeling score), sourced from the &ldquo;ptm&rdquo; field in summary_confidences.json. ' +
        'Range: 0 to 1. ' +
        'This metric evaluates the degree of overall topological similarity between the predicted structure and the true structure, ' +
        'and is primarily used to assess whether the protein&rsquo;s own folding conformation is reasonable. ' +
        'A value &gt; 0.5 generally indicates high structural similarity.' +
        '</p>',

    ptm_protein:
        '<p class="th_tooltip_desc">' +
        'Chain-level pTM for the protein chain, sourced from chain_ptm[0] in summary_confidences.json. ' +
        'Reflects the template-modeling confidence specific to the protein receptor chain.' +
        '</p>',

    ptm_ligand:
        '<p class="th_tooltip_desc">' +
        'Chain-level pTM for the phytohormone ligand, sourced from chain_ptm[1] in summary_confidences.json. ' +
        '<strong>Note:</strong> For small-molecule ligands with very few atoms (e.g., ethylene contains only 2 carbon atoms), ' +
        'the TM-score calculation is inherently stringent for extremely small molecules, ' +
        'which may result in anomalously low or even missing ipTM and pTM values. ' +
        'In such cases, local metrics such as PAE and pLDDT should be used for a comprehensive assessment.' +
        '</p>',

    ranking_score:
        '<p class="th_tooltip_desc">' +
        'Composite ranking score assigned by AlphaFold&nbsp;3 for each individual docking result. Calculated as:<br>' +
        '<code>ranking_score = 0.8 &times; ipTM + 0.2 &times; pTM + 0.5 &times; fraction_disordered &minus; 100 &times; has_clash</code>' +
        '</p>',

    has_clash:
        '<p class="th_tooltip_desc">' +
        'Indicates whether a significant number of atoms in the predicted structure are sterically clashing ' +
        '(i.e., overlapping in physical space). ' +
        'If steric clashes are present (value&nbsp;=&nbsp;1), the reliability of this docking result is considered very low.' +
        '</p>',

    fraction_disordered:
        '<p class="th_tooltip_desc">' +
        'Represents the proportion of the predicted structure that is disordered, ' +
        'i.e., regions lacking a fixed three-dimensional conformation.' +
        '</p>',

    plddt_ligand_avg:
        '<p class="th_tooltip_desc">' +
        'Arithmetic mean of the pLDDT values for all atoms of the phytohormone ligand, ' +
        'reflecting the model&rsquo;s confidence in predicting the ligand&rsquo;s own structure. ' +
        'Computed by extracting all atomic B-factor parameters of the ligand chain from the model.cif file. ' +
        '<strong>pLDDT</strong> (Predicted Local Distance Difference Test) ranges from 0 to 100 and indicates the local accuracy of each residue or atom position: ' +
        '&gt;&nbsp;90 = very high confidence; 70&ndash;90 = high confidence; 50&ndash;70 = low confidence; &lt;&nbsp;50 = very low confidence.' +
        '</p>',

    plddt_protein_avg:
        '<p class="th_tooltip_desc">' +
        'Arithmetic mean of the pLDDT values for all residues of the protein, ' +
        'reflecting the model&rsquo;s confidence in predicting the protein&rsquo;s own structure. ' +
        'Computed by extracting all atomic B-factor parameters of the protein chain from the model.cif file.' +
        '</p>',

    plddt_pocket_protein_avg:
        '<p class="th_tooltip_desc">' +
        'Mean pLDDT of the protein residues located within a 5&nbsp;&Aring; radius of the phytohormone ligand, ' +
        'representing the binding pocket region. ' +
        'This value is computed algorithmically from the model.cif file. ' +
        'When no binding pocket structure is detected, this value is 0.' +
        '</p>',

    pae_protein_base_min:
        '<p class="th_tooltip_desc">' +
        'Minimum PAE value with the protein as the reference frame, sourced from chain_pair_pae_min[0][1] in summary_confidences.json. ' +
        '<strong>PAE</strong> (Predicted Aligned Error) records the predicted error in relative positioning between any two residues/atoms (in &Aring;). ' +
        'Lower values indicate more accurate relative positioning; ' +
        'a value &lt;&nbsp;5&nbsp;&Aring; is generally considered to reflect a small prediction error.' +
        '</p>',

    pae_pocket_min_avg:
        '<p class="th_tooltip_desc">' +
        'For each protein residue within the 5&nbsp;&Aring; binding pocket, ' +
        'the minimum PAE value between that residue and all ligand atoms is computed; ' +
        'this metric is the average of those per-residue minimum PAE values. ' +
        'When no binding pocket structure is detected, this value defaults to 35 (the theoretical maximum of the PAE scale).' +
        '</p>'
};

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
    pageSizeSelectEl, pageInputEl, thTooltipEl;

function cacheDom() {
    panelEl           = document.getElementById('docking_table_panel');
    overlayEl         = document.getElementById('table_loading_overlay');
    tbodyEl           = document.getElementById('docking_table_body');
    paginationInfoEl  = document.getElementById('table_pagination_info');
    paginationNavEl   = document.getElementById('table_pagination_nav');
    pageSizeSelectEl  = document.getElementById('table_page_size_select');
    pageInputEl       = document.getElementById('table_page_input');
    thTooltipEl       = document.getElementById('th_tooltip');
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

// ==================== Column Header Tooltip ====================

let tooltipHideTimer = null;
let activeTooltipTh = null;

function positionThTooltip(th) {
    const thRect = th.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();

    const leftOffset = thRect.left - panelRect.left;
    const rightOverflow = leftOffset + thTooltipEl.offsetWidth - panelRect.width;
    const adjustedLeft = rightOverflow > 0 ? Math.max(0, leftOffset - rightOverflow - 8) : leftOffset;

    thTooltipEl.style.left   = `${adjustedLeft}px`;
    thTooltipEl.style.top    = 'auto';
    thTooltipEl.style.bottom = `${panelRect.bottom - thRect.top + 6}px`;
}

function showThTooltip(th) {
    const field = th.dataset.field;
    if (!field || !COLUMN_TOOLTIPS[field]) return;

    clearTimeout(tooltipHideTimer);
    activeTooltipTh = th;

    thTooltipEl.innerHTML = COLUMN_TOOLTIPS[field];
    thTooltipEl.classList.add('visible');
    positionThTooltip(th);
}

function scheduleHideThTooltip() {
    tooltipHideTimer = setTimeout(() => {
        thTooltipEl.classList.remove('visible');
        activeTooltipTh = null;
    }, 150);
}

function cancelHideThTooltip() {
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
        if (e.target.closest('.th_tooltip')) return;
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

    document.querySelectorAll('#docking_table_head th[data-field]').forEach(th => {
        th.addEventListener('mouseenter', () => showThTooltip(th));
        th.addEventListener('mouseleave', scheduleHideThTooltip);
    });
    thTooltipEl.addEventListener('mouseenter', cancelHideThTooltip);
    thTooltipEl.addEventListener('mouseleave', scheduleHideThTooltip);
}

// ==================== Init ====================

function initTablePanel() {
    cacheDom();
    bindEvents();
    renderSortIndicators();
}

export { initTablePanel };
