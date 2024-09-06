
document.addEventListener('DOMContentLoaded', () => {
    const sequenceInput = document.getElementById('query_sequence');
    const clearButton = document.getElementById('clear_button');
    const exampleButtonNucleotide = document.getElementById('example_button_nucleotide');
    const exampleButtonPeptide = document.getElementById('example_button_peptide');
    const checkboxes = document.querySelectorAll('.checkbox_container input[type="checkbox"]');
    const blastButtons = {
        blastn: document.getElementById('blastn'),
        blastp: document.getElementById('blastp'),
        blastx: document.getElementById('blastx'),
        tblastn: document.getElementById('tblastn'),
        tblastx: document.getElementById('tblastx')
    };

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

    // 设置 BLAST 按钮为禁用状态，并添加 disabled 类用于样式控制
    function setDisabledBlastButton(button) {
        button.disabled = true;
        button.classList.add('disabled');
    }
    function setEnabledBlastButton(button) {
        button.disabled = false;
        button.classList.remove('disabled');
    }

    // 根据用户输入的序列类型和选择的数据库，更新 BLAST 按钮的状态
    function updateBlastButtons(sequenceType) {
        console.log('updateBlastButtons:', sequenceType);

        // 获取用户选择的数据库
        const selectedDatabase = [...checkboxes].find(cb => cb.checked)?.id || '';

        if (sequenceType === 'nucleotide') {
            if (selectedDatabase.includes('nucleotide')) {
                // blastButtons.blastn.disabled = false;
                // blastButtons.tblastx.disabled = false;
                // blastButtons.blastx.disabled = true;
                // blastButtons.tblastn.disabled = true;
                // blastButtons.blastp.disabled = true;
                setEnabledBlastButton(blastButtons.blastn);
                setEnabledBlastButton(blastButtons.tblastx);
                setDisabledBlastButton(blastButtons.blastx);
                setDisabledBlastButton(blastButtons.tblastn);
                setDisabledBlastButton(blastButtons.blastp);
            } else if (selectedDatabase.includes('peptide')) {
                // blastButtons.blastx.disabled = false;
                // blastButtons.blastn.disabled = true;
                // blastButtons.tblastx.disabled = true;
                // blastButtons.tblastn.disabled = true;
                // blastButtons.blastp.disabled = true;
                setEnabledBlastButton(blastButtons.blastx);
                setDisabledBlastButton(blastButtons.blastn);
                setDisabledBlastButton(blastButtons.tblastx);
                setDisabledBlastButton(blastButtons.tblastn);
                setDisabledBlastButton(blastButtons.blastp);
            }
        } else if (sequenceType === 'peptide') {
            if (selectedDatabase.includes('nucleotide')) {
                // blastButtons.tblastn.disabled = false;
                // blastButtons.blastn.disabled = true;
                // blastButtons.tblastx.disabled = true;
                // blastButtons.blastx.disabled = true;
                // blastButtons.blastp.disabled = true;
                setEnabledBlastButton(blastButtons.tblastn);
                setDisabledBlastButton(blastButtons.blastn);
                setDisabledBlastButton(blastButtons.tblastx);
                setDisabledBlastButton(blastButtons.blastx);
                setDisabledBlastButton(blastButtons.blastp);
            } else if (selectedDatabase.includes('peptide')) {
                // blastButtons.blastp.disabled = false;
                // blastButtons.blastn.disabled = true;
                // blastButtons.tblastx.disabled = true;
                // blastButtons.blastx.disabled = true;
                // blastButtons.tblastn.disabled = true;
                setEnabledBlastButton(blastButtons.blastp);
                setDisabledBlastButton(blastButtons.blastn);
                setDisabledBlastButton(blastButtons.tblastx);
                setDisabledBlastButton(blastButtons.blastx);
                setDisabledBlastButton(blastButtons.tblastn);
            }
        }
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

    // 监听输入框的输入事件
    sequenceInput.addEventListener('input', () => {
        if (sequenceInput.value.trim() === '') {
            disableCheckboxes();
            cleanCheckboxes();
            disableAllBlastButtons();
        } else {
            cleanCheckboxes();
            enableCheckboxes();
            disableAllBlastButtons();
        }
    });

    // 监听清除按钮的点击事件
    clearButton.addEventListener('click', () => {
        sequenceInput.value = '';
        disableCheckboxes();
        cleanCheckboxes();
        disableAllBlastButtons();
    });

    // 监听示例按钮的点击事件
    exampleButtonNucleotide.addEventListener('click', () => {
        sequenceInput.value =
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
GTCAAGGCGGGTGAGAACGATAGGGATGCCAGTTGAGTATGTTAGAG`;

        cleanCheckboxes();
        enableCheckboxes();
        disableAllBlastButtons();
    });
    exampleButtonPeptide.addEventListener('click', () => {
        sequenceInput.value =
            `>q1
MAPPALPRALTVLLLLLLASTARSQEEAPSPTAEPPASAPLAADYQLAHSPISHPPTASA
PSAADTAADAPSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPAPAADQIKAAN
ASASIGSGEPEEEEHREMNGGSKAGVVLGTFAAATVLGLGVFVWRKRRANIRRARYADYA
ARLELV

>q2
DRLRSSDCWLLLKEVALGGQPMDFPPELQEIIGAVVANVKGSPLAAKAIGQMISSTRST
RKWRALINTEISDNIIISSLQLSYQHLPSHLQRCFAYCSIFPTTWRFNRYDLVKMWMALG
FIQPPTDEGKGMEDL`;

        cleanCheckboxes();
        enableCheckboxes();
        disableAllBlastButtons();
    });

    // 监听复选框的选择事件
    // 获取核酸和蛋白质复选框，选择所有具有 checkbox_container 类名的元素，然后筛选出 id 包含 nucleotide 和 peptide 的元素
    const nucleotideCheckboxes = document.querySelectorAll('.checkbox_container input[id*="nucleotide"]');
    const peptideCheckboxes = document.querySelectorAll('.checkbox_container input[id*="peptide"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', (event) => {
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

            // 检查用户输入是否是核酸或蛋白质序列，如果输入非法，则提示用户并返回
            const sequenceType = validateSequences();
            console.log('sequenceType:', sequenceType);
            if (!sequenceType) {
                cleanCheckboxes();
                enableCheckboxes();
                return;
            }
            updateBlastButtons(sequenceType);
        });
    });

    // 初始化禁用所有复选框和 BLAST 按钮
    disableCheckboxes();
    disableAllBlastButtons();
});