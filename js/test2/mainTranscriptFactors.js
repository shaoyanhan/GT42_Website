import { initialContentArea } from "./initialContentAreaTranscriptFactors.js";
import { validateGenomeID } from "./data.js";
import { showCustomAlert } from "./showCustomAlert.js";


const tf_list = ['AP2/ERF-AP2 (83)', 'AP2/ERF-ERF (663)', 'AP2/ERF-RAV (11)', 'Alfin-like (76)', 'B3 (335)', 'B3-ARF (462)', 'BBR-BPC (54)', 'BES1 (45)', 'BSD (11)', 'C2C2-CO-like (87)', 'C2C2-Dof (179)', 'C2C2-GATA (195)', 'C2C2-LSD (53)', 'C2C2-YABBY (36)', 'C2H2 (633)', 'C3H (650)', 'CAMTA (89)', 'CPP (59)', 'CSD (1)', 'DBB (95)', 'DBP (89)', 'DDT (68)', 'E2F-DP (60)', 'EIL (60)', 'FAR1 (412)', 'GARP-ARR-B (93)', 'GARP-G2-like (283)', 'GRAS (750)', 'GRF (59)', 'GeBP (121)', 'HB-BELL (257)', 'HB-HD-ZIP (575)', 'HB-KNOX (32)', 'HB-PHD (52)', 'HB-WOX (23)', 'HB-other (161)', 'HRT (5)', 'HSF (295)', 'LIM (32)', 'LOB (84)', 'MADS-M-type (63)', 'MADS-MIKC (69)', 'MYB (758)', 'MYB-related (781)', 'NAC (932)', 'NF-X1 (43)', 'NF-YA (127)', 'NF-YB (29)', 'NF-YC (56)', 'OFP (78)', 'PLATZ (93)', 'RWP-RK (68)', 'S1Fa-like (5)', 'SBP (193)', 'SRS (29)', 'STAT (18)', 'TCP (129)', 'TUB (286)', 'Tify (187)', 'Trihelix (312)', 'ULT (6)', 'VOZ (40)', 'WRKY (750)', 'Whirly (10)', 'bHLH (836)', 'bZIP (876)', 'zf-HD (30)'];
const tr_list = ['ARID (100)', 'AUX/IAA (393)', 'GNAT (134)', 'HMG (69)', 'IWS1 (182)', 'Jumonji (262)', 'LUG (39)', 'MBF1 (13)', 'MED6 (15)', 'Others (864)', 'PHD (350)', 'RB (48)', 'Rcd1-like (39)', 'SET (473)', 'SNF2 (672)', 'SOH1 (11)', 'SWI/SNF-BAF60b (77)', 'SWI/SNF-SWI3 (38)', 'TAZ (76)', 'TRAF (377)', 'mTERF (252)'];
const pk_list = ['AGC-Pl (40)', 'AGC_MAST (22)', 'AGC_NDR (92)', 'AGC_PDK1 (20)', 'AGC_PKA-PKG (45)', 'AGC_RSK-2 (230)', 'Aur (15)', 'BUB (20)', 'CAMK_AMPK (143)', 'CAMK_CAMK1-DCAMKL (3)', 'CAMK_CAMKL-CHK1 (575)', 'CAMK_CAMKL-LKB (17)', 'CAMK_CDPK (530)', 'CAMK_OST1L (365)', 'CK1_CK1 (277)', 'CK1_CK1-Pl (192)', 'CMGC_CDK-CCRK (3)', 'CMGC_CDK-CDK7 (9)', 'CMGC_CDK-CDK8 (17)', 'CMGC_CDK-CRK7-CDK9 (191)', 'CMGC_CDK-PITSLRE (99)', 'CMGC_CDK-Pl (90)', 'CMGC_CDKL-Os (25)', 'CMGC_CK2 (41)', 'CMGC_CLK (211)', 'CMGC_DYRK-PRP4 (162)', 'CMGC_DYRK-YAK (100)', 'CMGC_GSK (225)', 'CMGC_GSKL (4)', 'CMGC_MAPK (375)', 'CMGC_Pl-Tthe (15)', 'CMGC_RCK (164)', 'CMGC_SRPK (58)', 'Group-Pl-2 (7)', 'Group-Pl-3 (28)', 'Group-Pl-4 (35)', 'IRE1 (21)', 'NAK (72)', 'NEK (108)', 'PEK_GCN2 (30)', 'PEK_PEK (6)', 'RLK-Pelle_C-LEC (16)', 'RLK-Pelle_CR4L (91)', 'RLK-Pelle_CrRLK1L-1 (212)', 'RLK-Pelle_DLSV (1215)', 'RLK-Pelle_Extensin (123)', 'RLK-Pelle_L-LEC (365)', 'RLK-Pelle_LRK10L-2 (116)', 'RLK-Pelle_LRR-I-1 (69)', 'RLK-Pelle_LRR-I-2 (46)', 'RLK-Pelle_LRR-II (241)', 'RLK-Pelle_LRR-III (386)', 'RLK-Pelle_LRR-IV (29)', 'RLK-Pelle_LRR-IX (66)', 'RLK-Pelle_LRR-V (247)', 'RLK-Pelle_LRR-VI-1 (61)', 'RLK-Pelle_LRR-VI-2 (233)', 'RLK-Pelle_LRR-VII-1 (61)', 'RLK-Pelle_LRR-VII-2 (29)', 'RLK-Pelle_LRR-VII-3 (9)', 'RLK-Pelle_LRR-VIII-1 (198)', 'RLK-Pelle_LRR-XI-1 (506)', 'RLK-Pelle_LRR-XI-2 (30)', 'RLK-Pelle_LRR-XII-1 (257)', 'RLK-Pelle_LRR-XIIIa (46)', 'RLK-Pelle_LRR-XIIIb (87)', 'RLK-Pelle_LRR-XIV (14)', 'RLK-Pelle_LRR-XV (71)', 'RLK-Pelle_LRR-Xa (54)', 'RLK-Pelle_LRR-Xb-1 (125)', 'RLK-Pelle_LRR-Xb-2 (22)', 'RLK-Pelle_LysM (129)', 'RLK-Pelle_PERK-1 (153)', 'RLK-Pelle_PERK-2 (35)', 'RLK-Pelle_RKF3 (27)', 'RLK-Pelle_RLCK-II (16)', 'RLK-Pelle_RLCK-IV (81)', 'RLK-Pelle_RLCK-IXa (16)', 'RLK-Pelle_RLCK-IXb (147)', 'RLK-Pelle_RLCK-Os (34)', 'RLK-Pelle_RLCK-V (210)', 'RLK-Pelle_RLCK-VI (131)', 'RLK-Pelle_RLCK-VIII (174)', 'RLK-Pelle_RLCK-VIIa-1 (114)', 'RLK-Pelle_RLCK-VIIa-2 (550)', 'RLK-Pelle_RLCK-VIIb (21)', 'RLK-Pelle_RLCK-X (46)', 'RLK-Pelle_RLCK-XI (17)', 'RLK-Pelle_RLCK-XII-1 (93)', 'RLK-Pelle_RLCK-XIII (54)', 'RLK-Pelle_RLCK-XV (45)', 'RLK-Pelle_RLCK-XVI (33)', 'RLK-Pelle_SD-2b (362)', 'RLK-Pelle_URK-1 (45)', 'RLK-Pelle_URK-3 (2)', 'RLK-Pelle_WAK (244)', 'RLK-Pelle_WAK_LRK10L-1 (134)', 'SCY1_SCYL1 (20)', 'SCY1_SCYL2 (23)', 'STE_STE-Pl (28)', 'STE_STE11 (274)', 'STE_STE20-Fray (101)', 'STE_STE20-Pl (24)', 'STE_STE20-YSK (27)', 'STE_STE7 (77)', 'TKL-Pl-1 (19)', 'TKL-Pl-2 (24)', 'TKL-Pl-3 (7)', 'TKL-Pl-4 (266)', 'TKL-Pl-5 (42)', 'TKL-Pl-6 (202)', 'TKL-Pl-7 (9)', 'TKL_CTR1-DRK-1 (20)', 'TKL_CTR1-DRK-2 (175)', 'TKL_Gdt (2)', 'TLK (23)', 'TTK (10)', 'ULK_Fused (10)', 'ULK_ULK4 (5)', 'WEE (5)', 'WNK_NRBP (193)']

