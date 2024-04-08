import { createClickToCopyHandler } from './copyTextToClipboard.js';

// 更新结果详情的函数映射
// 因为haplotype和SNP共用一个result details容器, 所以不能用id映射到更新函数, 而是直接传入type进行分辨
let updateResultDetailsContainerFunctions = {
    haplotype: updateHaplotypeResultDetailsContainer,
    SNP: updateSNPResultDetailsContainer,
    transcript: updateTranscriptResultDetailsContainer,
};

function updateHaplotypeResultDetailsContainer(data, container) {
    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';

    // 创建并添加新的内容
    const mosaicIDContent = `
        <div class="item_container">
            <h1 class="item_title">mosaicID</h1>
            <p class="item_content">${data.mosaicID}</p>
        </div>`;
    const geneIDContent = `
        <div class="item_container">
            <h1 class="item_title">geneID</h1>
            <p class="item_content">${data.geneID}</p>
        </div>`;
    const geneTypeContent = `
        <div class="item_container">
            <h1 class="item_title">geneType</h1>
            <p class="item_content">${data.geneType}</p>
        </div>`;
    const lengthContent = `
        <div class="item_container">
            <h1 class="item_title">length</h1>
            <p class="item_content">${data.length}</p>
        </div>`;

    const sequenceContainer = `
        <div class="sequence_item_container">
            <div class="sequence_container_header">
                <h1 class="item_title">nucleotideSequence</h1>
                <button class="copy_button" data_sequence="${data.nucleotideSequence}">Click to Copy</button>
            </div>
            <div class="sequence_container">
                <p class="item_content">${data.nucleotideSequence}</p>
            </div>
        </div>`;

    resultDetails.innerHTML = mosaicIDContent + geneIDContent + geneTypeContent + lengthContent + sequenceContainer;
}

