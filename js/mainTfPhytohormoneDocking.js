import { initSearchPanel } from './dockingSearchModule.js';
import { initTablePanel } from './dockingTableModule.js';

document.addEventListener('DOMContentLoaded', () => {
    initSearchPanel();
    initTablePanel();
});