function generateTypeList(container, list, dataType) {
    let typeList = container.querySelector('.type_list');
    typeList.innerHTML = '';
    list.forEach((item, index) => {
        // <button class="type_btn" type-value="AP2/ERF-ERF">AP2/ERF-ERF (663)</button>
        let type_btn = document.createElement('button');
        type_btn.classList.add('type_btn');
        // 默认选中第一个
        if (index === 0) {
            type_btn.classList.add('select');
        }
        const typeValue = item.split(' ')[0];
        type_btn.setAttribute('data-value', typeValue);
        type_btn.setAttribute('data-type', dataType);
        type_btn.textContent = item;
        typeList.appendChild(type_btn);

    });

    // 为每个type_btn添加点击事件
    let type_btns = typeList.querySelectorAll('.type_btn');
    type_btns.forEach(type_btn => {
        type_btn.addEventListener('click', (e) => {
            type_btns.forEach(btn => btn.classList.remove('select'));
            type_btn.classList.add('select');
            const searchKeyword = type_btn.getAttribute('data-value');
            const keywordType = type_btn.getAttribute('data-type');
            initialContentArea(searchKeyword, keywordType)
        });
    });

}

function initialTypeList() {
    let tf_box = document.querySelector('.tf_box');
    let tr_box = document.querySelector('.tr_box');
    let pk_box = document.querySelector('.pk_box');

    generateTypeList(tf_box, tf_list, 'tf');
    generateTypeList(tr_box, tr_list, 'tr');
    generateTypeList(pk_box, pk_list, 'pk');
}