function updateSNPResultDetailsContainer(data, container) {
    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';

    // 拆分haplotypeSNP并创建表格 GT42G000001.SO.1:C; GT42G000001.SS.1:A -> [['GT42G000001.SO.1', 'C'], ['GT42G000001.SS.1', 'A']]
    const haplotypeSNPs = data.haplotypeSNP.split('; ').map(entry => entry.split(':'));
    let tableContent = haplotypeSNPs.map(snp => `<tr><td>${snp[0]}</td><td>${snp[1]}</td></tr>`).join('');

    // 创建并添加新的内容
    //    < !--h1分别为mosaicID, geneType, SNPSite, SNPType, IsoSeqEvidence, RNASeqEvidence, haplotypeSNP, color 其在网页中的结构如下-- >
    // <div class="item_container">
    //     <h1 class="item_title">mosaicID</h1>
    //     <p class="item_content">GT42G000001</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">geneType</h1>
    //     <p class="item_content">mosaic</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">SNPSite</h1>
    //     <p class="item_content">1</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">SNPType</h1>
    //     <p class="item_content">C/T</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">IsoSeqEvidence</h1>
    //     <p class="item_content">IsoSeq</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">RNASeqEvidence</h1>
    //     <p class="item_content">RNASeq</p>
    // </div>
    // <div class="table_item_container">
    //     <div class="table_header_container">
    //         <h1 class="item_title">Haplotype SNP</h1>
    //         <button class="download_button">Download</button>
    //     </div>
    //     <div class="table_content_container">
    //         <div class="table_header">
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>SNP ID</th>
    //                         <th>Type</th>
    //                     </tr>
    //                 </thead>
    //             </table>
    //         </div>
    //         <div class="table_content">
    //             <table>
    //                 <tbody>
    //                     <tr>
    //                         <td>GT42G000001.SO.1</td>
    //                         <td>C</td>
    //                     </tr>
    //                 </tbody>
    //             </table>

    //         </div>
    //     </div>
    // </div>

    // <div class="item_container">
    //     <h1 class="item_title">Color</h1>
    //     <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #003666"></div>
    // </div>
    const mosaicIDContent = `
        <div class="item_container">
            <h1 class="item_title">mosaicID</h1>
            <p class="item_content">${data.mosaicID}</p>
        </div>`;
    const geneTypeContent = `
        <div class="item_container">
            <h1 class="item_title">geneType</h1>
            <p class="item_content">${data.geneType}</p>
        </div>`;
    const SNPSiteContent = `
        <div class="item_container">
            <h1 class="item_title">SNPSite</h1>
            <p class="item_content">${data.SNPSite}</p>
        </div>`;
    const SNPTypeContent = `
        <div class="item_container">
            <h1 class="item_title">SNPType</h1>
            <p class="item_content">${data.SNPType}</p>
        </div>`;
    const IsoSeqEvidenceContent = `
        <div class="item_container">
            <h1 class="item_title">IsoSeqEvidence</h1>
            <p class="item_content">${data.IsoSeqEvidence}</p>
        </div>`;
    const RNASeqEvidenceContent = `
        <div class="item_container">
            <h1 class="item_title">RNASeqEvidence</h1>
            <p class="item_content">${data.RNASeqEvidence}</p>
        </div>`;
    const haplotypeSNPContainer = `
        <div class="table_item_container">
            <div class="table_header_container">
                <h1 class="item_title">Haplotype SNP</h1>
                <button class="download_button">Download</button>
            </div>
            <div class="table_content_container">
                <div class="table_header">
                    <table>
                        <thead>
                            <tr>
                                <th>SNP ID</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="table_content">
                    <table>
                        <tbody>
                            ${tableContent}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
    const colorContent = `
        <div class="item_container">
            <h1 class="item_title">Color</h1>
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${data.color}"></div>
        </div>`;
    resultDetails.innerHTML = mosaicIDContent + geneTypeContent + SNPSiteContent + SNPTypeContent + IsoSeqEvidenceContent + RNASeqEvidenceContent + haplotypeSNPContainer + colorContent;

    // 为这部分的表格结构中的下载按钮单独添加下载按钮事件监听器，这个地方可以类似于copyTextToClipboards.js使用工厂函数独立，但是前提是要将haplotypeSNPs提前存储起来
    container.querySelector('.download_button').addEventListener('click', function () {
        const csvContent = "data:text/csv;charset=utf-8," + haplotypeSNPs.map(snp => snp.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "haplotype_snp_data.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    });

}

function updateTranscriptResultDetailsContainer(data, container) {
    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';

    // 创建并添加新的内容，h1分别为mosaicID, geneID, transcriptID, transcriptIndex, isExon, start, end, length, transcriptRange, transcriptLength, proteinSequence, nucleotideSequence，最后两个使用sequence_item_container结构
    const mosaicIDContent = `
        <div class="item_container">
            <h1 class="item_title">mosaicID</h1>
            <p class="item_content">${data.mosaicID}</p>
        </div>`;
    const geneIDContent = `
        <div class="item_container">
            <h1 class="item_title">geneID</h1>
            <p class="item_content">${data.geneID}</p>
        </div>`;
    const transcriptIDContent = `
        <div class="item_container">
            <h1 class="item_title">transcriptID</h1>
            <p class="item_content">${data.transcriptID}</p>
        </div>`;
    const transcriptIndexContent = `
        <div class="item_container">
            <h1 class="item_title">transcriptIndex</h1>
            <p class="item_content">${data.transcriptIndex}</p>
        </div>`;
    const isExonContent = ` 
        <div class="item_container">
            <h1 class="item_title">isExon</h1>
            <p class="item_content">${data.isExon}</p>
        </div>`;
    const startContent = `
        <div class="item_container">
            <h1 class="item_title">start</h1>
            <p class="item_content">${data.start}</p>
        </div>`;
    const endContent = `    
        <div class="item_container">
            <h1 class="item_title">end</h1>
            <p class="item_content">${data.end}</p>
        </div>`;
    const lengthContent = `
        <div class="item_container">
            <h1 class="item_title">length</h1>
            <p class="item_content">${data.length}</p>
        </div>`;
    const transcriptRangeContent = `
        <div class="item_container">
            <h1 class="item_title">transcriptRange</h1>
            <p class="item_content">${data.transcriptRange}</p>
        </div>`;
    const transcriptLengthContent = `
        <div class="item_container">
            <h1 class="item_title">transcriptLength</h1>
            <p class="item_content">${data.transcriptLength}</p>
        </div>`;
    const proteinSequenceContainer = `
        <div class="sequence_item_container">
            <div class="sequence_container_header">
                <h1 class="item_title">proteinSequence</h1>
                <button class="copy_button" data_sequence="${data.proteinSequence}">Click to Copy</button>
            </div>
            <div class="sequence_container">
                <p class="item_content">${data.proteinSequence}</p>
            </div>
        </div>`;
    const nucleotideSequenceContainer = `
        <div class="sequence_item_container">
            <div class="sequence_container_header">
                <h1 class="item_title">nucleotideSequence</h1>
                <button class="copy_button" data_sequence="${data.nucleotideSequence}">Click to Copy</button>
            </div>
            <div class="sequence_container">
                <p class="item_content">${data.nucleotideSequence}</p>
            </div>
        </div>`;

    resultDetails.innerHTML = mosaicIDContent + geneIDContent + transcriptIDContent + transcriptIndexContent + isExonContent + startContent + endContent + lengthContent + transcriptRangeContent + transcriptLengthContent + proteinSequenceContainer + nucleotideSequenceContainer;
}

// 这里传入的data是一个对象，包含了type和data两个属性, type用于选择对应的更新函数，data用于传入更新函数的数据
// 因为haplotype和SNP共用一个result details容器, 所以不能用id映射到更新函数, 而是直接传入type进行分辨
function updateResultDetailsContainer(data, container) {
    // 获取数据的类型
    const dataType = data.type;
    const dataValue = data.data;
    console.log(`Updating container for type: ${dataType}`);

    // 获取对应的更新函数
    const updateFunction = updateResultDetailsContainerFunctions[dataType];
    console.log(updateFunction);

    // 调用更新函数（如果存在）
    if (updateFunction) {
        updateFunction(dataValue, container);
    } else {
        console.error(`No update function found for type: ${dataType}`);
    }
}


// 传入的是result_details_container结构的id
function setUpResultDetailsContainerEventListeners(containerSelector) {
    const container = document.querySelector(containerSelector);
    const clickToCopyHandler = createClickToCopyHandler(); // 生成点击复制按钮的事件处理器
    container.addEventListener('click', clickToCopyHandler);
}

export { updateResultDetailsContainer, setUpResultDetailsContainerEventListeners };