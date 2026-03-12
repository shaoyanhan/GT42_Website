import { fetchRawData2 } from './data.js';
import { showCustomAlert } from './showCustomAlert.js';

// ==================== Constants ====================

const PHYTOHORMONE_LIST = [
    'abscisic_acid',
    'auxin',
    'brassinosteroids',
    'ethylene',
    'gibberellic_acid',
    'jasmonic_acid',
    'kinetin',
    'salicylic_acid',
    'strigolactones'
];

const TF_FAMILY_LIST = [
    { name: 'Alfin-like', count: 32 },
    { name: 'AP2/ERF-AP2', count: 42 },
    { name: 'AP2/ERF-ERF', count: 287 },
    { name: 'AP2/ERF-RAV', count: 5 },
    { name: 'B3', count: 163 },
    { name: 'B3-ARF', count: 133 },
    { name: 'BBR-BPC', count: 5 },
    { name: 'BES1', count: 21 },
    { name: 'bHLH', count: 380 },
    { name: 'BSD', count: 4 },
    { name: 'bZIP', count: 328 },
    { name: 'C2C2-CO-like', count: 17 },
    { name: 'C2C2-Dof', count: 89 },
    { name: 'C2C2-GATA', count: 89 },
    { name: 'C2C2-LSD', count: 31 },
    { name: 'C2C2-YABBY', count: 20 },
    { name: 'C2H2', count: 265 },
    { name: 'C3H', count: 262 },
    { name: 'CAMTA', count: 17 },
    { name: 'CPP', count: 30 },
    { name: 'CSD', count: 1 },
    { name: 'DBB', count: 30 },
    { name: 'DBP', count: 20 },
    { name: 'DDT', count: 43 },
    { name: 'E2F-DP', count: 47 },
    { name: 'EIL', count: 17 },
    { name: 'FAR1', count: 140 },
    { name: 'GARP-ARR-B', count: 19 },
    { name: 'GARP-G2-like', count: 136 },
    { name: 'GeBP', count: 49 },
    { name: 'GRAS', count: 245 },
    { name: 'GRF', count: 28 },
    { name: 'HB-BELL', count: 66 },
    { name: 'HB-HD-ZIP', count: 165 },
    { name: 'HB-KNOX', count: 6 },
    { name: 'HB-other', count: 75 },
    { name: 'HB-PHD', count: 16 },
    { name: 'HB-WOX', count: 17 },
    { name: 'HRT', count: 3 },
    { name: 'HSF', count: 91 },
    { name: 'LIM', count: 10 },
    { name: 'LOB', count: 51 },
    { name: 'MADS-MIKC', count: 25 },
    { name: 'MADS-M-type', count: 44 },
    { name: 'MYB', count: 282 },
    { name: 'MYB-related', count: 349 },
    { name: 'NAC', count: 376 },
    { name: 'NF-X1', count: 22 },
    { name: 'NF-YA', count: 36 },
    { name: 'NF-YB', count: 17 },
    { name: 'NF-YC', count: 24 },
    { name: 'OFP', count: 48 },
    { name: 'PLATZ', count: 42 },
    { name: 'RWP-RK', count: 36 },
    { name: 'S1Fa-like', count: 3 },
    { name: 'SBP', count: 75 },
    { name: 'SRS', count: 21 },
    { name: 'STAT', count: 5 },
    { name: 'TCP', count: 45 },
    { name: 'Tify', count: 84 },
    { name: 'Trihelix', count: 118 },
    { name: 'TUB', count: 85 },
    { name: 'ULT', count: 2 },
    { name: 'VOZ', count: 9 },
    { name: 'Whirly', count: 6 },
    { name: 'WRKY', count: 330 },
    { name: 'zf-HD', count: 22 }
];

// ==================== State ====================

const DockingSearchState = {
    proteinId: '',
    idValidationStatus: null,  // null | 'valid' | 'invalid'
    resolvedTfFamily: '',      // TF family name resolved from protein ID validation
    selectedPhytohormones: new Set(),
    selectedTfFamilies: new Set(),
    tfFamilyDisabled: false,
    isSearching: false
};

