import { createClickToCopyHandler } from './copyTextToClipboard.js';
import { showCustomAlert } from './showCustomAlert.js';
import { getData, validateGenomeID, fetchRawData2 } from './data.js';

// 更新结果详情的函数映射
// 因为haplotype和SNP共用一个result details容器, 所以不能用id映射到更新函数, 而是直接传入type进行分辨
let updateResultDetailsContainerFunctions = {
    haplotype: updateHaplotypeResultDetailsContainer,
    SNP: updateSNPResultDetailsContainer,
    transcript: updateTranscriptResultDetailsContainer,
    allTranscript: updateTranscriptResultDetailsContainer,

    hubNetworkNode: updateHubNetworkNodeResultDetailsContainer,
    hubNetworkEdge: updateHubNetworkEdgeResultDetailsContainer,

    singleNetworkNode: updateSingleNetworkNodeResultDetailsContainer,
    singleNetworkEdge: updateSingleNetworkEdgeResultDetailsContainer,

    haplotypeSNPChartHaplotype: updateHaplotypeSNPChartHaplotypeResultDetailsContainer,
    haplotypeSNPChartSNP: updateHaplotypeSNPChartSNPResultDetailsContainer,
};

async function fetchSequence(sequenceID, sequenceType) {
    const response = await fetchRawData2('getSeqWithID', { 'sequenceID': sequenceID, 'sequenceType': sequenceType });
    const responseData = response.data;
    if (responseData.length === 0) {
        showCustomAlert('No sequence data found for the specified ID', 'error');
        return '';
    }
    return responseData[sequenceType];
}

function generateHighlightSequenceElement(sequence, highlightStart, highlightEnd) {
    highlightStart = parseInt(highlightStart);
    highlightEnd = parseInt(highlightEnd);

    // 检查输入的有效性
    if (typeof sequence !== 'string' || highlightStart < 1 || highlightEnd > sequence.length || highlightStart > highlightEnd) {
        console.error('Invalid input for generateHighlightSequenceElement', sequence, highlightStart, highlightEnd);
        return;
    }

    // 将 1 基索引转换为 0 基索引
    const startIndex = highlightStart - 1;
    const endIndex = highlightEnd;

    // 获取需要高亮的片段
    const beforeHighlight = sequence.slice(0, startIndex);
    const highlighted = sequence.slice(startIndex, endIndex);
    const afterHighlight = sequence.slice(endIndex);

    // 生成HTML，使用 .highlight 样式包装高亮区域
    const highlightedHTML = `
    <span>${beforeHighlight}</span><span class="highlight_transcript_range">${highlighted}</span><span>${afterHighlight}</span>
  `;

    return highlightedHTML;
}


