import { getData, updateData, fetchSingleNetworkGraphJSON, fetchRawData, validateGenomeID, fetchRawData2 } from "./data.js";
import { showCustomAlert } from "./showCustomAlert.js";

async function initialContentArea(searchKeyword, keywordType, bySubmit = false) {
    console.log("initialContentArea is called, searchKeyword: ", searchKeyword, "keywordType: ", keywordType);

    // 根据不同的关键词类型，初始化不同的内容
    const factorType = ['tf', 'tr', 'pk'];
    const genomeType = ['mosaic', 'xenologous', 'gene', 'transcript'];

    if (factorType.includes(keywordType)) {
        initialContentAreaFactors(searchKeyword, keywordType, bySubmit);
    } else if (genomeType.includes(keywordType)) {
        initialContentAreaGenomes(searchKeyword, keywordType, bySubmit);
    } else {
        showCustomAlert('Invalid keyword type: ' + keywordType, 'error');
    }

}

async function generateIsoformInfo(isoformID, factorID, factorType) {
    console.log("generateIsoformInfo is called, isofromID: ", isoformID, "factorID: ", factorID, "factorType: ", factorType);
    const descriptionData = await fetchRawData2('getAnnotationIsoform', { isoformID: isoformID, annotationType: 'description' });
    const descriptionList = descriptionData.data;
    // console.log('descriptionList', descriptionList);

    const sequenceData = await fetchRawData2('getSeqWithID', { sequenceID: isoformID, sequenceType: 'nucleotide' });
    const sequence = sequenceData.data.nucleotide;
    // console.log('sequence', sequence);

    const className = factorType + '_box';
    let expandable_box = document.querySelector('.' + className);
    let infoBox = expandable_box.querySelector('.info');
    infoBox.innerHTML = ''; // 清空之前的info

    let IDItem = document.createElement('div');
    IDItem.classList.add('info_item');
    IDItem.innerHTML = `
        <h3>ID</h3>
        <a class="dynamic_link" 
            data-replace="${isoformID}" 
            title="click to resource page"
            href="./searchBox.html?searchKeyword=${isoformID}"
            target="_blank"><span>${isoformID}</span></a>
        `;

    let lengthItem = document.createElement('div');
    lengthItem.classList.add('info_item');
    lengthItem.innerHTML = `
        <h3>Length</h3>
        <p>${sequence.length} bp</p>
        `;

    let annotationItem = document.createElement('div');
    annotationItem.classList.add('info_item');
    annotationItem.innerHTML = `
        <h3>Annotation</h3>
        <p>${factorID}</p>
        `;

    let descriptionItem = document.createElement('div');
    descriptionItem.classList.add('desc_item');
    descriptionItem.innerHTML = `
        <h3>Description : </h3>
        <ol>
            ${descriptionList.map(item => `<li><p>${item.description}</p></li>`).join('')}
        </ol>
        `;

    infoBox.appendChild(IDItem);
    infoBox.appendChild(lengthItem);
    infoBox.appendChild(annotationItem);
    infoBox.appendChild(descriptionItem);

}


function switchFocusFactorList(factorID, factorType) {
    let expandableBoxes = document.querySelector('.' + factorType + '_box');
    let type_btns = expandableBoxes.querySelectorAll('.type_btn');
    for (let i = 0; i < type_btns.length; i++) {
        let currentFactorID = type_btns[i].getAttribute('data-value');
        if (currentFactorID === factorID) {
            type_btns[i].classList.add('select');
        } else {
            type_btns[i].classList.remove('select');
        }
    }
}

function switchFocusIsoformList(isoformID, factorType) {
    let expandableBoxes = document.querySelector('.' + factorType + '_box');
    let buttons = expandableBoxes.querySelectorAll('.ID_btn');
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent === isoformID) {
            buttons[i].classList.add('select');
        } else {
            buttons[i].classList.remove('select');
        }
    }
}

// TODO： 优化使得可以在聚焦时滑动列表到指定ID处
function swtichFocusExpandableBox(factorType) {
    // 找到所有的expandable box
    let expandableBoxes = document.querySelectorAll('.expandable_box');
    expandableBoxes.forEach(expandableBox => {
        const contentBox = expandableBox.querySelector('.content_box');

        if (expandableBox.classList.contains(factorType + '_box')) {
            expandableBox.classList.add('active');
            contentBox.style.display = 'flex';
        } else {
            expandableBox.classList.remove('active');
            contentBox.style.display = 'none';
        }

    });
}

