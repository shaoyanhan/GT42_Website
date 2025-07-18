import { getData, fetchRawData2 } from "./data.js";
import { showCustomAlert } from "./showCustomAlert.js";
import { downloadFile } from "./downloadFile.js";
import { splitDetailedTableResultByIndex } from "./initialContentAreaBlast.js";

let blastDataArray = [];
let currentResultSeqType = ''; // 当前展示的序列类型，跟随系统数据集改变
let currentQueryIndex = 0; // 当前加载到的query索引，跟随系统数据集改变
let currentHitIndex = 0; // 当前加载到的对象索引，从0开始
let currentHspIndex = 0; // 当前加载到的hsp索引，从0开始
const chunkSize = 50; // 每行展示的碱基数量
const batchSize = 10; // 每次加载的hit结果数量

function getSearchResultByIndex(queryIndex) {
    return blastDataArray[queryIndex].report.results.search;
}
function getQueryIDByIndex(queryIndex) {
    let queryResult = getSearchResultByIndex(queryIndex);
    return queryResult.query_title ? queryResult.query_title : queryResult.query_id;
}
function getQueryLenByIndex(queryIndex) {
    return getSearchResultByIndex(queryIndex).query_len;
}
function getHitArrayByIndex(queryIndex) {
    return getSearchResultByIndex(queryIndex).hits;
}
function getHitByIndex(queryIndex, hitIndex) {
    return getHitArrayByIndex(queryIndex)[hitIndex];
}
function getSubjectIDByIndex(queryIndex, hitIndex) {
    return getHitByIndex(queryIndex, hitIndex).description[0].id;
}
function getSubjectLenByIndex(queryIndex, hitIndex) {
    return getHitByIndex(queryIndex, hitIndex).len;
}
function getHspArrayByIndex(queryIndex, hitIndex) {
    return getHitByIndex(queryIndex, hitIndex).hsps;
}
function getHspByIndex(queryIndex, hitIndex, hspIndex) {
    return getHspArrayByIndex(queryIndex, hitIndex)[hspIndex];
}

// 实现动态更新的效果
let dynamicValues = {
    // 当前Query对应的主要搜索结果，包含query信息，hits信息，stat信息
    get currentSearchResult() {
        return blastDataArray[currentQueryIndex].report.results.search;
    },
    // 检查是否存在query_title，如果存在则使用query_title，否则使用query_id
    get currentQueryID() {
        return this.currentSearchResult.query_title ? this.currentSearchResult.query_title : this.currentSearchResult.query_id;
    },
    get currentQueryLen() {
        return this.currentSearchResult.query_len;
    },
    get currentHitArray() {
        return this.currentSearchResult.hits;
    },
    get currentHit() {
        return this.currentHitArray[currentHitIndex];
    },
    get currentSubjectID() {
        return this.currentHit.description[0].id;
    },
    get currentSubjectLen() {
        return this.currentHit.len;
    },
    get currentHspArray() {
        return this.currentHit.hsps;
    },
    get currentHsp() {
        return this.currentHspArray[currentHspIndex];
    }
};

function getObjectDataByIndex(queryIndex, hitIndex, hspIndex) {
    let queryInfo = {
        query_id: getQueryIDByIndex(queryIndex),
        query_len: getQueryLenByIndex(queryIndex),
    };
    let subjectInfo = {
        subject_id: getSubjectIDByIndex(queryIndex, hitIndex),
        subject_len: getSubjectLenByIndex(queryIndex, hitIndex)
    };
    let hsp = getHspByIndex(queryIndex, hitIndex, hspIndex);
    let hspCount = getHspArrayByIndex(queryIndex, hitIndex).length;
    return {
        "queryIndex": queryIndex,
        "hitIndex": hitIndex,
        "hspCount": hspCount,
        "hspIndex": hspIndex,
        ...queryInfo,
        ...subjectInfo,
        ...hsp
    };
}

// 生成result details的内容，不能使用update函数替代，因为核酸和蛋白的result details结构是不同的，要先生成结构才能update
function getResultDetails(objectData) {
    if (currentResultSeqType === 'nucleotide') {
        return `
            <div class="item_container">
                <div class="item_title">Query Index</div>
                <div class="item_content query_index">${objectData.queryIndex + 1}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit Index</div>
                <div class="item_content hit_index">${objectData.hitIndex + 1}</div>
            </div>
            <div class="item_container">
                <div class="item_title">HSP Count</div>
                <div class="item_content hsp_count">${objectData.hspCount}</div>
            </div>
            <div class="item_container">
                <div class="item_title">HSP Index</div>
                <div class="item_content hsp_index">${objectData.hspIndex + 1}</div>
                <button class="hsp_switch previous_hsp" query-index="${objectData.queryIndex}" hit-index="${objectData.hitIndex}" hsp-index="${objectData.hspIndex}"
                    hsp-count="${objectData.hspCount}">Previous</button>
                <button class="hsp_switch next_hsp" query-index="${objectData.queryIndex}" hit-index="${objectData.hitIndex}" hsp-index="${objectData.hspIndex}"
                    hsp-count="${objectData.hspCount}">Next</button>
            </div>
            <div class="item_container">
                <div class="item_title">Query ID</div>
                <div class="item_content query_id">${objectData.query_id}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query Length</div>
                <div class="item_content query_len">${objectData.query_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Subject ID</div>
                <div class="item_content subject_id">
                    <a href="./searchBox.html?searchKeyword=${objectData.subject_id}" target="_blank" class="result_details_dynamic_link" data-replace="${objectData.subject_id}" title="click to resource page">
                        <span>${objectData.subject_id}</span>
                    </a>
                </div>
            </div>
            <div class="item_container">
                <div class="item_title">Subject Length</div>
                <div class="item_content subject_len">${objectData.subject_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Bit Score</div>
                <div class="item_content bit_score">${objectData.bit_score}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Score</div>
                <div class="item_content score">${objectData.score}</div>
            </div>
            <div class="item_container">
                <div class="item_title">E-value</div>
                <div class="item_content evalue">${objectData.evalue}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Identity</div>
                <div class="item_content identity">${objectData.identity}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query From</div>
                <div class="item_content query_from">${objectData.query_from}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query To</div>
                <div class="item_content query_to">${objectData.query_to}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query Strand</div>
                <div class="item_content query_strand">${objectData.query_strand}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit From</div>
                <div class="item_content hit_from">${objectData.hit_from}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit To</div>
                <div class="item_content hit_to">${objectData.hit_to}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit Strand</div>
                <div class="item_content hit_strand">${objectData.hit_strand}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Alignment Length</div>
                <div class="item_content align_len">${objectData.align_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Gaps</div>
                <div class="item_content gaps">${objectData.gaps}</div>
            </div>
        `;
    } else {
        return `
            <div class="item_container">
                <div class="item_title">Query Index</div>
                <div class="item_content query_index">${objectData.queryIndex + 1}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit Index</div>
                <div class="item_content hit_index">${objectData.hitIndex + 1}</div>
            </div>
            <div class="item_container">
                <div class="item_title">HSP Count</div>
                <div class="item_content hsp_count">${objectData.hspCount}</div>
            </div>
            <div class="item_container">
                <div class="item_title">HSP Index</div>
                <div class="item_content hsp_index">${objectData.hspIndex + 1}</div>
                <button class="hsp_switch previous_hsp" query-index="${objectData.queryIndex}" hit-index="${objectData.hitIndex}" hsp-index="${objectData.hspIndex}"
                    hsp-count="${objectData.hspCount}">Previous</button>
                <button class="hsp_switch next_hsp" query-index="${objectData.queryIndex}" hit-index="${objectData.hitIndex}" hsp-index="${objectData.hspIndex}"
                    hsp-count="${objectData.hspCount}">Next</button>
            </div>
            <div class="item_container">
                <div class="item_title">Query ID</div>
                <div class="item_content query_id">${objectData.query_id}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query Length</div>
                <div class="item_content query_len">${objectData.query_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Subject ID</div>
                <div class="item_content subject_id">
                    <a href="./searchBox.html?searchKeyword=${objectData.subject_id}" target="_blank" class="result_details_dynamic_link" data-replace="${objectData.subject_id}" title="click to resource page">
                        <span>${objectData.subject_id}</span>
                    </a>
                </div>
            </div>
            <div class="item_container">
                <div class="item_title">Subject Length</div>
                <div class="item_content subject_len">${objectData.subject_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Bit Score</div>
                <div class="item_content bit_score">${objectData.bit_score}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Score</div>
                <div class="item_content score">${objectData.score}</div>
            </div>
            <div class="item_container">
                <div class="item_title">E-value</div>
                <div class="item_content evalue">${objectData.evalue}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Identity</div>
                <div class="item_content identity">${objectData.identity}</div>
            </div>
            <div class="item_container">
                <div class="item_title">positive</div>
                <div class="item_content positive">${objectData.positive}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query From</div>
                <div class="item_content query_from">${objectData.query_from}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query To</div>
                <div class="item_content query_to">${objectData.query_to}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit From</div>
                <div class="item_content hit_from">${objectData.hit_from}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit To</div>
                <div class="item_content hit_to">${objectData.hit_to}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Alignment Length</div>
                <div class="item_content align_len">${objectData.align_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Gaps</div>
                <div class="item_content gaps">${objectData.gaps}</div>
            </div>
        `;
    }

}

