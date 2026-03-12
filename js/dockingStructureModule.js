import { showCustomAlert } from './showCustomAlert.js';

// ==================== Constants ====================

const API_BASE = 'http://localhost:30004/searchDatabase';
const RAW_FILES_BASE = 'https://cbi.gxu.edu.cn/download/yhshao/GT42_web/docking/raw_files';

const DETAIL_FIELDS = [
    { key: 'phytohormone',             label: 'Phytohormone',        format: 'phytohormone' },
    { key: 'tf_family',                label: 'TF Family' },
    { key: 'protein_id',               label: 'Protein ID',          format: 'mono' },
    { key: 'confidence_level',         label: 'Confidence Level',    format: 'badge' },
    { key: 'tf_len',                   label: 'TF Length (residues)' },
    { key: 'hormone_len',              label: 'Hormone Length (atoms)' },
    { key: 'iptm',                     label: 'ipTM' },
    { key: 'ptm_all',                  label: 'pTM All' },
    { key: 'ptm_protein',              label: 'pTM Protein' },
    { key: 'ptm_ligand',              label: 'pTM Ligand' },
    { key: 'fraction_disordered',      label: 'Fraction Disordered' },
    { key: 'has_clash',                label: 'Has Clash' },
    { key: 'ranking_score',            label: 'Ranking Score' },
    { key: 'plddt_ligand_avg',         label: 'pLDDT Ligand Avg' },
    { key: 'plddt_protein_avg',        label: 'pLDDT Protein Avg' },
    { key: 'plddt_pocket_protein_avg', label: 'pLDDT Pocket Avg' },
    { key: 'pae_protein_base_min',     label: 'PAE Protein Min' },
    { key: 'pae_pocket_min_avg',       label: 'PAE Pocket Avg' }
];

// ==================== State ====================

const StructureState = {
    proteinId: '',
    phytohormone: '',
    rowData: null,
    paeData: null,
    isVisible: false,
    isLoading: false,
    molstarViewer: null,
    layoutSub: null,
    paeZoomLevel: 1,
    paeBaseSize: 0
};

// ==================== DOM References ====================

let panelEl, overlayEl, subtitleEl, molstarContainerEl,
    paeImageEl, paePlaceholderEl, detailTbodyEl,
    dlModelCif, dlConfidences, dlSummaryConfidences;

function cacheDom() {
    panelEl              = document.getElementById('structure_panel');
    overlayEl            = document.getElementById('structure_loading_overlay');
    subtitleEl           = document.getElementById('structure_panel_subtitle');
    molstarContainerEl   = document.getElementById('molstar_container');
    paeImageEl           = document.getElementById('pae_image');
    paePlaceholderEl     = document.getElementById('pae_placeholder');
    detailTbodyEl        = document.getElementById('detail_table_body');
    dlModelCif           = document.getElementById('dl_model_cif');
    dlConfidences        = document.getElementById('dl_confidences');
    dlSummaryConfidences = document.getElementById('dl_summary_confidences');
}

// ==================== Visibility & Loading ====================

function showPanel() {
    if (!StructureState.isVisible) {
        panelEl.style.display = '';
        StructureState.isVisible = true;
        requestAnimationFrame(() => panelEl.classList.add('visible'));
        panelEl.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'transform') {
                panelEl.style.transform = 'none';
                panelEl.removeEventListener('transitionend', handler);
            }
        });
    }
}

function showStructureLoading(show) {
    StructureState.isLoading = show;
    if (show) {
        overlayEl.classList.add('active');
    } else {
        overlayEl.classList.remove('active');
    }
}

// ==================== URL Builders ====================

function buildCifUrl(phytohormone, proteinId) {
    return `${RAW_FILES_BASE}/${phytohormone}/${proteinId}/model.cif`;
}

function buildRawFileUrl(phytohormone, proteinId, filename) {
    return `${RAW_FILES_BASE}/${phytohormone}/${proteinId}/${filename}`;
}

// ==================== Molstar Viewer ====================