// ==================== Utility ====================

function formatPhytohormoneName(snakeName) {
    return snakeName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ==================== Render ====================

function renderPhytohormoneButtons() {
    const grid = document.getElementById('phytohormone_button_grid');
    grid.innerHTML = '';

    PHYTOHORMONE_LIST.forEach(name => {
        const btn = document.createElement('button');
        btn.className = 'selection_btn';
        btn.dataset.value = name;
        btn.dataset.group = 'phytohormone';

        const label = document.createElement('span');
        label.className = 'btn_label';
        label.textContent = formatPhytohormoneName(name);

        const removeIcon = document.createElement('span');
        removeIcon.className = 'remove_icon';
        removeIcon.textContent = '\u00D7';

        btn.appendChild(label);
        btn.appendChild(removeIcon);
        grid.appendChild(btn);
    });
}

function renderTfFamilyButtons() {
    const grid = document.getElementById('tf_family_button_grid');
    grid.innerHTML = '';

    TF_FAMILY_LIST.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'selection_btn';
        btn.dataset.value = item.name;
        btn.dataset.group = 'tf_family';

        const label = document.createElement('span');
        label.className = 'btn_label';
        label.textContent = item.name;

        const count = document.createElement('span');
        count.className = 'member_count';
        count.textContent = `(${item.count})`;

        const removeIcon = document.createElement('span');
        removeIcon.className = 'remove_icon';
        removeIcon.textContent = '\u00D7';

        btn.appendChild(label);
        btn.appendChild(count);
        btn.appendChild(removeIcon);
        grid.appendChild(btn);
    });
}

// ==================== Button Interaction ====================

function handleButtonClick(e) {
    const btn = e.target.closest('.selection_btn');
    if (!btn) return;

    if (btn.dataset.group === 'tf_family' && DockingSearchState.tfFamilyDisabled) return;

    const isRemoveClick = e.target.closest('.remove_icon');
    const group = btn.dataset.group;
    const value = btn.dataset.value;
    const stateSet = group === 'phytohormone'
        ? DockingSearchState.selectedPhytohormones
        : DockingSearchState.selectedTfFamilies;

    if (isRemoveClick || btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        stateSet.delete(value);
    } else {
        btn.classList.add('selected');
        stateSet.add(value);
    }
}

function handleSelectAll(group) {
    if (group === 'tf_family' && DockingSearchState.tfFamilyDisabled) return;

    const stateSet = group === 'phytohormone'
        ? DockingSearchState.selectedPhytohormones
        : DockingSearchState.selectedTfFamilies;
    const gridId = group === 'phytohormone'
        ? 'phytohormone_button_grid'
        : 'tf_family_button_grid';
    const buttons = document.getElementById(gridId).querySelectorAll('.selection_btn');

    buttons.forEach(btn => {
        btn.classList.add('selected');
        stateSet.add(btn.dataset.value);
    });
}

function handleDeselectAll(group) {
    if (group === 'tf_family' && DockingSearchState.tfFamilyDisabled) return;

    const stateSet = group === 'phytohormone'
        ? DockingSearchState.selectedPhytohormones
        : DockingSearchState.selectedTfFamilies;
    const gridId = group === 'phytohormone'
        ? 'phytohormone_button_grid'
        : 'tf_family_button_grid';
    const buttons = document.getElementById(gridId).querySelectorAll('.selection_btn');

    buttons.forEach(btn => {
        btn.classList.remove('selected');
    });
    stateSet.clear();
}

// ==================== TF Family Disable / Enable ====================

function setTfFamilyDisabled(disabled) {
    DockingSearchState.tfFamilyDisabled = disabled;
    const section = document.querySelector('.tf_family_select_group');
    if (disabled) {
        resetTfFamilySelection();
        section.classList.add('disabled');
    } else {
        section.classList.remove('disabled');
    }
}