function updateResultDetails(objectData, resultDetailsContainer) {
    let contentBox = resultDetailsContainer.querySelector('.content_box');
    const queryIndexElement = contentBox.querySelector('.query_index');
    if (queryIndexElement) {
        queryIndexElement.textContent = objectData.queryIndex + 1;
    }
    const hitIndexElement = contentBox.querySelector('.hit_index');
    if (hitIndexElement) {
        hitIndexElement.textContent = objectData.hitIndex + 1;
    }
    const hspCountElement = contentBox.querySelector('.hsp_count');
    if (hspCountElement) {
        hspCountElement.textContent = objectData.hspCount;
    }
    const hspIndexElement = contentBox.querySelector('.hsp_index');
    if (hspIndexElement) {
        hspIndexElement.textContent = objectData.hspIndex + 1;
    }
    const previousHspButton = contentBox.querySelector('.previous_hsp');
    if (previousHspButton) {
        previousHspButton.setAttribute('query-index', objectData.queryIndex);
        previousHspButton.setAttribute('hit-index', objectData.hitIndex);
        previousHspButton.setAttribute('hsp-index', objectData.hspIndex);
        previousHspButton.setAttribute('hsp-count', objectData.hspCount);
    }
    if (objectData.hspIndex === 0) {
        previousHspButton.disabled = true;
        previousHspButton.classList.add('disabled');
    } else {
        previousHspButton.disabled = false;
        previousHspButton.classList.remove('disabled');
    }
    const nextHspButton = contentBox.querySelector('.next_hsp');
    if (nextHspButton) {
        nextHspButton.setAttribute('query-index', objectData.queryIndex);
        nextHspButton.setAttribute('hit-index', objectData.hitIndex);
        nextHspButton.setAttribute('hsp-index', objectData.hspIndex);
        nextHspButton.setAttribute('hsp-count', objectData.hspCount);
    }
    if (objectData.hspIndex === objectData.hspCount - 1) {
        nextHspButton.disabled = true;
        nextHspButton.classList.add('disabled');
    } else {
        nextHspButton.disabled = false;
        nextHspButton.classList.remove('disabled');
    }
    const queryIDElement = contentBox.querySelector('.query_id');
    if (queryIDElement) {
        queryIDElement.textContent = objectData.query_id;
    }
    const queryLenElement = contentBox.querySelector('.query_len');
    if (queryLenElement) {
        queryLenElement.textContent = objectData.query_len;
    }
    const subjectIDElement = contentBox.querySelector('.subject_id');
    if (subjectIDElement) {
        const linkElement = subjectIDElement.querySelector('.result_details_dynamic_link');
        if (linkElement) {
            linkElement.href = `./searchBox.html?searchKeyword=${objectData.subject_id}`;
            linkElement.target = `_blank`;
            linkElement.dataset.replace = objectData.subject_id;
            linkElement.title = `click to resource page`;
            linkElement.querySelector('span').textContent = objectData.subject_id;
        }
    }
    const subjectLenElement = contentBox.querySelector('.subject_len');
    if (subjectLenElement) {
        subjectLenElement.textContent = objectData.subject_len;
    }
    const bitScoreElement = contentBox.querySelector('.bit_score');
    if (bitScoreElement) {
        bitScoreElement.textContent = objectData.bit_score;
    }
    const scoreElement = contentBox.querySelector('.score');
    if (scoreElement) {
        scoreElement.textContent = objectData.score;
    }
    const evalueElement = contentBox.querySelector('.evalue');
    if (evalueElement) {
        evalueElement.textContent = objectData.evalue;
    }
    const identityElement = contentBox.querySelector('.identity');
    if (identityElement) {
        identityElement.textContent = objectData.identity;
    }
    const positiveElement = contentBox.querySelector('.positive');
    if (positiveElement) {
        positiveElement.textContent = objectData.positive;
    }
    const queryFromElement = contentBox.querySelector('.query_from');
    if (queryFromElement) {
        queryFromElement.textContent = objectData.query_from;
    }
    const queryToElement = contentBox.querySelector('.query_to');
    if (queryToElement) {
        queryToElement.textContent = objectData.query_to;
    }
    const queryStrandElement = contentBox.querySelector('.query_strand');
    if (queryStrandElement) {
        queryStrandElement.textContent = objectData.query_strand;
    }
    const hitFromElement = contentBox.querySelector('.hit_from');
    if (hitFromElement) {
        hitFromElement.textContent = objectData.hit_from;
    }
    const hitToElement = contentBox.querySelector('.hit_to');
    if (hitToElement) {
        hitToElement.textContent = objectData.hit_to;
    }
    const hitStrandElement = contentBox.querySelector('.hit_strand');
    if (hitStrandElement) {
        hitStrandElement.textContent = objectData.hit_strand;
    }
    const alignLenElement = contentBox.querySelector('.align_len');
    if (alignLenElement) {
        alignLenElement.textContent = objectData.align_len;
    }
    const gapsElement = contentBox.querySelector('.gaps');
    if (gapsElement) {
        gapsElement.textContent = objectData.gaps;
    }
}

