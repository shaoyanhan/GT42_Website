import { initialContentArea } from "./initialContentAreaBlast.js";
import { fetchPostData, updateData, getData } from "./data.js";
import { fillSelect } from './selectEvents.js';
import { scrollToTargetID } from "./echartsEventsBlast.js";


// 获取搜索框组件相关元素
const sequenceInput = document.getElementById('query_sequence');
const clearButton = document.getElementById('clear_button');
const exampleButtonNucleotide = document.getElementById('example_button_nucleotide');
const exampleButtonPeptide = document.getElementById('example_button_peptide');
const checkboxes = document.querySelectorAll('.checkbox_container input[type="checkbox"]');
// 获取核酸和蛋白质复选框，选择所有具有 checkbox_container 类名的元素，然后筛选出 id 包含 nucleotide 和 peptide 的元素
const nucleotideCheckboxes = document.querySelectorAll('.checkbox_container input[id*="nucleotide"]');
const peptideCheckboxes = document.querySelectorAll('.checkbox_container input[id*="peptide"]');
const blastButtons = {
    blastn: document.getElementById('blastn'),
    blastp: document.getElementById('blastp'),
    blastx: document.getElementById('blastx'),
    tblastn: document.getElementById('tblastn'),
    tblastx: document.getElementById('tblastx')
};
const exampleSequences = {
    nucleotide:
        `>q1
GGGAAGAAGAGCACGCCAACTCCTCCGGCTCTTCTCCTCCTCCAGTCCACCGGCAGCACC
ACCACCACCTCCCTCCTCCAGTCCTCCTGCCACCGCGCGGCCCCAACCACAGCACAGCAT
AATGGCGGGCAACGGCGCCATCGTGGAGAGCGACCCGCTGAACTGGGGCGCGGCGGCAGC
GGAGCTGGCGGGGAGCCACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCC
CGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGC
CAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGC
CAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCTG
GACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCC
ACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCC
GTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGAC
TGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCAC
CGCCGCACCAAGGACGGGCCCGCTCTCCAGGTCGAGCTGCTCAGGCATCTCAACGCCGGA
ATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATG
CTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAG
GCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATC
ACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCC
AACGCGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATC
GCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC

>q2
GTGGGTGGCAGCGCTGGTCCAGCGGGAGGTGCGCGCCCAGATGGTGGCGGAGGAGGAGA
GGCGCATCACGCGCGACCGCCTGCGCGCCGCGGTGGAGGAGTCGGCCGCCCGCCGCCGCC
AGCTTGCGGACGAGGTGGAGCTCTGGGCTGGGTACTGCGCCTGCTCCGCCATTCTGGGCG
GGTGGGCCGTGGGCGCCGGGTTGGCGATGCTGTTGTTTGCTCGCTGAAAGGGAGGGTCTT
GTCAAGGCGGGTGAGAACGATAGGGATGCCAGTTGAGTATGTTAGAG`,

    peptide:
        `>q1
MAPPALPRALTVLLLLLLASTARSQEEAPSPTAEPPASAPLAADYQLAHSPISHPPTASA
PSAADTAADAPSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPAPAADQIKAAN
ASASIGSGEPEEEEHREMNGGSKAGVVLGTFAAATVLGLGVFVWRKRRANIRRARYADYA
ARLELV

>q2
DRLRSSDCWLLLKEVALGGQPMDFPPELQEIIGAVVANVKGSPLAAKAIGQMISSTRST
RKWRALINTEISDNIIISSLQLSYQHLPSHLQRCFAYCSIFPTTWRFNRYDLVKMWMALG
FIQPPTDEGKGMEDL`
};

// 设置 BLAST 按钮为禁用状态，并添加 disabled 类用于样式控制
function setDisabledBlastButton(button) {
    button.disabled = true;
    button.classList.add('disabled');
}
function setEnabledBlastButton(button) {
    button.disabled = false;
    button.classList.remove('disabled');
}