async function initMolstarViewer(cifUrl) {
    if (StructureState.layoutSub) {
        StructureState.layoutSub.unsubscribe();
        StructureState.layoutSub = null;
    }
    if (StructureState.molstarViewer) {
        StructureState.molstarViewer.dispose();
        StructureState.molstarViewer = null;
    }

    molstarContainerEl.innerHTML = '';

    try {
        const viewer = await molstar.Viewer.create(molstarContainerEl, {
            layoutIsExpanded: false,
            layoutShowControls: true,
            layoutShowRemoteState: false,
            layoutShowSequence: true,
            layoutShowLog: false,
            layoutShowLeftPanel: false
        });

        StructureState.molstarViewer = viewer;
        setupExpandedWatcher(viewer);
        await viewer.loadStructureFromUrl(cifUrl, 'mmcif');

    } catch (err) {
        console.error('[Structure] Molstar failed:', err);
        showCustomAlert('Failed to load 3D structure. Please try again.', 'error');
    }
}

function setupExpandedWatcher(viewer) {
    const navHeader = document.querySelector('.nav_header');
    if (!navHeader) return;

    try {
        StructureState.layoutSub = viewer.plugin.layout.events.updated.subscribe(() => {
            const isExpanded = viewer.plugin.layout.state.isExpanded;
            navHeader.style.display = isExpanded ? 'none' : '';
        });
    } catch (_) {
        /* layout subscription unavailable in this Molstar build */
    }
}

// ==================== PAE Heatmap ====================