// 创建图例元素
function creatLegendElement(baseType) {
    const legend = document.createElement('div');
    legend.className = 'legend';

    let legendContentMatch = `
            <div class="legend_item">
                <div class="legend_color match"></div>
                <span>match</span>
            </div>`;

    let legendContentNotMatch = `
            <div class="legend_item">
                <div class="legend_color mismatch"></div>
                <span>mismatch</span>
            </div>
            <div class="legend_item">
                <div class="legend_color gap"></div>
                <span>gap</span>
            </div>`;

    // 如果是蛋白质序列，还需要添加一个conservative的图例
    if (baseType === 'peptide') {
        legendContentNotMatch = `
            <div class="legend_item">
                <div class="legend_color conservative"></div>
                <span>conservative</span>
            </div>` + legendContentNotMatch;
    }

    legend.innerHTML = legendContentMatch + legendContentNotMatch;

    return legend;
}

// 创建一个函数，用于创建碱基元素：<span class="base C" data-position="709" data-type="query">C</span>
function createBaseElement(base, position, type) {
    const span = document.createElement('span');
    span.className = `base ${base.toUpperCase()}`;
    span.textContent = base.toUpperCase();
    span.setAttribute('data-position', position);
    span.setAttribute('data-type', type);

    return span;
}

// 创建一个函数，用于创建中线元素：<span class="base match" data-type="match">&nbsp;</span>
function createMidlineElement(type) {
    const span = document.createElement('span');
    span.className = `base ${type}`;
    span.setAttribute('data-type', 'midline');
    span.setAttribute('match-type', type);
    span.innerHTML = '&nbsp;';

    return span;
}

// 创建一个函数，用于可视化blast比对结果，需要指定传入的数据是蛋白质还是核苷酸序列
function visualizeBlastResult(result, chunkSize, baseType, resultContainer) {
    const query = result.qseq;
    const subject = result.hseq;
    const midline = result.midline;

    let qPos = result.query_from;
    let sPos = result.hit_from;

    // const resultContainer = document.getElementById('align_seq_container');

    // 添加图例
    resultContainer.appendChild(creatLegendElement(baseType));

    // 每三行为一组，分别是query行，midline行和subject行，逐一填充按照chunkSize长度切割后的序列
    for (let i = 0; i < query.length; i += chunkSize) {
        // slice是左闭右开区间
        const qChunk = query.slice(i, i + chunkSize);
        const sChunk = subject.slice(i, i + chunkSize);
        const mChunk = midline.slice(i, i + chunkSize);

        // // 这里不能写 qPos + chunkSize - 1; 因为最后一行可能不足chunkSize个碱基
        // const qEndPos = qPos + qChunk.length - 1;
        // const sEndPos = sPos + sChunk.length - 1;

        // 检查qChunk和sChunk中的gap数量，计算qEndPos和sEndPos时要减去gap的数量
        const qGapCount = qChunk.split('').filter(base => base === '-').length;
        const sGapCount = sChunk.split('').filter(base => base === '-').length;
        const qEndPos = qPos + qChunk.length - 1 - qGapCount;
        const sEndPos = sPos + sChunk.length - 1 - sGapCount;

        // 定义三行，分别是query行，subject行和match行
        const qLine = document.createElement('div');
        qLine.className = 'query_line';

        const sLine = document.createElement('div');
        sLine.className = 'subject_line';

        const mLine = document.createElement('div');
        mLine.className = 'mid_line';

        // 为了统一长度，每一行都包含四个部分：title, start, sequence, end，分别是标题，起始位置，序列，结束位置
        // 其中start向右对齐，end向左对齐，midline的 title, start, end都为空，sequence 中匹配为空格，错配和gap用不同的颜色表示
        const qTitle = document.createElement('div');
        qTitle.className = 'title';
        qTitle.textContent = 'Query';

        const qStart = document.createElement('div');
        qStart.className = 'start';
        qStart.textContent = qPos;

        const qSequence = document.createElement('div');
        qSequence.className = 'sequence';
        qChunk.split('').forEach((base, index) => {
            qSequence.appendChild(createBaseElement(base, qPos + index, 'query'));
        });

        const qEnd = document.createElement('div');
        qEnd.className = 'end';
        qEnd.textContent = qEndPos;

        const sTitle = document.createElement('div');
        sTitle.className = 'title';
        sTitle.textContent = 'Subject';

        const sStart = document.createElement('div');
        sStart.className = 'start';
        sStart.textContent = sPos;

        const sSequence = document.createElement('div');
        sSequence.className = 'sequence';
        sChunk.split('').forEach((base, index) => {
            sSequence.appendChild(createBaseElement(base, sPos + index, 'subject'));
        });

        const sEnd = document.createElement('div');
        sEnd.className = 'end';
        sEnd.textContent = sEndPos;

        const mTitle = document.createElement('div');
        mTitle.className = 'title';
        mTitle.textContent = '';

        const mStart = document.createElement('div');
        mStart.className = 'start';
        mStart.textContent = '';

        const mSequence = document.createElement('div');
        mSequence.className = 'sequence';
        mChunk.split('').forEach((char, index) => {
            const qBase = qChunk[index];
            const sBase = sChunk[index];
            let type = '';
            // '|' （核酸）或者字母（蛋白）表示匹配，空格表示错配或者gap，因此对于空格还需要额外判断对应的query和subject的相应位置是否是gap
            if (char === ' ') {
                if (qBase === '-' || sBase === '-') {
                    type = 'gap';
                } else {
                    type = 'mismatch';
                }
            } else {
                if (char === '+') {
                    type = 'conservative';
                } else {
                    type = 'match';
                }
            }

            mSequence.appendChild(createMidlineElement(type));
        });

        const mEnd = document.createElement('div');
        mEnd.className = 'end';
        mEnd.textContent = '';

        qLine.appendChild(qTitle);
        qLine.appendChild(qStart);
        qLine.appendChild(qSequence);
        qLine.appendChild(qEnd);

        mLine.appendChild(mTitle);
        mLine.appendChild(mStart);
        mLine.appendChild(mSequence);
        mLine.appendChild(mEnd);

        sLine.appendChild(sTitle);
        sLine.appendChild(sStart);
        sLine.appendChild(sSequence);
        sLine.appendChild(sEnd);

        resultContainer.appendChild(qLine);
        resultContainer.appendChild(mLine);
        resultContainer.appendChild(sLine);

        // 如果不是最后一轮循环，就添加一些空行
        if (i + chunkSize < query.length) {
            resultContainer.appendChild(document.createElement('br'));
            resultContainer.appendChild(document.createElement('br'));
            resultContainer.appendChild(document.createElement('br'));
        }

        qPos = qEndPos + 1;
        sPos = sEndPos + 1;
    }
}