// 禁用所有复选框
function disableCheckboxes() {
    checkboxes.forEach(cb => cb.disabled = true);
}
function enableCheckboxes() {
    checkboxes.forEach(cb => cb.disabled = false);
}
// 清除所有复选框中勾选的状态
function cleanCheckboxes() {
    checkboxes.forEach(cb => cb.checked = false);
}

// 禁用所有 BLAST 按钮
function disableAllBlastButtons() {
    Object.values(blastButtons).forEach(btn => setDisabledBlastButton(btn));
}

// 处理输入框的输入事件
function sequenceInputEventHandler() {
    console.log('sequenceInputEventHandler');
    if (sequenceInput.value.trim() === '') {
        disableCheckboxes();
        cleanCheckboxes();
        disableAllBlastButtons();
    } else {
        cleanCheckboxes();
        enableCheckboxes();
        disableAllBlastButtons();
    }
}

// 处理示例按钮的点击事件
function exampleButtonEventHandler(exampleSequence) {
    console.log('exampleButtonEventHandler');
    sequenceInput.value = exampleSequence;
    cleanCheckboxes();
    enableCheckboxes();
    disableAllBlastButtons();
}

// 处理清除按钮的点击事件
function clearButtonEventHandler() {
    console.log('clearButtonEventHandler');
    sequenceInput.value = '';
    disableCheckboxes();
    cleanCheckboxes();
    disableAllBlastButtons();
}


// 将输入框中的序列逐一提取出来，并返回一个序列数组
function getSequences(sequenceInputValue) {
    // 将输入按行分割，并移除空行
    const lines = sequenceInputValue.split('\n').filter(line => line.trim() !== '');

    // 初始化一个数组来存储序列
    let sequences = [];

    // 如果第一行包含'>'字符，表示FASTA格式
    if (lines.length > 0 && lines[0].startsWith('>')) {
        let currentSequence = '';
        for (let line of lines) {
            if (line.startsWith('>')) {
                // 遇到新的标题行，将当前序列存入数组并重置
                if (currentSequence) {
                    sequences.push(currentSequence);
                    currentSequence = '';
                }
            } else {
                // 累加序列行
                currentSequence += line.trim();
            }
        }
        // 添加最后一个序列
        if (currentSequence) {
            sequences.push(currentSequence);
        }
    } else {
        // 如果不是FASTA格式，直接将所有行合并为一个序列
        sequences = [lines.join('').trim()];
    }

    return sequences;
}

// 判断输入序列是否为核酸序列
function isNucleotideSequence(sequence) {
    const upperCaseSequence = sequence.toUpperCase();
    const nucleotidePattern = /^[ATCGU]+$/;
    return nucleotidePattern.test(upperCaseSequence);
}

// 判断输入序列是否为蛋白质序列
function isPeptideSequence(sequence) {
    const upperCaseSequence = sequence.toUpperCase();
    const peptidePattern = /^[ACDEFGHIKLMNPQRSTVWY]+$/;
    // 如果序列是核酸序列且只包含ATCG，则优先判断为核酸序列
    if (isNucleotideSequence(sequence) && /^[ATCG]+$/.test(upperCaseSequence)) {
        return false;
    }
    return peptidePattern.test(upperCaseSequence);
}

// 检查输入的序列是否为核酸或蛋白质序列
function validateSequences() {
    const sequences = getSequences(sequenceInput.value);
    console.log('sequences:', sequences);
    const isNucleotide = sequences.every(isNucleotideSequence);
    const isPeptide = sequences.every(isPeptideSequence);
    console.log('isNucleotide:', isNucleotide);
    console.log('isPeptide:', isPeptide);

    if (isNucleotide && !isPeptide) {
        return 'nucleotide';
    } else if (!isNucleotide && isPeptide) {
        return 'peptide';
    } else {
        alert('Sequences must be all nucleotide or all peptide.');
        return null;
    }
}