function resetTfFamilySelection() {
    DockingSearchState.selectedTfFamilies.clear();
    DockingSearchState.resolvedTfFamily = '';
    const buttons = document.getElementById('tf_family_button_grid')
        .querySelectorAll('.selection_btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
}

function autoSelectTfFamily(familyName) {
    DockingSearchState.resolvedTfFamily = familyName;
    DockingSearchState.selectedTfFamilies.clear();
    DockingSearchState.selectedTfFamilies.add(familyName);

    const buttons = document.getElementById('tf_family_button_grid')
        .querySelectorAll('.selection_btn');
    buttons.forEach(btn => {
        if (btn.dataset.value === familyName) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// ==================== ID Input & Clear ====================

function handleIdInputChange() {
    const input = document.getElementById('docking_protein_id_input');
    const value = input.value.trim();
    const clearBtn = document.getElementById('id_clear_btn');

    // Reset validation state on any input change
    const icon = document.getElementById('id_validation_icon');
    icon.className = 'id_validation_icon';
    icon.textContent = '';
    DockingSearchState.idValidationStatus = null;
    DockingSearchState.proteinId = '';
    DockingSearchState.resolvedTfFamily = '';

    // Toggle clear button visibility
    if (value) {
        clearBtn.classList.add('visible');
        setTfFamilyDisabled(true);
    } else {
        clearBtn.classList.remove('visible');
        setTfFamilyDisabled(false);
    }
}

function handleClearInput() {
    const input = document.getElementById('docking_protein_id_input');
    input.value = '';
    input.focus();
    handleIdInputChange();
}

// ==================== ID Validation (getAnnotationIsoform) ====================

async function validateProteinId(proteinId) {
    const result = await fetchRawData2('getAnnotationIsoform', {
        isoformID: proteinId,
        annotationType: 'factor'
    });

    if (result && Array.isArray(result.data) && result.data.length > 0
        && result.data[0].type === 'tf') {
        return { valid: true, familyName: result.data[0].name };
    }
    return { valid: false, familyName: '' };
}

// ==================== Submit ====================

async function handleSubmit() {
    const proteinId = document.getElementById('docking_protein_id_input').value.trim();
    const phytohormones = Array.from(DockingSearchState.selectedPhytohormones);
    const tfFamilies = Array.from(DockingSearchState.selectedTfFamilies);

    // 1) Check: at least one filter must be provided
    if (!proteinId && phytohormones.length === 0 && tfFamilies.length === 0) {
        showCustomAlert(
            'Please enter a Protein ID, or select at least one phytohormone or TF family.',
            'warning'
        );
        return;
    }

    // 2) If protein ID is provided, validate via getAnnotationIsoform
    if (proteinId) {
        const icon = document.getElementById('id_validation_icon');
        icon.className = 'id_validation_icon validating';
        icon.textContent = '';
        setSubmitLoading(true);

        try {
            const { valid, familyName } = await validateProteinId(proteinId);

            if (valid) {
                icon.className = 'id_validation_icon valid';
                icon.textContent = '\u2713';
                DockingSearchState.proteinId = proteinId;
                DockingSearchState.idValidationStatus = 'valid';
                autoSelectTfFamily(familyName);
            } else {
                icon.className = 'id_validation_icon invalid';
                icon.textContent = '\u2717';
                DockingSearchState.idValidationStatus = 'invalid';
                setSubmitLoading(false);
                showCustomAlert(
                    'Invalid ID: not a recognized transcription factor. Please enter a valid TF protein ID.',
                    'error'
                );
                return;
            }
        } catch (err) {
            icon.className = 'id_validation_icon invalid';
            icon.textContent = '\u2717';
            DockingSearchState.idValidationStatus = 'invalid';
            setSubmitLoading(false);
            showCustomAlert(
                'Network error: failed to validate Protein ID. Please try again.',
                'error'
            );
            return;
        }
    } else {
        DockingSearchState.proteinId = '';
        DockingSearchState.idValidationStatus = null;
        DockingSearchState.resolvedTfFamily = '';
    }

    // 3) Start the actual search request
    showSearchLoading(true);
    setSubmitLoading(true);

    const searchParams = getSearchParams();

    /* ====================================================================
     * [TEST CODE - Section 2 Integration Point]
     *
     * The code below directly calls the backend API for testing purposes.
     * When implementing Section 2 (table display panel), replace this
     * block with an event dispatch:
     *
     *   document.dispatchEvent(new CustomEvent('dockingSearchTriggered', {
     *       detail: searchParams
     *   }));
     *
     * Section 2 should:
     *   1. Listen for the 'dockingSearchTriggered' event
     *   2. Use searchParams from event.detail to fetch table data
     *   3. Dispatch 'dockingSearchCompleted' when done to dismiss
     *      the loading overlay on Section 1
     * ==================================================================== */
    try {
        const requestBody = { page: 1, page_size: 10 };
        if (searchParams.protein_id) {
            requestBody.protein_id = searchParams.protein_id;
        }
        if (searchParams.phytohormone.length > 0) {
            requestBody.phytohormone = searchParams.phytohormone;
        }
        if (searchParams.tf_family.length > 0) {
            requestBody.tf_family = searchParams.tf_family;
        }

        console.log('[Docking Search] Request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(
            'http://localhost:30004/searchDatabase/getDockingSummaryTableByPage/',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }
        );
        const data = await response.json();

        console.log('[Docking Search] Response:', data);

        showSearchLoading(false);
        setSubmitLoading(false);
        showCustomAlert('Search completed successfully!', 'normal');

    } catch (err) {
        console.error('[Docking Search] Request failed:', err);
        showSearchLoading(false);
        setSubmitLoading(false);
        showCustomAlert('Search request failed. Please check your network.', 'error');
    }
    /* ==== [END TEST CODE] ==== */
}

// ==================== Search Params ====================

function getSearchParams() {
    return {
        protein_id: DockingSearchState.idValidationStatus === 'valid'
            ? DockingSearchState.proteinId
            : '',
        phytohormone: Array.from(DockingSearchState.selectedPhytohormones),
        tf_family: Array.from(DockingSearchState.selectedTfFamilies)
    };
}

// ==================== Loading Overlay ====================

function showSearchLoading(show) {
    const overlay = document.getElementById('search_loading_overlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
    DockingSearchState.isSearching = show;
}

function setSubmitLoading(loading) {
    const btn = document.getElementById('docking_submit_btn');
    if (!btn) return;
    const textSpan = btn.querySelector('.submit_btn_text');
    if (loading) {
        btn.classList.add('loading');
        if (textSpan) textSpan.textContent = 'Searching...';
    } else {
        btn.classList.remove('loading');
        if (textSpan) textSpan.textContent = 'Search';
    }
}

// ==================== Example ID ====================

function handleExampleIdClick(e) {
    const exampleEl = e.target.closest('.example_id');
    if (!exampleEl) return;

    const input = document.getElementById('docking_protein_id_input');
    input.value = exampleEl.dataset.id;
    handleIdInputChange();
}

// ==================== Init ====================

function initSearchPanel() {
    renderPhytohormoneButtons();
    renderTfFamilyButtons();

    document.getElementById('docking_protein_id_input')
        .addEventListener('input', handleIdInputChange);

    document.getElementById('id_clear_btn')
        .addEventListener('click', handleClearInput);

    const hintArea = document.querySelector('.id_search_hint');
    if (hintArea) {
        hintArea.addEventListener('click', handleExampleIdClick);
    }

    document.getElementById('phytohormone_button_grid')
        .addEventListener('click', handleButtonClick);
    document.getElementById('tf_family_button_grid')
        .addEventListener('click', handleButtonClick);

    document.querySelectorAll('.select_all_btn').forEach(btn => {
        btn.addEventListener('click', () => handleSelectAll(btn.dataset.target));
    });
    document.querySelectorAll('.deselect_all_btn').forEach(btn => {
        btn.addEventListener('click', () => handleDeselectAll(btn.dataset.target));
    });

    document.getElementById('docking_submit_btn')
        .addEventListener('click', handleSubmit);

    document.addEventListener('dockingSearchCompleted', () => {
        showSearchLoading(false);
        setSubmitLoading(false);
    });
}

export {
    initSearchPanel,
    getSearchParams,
    showSearchLoading,
    DockingSearchState
};