function updateBlastResultDetailsContainer(queryIndex, hitIndex, hspIndex) {
    console.log('updateBlastResultDetailsContainer', queryIndex, hitIndex, hspIndex);
    let objectData = getObjectDataByIndex(queryIndex, hitIndex, hspIndex);
    let blastResultDetailsContainer = document.getElementById(`blast_result_details_container_${hitIndex}`);
    updateResultDetails(objectData, blastResultDetailsContainer);
}

function updateAlignSeqContainer(queryIndex, hitIndex, hspIndex) {
    let objectData = getObjectDataByIndex(queryIndex, hitIndex, hspIndex);
    let alignSeqContainer = document.getElementById(`align_seq_container_${hitIndex}`);
    alignSeqContainer.innerHTML = '';
    visualizeBlastResult(objectData, chunkSize, currentResultSeqType, alignSeqContainer);
}

function updateHitAreaAlignPlotHighlight(hitIndex, hspIndex) {
    let hitAreaAlignPlot = document.getElementById(`hit_area_align_plot_${hitIndex}`);
    let hitPolygons = hitAreaAlignPlot.querySelectorAll('.hit');
    hitPolygons.forEach(hitPolygon => {
        hitPolygon.classList.remove('highlighted');
    });
    hitPolygons[hspIndex].classList.add('highlighted');
}