// 根据用户输入的序列类型和选择的数据库，更新 BLAST 按钮的状态
function updateBlastButtons(sequenceType) {
    console.log('updateBlastButtons:', sequenceType);

    // 获取用户选择的数据库
    const selectedDatabase = [...checkboxes].find(cb => cb.checked)?.id || '';

    if (sequenceType === 'nucleotide') {
        if (selectedDatabase.includes('nucleotide')) {
            setEnabledBlastButton(blastButtons.blastn);
            setEnabledBlastButton(blastButtons.tblastx);
            setDisabledBlastButton(blastButtons.blastx);
            setDisabledBlastButton(blastButtons.tblastn);
            setDisabledBlastButton(blastButtons.blastp);
        } else if (selectedDatabase.includes('peptide')) {
            setEnabledBlastButton(blastButtons.blastx);
            setDisabledBlastButton(blastButtons.blastn);
            setDisabledBlastButton(blastButtons.tblastx);
            setDisabledBlastButton(blastButtons.tblastn);
            setDisabledBlastButton(blastButtons.blastp);
        }
    } else if (sequenceType === 'peptide') {
        if (selectedDatabase.includes('nucleotide')) {
            setEnabledBlastButton(blastButtons.tblastn);
            setDisabledBlastButton(blastButtons.blastn);
            setDisabledBlastButton(blastButtons.tblastx);
            setDisabledBlastButton(blastButtons.blastx);
            setDisabledBlastButton(blastButtons.blastp);
        } else if (selectedDatabase.includes('peptide')) {
            setEnabledBlastButton(blastButtons.blastp);
            setDisabledBlastButton(blastButtons.blastn);
            setDisabledBlastButton(blastButtons.tblastx);
            setDisabledBlastButton(blastButtons.blastx);
            setDisabledBlastButton(blastButtons.tblastn);
        }
    }
}

// 处理数据库选择框的点击事件
function databaseCheckboxEventHandler(event) {
    // 检查用户输入是否是核酸或蛋白质序列，如果输入非法，则提示用户并清除所有复选框
    const sequenceType = validateSequences();
    console.log('sequenceType:', sequenceType);
    if (!sequenceType) {
        cleanCheckboxes();
        return
    };

    const target = event.target;
    const selectedType = event.target.id.includes('nucleotide') ? 'nucleotide' : 'peptide';

    // 如果选中了一个复选框，立即判断当前选择的是核酸还是蛋白质数据库，然后禁用另外一种类型的复选框
    if (target.checked) {
        if (selectedType === 'nucleotide') {
            peptideCheckboxes.forEach(checkbox => {
                checkbox.disabled = true;
                checkbox.checked = false;
            });
        } else if (selectedType === 'peptide') {
            nucleotideCheckboxes.forEach(checkbox => {
                checkbox.disabled = true;
                checkbox.checked = false;
            });
        }
    } else {
        // 如果取消选择了一个复选框，则启用所有复选框，这样就可以选择其他数据库
        // 需要优化，如果取消了一个复选框，应该检查该类型的复选框是否还有被选中的，如果有，则不启用所有复选框
        checkboxes.forEach(checkbox => {
            checkbox.disabled = false;
        });

        // 检查是否所有复选框都未选中
        const allUnchecked = Array.from(checkboxes).every(checkbox => !checkbox.checked);
        // 如果所有选项都未选中，则禁用所有 BLAST 按钮
        if (allUnchecked) {
            disableAllBlastButtons();
        }
    }

    // 根据输入的序列类型和选择的数据库，更新 BLAST 按钮的状态
    updateBlastButtons(sequenceType);
}