function initialExpandBoxEvent() {
    let expandableBoxes = document.querySelectorAll('.expandable_box');
    expandableBoxes.forEach(expandableBox => {
        const headerBox = expandableBox.querySelector('.header_box');
        const contentBox = expandableBox.querySelector('.content_box');

        headerBox.addEventListener('click', function () {
            expandableBox.classList.toggle('active');
            contentBox.style.display = contentBox.style.display === 'flex' ? 'none' : 'flex';

        });
    });
}

// 检查URL是否有searchKeyword参数，如果有，返回true，否则返回false
function checkURLSearchKeyword() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('searchKeyword');
}

// 提交搜索表单
async function submitSearchForm(container) {
    const searchInput = container.querySelector('.search_input');
    const searchKeyword = searchInput.value;

    // 后端验证ID是否存在
    const response = await validateGenomeID(searchKeyword);
    console.log(response);

    if (response && response.status === 'success') {
        // 根据搜索关键词的类型，初始化页面，需要加上bySubmit参数用于对展开框进行展开聚焦效果的切换
        initialContentArea(searchKeyword, response.type, true);

    } else {
        console.error('Genome ID validation failed', response);
        showCustomAlert('Genome ID validation failed. Please try again.', 'error');
    }
}

// 仅可以包含字母、数字、下划线、短横线、点号和斜杠，不合法则终止并提示用户
function inputValidation(searchKeyword) {
    const reg = /^[a-zA-Z0-9_\-./]+$/;
    if (!reg.test(searchKeyword)) {
        showCustomAlert('Invalid search keyword! Please enter a valid search keyword.', 'error');
        return false;
    }
    return true;
}

// 针对于URL是否有searchKeyword参数的情况，进行不同的初始化操作
function initialBasedOnURLSearchKeyword() {
    // 无论有没有参数都用第一个factor初始化页面内容
    initialContentArea('AP2/ERF-AP2', 'tf');
    initialContentArea('ARID', 'tr');
    initialContentArea('AGC-Pl', 'pk');

    if (!checkURLSearchKeyword()) {
        return;
    }

    // 如果URL中有searchKeyword参数，那么使用searchKeyword参数初始化页面
    // http://127.0.0.1:5501/html/test/transcriptFactors.html?searchKeyword=SGI000002.SO
    let searchKeyword = new URLSearchParams(window.location.search).get('searchKeyword');

    // 找到搜索框组件
    const searchContainer = document.querySelector('.search_container');

    // 将searchKeyword填充到搜索框中
    let searchInput = searchContainer.querySelector('.search_input');
    searchInput.value = searchKeyword;

    // 提交搜索表单
    submitSearchForm(searchContainer);

}

function setUpSearchContainerEventListeners(containerSelector) {
    const searchContainer = document.querySelector(containerSelector);
    const searchInput = searchContainer.querySelector('.search_input');
    const searchButton = searchContainer.querySelector('.search_icon');
    const exampleIDs = searchContainer.querySelectorAll('.example_id');

    // 填充搜索框的值
    exampleIDs.forEach(exampleID => {
        exampleID.addEventListener('click', () => {
            searchInput.value = exampleID.getAttribute('data_value');
        });
    });

    // 表单验证和提交逻辑
    const handleSearch = () => {
        // 获取搜索框的值, 去除首尾的引号和空白符
        let searchKeyword = searchInput.value.replace(/^['"]+|['"]+$/g, '').trim();

        if (!searchKeyword) {
            showCustomAlert('Please enter a search keyword!', 'error');
            return;
        }

        if (!inputValidation(searchKeyword)) {
            return;
        }

        submitSearchForm(searchContainer);
    };

    // 按钮点击事件
    searchButton.addEventListener('click', () => {
        console.log("searchButton is clicked");
        handleSearch();
    });

    // 回车键事件
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log("Enter key is pressed");
            handleSearch();
        }
    });
}


// 确保文档加载完成后再执行初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化factor列表点击事件
    initialTypeList();

    // 初始化expandBox点击事件
    initialExpandBoxEvent();

    // 检查URL是否有searchKeyword参数并初始化页面
    initialBasedOnURLSearchKeyword();

    // 初始化搜索框事件
    setUpSearchContainerEventListeners('.search_container');
});