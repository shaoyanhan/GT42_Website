import { initSearchPanel } from './dockingSearchModule.js';
import { initTablePanel } from './dockingTableModule.js';
import { initStructurePanel } from './dockingStructureModule.js';

document.addEventListener('DOMContentLoaded', () => {
    initSearchPanel();
    initTablePanel();
    initStructurePanel();
});