// 处理blast按钮的点击事件
async function blastButtonEventHandler(event) {
    console.log('blastButtonEventHandler');

    // 如果之前已经有结果展示，点击BLAST按钮时，先隐藏结果展示
    let blastResultContainer = document.getElementById('blast_result_container');
    blastResultContainer.style.display = 'none';

    // 能够点击到这里，说明输入的序列是合法的，且至少选择了一个数据库
    let querySequence = sequenceInput.value;

    // 获取用户输入的序列类型，更新系统数据
    let querySeqType = validateSequences();
    updateData('currentBlastQuerySeqType', querySeqType);

    // 获取用户选择的数据库
    let selectedDatabases = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            selectedDatabases.push(cb.id);
        }
    });
    // 将每一个id按照下划线分割，取第一个元素，即数据库类型
    selectedDatabases = selectedDatabases.map(db => db.split('_')[0]);

    // 获取点击的BLAST按钮的id
    let blastFunction = event.target.id;

    // 根据blastFunction判断结果序列的类型，并更新系统数据
    let nucleotideResultFunction = ['blastn']
    let peptideResultFunction = ['blastp', 'tblastn', 'blastx', 'tblastx']
    let resultSeqType;
    if (nucleotideResultFunction.includes(blastFunction)) {
        resultSeqType = 'nucleotide';
    } else if (peptideResultFunction.includes(blastFunction)) {
        resultSeqType = 'peptide';
    }
    updateData('blastResultSeqType', resultSeqType);

    // 准备POST请求的数据
    let postData = {
        'querySequence': querySequence,
        'databases[]': selectedDatabases,
        'blastFunction': blastFunction
    };

    // 显示遮罩层和loading动画
    const overlayContainer = document.getElementById('overlay');
    overlayContainer.style.display = 'block';

    // 发送POST请求，获取BLAST结果
    let blastResult = await fetchPostData('blastResults', postData);
    console.table('blastResult:', blastResult);



    // 如果blastResult的data长度为0，显示error_tip提示框
    if (blastResult.data.length === 0) {
        console.log('No hits found');
        // 隐藏遮罩层和loading动画
        overlayContainer.style.display = 'none';

        let errorTip = document.getElementById('error_tip');
        errorTip.style.display = 'flex';
    } else {
        // 如果blastResult的data长度不为0，则更新系统数据并进行初始化操作
        updateData('blastResult', blastResult);

        // 获取queryIDList
        const queryIDList = await getData('blastQueryIDList');
        console.log('queryIDList:', queryIDList);

        // 将query的id列表填充到result_select select标签中
        const resultSelect = document.getElementById('result_select');
        fillSelect(resultSelect, queryIDList, 0);

        // 初始化blast结果展示区域
        await initialContentArea();

        // 初始化完成，隐藏遮罩层和loading动画，显示blast结果容器
        overlayContainer.style.display = 'none';
        blastResultContainer.style.display = 'block';

        // 为所有的details标签加上open属性
        let detailsElements = document.querySelectorAll('details');
        detailsElements.forEach(details => details.open = true);

        // 将页面滚动到blast_result_container
        scrollToTargetID('blast_result_container');
    }

}

// 为搜索框组件添加事件监听器
async function setUpBlastSubmitContainerEvents() {
    sequenceInput.addEventListener('input', sequenceInputEventHandler); // 为输入框添加输入事件监听器
    clearButton.addEventListener('click', clearButtonEventHandler); // 为清除按钮添加点击事件监听器
    exampleButtonNucleotide.addEventListener('click', () => exampleButtonEventHandler(exampleSequences.nucleotide)); // 为示例按钮添加点击事件监听器
    exampleButtonPeptide.addEventListener('click', () => exampleButtonEventHandler(exampleSequences.peptide)); // 为示例按钮添加点击事件监听器
    checkboxes.forEach(cb => cb.addEventListener('change', databaseCheckboxEventHandler)); // 为复选框添加点击事件监听器，无需显式传递事件对象，因为事件对象会自动传递给事件处理函数
    // 为所有 BLAST 按钮添加点击事件监听器
    Object.values(blastButtons).forEach(btn => btn.addEventListener('click', blastButtonEventHandler));
    // 初始化禁用所有复选框和 BLAST 按钮
    disableCheckboxes();
    disableAllBlastButtons();
}

export { setUpBlastSubmitContainerEvents };