function createAlignSeqResultContainer(objectData, hitIndex) {

    let alignSeqResultContainer = document.createElement('div');
    alignSeqResultContainer.id = `align_seq_result_container_${hitIndex}`;

    let toolNavBar = `
    <div class="tool_nav_bar">
        <div class="select_download_type">
            <div class="group_header">
                <span class="text">Download</span>
                <span class="arrow">▼</span>
            </div>

            <div class="link_list">
                <ul class="download_types">
                    <li><a class="download_align_area_pic" hitIndex="${hitIndex}">Alignment Area Picture</a></li>
                    <li><a class="download_align_seq_pic" hitIndex="${hitIndex}">Alignment Sequence Picture</a></li>
                    <li><a class="download_complete_subject_sequence" hitIndex="${hitIndex}">Complete Subject Sequence</a></li>
                    <li><a class="download_aligned_subject_sequence" hitIndex="${hitIndex}">Aligned Subject Sequence</a></li>
                    <li><a class="download_pairwise_alignment_result" hitIndex="${hitIndex}">Pairwise Alignment Result</a></li>
                    <li><a class="download_detailed_value_table" hitIndex="${hitIndex}">Detailed Value Table</a></li>
                </ul>
            </div>
        </div>

        <div class="page_turning_tools">
            <div class="page_turning to_top" hitIndex="${hitIndex}">
                <span class="text">Top</span>
                <span class="arrow">▲</span>
            </div>
            <div class="page_turning to_previous" hitIndex="${hitIndex}">
                <span class="text">Previous</span>
                <span class="arrow">▲</span>
            </div>
            <div class="page_turning to_next" hitIndex="${hitIndex}">
                <span class="text">Next</span>
                <span class="arrow">▼</span>
            </div>
            <div class="page_turning to_bottom" hitIndex="${hitIndex}">
                <span class="text">Bottom</span>
                <span class="arrow">▼</span>
            </div>
        </div>
    </div>`;

    let resultDetailsPlotContainer = `
    <div class="result_details_plot_container">
        <div class="result_details_container" id="blast_result_details_container_${hitIndex}">
            <!-- 下面必须使用两个div嵌套才能实现内容溢出的时候不会覆盖圆角框和矩形框之间的底部间隔 -->
            <div class="content_box">
                <h1 class="main_title">Result Details</h1>
                <div class="result_details">
                    ${getResultDetails(objectData)}
                </div>
            </div>
        </div>
        <svg class="hit_area_align_plot" id="hit_area_align_plot_${hitIndex}" width="900" height="500"></svg>

    </div>`;

    let alignSeqContainer = `<div class="align_seq_container" id="align_seq_container_${hitIndex}"></div>`;

    alignSeqResultContainer.innerHTML = toolNavBar + resultDetailsPlotContainer + alignSeqContainer;

    // 绘制文本序列匹配结果
    alignSeqContainer = alignSeqResultContainer.querySelector('.align_seq_container')
    visualizeBlastResult(objectData, chunkSize, currentResultSeqType, alignSeqContainer);


    // 使用经典的SVG序列化方法，为d3.js生成的SVG图像添加下载功能
    alignSeqResultContainer.querySelector('.download_align_area_pic').addEventListener('click', function () {
        showCustomAlert('Converting started!', 'normal', 1000);

        // 获取当前点击的按钮的hitIndex属性，用于定位对应的svg元素
        const hitIndex = parseInt(this.getAttribute('hitIndex'));
        const svg = document.getElementById(`hit_area_align_plot_${hitIndex}`);

        // 将SVG相关的CSS样式内嵌到SVG中，以便下载后的图片样式正确
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        // 从css文件中截取的样式-
        styleElement.innerHTML = `
            .hit_area_align_plot .hit {
                fill: steelblue;
                opacity: 0.2;
                cursor: pointer;
            }
            .hit_area_align_plot .highlighted {
                stroke: red;
                stroke-width: 3;
                stroke-dasharray: 10;
                stroke-linecap: round;
                opacity: 0.9;
            }
            .hit_area_align_plot .axis-label {
                font-size: 14px;
                font-weight: bold;
            }
        `;
        // 将style元素插入到svg元素的第一个子元素之前
        svg.insertBefore(styleElement, svg.firstChild);

        // 将SVG元素序列化为字符串
        const svgData = new XMLSerializer().serializeToString(svg);
        // 创建一个Blob对象来存储SVG数据；指定了Blob的MIME类型，这告诉浏览器这个数据是SVG格式的图像，并且使用UTF-8字符编码
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        // 创建一个链接元素，设置下载属性，模拟点击下载
        const downloadLink = document.createElement('a');
        // 创建一个指向Blob对象的临时URL。这种URL可以用于<a>标签的href属性，允许用户点击链接下载Blob所表示的数据
        const url = URL.createObjectURL(svgBlob);
        downloadLink.href = url;
        // 设置下载文件的默认名称
        downloadLink.download = `Alignment_Area_Picture_${hitIndex + 1}.svg`;

        document.body.appendChild(downloadLink);
        // 触发点击事件以进行下载
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // 释放URL对象
        URL.revokeObjectURL(url);

        // 清理，移除内嵌的style元素
        svg.removeChild(styleElement);
    });


    // 为序列文本匹配的标签组添加下载事件，由于html2canvas方法生成的效果太差，因此模仿SVG的序列化方法，直接生成一个新的网页，间接实现标签组的下载
    alignSeqResultContainer.querySelector('.download_align_seq_pic').addEventListener('click', function () {
        showCustomAlert('Converting started!', 'normal', 1000);

        const hitIndex = this.getAttribute('hitIndex');
        const targetDiv = document.getElementById(`align_seq_container_${hitIndex}`);

        // 获取div标签组的HTML内容（innerHTML 只包含元素内部的内容，不包括元素本身；outerHTML 包含元素本身及其内部的所有内容。）
        const divContent = targetDiv.outerHTML;

        // 定义内联样式
        const styleContent = `
                <style>
                    .align_seq_container {
                        width: 1320px;
                        font-family: 'Poppins';

                        margin: 20px;
                        padding-bottom: 40px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.1);
                        background-color: rgba(255, 255, 255, 0.9);
                        overflow: hidden;
                    }

                    .align_seq_container .legend {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 30px 0;
                    }

                    .align_seq_container .legend .legend_item {
                        display: flex;
                        align-items: center;
                        margin: 0 10px;
                        font-size: 16px;
                    }

                    .align_seq_container .legend .legend_item .legend_color {
                        width: 20px;
                        height: 20px;
                        margin-right: 5px;
                    }

                    .align_seq_container .legend .legend_item .match {
                        box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
                    }

                    .align_seq_container .legend .legend_item .mismatch {
                        background-color: rgb(255, 206, 43);
                    }

                    .align_seq_container .legend .legend_item .gap {
                        background-color: rgb(255, 60, 0);
                    }

                    .query_line,
                    .mid_line,
                    .subject_line {
                        display: flex;
                        align-items: center;
                        /* font-family: monospace; */
                        margin-left: 40px;
                    }

                    .title {
                        width: 65px;
                        /* 固定宽度以对齐 */
                        text-align: left;
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .start {
                        width: 70px;
                        /* 根据最大数字宽度设置 */
                        text-align: right;
                        font-size: 16px;
                        /* font-weight: bold; */
                        margin-right: 20px;
                    }

                    .end {
                        width: 70px;
                        /* 根据最大数字宽度设置 */
                        text-align: left;
                        font-size: 16px;
                        /* font-weight: bold; */
                        margin-left: 20px;
                    }

                    .start,
                    .end {
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .sequence {
                        display: flex;
                    }

                    .base {
                        width: 20px;
                        /* 每个碱基固定宽度 */
                        text-align: center;
                        font-size: 14px;
                        font-weight: bold;
                    }

                    /* ACDEFGHIKLMNPQRSTVWY */
                    .A {
                        background-color: rgba(183, 66, 115, 0.3);
                    }

                    .C {
                        background-color: rgba(255, 255, 0, 0.15);
                    }

                    .D {
                        background-color: rgba(99, 166, 128, 0.3);
                    }

                    .E {
                        background-color: rgba(23, 29, 24, 0.3);
                    }

                    .F {
                        background-color: rgba(109, 114, 168, 0.3);
                    }

                    .G {
                        background-color: rgba(0, 128, 0, 0.15);
                    }

                    .H {
                        background-color: rgba(81, 74, 8, 0.3);
                    }

                    .I {
                        background-color: rgba(47, 21, 92, 0.3);
                    }

                    .K {
                        background-color: rgba(178, 70, 194, 0.3);
                    }

                    .L {
                        background-color: rgba(72, 171, 133, 0.3);
                    }

                    .M {
                        background-color: rgba(223, 72, 53, 0.3);
                    }

                    .N {
                        background-color: rgba(189, 229, 34, 0.3);
                    }

                    .P {
                        background-color: rgba(134, 38, 169, 0.3);
                    }

                    .Q {
                        background-color: rgba(90, 207, 248, 0.3);
                    }

                    .R {
                        background-color: rgba(72, 1, 108, 0.3);
                    }

                    .S {
                        background-color: rgba(247, 254, 93, 0.3);
                    }

                    .T {
                        background-color: rgba(0, 0, 255, 0.15);
                    }

                    .V {
                        background-color: rgba(208, 156, 111, 0.3);
                    }

                    .W {
                        background-color: rgba(25, 109, 191, 0.3);
                    }

                    .Y {
                        background-color: rgba(160, 105, 3, 0.3);
                    }

                    .U {
                        background-color: rgba(149, 171, 137, 0.3);
                    }

                    .mismatch {
                        background-color: rgb(255, 206, 43);
                    }

                    .gap {
                        background-color: rgb(255, 60, 0);
                    }

                    .conservative {
                        background-color: rgb(34, 173, 34);
                    }
                </style>
            `;

        // 创建新的HTML文档
        const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Download Alignment Sequence Container</title>
                    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
                    ${styleContent}
                </head>
                <body>
                    ${divContent}
                </body>
                </html>
            `;

        // 将HTML内容创建为Blob对象
        const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });

        // 创建一个下载链接
        const downloadLink = document.createElement('a');
        const url = URL.createObjectURL(htmlBlob);
        downloadLink.href = url;
        downloadLink.download = `Alignment_Sequence_Container_${hitIndex + 1}.html`;

        // 触发下载
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // 释放URL对象
        URL.revokeObjectURL(url);
    });

    // 为单一Hit的序列匹配结果添加文件下载功能，
    // 1. 下载完整的subject序列（Hit）：haplotype和transcript数据库， 生成格式>GT42G000001, length：1000bp，序列每50bp换行
    // 2. 下载匹配区域的subject序列（HSP）：遍历Hit的object数据，生成格式>GT42G000001:1-1000bp，序列每50bp换行
    // 3. 下载HSP的两两比对txt格式：参考initialContentArea中的splitPairwiseAlignmentResultByIndex，直接存储对应的ID（>GT42G000001）的所有HSP行即可
    // 3. 下载当前subject的数值列表：使用initialContentArea中的splitDetailedTableResultByIndex
    alignSeqResultContainer.querySelector('.download_complete_subject_sequence').addEventListener('click', async function () {

        // 根据ID获取完整的subject序列
        const currentQueryIndex = getData('currentBlastResultQueryIndex');
        const currentHitIndex = this.getAttribute('hitIndex');
        const subjectID = getSubjectIDByIndex(currentQueryIndex, currentHitIndex);
        const currentDatabaseSeqType = getData('currentBlastDatabaseSeqType');
        const response = await fetchRawData2('getSeqWithID', { 'sequenceID': subjectID, 'sequenceType': currentDatabaseSeqType });
        const responseData = response.data;

        if (responseData.length === 0) {
            showCustomAlert('No sequence data found for the specified ID', 'error');
            return;
        }

        // 将序列数据转换为fasta格式
        let sequence = responseData[currentDatabaseSeqType];
        let sequenceLength = sequence.length;
        let resultLines = [];
        resultLines.push(`>${subjectID}, length: ${sequenceLength} bp`); // 生成标题行格式>GT42G000001, length：1000bp
        // 序列每50bp换行
        for (let i = 0; i < sequenceLength; i += 50) {
            resultLines.push(sequence.slice(i, i + 50));
        }
        let resultString = resultLines.join('\n');

        // 下载文件
        downloadFile(resultString, `Complete_Subject_Sequence_of_${subjectID}`, 'fasta');
    });

    alignSeqResultContainer.querySelector('.download_aligned_subject_sequence').addEventListener('click', async function () {

        // 获取当前Hit对应的HSP列表
        const currentQueryIndex = getData('currentBlastResultQueryIndex');
        const currentHitIndex = this.getAttribute('hitIndex');
        const subjectID = getSubjectIDByIndex(currentQueryIndex, currentHitIndex);
        const hspArray = getHspArrayByIndex(currentQueryIndex, currentHitIndex);

        // 遍历HSP列表，获取每个HSP的序列数据
        let resultLines = [];
        hspArray.forEach(hsp => {
            resultLines.push(`HSP_${hsp.num}:`);
            resultLines.push(`>${subjectID}, range: ${hsp.hit_from}-${hsp.hit_to} bp`); // 生成标题行格式>GT42G000001:1-1000bp
            // 序列每50bp换行
            for (let i = 0; i < hsp.align_len; i += 50) {
                resultLines.push(hsp.hseq.slice(i, i + 50));
            }
            resultLines.push('');
        });

        let resultString = resultLines.join('\n');

        // 下载文件
        downloadFile(resultString, `Aligned_Subject_Sequence_of_${subjectID}`, 'fasta');
    });

    alignSeqResultContainer.querySelector('.download_pairwise_alignment_result').addEventListener('click', async function () {

        // 获取format0的结果
        const blastResultPairwiseAlignment = getData('blastResultPairwiseAlignment');
        const resultRows = blastResultPairwiseAlignment.split('\n');
        // 获取subjectID
        const currentQueryIndex = getData('currentBlastResultQueryIndex');
        const currentHitIndex = this.getAttribute('hitIndex');
        const subjectID = getSubjectIDByIndex(currentQueryIndex, currentHitIndex);

        // 遍历结果，获取对应subjectID的所有行
        let resultLines = [];
        for (let i = 0; i < resultRows.length; i++) {
            if (resultRows[i].startsWith('>')) {
                if (resultRows[i].includes(subjectID)) {
                    resultLines.push(resultRows[i]);
                    let j = i + 1;
                    while (!(resultRows[j].startsWith('>')) && !(resultRows[j].startsWith('Lambda'))) {
                        resultLines.push(resultRows[j]);
                        j++;
                    }
                    break;
                }
            }
        }

        let resultString = resultLines.join('\n');

        // 下载文件
        downloadFile(resultString, `Pairwise_Alignment_Result_of_${subjectID}`, 'txt');

    });

    alignSeqResultContainer.querySelector('.download_detailed_value_table').addEventListener('click', async function () {

        // 获取format2的结果
        const blastResultDetailedTable = getData('blastResultDetailedTable');
        const currentQueryIndex = getData('currentBlastResultQueryIndex');
        const blastResultDetailedTableByIndex = splitDetailedTableResultByIndex(blastResultDetailedTable, currentQueryIndex);
        const tableRows = blastResultDetailedTableByIndex.split('\n');

        // 获取subjectID
        const currentHitIndex = this.getAttribute('hitIndex');
        const subjectID = getSubjectIDByIndex(currentQueryIndex, currentHitIndex);

        // 遍历结果，获取对应subjectID的所有行
        let resultLines = [];
        // 先把前四行加入
        for (let i = 0; i < 4; i++) {
            resultLines.push(tableRows[i]);
        }

        // 再把subjectID对应的行加入
        let subjectLines = [];
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].includes(subjectID)) {
                subjectLines.push(tableRows[i]);
            }
        }

        // 加入统计行
        resultLines.push(`Total ${subjectLines.length} HSPs for ${subjectID}`);

        // 最后加入subjectID对应的行
        resultLines.push(...subjectLines);

        let resultString = resultLines.join('\n');

        // 下载文件
        downloadFile(resultString, `Detailed_Value_Table_of_${subjectID}`, 'txt');
    });


    // 为序列匹配结果的导航栏的四个结果跳转按钮添加点击事件
    alignSeqResultContainer.querySelectorAll('.page_turning').forEach(pageTurning => {
        pageTurning.addEventListener('click', function () {
            let hitIndex = parseInt(this.getAttribute('hitIndex'));
            let hitArrayLength = dynamicValues.currentHitArray.length;
            if (hitIndex === 0 && this.classList.contains('to_previous') ||
                hitIndex === hitArrayLength - 1 && this.classList.contains('to_next') ||
                hitIndex === hitArrayLength - 1 && this.classList.contains('to_bottom')) {
                return;
            }

            // 移动到id为align_seq_result_container_i的标签
            let idPrefix = 'align_seq_result_container_';


            if (this.classList.contains('to_previous')) {
                hitIndex -= 1;
            }
            else if (this.classList.contains('to_next')) {
                hitIndex += 1;
                // 在上一轮loadNextBatch的时候，currentHitIndex累加到了这一批的最后一个元素
                // 因此如果hitIndex等于currentHitIndex，说明当前已经加载到最后一个hit，需要加载下一批数据
                if (hitIndex === currentHitIndex) {
                    loadNextBatch();
                }
            }
            else if (this.classList.contains('to_bottom')) {
                loadRemainingData();
                hitIndex = hitArrayLength - 1;
            }

            // 获取最外层的 details 元素作为滚动容器，让内部的元素在这个视界内滚动
            let scrollContainer = document.getElementById('blast_result_container');
            let targetElement;
            if (this.classList.contains('to_top')) {
                targetElement = scrollContainer;
            } else {
                targetElement = document.getElementById(idPrefix + hitIndex);
            }

            // 使用 scrollIntoView 方法，将 targetElement 滚动到外层 details 的可见区域
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });

            // 将滚动容器的 scrollTop 设置为目标元素的位置，这里相当于让 targetElement 对齐到距离 scrollContainer 顶部的距离减去 scrollContainer 高度的15%的位置
            scrollContainer.scrollTop = targetElement.offsetTop - scrollContainer.offsetTop - scrollContainer.clientHeight * 0.15;

        });
    });


    // 为resultDetailsContainer中的HSP切换按钮添加点击事件
    alignSeqResultContainer.querySelectorAll('.hsp_switch').forEach(hspSwitch => {
        hspSwitch.addEventListener('click', function () {
            let queryIndex = parseInt(this.getAttribute('query-index'));
            let hitIndex = parseInt(this.getAttribute('hit-index'));
            let hspIndex = parseInt(this.getAttribute('hsp-index'));
            let changedHspIndex;

            if (this.classList.contains('previous_hsp')) {
                changedHspIndex = hspIndex - 1;
            }
            else if (this.classList.contains('next_hsp')) {
                changedHspIndex = hspIndex + 1;
            }

            updateBlastResultDetailsContainer(queryIndex, hitIndex, changedHspIndex);
            updateAlignSeqContainer(queryIndex, hitIndex, changedHspIndex);
            updateHitAreaAlignPlotHighlight(hitIndex, changedHspIndex);
        });
    });

    // 初始化时不调用updateBlastResultDetailsContainer函数，手动为resultDetailsContainer中的HSP切换按钮添加点击事件
    let previousHspButton = alignSeqResultContainer.querySelector('.previous_hsp');
    let nextHspButton = alignSeqResultContainer.querySelector('.next_hsp');
    if (objectData.hspIndex === 0) {
        previousHspButton.disabled = true;
        previousHspButton.classList.add('disabled');
    }
    if (objectData.hspIndex === objectData.hspCount - 1) {
        nextHspButton.disabled = true;
        nextHspButton.classList.add('disabled');
    }

    return alignSeqResultContainer;
}


function drawHitAreaAlignPlot(blastData, svgId) {
    // 找到SVG元素并设置宽度和高度
    const svg = d3.select(svgId);
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    // 设置边距和内部宽度和高度
    const margin = { top: 70, right: 20, bottom: 70, left: 40 };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    // 创建一个线性比例尺（scaleLinear）。比例尺是用来将一个输入域（domain）映射到一个输出范围（range）的函数
    // 这里我们有两个比例尺，一个用于查询序列（query）的比例尺，另一个用于目标序列（subject）的比例尺
    let queryLength = dynamicValues.currentQueryLen;
    let subjectLength = dynamicValues.currentSubjectLen;
    let xScaleQuery = d3.scaleLinear()
        .domain([0, queryLength]) // query序列的长度
        .range([margin.left, width - margin.right]);
    let xScaleSubject = d3.scaleLinear()
        .domain([0, subjectLength])  // subject序列的长度
        .range([margin.left, width - margin.right]);

    // 使用axisTop和axisBottom方法，利用比例尺创建坐标轴
    const xAxisQuery = d3.axisTop(xScaleQuery)
        .tickFormat(d => `${d} bp`); // 使用tickFormat方法将坐标轴标签格式化为带有“bp”后缀的字符串
    const xAxisSubject = d3.axisBottom(xScaleSubject)
        .tickFormat(d => `${d} bp`);

    // 创建坐标轴组并将其添加到SVG元素中
    const gXAxisQuery = svg.append("g")
        .attr("transform", `translate(0,${margin.top})`) // 将坐标轴移动到指定的位置
        .call(xAxisQuery); // 调用坐标轴方法, 生成坐标轴
    const gXAxisSubject = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxisSubject);

    // 添加两个坐标轴的标题
    svg.append("text")
        .attr("class", "axis-label") // 添加CSS类用于样式化
        .attr("x", width / 2) // 设置了文本标签的x坐标。width是SVG容器的宽度，这里使其居中
        .attr("y", 10) // 将文本标签的y坐标设置为距离起始10个像素，使其距离容器顶部有一定的间距
        .attr("text-anchor", "middle") // 设置了文本标签的文本锚点。"middle"表示文本将以其x坐标为中心点进行对齐。
        .text("Query"); // 设置标题内容为"Query"
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Subject");

    // 设置坐标轴标签的样式
    gXAxisQuery.selectAll("text") // 选择所有的坐标轴标签
        .style("text-anchor", "end") // 设置了文本的对齐方式为"end"，也就是右对齐。这意味着文本的最后一个字符将与选择的位置对齐。
        .attr("dx", "3.2em") // 设置了文本的水平偏移量为"3.2em"。这将使文本相对于选择的位置向右移动3.2个em单位
        .attr("dy", "-0.5em") // 设置了文本的垂直偏移量为"-0.5em"。这将使文本相对于选择的位置向上移动0.5个em单位
        .attr("transform", "rotate(-45)"); // 对文本进行了旋转变换，将其逆时针旋转45度。
    gXAxisSubject.selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-45)");

    // 创建一个组元素用于存放所有的hit四边形区域
    const hitGroup = svg.append("g");

    // 为每个hit创建一个四边形区域，并添加点击聚焦事件
    const hits = hitGroup.selectAll(".hit") // 选择hitGroup中的所有类名为hit的元素。由于这些元素还不存在，这里只是创建了一个选择集。
        .data(blastData) // 将数据绑定到选择集上
        .enter().append("polygon") // 为blastData每个数据元素创建一个四边形区域
        .attr("class", "hit") // 添加CSS类用于样式化
        .attr("hitIndex", currentHitIndex) // 设置hitIndex属性，值为索引i
        .attr("hspIndex", (d, i) => i) // 设置hspIndex属性，值为0
        .attr("points", d => { // 设置四边形的四个顶点坐标
            const x1 = xScaleQuery(d.query_from); // 使用查询序列的起始位置d.query_from计算第一个顶点的x坐标。xScaleQuery是一个比例尺函数，将序列位置映射到SVG的x坐标。
            const x2 = xScaleQuery(d.query_to);
            const y1 = margin.top + 10;
            const y2 = height - margin.bottom - 10;
            const x3 = xScaleSubject(d.hit_from);
            const x4 = xScaleSubject(d.hit_to);
            return `${x1},${y1} ${x2},${y1} ${x4},${y2} ${x3},${y2}`; // 返回四个顶点的坐标, 用空格分隔, 顺时针方向绘制
        })
        .on("click", function (event, d) { // 为每个多边形添加一个点击事件处理函数
            const targetPolygon = d3.select(this); // 获取当前点击的多边形
            const isHighlighted = targetPolygon.classed("highlighted");
            hitGroup.selectAll(".hit").classed("highlighted", false);
            if (!isHighlighted) {
                targetPolygon.classed("highlighted", true);
            }
            const targetPolygonHitIndex = parseInt(targetPolygon.attr("hitIndex"));
            const targetPolygonHspIndex = parseInt(targetPolygon.attr("hspIndex"));
            updateBlastResultDetailsContainer(currentQueryIndex, targetPolygonHitIndex, targetPolygonHspIndex);
            updateAlignSeqContainer(currentQueryIndex, targetPolygonHitIndex, targetPolygonHspIndex);
        });

    // 为第一个hsp添加一个高亮类
    hits.filter((d, i) => i === 0).classed("highlighted", true);

    // 创建两个缩放行为，一个用于查询序列，另一个用于目标序列
    const zoomQuery = d3.zoom()
        .scaleExtent([1, 5]) // 设置缩放比例的范围
        .translateExtent([[0, 0], [width, height / 2]]) // 设置平移的范围
        .extent([[margin.left, 0], [width - margin.right, height / 2]]) // 设置缩放的范围
        .on("zoom", zoomedQuery); // 设置缩放事件处理函数
    const zoomSubject = d3.zoom()
        .scaleExtent([1, 50])
        .translateExtent([[0, height / 2], [width, height]])
        .extent([[margin.left, height / 2], [width - margin.right, height]])
        .on("zoom", zoomedSubject);

    // 创建两个矩形区域用于接收缩放事件
    const queryRect = svg.append("rect")
        .attr("class", "zoom-query")
        .attr("width", width) // 设置矩形的宽度为SVG容器的宽度
        .attr("height", height / 2) // 设置矩形的高度为SVG容器高度的一半
        .attr("fill", "none") // 设置矩形的填充颜色为透明
        .attr("pointer-events", "all") // 设置矩形接收所有的鼠标事件
        .call(zoomQuery); // 调用缩放行为
    const subjectRect = svg.append("rect")
        .attr("class", "zoom-subject")
        .attr("width", width)
        .attr("height", height / 2)
        .attr("y", height / 2)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .call(zoomSubject);
    // 在 queryRect 和 subjectRect 中添加title元素，用于显示提示信息
    queryRect.append("title").text("zoom or drag to move");
    subjectRect.append("title").text("zoom or drag to move");

    // 初始化缩放变换。d3.zoomIdentity：D3.js提供的初始缩放变换，表示没有缩放或平移。
    let queryTransform = d3.zoomIdentity;
    let subjectTransform = d3.zoomIdentity;

    // 定义query和subject区域的缩放事件处理函数
    // 更新查询序列和目标序列的变换以及相应的缩放效果是通过D3.js的缩放事件处理函数实现的
    function zoomedQuery(event) {
        queryTransform = event.transform; // 保存缩放和平移信息，包括缩放比例和偏移量。
        const newXScaleQuery = queryTransform.rescaleX(xScaleQuery); // 重新计算查询序列的x比例尺，使得比例尺能够根据当前的缩放和平移进行调整。
        gXAxisQuery.call(xAxisQuery.scale(newXScaleQuery)) // 调用x轴生成器并传入新的比例尺，更新x轴的刻度和标签。
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "3.2em")
            .attr("dy", "-0.5em")
            .attr("transform", "rotate(-45)");
        // 调用updateHits函数，并传入新的查询序列和目标序列的x比例尺，以更新匹配区域的多边形。
        // 这里之所以还要对目标序列的比例尺进行重新计算，是因为当在query区域进行操作的时候确实不会影响到subject区域，
        // 但是如果接下来在subject区域进行了操作，然后再回到query区域进行操作，如果此时不重新计算subject区域的比例尺，
        // 那么subject区域的多边形就会跳回到原来的位置导致错位。
        updateHits(newXScaleQuery, subjectTransform.rescaleX(xScaleSubject));
    }
    function zoomedSubject(event) {
        subjectTransform = event.transform;
        const newXScaleSubject = subjectTransform.rescaleX(xScaleSubject);
        gXAxisSubject.call(xAxisSubject.scale(newXScaleSubject))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .attr("transform", "rotate(-45)");
        updateHits(queryTransform.rescaleX(xScaleQuery), newXScaleSubject);
    }

    // 更新匹配区域的多边形的四个顶点坐标
    function updateHits(newXScaleQuery, newXScaleSubject) {
        hits.attr("points", d => {
            const x1 = newXScaleQuery(d.query_from);
            const x2 = newXScaleQuery(d.query_to);
            const y1 = margin.top + 10;
            const y2 = height - margin.bottom - 10;
            const x3 = newXScaleSubject(d.hit_from);
            const x4 = newXScaleSubject(d.hit_to);
            return `${x1},${y1} ${x2},${y1} ${x4},${y2} ${x3},${y2}`;
        });
    }

    // 将 hitGroup 提升到SVG的顶部，确保匹配区域在所有其他元素之上，从而避免被rect元素遮挡
    hitGroup.raise();
}

function loadNextBatch() {
    // 获取容器元素，向其中一组一组地填充数据
    const container = document.getElementById('all_hits_align_details');

    // 一次性加载 batchSize 个数据, 如果加载完毕则返回
    let hitArrayLength = dynamicValues.currentHitArray.length;
    for (let i = 0; i < batchSize && currentHitIndex < hitArrayLength; i++, currentHitIndex++) {
        let objectData = getObjectDataByIndex(currentQueryIndex, currentHitIndex, currentHspIndex);
        const alignSeqResultContainer = createAlignSeqResultContainer(objectData, currentHitIndex);
        container.appendChild(alignSeqResultContainer);

        // 绘制匹配区域的多边形图
        // 由于d3.js需要使用ID选择器，所以不能在 createAlignSeqResultContainer 函数中使用类选择器进行绘制
        let hspArray = getHspArrayByIndex(currentQueryIndex, currentHitIndex);
        drawHitAreaAlignPlot(hspArray, `#hit_area_align_plot_${currentHitIndex}`);
    }
}

// 根据索引加载一组数据，用于批量加载多个batch但是不一定全部加载完
function loadBatchByIndex(hitIndex) {
    let hitArrayLength = dynamicValues.currentHitArray.length;
    while (currentHitIndex < hitArrayLength && currentHitIndex < hitIndex) {
        loadNextBatch();
    }
}

function loadRemainingData() {
    let hitArrayLength = dynamicValues.currentHitArray.length;
    while (currentHitIndex < hitArrayLength) {
        loadNextBatch();
    }
}


function updateAllHitsAlignDetails() {
    console.log('updateAllHitsAlignDetails');

    // 清空 all_hits_align_details, 向其中一组一组地填充blast结果数据
    const allHitsAlignDetailsContainer = document.getElementById('all_hits_align_details');
    allHitsAlignDetailsContainer.querySelectorAll(':not(summary)').forEach(child => child.remove());

    // 获取并更新全局变量
    blastDataArray = getData('blastResultSingleJSON');
    currentResultSeqType = getData('blastResultSeqType'); // 当前展示的序列类型，跟随系统数据集改变
    currentQueryIndex = getData('currentBlastResultQueryIndex'); // 当前加载到的query索引，跟随系统数据集改变
    currentHitIndex = 0; // 当前加载到的对象索引，从0开始
    currentHspIndex = 0; // 当前加载到的hsp索引，从0开始

    loadNextBatch(); // 初始加载第一批数据

    // 实现滚动到底部加载更多数据
    document.getElementById('blast_result_container').addEventListener('scroll', (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 5) { // 接近底部时加载更多数据
            loadNextBatch();
        }
    });
}



export { updateAllHitsAlignDetails, loadBatchByIndex, updateBlastResultDetailsContainer, updateAlignSeqContainer, updateHitAreaAlignPlotHighlight };