async function fetchPaeImage(phytohormone, proteinId) {
    const url = `${API_BASE}/getDockingPaePlot/?phytohormone=${encodeURIComponent(phytohormone)}&protein_id=${encodeURIComponent(proteinId)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    if (json.status !== 'success') throw new Error(json.message || 'PAE fetch failed');

    return json;
}

function renderPaeImage(paeData) {
    StructureState.paeData = paeData;

    paeImageEl.src = 'data:image/png;base64,' + paeData.image_base64;
    paeImageEl.classList.add('loaded');
    paePlaceholderEl.style.display = 'none';
}

function clearPaeImage() {
    paeImageEl.src = '';
    paeImageEl.classList.remove('loaded');
    paePlaceholderEl.style.display = '';
    paePlaceholderEl.textContent = 'Loading PAE heatmap...';
    StructureState.paeData = null;
}

// ==================== Detail Info Table ====================

function renderDetailTable(rowData, paeData) {
    detailTbodyEl.innerHTML = '';

    const mergedData = { ...rowData };
    if (paeData) {
        mergedData.tf_len = paeData.tf_len;
        mergedData.hormone_len = paeData.hormone_len;
    }

    DETAIL_FIELDS.forEach(field => {
        const value = mergedData[field.key];
        if (value === undefined || value === null) return;

        const tr = document.createElement('tr');

        const keyTd = document.createElement('td');
        keyTd.className = 'detail_key';
        keyTd.textContent = field.label;

        const valTd = document.createElement('td');
        valTd.className = 'detail_value';

        if (field.format === 'phytohormone') {
            valTd.textContent = formatPhytohormoneName(value);
        } else if (field.format === 'badge') {
            const badge = document.createElement('span');
            badge.className = `confidence_badge confidence_${value.toLowerCase()}`;
            badge.textContent = value;
            valTd.appendChild(badge);
        } else if (field.format === 'mono') {
            valTd.style.fontFamily = "'Courier New', Consolas, monospace";
            valTd.textContent = value;
        } else {
            valTd.textContent = value;
        }

        tr.appendChild(keyTd);
        tr.appendChild(valTd);
        detailTbodyEl.appendChild(tr);
    });
}

function formatPhytohormoneName(snakeName) {
    return snakeName
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

// ==================== Download Links ====================

function updateDownloadLinks(phytohormone, proteinId) {
    dlModelCif.href           = buildRawFileUrl(phytohormone, proteinId, 'model.cif');
    dlConfidences.href        = buildRawFileUrl(phytohormone, proteinId, 'confidences.json');
    dlSummaryConfidences.href = buildRawFileUrl(phytohormone, proteinId, 'summary_confidences.json');
}

// ==================== Main Load Orchestrator ====================

async function loadStructure(detail) {
    const { protein_id, phytohormone, rowData } = detail;

    StructureState.proteinId = protein_id;
    StructureState.phytohormone = phytohormone;
    StructureState.rowData = rowData;

    showPanel();
    showStructureLoading(true);

    const tfFamily = rowData ? rowData.tf_family : '';
    subtitleEl.textContent = `${formatPhytohormoneName(phytohormone)} - ${tfFamily} (${protein_id})`;

    clearPaeImage();
    updateDownloadLinks(phytohormone, protein_id);
    renderDetailTable(rowData, null);

    panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const cifUrl = buildCifUrl(phytohormone, protein_id);

    const molstarPromise = initMolstarViewer(cifUrl);

    const paePromise = fetchPaeImage(phytohormone, protein_id)
        .then(paeData => {
            renderPaeImage(paeData);
            renderDetailTable(rowData, paeData);
        })
        .catch(err => {
            console.error('[Structure] PAE fetch failed:', err);
            paePlaceholderEl.textContent = 'Failed to load PAE heatmap.';
        });

    await Promise.allSettled([molstarPromise, paePromise]);

    showStructureLoading(false);
}

// ==================== pLDDT Tooltip ====================

let plddtHideTimer = null;

function showPlddtTooltip() {
    clearTimeout(plddtHideTimer);
    document.getElementById('plddt_tooltip').classList.add('visible');
}

function schedulePlddtHide() {
    plddtHideTimer = setTimeout(() => {
        document.getElementById('plddt_tooltip').classList.remove('visible');
    }, 150);
}

function cancelPlddtHide() {
    clearTimeout(plddtHideTimer);
}

// ==================== PAE Fullscreen Modal ====================

const PAE_VIEWPORT_PADDING = 24;

function getMaxPaeDisplaySize() {
    return Math.min(
        window.innerWidth - PAE_VIEWPORT_PADDING * 2,
        window.innerHeight - PAE_VIEWPORT_PADDING * 2
    );
}

function applyPaeZoom() {
    const img = document.getElementById('pae_modal_image');
    const size = StructureState.paeBaseSize * StructureState.paeZoomLevel;
    img.style.width = size + 'px';
    img.style.height = size + 'px';
}

function openPaeModal() {
    if (!StructureState.paeData) return;

    const overlay = document.getElementById('pae_modal_overlay');
    const img = document.getElementById('pae_modal_image');

    img.src = 'data:image/png;base64,' + StructureState.paeData.image_base64;

    const maxSize = getMaxPaeDisplaySize();
    StructureState.paeBaseSize = maxSize * 0.55;
    StructureState.paeZoomLevel = 1;
    applyPaeZoom();

    overlay.classList.add('active');
}

function closePaeModal() {
    document.getElementById('pae_modal_overlay').classList.remove('active');
}

function zoomPae(delta) {
    const maxSize = getMaxPaeDisplaySize();
    const maxZoom = maxSize / StructureState.paeBaseSize;
    StructureState.paeZoomLevel = Math.max(0.2, Math.min(maxZoom, StructureState.paeZoomLevel + delta));
    applyPaeZoom();
}

function resetPaeZoom() {
    StructureState.paeZoomLevel = 1;
    applyPaeZoom();
}

function downloadPaeImage() {
    if (!StructureState.paeData) return;

    const link = document.createElement('a');
    link.href = 'data:image/png;base64,' + StructureState.paeData.image_base64;
    link.download = `PAE_${StructureState.phytohormone}_${StructureState.proteinId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==================== Event Binding ====================

function bindEvents() {
    document.addEventListener('dockingProteinSelected', (e) => {
        loadStructure(e.detail);
    });

    // pLDDT tooltip — hover on the entire help row triggers it
    const helpRow = document.getElementById('plddt_help_icon').parentElement;
    const plddtTooltip = document.getElementById('plddt_tooltip');
    helpRow.addEventListener('mouseenter', showPlddtTooltip);
    helpRow.addEventListener('mouseleave', schedulePlddtHide);
    plddtTooltip.addEventListener('mouseenter', cancelPlddtHide);
    plddtTooltip.addEventListener('mouseleave', schedulePlddtHide);

    // PAE image click -> fullscreen
    document.getElementById('pae_image_wrapper').addEventListener('click', openPaeModal);

    // PAE modal controls
    document.getElementById('pae_modal_close').addEventListener('click', closePaeModal);
    document.getElementById('pae_zoom_in').addEventListener('click', () => zoomPae(0.25));
    document.getElementById('pae_zoom_out').addEventListener('click', () => zoomPae(-0.25));
    document.getElementById('pae_zoom_reset').addEventListener('click', resetPaeZoom);
    document.getElementById('pae_modal_download').addEventListener('click', downloadPaeImage);

    // Close modal on overlay click (not on inner content)
    document.getElementById('pae_modal_overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closePaeModal();
    });

    // Mouse wheel zoom in modal
    document.getElementById('pae_modal_image_wrapper').addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        zoomPae(delta);
    }, { passive: false });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePaeModal();
    });
}

// ==================== Init ====================

function initStructurePanel() {
    cacheDom();
    bindEvents();
}

export { initStructurePanel };
