import { initSearchPanel } from './dockingSearchModule.js';
import { initTablePanel } from './dockingTableModule.js';
import { initStructurePanel } from './dockingStructureModule.js';

function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchKeyword = urlParams.get('searchKeyword');

    if (!searchKeyword || !searchKeyword.trim()) return;

    const trimmedKeyword = searchKeyword.trim();

    setTimeout(() => {
        const input = document.getElementById('docking_protein_id_input');
        if (!input) return;

        input.value = trimmedKeyword;
        input.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(() => {
            const submitBtn = document.getElementById('docking_submit_btn');
            if (submitBtn) submitBtn.click();
        }, 200);
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    initSearchPanel();
    initTablePanel();
    initStructurePanel();
    handleUrlParameters();
});