async function updateHaplotypeResultDetailsContainer(data, container) {
    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';

    let ID = data.geneID === '--' ? data.mosaicID : data.geneID;

    // 创建并添加新的内容
    const IDContent = `
        <div class="item_container">
            <h1 class="item_title">ID</h1>
            <p class="item_content">${ID}</p>
        </div>`;


    const areaTypeContent = `
        <div class="item_container">
            <h1 class="item_title">Area Type</h1>
            <p class="item_content">${data.areaType}</p>
        </div>`;
    const lengthContent = `
        <div class="item_container">
            <h1 class="item_title">Length</h1>
            <p class="item_content">${data.length}</p>
        </div>`;

    const nucleotideSequence = await fetchSequence(ID, 'nucleotide');
    const sequenceContainer = `
            <div class="sequence_item_container">
                <div class="sequence_container_header">
                    <h1 class="item_title">Nucleotide Sequence</h1>
                    <button class="copy_button" data_sequence="${nucleotideSequence}">Copy</button>
                </div>
                <div class="sequence_container">
                    <p class="item_content">${nucleotideSequence}</p>
                </div>
            </div>`;

    resultDetails.innerHTML = IDContent + areaTypeContent + lengthContent + sequenceContainer;
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
    //    < !--h1分别为mosaicID, areaType, SNPSite, SNPType, IsoSeqEvidence, RNASeqEvidence, haplotypeSNP, color 其在网页中的结构如下-- >
    // <div class="item_container">
    //     <h1 class="item_title">mosaicID</h1>
    //     <p class="item_content">GT42G000001</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">areaType</h1>
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
    const areaTypeContent = `
        <div class="item_container">
            <h1 class="item_title">areaType</h1>
            <p class="item_content">${data.areaType}</p>
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
                <h1 class="item_title">haplotypeSNP</h1>
                <button class="download_button">Download</button>
            </div>
            <div class="table_content_container">
                <div class="table_header">
                    <table>
                        <thead>
                            <tr>
                                <th>haplotype ID</th>
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
    resultDetails.innerHTML = mosaicIDContent + areaTypeContent + SNPSiteContent + SNPTypeContent + IsoSeqEvidenceContent + RNASeqEvidenceContent + haplotypeSNPContainer + colorContent;

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
        showCustomAlert('SNP of haplotype data downloaded!');
    });

}


async function updateTranscriptResultDetailsContainer(data, container) {
    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';

    // 创建并添加新的内容，h1分别为mosaicID, geneID, transcriptID, transcriptIndex, areaType, start, end, length, transcriptRange, transcriptLength, proteinSequence, nucleotideSequence，最后两个使用sequence_item_container结构
    // 将前三列ID合并为一列
    let ID;
    if (data.transcriptID === '--') {
        ID = data.geneID === '--' ? data.mosaicID : data.geneID;
    } else {
        ID = data.transcriptID;
    }

    // 去除 subjectStart 和 subjectEnd 中为了绘图设置的 marker 点
    let subjectStart;
    let subjectEnd;
    let areaType = data.areaType;
    if (areaType === 'softClip' || areaType === 'insertion') {
        subjectStart = '--';
        subjectEnd = '--';
    } else {
        subjectStart = data.subjectStart;
        subjectEnd = data.subjectEnd;
    }

    const IDContent = `
        <div class="item_container">
            <h1 class="item_title">ID</h1>
            <p class="item_content">${ID}</p>
        </div>`;

    const areaTypeContent = ` 
        <div class="item_container">
            <h1 class="item_title">Area Type</h1>
            <p class="item_content">${areaType}</p>
        </div>`;
    const lengthContent = `
        <div class="item_container">
            <h1 class="item_title">Length</h1>
            <p class="item_content">${data.length}</p>
        </div>`;
    const queryStartContent = `
        <div class="item_container">
            <h1 class="item_title">Query Start</h1>
            <p class="item_content">${data.queryStart}</p>
        </div>`;
    const queryEndContent = `    
        <div class="item_container">
            <h1 class="item_title">Query End</h1>
            <p class="item_content">${data.queryEnd}</p>
        </div>`;
    const subjectStartContent = `
        <div class="item_container">
            <h1 class="item_title">Subject Start</h1>
            <p class="item_content">${subjectStart}</p>
        </div>`;
    const subjectEndContent = `    
        <div class="item_container">
            <h1 class="item_title">Subject End</h1>
            <p class="item_content">${subjectEnd}</p>
        </div>`;

    let queryNucleotideSequence;
    let queryProteinSequence;
    let subjectNucleotideSequence;

    // 检查当前的比对目标序列类型是什么，并获取其核酸序列
    const currentTranscriptSubjectType = getData('currentTranscriptSubjectType');
    let subjectID = currentTranscriptSubjectType === 'mosaic' ? data.mosaicID : data.geneID;
    subjectNucleotideSequence = await fetchSequence(subjectID, 'nucleotide');

    // 获取 query 的核酸序列和蛋白质序列
    if (areaType === 'mosaic' || areaType === 'haplotype') {
        queryNucleotideSequence = 'None';
        queryProteinSequence = 'None';
    } else {
        queryNucleotideSequence = await fetchSequence(data.transcriptID, 'nucleotide');
        queryProteinSequence = await fetchSequence(data.transcriptID, 'peptide');
    }

    let querySequenceElement;
    let subjectSequenceElement;
    if (areaType === 'exon') {
        querySequenceElement = generateHighlightSequenceElement(queryNucleotideSequence, data.queryStart, data.queryEnd);
        subjectSequenceElement = generateHighlightSequenceElement(subjectNucleotideSequence, data.subjectStart, data.subjectEnd);
    } else if (areaType === 'softClip' || areaType === 'insertion') {
        querySequenceElement = generateHighlightSequenceElement(queryNucleotideSequence, data.queryStart, data.queryEnd);
        subjectSequenceElement = subjectNucleotideSequence;
    } else if (areaType === 'intron' || areaType === 'deletion') {
        querySequenceElement = queryNucleotideSequence;
        subjectSequenceElement = generateHighlightSequenceElement(subjectNucleotideSequence, data.subjectStart, data.subjectEnd);
    } else {
        querySequenceElement = queryNucleotideSequence;
        subjectSequenceElement = subjectNucleotideSequence;
    }

    const queryNucleotideSequenceContainer = `
        <div class="sequence_item_container">
            <div class="sequence_container_header">
                <h1 class="item_title">Query Nucleotide</h1>
                <button class="copy_button" data_sequence="${queryNucleotideSequence}">Copy</button>
            </div>
            <div class="sequence_container">
                <p class="item_content">${querySequenceElement}</p>
            </div>
        </div>`;
    const subjectNucleotideSequenceContainer = `
        <div class="sequence_item_container">
            <div class="sequence_container_header">
                <h1 class="item_title">Subject Nucleotide</h1>
                <button class="copy_button" data_sequence="${subjectNucleotideSequence}">Copy</button>
            </div>
            <div class="sequence_container">
                <p class="item_content">${subjectSequenceElement}</p>
            </div>
        </div>`;
    const queryProteinSequenceContainer = `
        <div class="sequence_item_container">
            <div class="sequence_container_header">
                <h1 class="item_title">Query Peptide</h1>
                <button class="copy_button" data_sequence="${queryProteinSequence}">Copy</button>
            </div>
            <div class="sequence_container">
                <p class="item_content">${queryProteinSequence}</p>
            </div>
        </div>`;

    resultDetails.innerHTML = IDContent + areaTypeContent + lengthContent + queryStartContent + queryEndContent + subjectStartContent + subjectEndContent + queryNucleotideSequenceContainer + subjectNucleotideSequenceContainer + queryProteinSequenceContainer;
}

function updateHubNetworkNodeResultDetailsContainer(data, container) {
    // data 格式
    // {
    //     "name": "GT42G027744",
    //     "symbolSize": 5.3423,
    //     "itemStyle": {
    //         "color": "#eb0973"
    //     },
    //     "totalDegree": 209,
    //     "inDegree": 8,
    //     "outDegree": 201
    // }

    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';

    // 创建并添加新的内容
    // <div class="header_container">
    //     <p class="header_text">Node</p>
    //     <div class="color_node"></div>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">ID</h1>
    //     <a class="item_content click_to_draw_single_network"
    //         title="Click to draw its single network">GT42G000932.SS.3</a>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">symbolSize</h1>
    //     <p class="item_content">5.0689</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">totalDegree</h1>
    //     <p class="item_content">159</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">inDegree</h1>
    //     <p class="item_content">9</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">outDegree</h1>
    //     <p class="item_content">150</p>
    // </div>

    const headerContainer = `
        <div class="header_container">
            <p class="header_text">Node</p>
            <div class="color_node" style="background-color:${data.itemStyle.color}"></div>
        </div>`;

    // 利用CSS类和CSS变量（Custom Properties）来控制样式。这样，你可以在CSS文件中定义所有必要的样式，
    // 并在JavaScript中只修改CSS变量的值，并保持剩余非CSS变量的应用不被内联样式覆盖
    const IDContent = `
        <div class="item_container">
            <h1 class="item_title">ID</h1>
            <a class="item_content click_to_draw_single_network"
                title="Click to draw its single network"
                href="./singleCoExpressionNetwork.html?searchKeyword=${data.name}"
                target="_blank"
                style="--color-gradient-start: ${data.itemStyle.color}; --color-gradient-end: ${data.itemStyle.color};">${data.name}</a>
        </div>`;
    const symbolSizeContent = `
        <div class="item_container">
            <h1 class="item_title">symbolSize</h1>
            <p class="item_content">${data.symbolSize}</p>
        </div>`;
    const totalDegreeContent = `
        <div class="item_container">
            <h1 class="item_title">totalDegree</h1>
            <p class="item_content">${data.totalDegree}</p>
        </div>`;
    const inDegreeContent = `
        <div class="item_container">
            <h1 class="item_title">inDegree</h1>
            <p class="item_content">${data.inDegree}</p>
        </div>`;
    const outDegreeContent = `
        <div class="item_container">
            <h1 class="item_title">outDegree</h1>
            <p class="item_content">${data.outDegree}</p>
        </div>`;
    resultDetails.innerHTML = headerContainer + IDContent + symbolSizeContent + totalDegreeContent + inDegreeContent + outDegreeContent;

    // 为了实现调用方对异步操作的同步，这里个函数虽然没有异步操作，但是也要返回一个空的Promise对象
    return Promise.resolve();
}

function updateHubNetworkEdgeResultDetailsContainer(data, container) {
    // data格式
    // {
    //     "source": "GT42G010453",
    //     "target": "GT42G006919",
    //     "lineStyle": {
    //         "color": "#e990ab"
    //     },
    //     "weight": 2.9088
    // }

    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';

    // 创建并添加新的内容
    // <div class="header_container">
    //     <p class="header_text">Edge</p>
    //     <div class="color_line"></div>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">Weight</h1>
    //     <p class="item_content">4.2341</p>
    // </div>

    // <div class="item_container">
    //     <h1 class="item_title">Source</h1>
    //     <a class="item_content click_to_draw_single_network"
    //         title="Click to draw its single network">GT42G000005.SS.3.112</a>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">Target</h1>
    //     <a class="item_content click_to_draw_single_network"
    //         title="Click to draw its single network">GT42G000005.SS.123.112</a>
    // </div>

    const headerContainer = `
        <div class="header_container">
            <p class="header_text">Edge</p>
            <div class="color_line" style="background-color:${data.lineStyle.color}"></div>
        </div>`;
    const weightContent = `
        <div class="item_container">
            <h1 class="item_title">Weight</h1>
            <p class="item_content">${data.weight}</p>
        </div>`;


    // 先判断当前的网络是那种类型的网络，这里使用.then()方法来处理异步操作，并在调用处也使用.then()方法来对异步操作进行同步
    return validateGenomeID(data.source)
        .then(response => {
            const IDType = response.type;
            const dataType = IDType + 'HubNetworkGraphJSON';
            // 从全局变量中获取mosaicHubNetworkGraphJSON数据，并根据source和target的name属性找到对应的itemStyle.color
            const hubNetworkGraphJSON = getData(dataType);
            const sourceNodeColor = hubNetworkGraphJSON.nodes.find(node => node.name === data.source).itemStyle.color;
            const sourceContent = `
        <div class="item_container">
            <h1 class="item_title">Source</h1>
            <a class="item_content click_to_draw_single_network" 
            title="Click to draw its single network"
            href="./singleCoExpressionNetwork.html?searchKeyword=${data.source}"
            target="_blank"
            style="--color-gradient-start: ${sourceNodeColor}; --color-gradient-end: ${sourceNodeColor};">${data.source}</a>
        </div>`;
            const targetNodeColor = hubNetworkGraphJSON.nodes.find(node => node.name === data.target).itemStyle.color;
            const targetContent = `
        <div class="item_container">
            <h1 class="item_title">Target</h1>
            <a class="item_content click_to_draw_single_network" 
            title="Click to draw its single network"
            href="./singleCoExpressionNetwork.html?searchKeyword=${data.target}"
            target="_blank"
            style="--color-gradient-start: ${targetNodeColor}; --color-gradient-end: ${targetNodeColor};">${data.target}</a>
        </div>`;

            resultDetails.innerHTML = headerContainer + weightContent + sourceContent + targetContent;
        })
        .catch(error => {
            console.error('Error:', error);
        });


}

function updateSingleNetworkNodeResultDetailsContainer(data, container) {
    // data 格式
    // {
    //     "name": "GT42G000001",
    //     "symbolSize": "1.6094",
    //         "itemStyle": {
    //     "color": "#96b8db"
    //     },
    //     "totalDegree": 5,
    //     "inDegree": 5,
    //     "outDegree": 0,
    //     "adjacency": [
    //         "GT42G017113",
    //         "GT42G019985",
    //         "GT42G019032",
    //         "GT42G008514",
    //         "GT42G013405"
    //     ]
    // }

    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';



    // 创建并添加新的内容
    // <div class="header_container">
    //     <p class="header_text">Node</p>
    //     <div class="color_node"></div>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">ID</h1>
    //     <a class="item_content click_to_draw_single_network"
    //         title="Click to draw its single network">GT42G000932.SS.3</a>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">symbolSize</h1>
    //     <p class="item_content">5.0689</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">totalDegree</h1>
    //     <p class="item_content">159</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">inDegree</h1>
    //     <p class="item_content">9</p>
    // </div>
    // <div class="item_container">
    //     <h1 class="item_title">outDegree</h1>
    //     <p class="item_content">150</p>
    // </div>
    // <div class="table_container">
    //     <div class="table_header">
    //         <table>
    //             <thead>
    //                 <tr>
    //                     <th>Adjacent Nodes</th>
    //                 </tr>
    //             </thead>
    //         </table>
    //     </div>
    //     <div class="table_content">
    //         <table>

    //             <tbody>
    //                 <tr>
    //                     <td><a class="click_to_draw_single_network"
    //                             title="Click to draw its single network">GT42G000932.SS.3</a>
    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td><a class="click_to_draw_single_network"
    //                             title="Click to draw its single network">GT42G000932.SS.3</a>
    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td><a class="click_to_draw_single_network"
    //                             title="Click to draw its single network">GT42G000932.SS.3</a>
    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td><a class="click_to_draw_single_network"
    //                             title="Click to draw its single network">GT42G000932.SS.3</a>
    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td><a class="click_to_draw_single_network"
    //                             title="Click to draw its single network">GT42G000932.SS.3</a>
    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td><a class="click_to_draw_single_network"
    //                             title="Click to draw its single network">GT42G000932.SS.3</a>
    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td><a class="click_to_draw_single_network"
    //                             title="Click to draw its single network">GT42G000932.SS.3</a>
    //                     </td>
    //                 </tr>
    //             </tbody>
    //         </table>
    //     </div>

    const headerContainer = `
        <div class="header_container">
            <p class="header_text">Node</p>
            <div class="color_node" style="background-color:${data.itemStyle.color}"></div>
        </div>`;
    const IDContent = `
        <div class="item_container">
            <h1 class="item_title">ID</h1>
            <a class="item_content click_to_draw_single_network"
                title="Click to draw its single network"
                style="--color-gradient-start: ${data.itemStyle.color}; --color-gradient-end: ${data.itemStyle.color};">${data.name}</a>
        </div>`;
    const symbolSizeContent = `
        <div class="item_container">
            <h1 class="item_title">symbolSize</h1>
            <p class="item_content">${data.symbolSize}</p>
        </div>`;
    const totalDegreeContent = `
        <div class="item_container">
            <h1 class="item_title">totalDegree</h1>
            <p class="item_content">${data.totalDegree}</p>
        </div>`;
    const inDegreeContent = `
        <div class="item_container">
            <h1 class="item_title">inDegree</h1>
            <p class="item_content">${data.inDegree}</p>
        </div>`;
    const outDegreeContent = `
        <div class="item_container">
            <h1 class="item_title">outDegree</h1>
            <p class="item_content">${data.outDegree}</p>
        </div>`;



    return validateGenomeID(data.name)
        .then(response => {

            const IDType = response.type;
            const dataType = IDType + 'SingleNetworkGraphJSON';
            // 从全局变量中获取mosaicHubNetworkGraphJSON数据，并根据source和target的name属性找到对应的itemStyle.color
            const singleNetworkGraphJSON = getData(dataType);
            const nodes = singleNetworkGraphJSON.nodes;

            // 为adjacency数组中的元素创建列表
            let tableContent = data.adjacency.map(adjacentNode => {
                // 从nodes数组中找到匹配的节点
                let nodeData = nodes.find(node => node.name === adjacentNode);

                if (nodeData) {
                    // 如果找到相应的节点数据，则使用该数据来设置<a>标签的样式
                    return `<tr>
                    <td>
                        <a class="item_content click_to_draw_single_network"
                           title="Click to draw its single network"
                           style="--color-gradient-start: ${nodeData.itemStyle.color}; --color-gradient-end: ${nodeData.itemStyle.color};">${nodeData.name}</a>
                    </td>
                </tr>`;
                } else {
                    // 如果没有找到匹配的节点数据，可能需要返回一个默认的或错误处理的行
                    return `<tr>
                    <td>
                        <a class="item_content click_to_draw_single_network"
                           title="Click to draw its single network">${adjacentNode}</a>
                    </td>
                </tr>`;
                }
            }).join('');

            const adjacencyContainer = `
                <div class="table_container">
                    <div class="table_header">
                        <table>
                            <thead>
                                <tr>
                                    <th>Adjacent Nodes</th>
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
                </div>`;
            resultDetails.innerHTML = headerContainer + IDContent + symbolSizeContent + totalDegreeContent + inDegreeContent + outDegreeContent + adjacencyContainer;


        })
        .catch(error => {
            console.error('Error:', error);
        });


}


function updateSingleNetworkEdgeResultDetailsContainer(data, container) {
    // data 格式
    // {
    //     "source": "GT42G019032",
    //     "target": "GT42G000001",
    //     "lineStyle": {
    //         "width": "3.0414",
    //         "color": "#39a6dd"
    //     }
    // }

    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';

    const headerContainer = `
        <div class="header_container">
            <p class="header_text">Edge</p>
            <div class="color_line" style="background-color:${data.lineStyle.color}"></div>
        </div>`;
    const weightContent = `
        <div class="item_container">
            <h1 class="item_title">Weight</h1>
            <p class="item_content">${data.lineStyle.width}</p>
        </div>`;
    // const sourceContent = `
    //     <div class="item_container">
    //         <h1 class="item_title">Source</h1>
    //         <a class="item_content click_to_draw_single_network" title="Click to draw its single network">${data.source}</a>
    //     </div>`;
    // const targetContent = `
    //     <div class="item_container">
    //         <h1 class="item_title">Target</h1>
    //         <a class="item_content click_to_draw_single_network" title="Click to draw its single network">${data.target}</a>
    //     </div>`;


    // 先判断当前的网络是那种类型的网络，这里使用.then()方法来处理异步操作，并在调用处也使用.then()方法来对异步操作进行同步
    return validateGenomeID(data.source)
        .then(response => {
            const IDType = response.type;
            const dataType = IDType + 'SingleNetworkGraphJSON';
            // 从全局变量中获取mosaicHubNetworkGraphJSON数据，并根据source和target的name属性找到对应的itemStyle.color
            const singleNetworkGraphJSON = getData(dataType);
            const sourceNodeColor = singleNetworkGraphJSON.nodes.find(node => node.name === data.source).itemStyle.color;
            const sourceContent = `
        <div class="item_container">
            <h1 class="item_title">Source</h1>
            <a class="item_content click_to_draw_single_network" title="Click to draw its single network"
            style="--color-gradient-start: ${sourceNodeColor}; --color-gradient-end: ${sourceNodeColor};">${data.source}</a>
        </div>`;
            const targetNodeColor = singleNetworkGraphJSON.nodes.find(node => node.name === data.target).itemStyle.color;
            const targetContent = `
        <div class="item_container">
            <h1 class="item_title">Target</h1>
            <a class="item_content click_to_draw_single_network" title="Click to draw its single network"
            style="--color-gradient-start: ${targetNodeColor}; --color-gradient-end: ${targetNodeColor};">${data.target}</a>
        </div>`;

            resultDetails.innerHTML = headerContainer + weightContent + sourceContent + targetContent;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function updateHaplotypeSNPChartHaplotypeResultDetailsContainer(data, container) {
    console.log('data:', data);
    console.log('container:', container);

    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';


    const areaTypeContent = `
                <div class="item_container">
                    <h1 class="item_title">Area Type</h1>
                    <p class="item_content">${data.areaType}</p>
                </div>`;

    let ID = data.geneID === '--' ? data.mosaicID : data.geneID;

    // 创建并添加新的内容
    const IDContent = `
        <div class="item_container">
            <h1 class="item_title">ID</h1>
            <p class="item_content">${ID}</p>
        </div>`;

    const lengthContent = `
                <div class="item_container">
                    <h1 class="item_title">Length</h1>
                    <p class="item_content">${data.length}</p>
                </div>`;

    let tableContent = data.SNPTable.map(item => { return `<tr><td>${item[0]}</td><td>${item[1]}</td></tr>` }).join('');

    const haplotypeSNPTableContent = `
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
                                        <th>SNP Site</th>
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

    const nucleotideSequence = await fetchSequence(ID, 'nucleotide');
    const sequenceContainer = `
            <div class="sequence_item_container">
                <div class="sequence_container_header">
                    <h1 class="item_title">Nucleotide Sequence</h1>
                    <button class="copy_button" data_sequence="${nucleotideSequence}">Copy</button>
                </div>
                <div class="sequence_container">
                    <p class="item_content">${nucleotideSequence}</p>
                </div>
            </div>`;

    resultDetails.innerHTML = areaTypeContent + IDContent + lengthContent + haplotypeSNPTableContent + sequenceContainer;

    // 为这部分的表格结构中的下载按钮单独添加下载按钮事件监听器，这个地方可以类似于copyTextToClipboards.js使用工厂函数独立，但是前提是要将haplotypeSNPs提前存储起来
    container.querySelector('.download_button').addEventListener('click', function () {
        const csvContent = "data:text/csv;charset=utf-8," + data.SNPTable.map(snp => snp.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "snp_table.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
        showCustomAlert('SNP table downloaded!');
    });
}

function updateHaplotypeSNPChartSNPResultDetailsContainer(data, container) {
    console.log('data:', data);
    console.log('container:', container);

    // 定位到result_details容器
    const resultDetails = container.querySelector('.result_details');

    // 清空现有内容
    resultDetails.innerHTML = '';

    let tableContent = data.SNPTable.map(item => { return `<tr><td>${item[0]}</td><td>${item[1]}</td></tr>` }).join('');

    const areaTypeContent = `
                <div class="item_container">
                    <h1 class="item_title">Area Type</h1>
                    <p class="item_content">${data.areaType}</p>
                </div>`;
    const baseContent = `
                <div class="item_container">
                    <h1 class="item_title">Base</h1>
                    <div style="width: 10px; height: 10px; margin: 10px; border-radius: 50%; background-color: ${data.selectedSNPBaseColor}"></div>
                    <p class="item_content">${data.selectedSNPBase}</p>
                </div>`;
    const mosaicIDContent = `
                <div class="item_container">
                    <h1 class="item_title">Mosaic ID</h1>
                    <p class="item_content">${data.mosaicID}</p>
                </div>`;
    const SNPSiteContent = `
                <div class="item_container">
                    <h1 class="item_title">SNP Site</h1>
                    <p class="item_content">${data.SNPSite}</p>
                </div>`;
    const SNPTypeContent = `
                <div class="item_container">
                    <h1 class="item_title">SNP Type</h1>
                    <p class="item_content">${data.SNPType}</p>
                </div>`;
    const IsoSeqEvidenceContent = `
                <div class="item_container">
                    <h1 class="item_title">Iso-Seq Evidence</h1>
                    <p class="item_content">${data.IsoSeqEvidence}</p>
                </div>`;
    const RNASeqEvidenceContent = `
                <div class="item_container">
                    <h1 class="item_title">RNA-Seq Evidence</h1>
                    <p class="item_content">${data.RNASeqEvidence}</p>
                </div>`;
    const haplotypeSNPTableContent = `
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
                                        <th>Haplotype ID</th>
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

    resultDetails.innerHTML = areaTypeContent + baseContent + mosaicIDContent + SNPSiteContent + SNPTypeContent + IsoSeqEvidenceContent + RNASeqEvidenceContent + haplotypeSNPTableContent;

    // 为这部分的表格结构中的下载按钮单独添加下载按钮事件监听器，这个地方可以类似于copyTextToClipboards.js使用工厂函数独立，但是前提是要将haplotypeSNPs提前存储起来
    container.querySelector('.download_button').addEventListener('click', function () {
        const csvContent = "data:text/csv;charset=utf-8," + data.SNPTable.map(snp => snp.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "snp_table.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
        showCustomAlert('SNP table downloaded!');
    });
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

    // 返回更新函数（如果存在），注意这里不能直接执行更新函数，因为有的更新函数是异步的，例如updateSingleNetworkNodeResultDetailsContainer
    // 对于异步的更新函数，需要在调用的地方进行异步处理而不是在这里进行异步处理
    if (updateFunction) {
        return updateFunction(dataValue, container);
    } else {
        console.error(`No update function found for type: ${dataType}`);
    }
}


export { updateResultDetailsContainer };