function generateIDListButtons(IDList, factorID, factorType) {
    // console.log("generateIDListButtons is called, IDList: ", IDList, "factorID: ", factorID, "factorType: ", factorType);

    // 生成 isoform ID 列表按钮
    const className = factorType + '_box';
    let expandable_box = document.querySelector('.' + className);
    let buttonGroup = expandable_box.querySelector('.ID_list');
    buttonGroup.innerHTML = ''; // 清空之前的按钮

    for (let i = 0; i < IDList.length; i++) {
        let button = document.createElement('button');
        button.classList.add('ID_btn');
        button.textContent = IDList[i];
        buttonGroup.appendChild(button);
    }

    // 添加按钮监听事件
    let buttons = buttonGroup.querySelectorAll('.ID_btn');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            console.log('button clicked: ', button.textContent);
            buttons.forEach(btn => btn.classList.remove('select'));
            button.classList.add('select');
            generateIsoformInfo(button.textContent, factorID, factorType);
        });
    });

}

async function initialContentAreaFactors(factorID, factorType, bySubmit) {
    console.log("initialContentAreaFactors is called, factorID: ", factorID, "factorType: ", factorType);

    // 切换 factor 列表聚焦为当前 factorID
    switchFocusFactorList(factorID, factorType);

    // 如果bySubmit为true展开该expandable box
    if (bySubmit) {
        swtichFocusExpandableBox(factorType);
    }

    // 查询 factorID 的所有 isoformID
    const response = await fetchRawData('getIsoformIDList', factorID);
    console.log('getIsoformIDList', response);
    const isoformIDList = response.data;

    // 生成 isoform ID 列表按钮
    generateIDListButtons(isoformIDList, factorID, factorType);

    // 默认选中第一个 isoform ID 按钮
    switchFocusIsoformList(isoformIDList[0], factorType);

    // 使用第一个ID生成info框
    generateIsoformInfo(isoformIDList[0], factorID, factorType);
}

async function initialContentAreaGenomes(genomeID, IDType, bySubmit) {

    console.log("initialContentAreaGenomes is called, genomeID: ", genomeID, "IDType: ", IDType);

    // TODO: 消息提示需要优化，不应该让消息共用一个div，而应该每个消息都有一个div，形成消息队列，这样可以避免消息重叠
    // 如果用户输入的不是isoformID，那么使用第一个isoformID
    if (IDType !== 'transcript') {

        // 获取第一个isoformID
        const mosaicID = genomeID.split('.')[0];
        const homologousIDSet = await fetchRawData('homologousIDSet', mosaicID);
        console.log('homologousIDSet', homologousIDSet);
        genomeID = homologousIDSet["transcript"][0];

        // 发出警告
        const message1 = IDType + ' ID is not available in this page!';
        showCustomAlert(message1, 'warning', 3000);
        const message2 = 'Using the first isoform ID ' + genomeID + ' automatically!';
        showCustomAlert(message2, 'warning', 4000);
    }

    // 首先根据当前ID查询其对应的factorID
    const response = await fetchRawData2('getAnnotationIsoform', { isoformID: genomeID, annotationType: 'factor' });
    console.log('getAnnotationIsoform', response);
    if (response.data.length === 0) {
        showCustomAlert(genomeID + ' is not annotated as TF/TR/PK!', 'error', 5000);
        return;
    }

    const factorID = response.data[0].name;
    const factorType = response.data[0].type;

    // 切换 factor 列表聚焦为当前 factorID
    switchFocusFactorList(factorID, factorType);

    // 如果bySubmit为true展开该expandable box
    if (bySubmit) {
        swtichFocusExpandableBox(factorType);
    }

    // 展开该expandable box
    let targetBox = document.querySelector('.' + factorType + '_box');
    targetBox.classList.add('active');

    // 查询 factorID 的所有 isoformID
    const isoformIDList = await fetchRawData('getIsoformIDList', factorID);
    console.log('getIsoformIDList', isoformIDList);

    // 生成 isoform ID 列表按钮
    generateIDListButtons(isoformIDList.data, factorID, factorType);

    // 将当前 genomeID 设置为聚焦
    switchFocusIsoformList(genomeID, factorType);

    // 使用当前ID生成info框
    generateIsoformInfo(genomeID, factorID, factorType);

}

export { initialContentArea };