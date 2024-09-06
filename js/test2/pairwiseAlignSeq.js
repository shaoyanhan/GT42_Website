const blastResultNucleotide = {
    "query_id": "Query_1",
    "query_len": 1071,
    "subject_id": "GT42G003238",
    "subject_len": 2883,
    "bit_score": 311.357,
    "score": 168,
    "e_value": 1.72208e-83,
    "identity": 1071,
    "query_from": 709,
    "query_to": 1071,
    "query_strand": "Plus",
    "hit_from": 700,
    "hit_to": 1062,
    "hit_strand": "Plus",
    "align_len": 364,
    "gaps": 2,
    "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
    "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
    "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
};

const blastResultPeptide = {
    "query_id": "Query_1",
    "query_len": 357,
    "subject_id": "GT42G003238",
    "subject_len": 357,
    "bit_score": 311.357,
    "score": 168,
    "e_value": 1.72208e-83,
    "identity": 1071,
    "positive": 1071,
    "query_from": 71,
    "query_to": 150,
    "hit_from": 52,
    "hit_to": 129,
    "align_len": 80,
    "gaps": 2,
    "qseq": "PSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPA----PAADQIKAAN-ASASIGSGEPEEEEHREMNGGSKAGVVLGT",
    "hseq": "PLLRPP-TSPTTAASDD----PFVIDDFLDEDDFTTPSPSVARPPRAARVDAASPVFAKITVSDP--KKHAEPSGAGAAGVIPGS",
    "midline": "P L PP TSP  A S D    P   D++  +DD  +PSP+    P A ++ AA+   A I   +P  ++H E +G   AGV+ G+"
};




// 创建一个函数，用于创建碱基元素：<span class="base C" data-position="709" data-type="query">C</span>
function createBaseElement(base, position, type) {
    const span = document.createElement('span');
    span.className = `base ${base.toUpperCase()}`;
    span.textContent = base.toUpperCase();
    span.setAttribute('data-position', position);
    span.setAttribute('data-type', type);

    return span;
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
    console.log('resultContainer:', resultContainer);
    resultContainer.appendChild(creatLegendElement(baseType));

    // 每三行为一组，分别是query行，midline行和subject行，逐一填充按照chunkSize长度切割后的序列
    for (let i = 0; i < query.length; i += chunkSize) {
        // slice是左闭右开区间
        const qChunk = query.slice(i, i + chunkSize);
        const sChunk = subject.slice(i, i + chunkSize);
        const mChunk = midline.slice(i, i + chunkSize);

        // 这里不能写 qPos + chunkSize - 1; 因为最后一行可能不足chunkSize个碱基
        const qEndPos = qPos + qChunk.length - 1;
        const sEndPos = sPos + sChunk.length - 1;

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
// let resultContainer = document.getElementById('align_seq_container_1');
// visualizeBlastResult(blastResultNucleotide, chunkSize, 'nucleotide', resultContainer);
// visualizeBlastResult(blastResultPeptide, chunkSize, 'peptide', resultContainer);

function testScrollAndDownload() {
    let detailsContainer = document.getElementById('all_hits_align_details');
    // 清空除了summary之外的所有子元素
    detailsContainer.querySelectorAll(':not(summary)').forEach(child => child.remove());

    for (let i = 0; i < 10; i++) {
        let alignResultContainer = document.createElement('div');
        alignResultContainer.id = `align_seq_result_container_${i}`;

        let toolNavBar = `
        <div class="tool_nav_bar">
            <div class="select_download_type">
                <div class="group_header">
                    <span class="text">Download</span>
                    <span class="arrow">▼</span>
                </div>

                <div class="link_list">
                    <ul class="download_types">
                        <li><a class="download_align_area_pic" index="${i}">Alignment Area Picture</a></li>
                        <li><a class="download_align_seq_pic" index="${i}">Alignment Sequence Picture</a></li>
                        <li><a class="download_align_seq_file" index="${i}">Alignment Sequence File</a></li>
                    </ul>
                </div>
            </div>

            <div class="page_turning_tools">
                <div class="page_turning to_top" index="${i}">
                    <span class="text">Top</span>
                    <span class="arrow">▲</span>
                </div>
                <div class="page_turning to_previous" index="${i}">
                    <span class="text">Previous</span>
                    <span class="arrow">▲</span>
                </div>
                <div class="page_turning to_next" index="${i}">
                    <span class="text">Next</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="page_turning to_bottom" index="${i}">
                    <span class="text">Bottom</span>
                    <span class="arrow">▼</span>
                </div>
            </div>
        </div>`;

        let resultDetailsPlotContainer = `
        <div class="result_details_plot_container">
            <div class="result_details_container" id="blast_result_details_container_${i}">
                <!-- 下面必须使用两个div嵌套才能实现内容溢出的时候不会覆盖圆角框和矩形框之间的底部间隔 -->
                <div class="content_box">
                    <h1 class="main_title">Result Details</h1>
                    <div class="result_details">
                        <div class="item_container">
                            <div class="item_title">Query ID</div>
                            <div class="item_content">Query_1</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Query Length</div>
                            <div class="item_content">1071</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Subject ID</div>
                            <div class="item_content">GT42G003238</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Subject Length</div>
                            <div class="item_content">2883</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Bit Score</div>
                            <div class="item_content">311.357</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Score</div>
                            <div class="item_content">168</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">E-value</div>
                            <div class="item_content">1.72208e-83</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Identity</div>
                            <div class="item_content">1071</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Query From</div>
                            <div class="item_content">709</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Query To</div>
                            <div class="item_content">1071</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Query Strand</div>
                            <div class="item_content">Plus</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Hit From</div>
                            <div class="item_content">700</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Hit To</div>
                            <div class="item_content">1062</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Hit Strand</div>
                            <div class="item_content">Plus</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Alignment Length</div>
                            <div class="item_content">364</div>
                        </div>
                        <div class="item_container">
                            <div class="item_title">Gaps</div>
                            <div class="item_content">2</div>
                        </div>
                    </div>
                </div>
            </div>
            <svg class="hit_area_align_plot" id="hit_area_align_plot_${i}" width="900" height="500"></svg>

        </div>`;

        let alignSeqContainer = `<div class="align_seq_container" id="align_seq_container_${i}"></div>`;

        alignResultContainer.innerHTML = toolNavBar + resultDetailsPlotContainer + alignSeqContainer;
        detailsContainer.appendChild(alignResultContainer);
    }

    // 为序列匹配结果的导航栏的四个结果跳转按钮添加点击事件
    detailsContainer.querySelectorAll('.page_turning').forEach(pageTurning => {
        pageTurning.addEventListener('click', function () {
            let index = parseInt(this.getAttribute('index'));
            if (index === 0 && this.classList.contains('to_top') ||
                index === 0 && this.classList.contains('to_previous') ||
                index === 9 && this.classList.contains('to_next') ||
                index === 9 && this.classList.contains('to_bottom')) {
                return;
            }

            // 移动到id为align_seq_result_container_i的标签
            let idPrefix = 'align_seq_result_container_';

            if (this.classList.contains('to_top')) {
                index = 0;
            }
            else if (this.classList.contains('to_previous')) {
                index -= 1;
            }
            else if (this.classList.contains('to_next')) {
                index += 1;
            }
            else if (this.classList.contains('to_bottom')) {
                index = 9;
            }

            let targetElement = document.getElementById(idPrefix + index);
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // 使用经典的SVG序列化方法，为d3.js生成的SVG图像添加下载功能
    d3.selectAll('.download_align_area_pic').on('click', function () {
        // 获取当前点击的按钮的index属性，用于定位对应的svg元素
        const index = d3.select(this).attr('index');
        const svg = document.getElementById(`hit_area_align_plot_${index}`);

        // 将SVG相关的CSS样式内嵌到SVG中，以便下载后的图片样式正确
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        // 从css文件中截取的样式
        styleElement.innerHTML = `
            .hit_area_align_plot .hit {
                fill: steelblue;
                opacity: 0.5;
                cursor: pointer;
            }
            .hit_area_align_plot .highlighted {
                stroke: red;
                stroke-width: 2;
                stroke-dasharray: 4;
                opacity: 0.8;
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
        downloadLink.download = `Alignment_Area_Picture_${index}.svg`;

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
    document.querySelectorAll('.download_align_seq_pic').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('index');
            const targetDiv = document.getElementById(`align_seq_container_${index}`);

            // 获取div标签组的HTML内容
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
            downloadLink.download = `Alignment_Sequence_Container_${index}.html`;

            // 触发下载
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // 释放URL对象
            URL.revokeObjectURL(url);
        });
    });

}
// testScrollAndDownload();
// let resultContainer = document.getElementById('align_seq_container_1');
// visualizeBlastResult(blastResultNucleotide, chunkSize, 'nucleotide', resultContainer);





// const dataArray = [
//     {
//         "query_id": "Query_1",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
//     {
//         "query_id": "Query_2",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
//     {
//         "query_id": "Query_3",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
//     {
//         "query_id": "Query_4",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
//     {
//         "query_id": "Query_5",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
//     {
//         "query_id": "Query_6",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
//     {
//         "query_id": "Query_7",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
//     {
//         "query_id": "Query_8",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
//     {
//         "query_id": "Query_9",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
//     {
//         "query_id": "Query_10",
//         "query_len": 1071,
//         "subject_id": "GT42G003238",
//         "subject_len": 2883,
//         "bit_score": 311.357,
//         "score": 168,
//         "e_value": 1.72208e-83,
//         "identity": 1071,
//         "query_from": 709,
//         "query_to": 1071,
//         "query_strand": "Plus",
//         "hit_from": 700,
//         "hit_to": 1062,
//         "hit_strand": "Plus",
//         "align_len": 364,
//         "gaps": 2,
//         "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
//         "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
//         "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
//     },
// ];

let blastDataArrayNucleotide = [
    {
        "report": {
            "program": "blastn",
            "version": "BLASTN 2.16.0+",
            "reference": "Zheng Zhang, Scott Schwartz, Lukas Wagner, and Webb Miller (2000), \"A greedy algorithm for aligning DNA sequences\", J Comput Biol 2000; 7(1-2):203-14.",
            "search_target": {
                "db": "mosaic_nucleotide"
            },
            "params": {
                "expect": 10,
                "sc_match": 1,
                "sc_mismatch": -2,
                "gap_open": 0,
                "gap_extend": 0,
                "filter": "L;m;"
            },
            "results": {
                "search": {
                    "query_id": "Query_1",
                    "query_title": "q1",
                    "query_len": 1071,
                    "query_masking": [
                        {
                            "from": 19,
                            "to": 93
                        }
                    ],
                    "hits": [
                        {
                            "num": 1,
                            "description": [
                                {
                                    "id": "GT42G000001",
                                    "accession": "GT42G000001",
                                    "title": ""
                                }
                            ],
                            "len": 6648,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 1978.88,
                                    "score": 1071,
                                    "evalue": 0,
                                    "identity": 1071,
                                    "query_from": 1,
                                    "query_to": 1071,
                                    "query_strand": "Plus",
                                    "hit_from": 1,
                                    "hit_to": 1071,
                                    "hit_strand": "Plus",
                                    "align_len": 1071,
                                    "gaps": 0,
                                    "qseq": "GGGAAGAAGAGCACGCCAActcctccggctcttctcctcctccagtccaccggcagcaccaccaccacctccctcctccagtcctcctgccaccGCGCGGCCCCAACCACAGCACAGCATAATGGCGGGCAACGGCGCCATCGTGGAGAGCGACCCGCTGAACTGGGGCGCGGCGGCAGCGGAGCTGGCGGGGAGCCACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCACCGCCGCACCAAGGACGGGCCCGCTCTCCAGGTCGAGCTGCTCAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
                                    "hseq": "GGGAAGAAGAGCACGCCAACTCCTCCGGCTCTTCTCCTCCTCCAGTCCACCGGCAGCACCACCACCACCTCCCTCCTCCAGTCCTCCTGCCACCGCGCGGCCCCAACCACAGCACAGCATAATGGCGGGCAACGGCGCCATCGTGGAGAGCGACCCGCTGAACTGGGGCGCGGCGGCAGCGGAGCTGGCGGGGAGCCACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCACCGCCGCACCAAGGACGGGCCCGCTCTCCAGGTCGAGCTGCTCAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
                                    "midline": "|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
                                },
                                {
                                    "num": 2,
                                    "bit_score": 710.234,
                                    "score": 384,
                                    "evalue": 0,
                                    "identity": 398,
                                    "query_from": 509,
                                    "query_to": 913,
                                    "query_strand": "Plus",
                                    "hit_from": 2000,
                                    "hit_to": 2404,
                                    "hit_strand": "Plus",
                                    "align_len": 405,
                                    "gaps": 0,
                                    "qseq": "TCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCACCGCCGCACCAAGGACGGGCCCGCTCTCCAGGTCGAGCTGCTCAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCG",
                                    "hseq": "TCACCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCACCGCCGCACCAAGGACGGGCCCGCTCTCCAGGTCGAGCTGCTCAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGTCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCAAGGACGCGTCGGGCG",
                                    "midline": "|| |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| |||||||||||||||||||||||| |||||||||||||||||||||||||||||||||||||||||||||||||||||||||    |||||||||||"
                                },
                                {
                                    "num": 3,
                                    "bit_score": 684.381,
                                    "score": 370,
                                    "evalue": 0,
                                    "identity": 370,
                                    "query_from": 702,
                                    "query_to": 1071,
                                    "query_strand": "Plus",
                                    "hit_from": 3948,
                                    "hit_to": 4317,
                                    "hit_strand": "Plus",
                                    "align_len": 370,
                                    "gaps": 0,
                                    "qseq": "CAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
                                    "hseq": "CAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
                                    "midline": "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
                                },
                                {
                                    "num": 4,
                                    "bit_score": 411.077,
                                    "score": 222,
                                    "evalue": 1.65052e-113,
                                    "identity": 222,
                                    "query_from": 415,
                                    "query_to": 636,
                                    "query_strand": "Plus",
                                    "hit_from": 197,
                                    "hit_to": 418,
                                    "hit_strand": "Plus",
                                    "align_len": 222,
                                    "gaps": 0,
                                    "qseq": "CACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "hseq": "CACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "midline": "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
                                },
                                {
                                    "num": 5,
                                    "bit_score": 411.077,
                                    "score": 222,
                                    "evalue": 1.65052e-113,
                                    "identity": 222,
                                    "query_from": 197,
                                    "query_to": 418,
                                    "query_strand": "Plus",
                                    "hit_from": 415,
                                    "hit_to": 636,
                                    "hit_strand": "Plus",
                                    "align_len": 222,
                                    "gaps": 0,
                                    "qseq": "CACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "hseq": "CACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "midline": "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
                                },
                                {
                                    "num": 6,
                                    "bit_score": 342.75,
                                    "score": 185,
                                    "evalue": 6.1067e-93,
                                    "identity": 187,
                                    "query_from": 518,
                                    "query_to": 705,
                                    "query_strand": "Plus",
                                    "hit_from": 2387,
                                    "hit_to": 2574,
                                    "hit_strand": "Plus",
                                    "align_len": 188,
                                    "gaps": 0,
                                    "qseq": "CCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCACCGCCGCACCAAGGACGGGCCCGCTCTCCAGGTCGAGCTGCTCAGG",
                                    "hseq": "CCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCCCCGCCGCACCAAGGACGGGCCCGCTCTCCAGGTCGAGCTGCTCAGG",
                                    "midline": "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| ||||||||||||||||||||||||||||||||||||||||||||||"
                                },
                                {
                                    "num": 7,
                                    "bit_score": 231.952,
                                    "score": 125,
                                    "evalue": 1.37919e-59,
                                    "identity": 127,
                                    "query_from": 291,
                                    "query_to": 418,
                                    "query_strand": "Plus",
                                    "hit_from": 2000,
                                    "hit_to": 2127,
                                    "hit_strand": "Plus",
                                    "align_len": 128,
                                    "gaps": 0,
                                    "qseq": "TCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "hseq": "TCACCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "midline": "|| |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
                                },
                                {
                                    "num": 8,
                                    "bit_score": 220.872,
                                    "score": 119,
                                    "evalue": 2.98541e-56,
                                    "identity": 119,
                                    "query_from": 300,
                                    "query_to": 418,
                                    "query_strand": "Plus",
                                    "hit_from": 2387,
                                    "hit_to": 2505,
                                    "hit_strand": "Plus",
                                    "align_len": 119,
                                    "gaps": 0,
                                    "qseq": "CCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "hseq": "CCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "midline": "|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
                                }
                            ]
                        },
                        {
                            "num": 2,
                            "description": [
                                {
                                    "id": "GT42G022956",
                                    "accession": "GT42G022956",
                                    "title": ""
                                }
                            ],
                            "len": 2076,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 662.221,
                                    "score": 358,
                                    "evalue": 0,
                                    "identity": 366,
                                    "query_from": 702,
                                    "query_to": 1071,
                                    "query_strand": "Plus",
                                    "hit_from": 1726,
                                    "hit_to": 1357,
                                    "hit_strand": "Minus",
                                    "align_len": 370,
                                    "gaps": 0,
                                    "qseq": "CAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
                                    "hseq": "CAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCTTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCAGGCCACCACCGTCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAGGGCCTCGCC",
                                    "midline": "|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| |||||||||||||||||||||||||||||||||||||||||||||||| |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| || ||||||"
                                }
                            ]
                        },
                        {
                            "num": 3,
                            "description": [
                                {
                                    "id": "GT42G000002",
                                    "accession": "GT42G000002",
                                    "title": ""
                                }
                            ],
                            "len": 5887,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 540.342,
                                    "score": 292,
                                    "evalue": 2.0176e-152,
                                    "identity": 544,
                                    "query_from": 415,
                                    "query_to": 1071,
                                    "query_strand": "Plus",
                                    "hit_from": 343,
                                    "hit_to": 996,
                                    "hit_strand": "Plus",
                                    "align_len": 665,
                                    "gaps": 19,
                                    "qseq": "CACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGC-CGCCAAGGACGCGTCG-GGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGA-CTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCACCGCCGCACCAAGGACGGGCCCGCTCTCCAGGTCGAGCTGCTCAGGCAT-CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAAC---G-CGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
                                    "hseq": "CACCTGGAGGAGGTGAAGCGGATGGTGGCGGAGTTCCGCGAACCGGTGGTGAAGATCCAGGGCGCGAGCCTGAGCATCGCGCAGGTGGCCGCCGTGGCCGCGGGCGCCGG-CG-G-CGAGGC-CCG-CGTGGAGCTGGACGAGTCCGCGCGCGAGCGCGTCAAGGCCAGCAGCGACTGGGTCAT-GAGCAGCATGATGAACGGCACCGACAGCTACGGCGTCACCACCGGCTTCGGCGCCACCTCCCACCGCCGCACCAAGGAAGGCGGCGCGCTCCAGAGGGAGCTCATCA-GATTCCTCAATGCCGGCGCCTTCGGCACCGGCGCCGACGGCCACGTGCTGCCGGCCGAGGCCACCCGCGCGGCGATGCTCGTGCGCATCAACACCCTCCTCCAGGGCTACTCCGGCATCCGCTTCGAGATCCTCGAGGCCATCGCCAAGCTGCTCAACGCCAACGTCACGCCGTGCCTGCCGCTGCGGGGCACCATCACCGCGTCGGGCGACCTCGTGCCGCTCTCCTACATTGCGGGACTCATCACGGGCCGCCAGAACTCCGTCGC-GGTGGCC-CC--CGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGCATCGAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGCCTCGCC",
                                    "midline": "|||||||| ||||||||||| ||||||||| ||  |||  | || |||||||||||| ||||| | |  ||  || |||  |||||||||||||| |||||  ||   || || | || |||  || ||| ||||| ||||||   || |||   |||||||||||||||||||| ||| || | || | ||||     |||||  ||||| |||||||||||||||||||||||||| |||||||||||||||||||||||| ||   ||| ||||||   |||||  ||| |  | ||||| |||||   |||||||||||||  ||| ||||||  ||||||| | |||| |  ||||||||||||||| |||||||||||||||||||||||||||||||| |||||||||||||||||||| ||||||||| |||||||||||||| ||   ||||  |||||||||||||| |||||||||||||||||||||||||||||||| |||||||||||||| || || ||||||||||||||||  |||   | ||| ||   || ||  |||||| ||||||||||||||||| |||||||||||||||||||||||||||  |||||||||| ||||  | ||||||||||| ||||||"
                                }
                            ]
                        },
                        {
                            "num": 4,
                            "description": [
                                {
                                    "id": "GT42G000097",
                                    "accession": "GT42G000097",
                                    "title": ""
                                }
                            ],
                            "len": 3496,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 512.642,
                                    "score": 277,
                                    "evalue": 4.39833e-144,
                                    "identity": 340,
                                    "query_from": 702,
                                    "query_to": 1071,
                                    "query_strand": "Plus",
                                    "hit_from": 1311,
                                    "hit_to": 1680,
                                    "hit_strand": "Plus",
                                    "align_len": 371,
                                    "gaps": 2,
                                    "qseq": "CAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTC-CGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
                                    "hseq": "CAGGCATCTCAATGCCGGAATCTTCGGCAATGGCTCCGACGGCCACACGCTCCCGTCCGAGGT-TTCACGCGCGGCCATGCTGGTCCGCATCAACACCCTCCTCCAGGGCTACTCCGGCATCCGCTTCGAGATCCTCGAGACCATCACCAAGCTCCTCAACACGGGCGTCAGCCCGTGCCTGCCGCTGCGGGGCACCATCACGGCGTCGGGCGACCTCGTCCCGCTGTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCAGGCCGTCACCGTGGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGGTGGCCGGCATCGAGGGCGGCTTCTTCAAGCTTAACCCCAAGGAGGGCCTCGCC",
                                    "midline": "|||||||||||| ||||||||||||||||  |||  ||| ||||||||||| ||||| |||||  || |||||||| |||||||| ||||||||||||||||||||||||||||| |||||||||||||||||||| ||| ||||||||||||| |||||||| || |||||||||||||||||||| |||||||||||||| ||||||||||||||||||||||| |||||||||||||||||||||||||||||||||||||||||||||  |||| | |||||||||||||||||||||||||||||||||||| | ||||||||||||||||||||||||||||| ||||||||||| || ||||||"
                                },
                                {
                                    "num": 2,
                                    "bit_score": 399.997,
                                    "score": 216,
                                    "evalue": 3.57274e-110,
                                    "identity": 266,
                                    "query_from": 415,
                                    "query_to": 705,
                                    "query_strand": "Plus",
                                    "hit_from": 203,
                                    "hit_to": 493,
                                    "hit_strand": "Plus",
                                    "align_len": 291,
                                    "gaps": 0,
                                    "qseq": "CACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCACCGCCGCACCAAGGACGGGCCCGCTCTCCAGGTCGAGCTGCTCAGG",
                                    "hseq": "CACCTCGACGAGGTGAAGCGTATGGTGGCGCAGTTCCGCGACCCCATCGTCAAGATCGAGGGCTCCACCCTCCGGGTCGGCCAGGTGGCGGCCGTGGCAGCGGCCAAGGACGCGTCCGGCGTGGCCGTCGAGCTGGACGAGGAGGCCCGGCCCCGAGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCGCACCGACGTACCAAGGACGGGCCCGCGCTCCAGGTCGAGCTGCTCAGG",
                                    "midline": "||||| |||||||||||||| ||||||||||||  |||  | ||| | || ||||||||||||||||| ||||| |||||||||||||| ||||| || || |||||||||||||| ||||| ||||||||||| |||||||||||||| ||||| |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| ||||| || ||||||||||||||||| |||||||||||||||||||||"
                                },
                                {
                                    "num": 3,
                                    "bit_score": 374.144,
                                    "score": 202,
                                    "evalue": 2.1655e-102,
                                    "identity": 266,
                                    "query_from": 121,
                                    "query_to": 418,
                                    "query_strand": "Plus",
                                    "hit_from": 127,
                                    "hit_to": 424,
                                    "hit_strand": "Plus",
                                    "align_len": 298,
                                    "gaps": 0,
                                    "qseq": "AATGGCGGGCAACGGCGCCATCGTGGAGAGCGACCCGCTGAACTGGGGCGCGGCGGCAGCGGAGCTGGCGGGGAGCCACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGCGTCGGGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "hseq": "AATGGCGAGCAACACGGCCATCCTCGAGAGCGACCCGCTCAACTGGGGCAAGGCGGCCGCGGAGCTGACGGGGAGCCACCTCGACGAGGTGAAGCGTATGGTGGCGCAGTTCCGCGACCCCATCGTCAAGATCGAGGGCTCCACCCTCCGGGTCGGCCAGGTGGCGGCCGTGGCAGCGGCCAAGGACGCGTCCGGCGTGGCCGTCGAGCTGGACGAGGAGGCCCGGCCCCGAGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACC",
                                    "midline": "||||||| |||||   |||||| | |||||||||||||| |||||||||  |||||| ||||||||| ||||||||||||| |||||||||||||| ||||||||||||  |||  | ||| | || ||||||||||||||||| ||||| |||||||||||||| ||||| || || |||||||||||||| ||||| ||||||||||| |||||||||||||| ||||| ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
                                }
                            ]
                        },
                        {
                            "num": 5,
                            "description": [
                                {
                                    "id": "GT42G004106",
                                    "accession": "GT42G004106",
                                    "title": ""
                                }
                            ],
                            "len": 2738,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 453.549,
                                    "score": 245,
                                    "evalue": 2.7039e-126,
                                    "identity": 521,
                                    "query_from": 415,
                                    "query_to": 1067,
                                    "query_strand": "Plus",
                                    "hit_from": 296,
                                    "hit_to": 942,
                                    "hit_strand": "Plus",
                                    "align_len": 656,
                                    "gaps": 12,
                                    "qseq": "CACCTGGACGAGGTGAAGCGCATGGTGGCGCAGGCCCGGCAGCCCGTGGTGAAGATCGAGGGCTCCACGCTCCGCGTCGGCCAGGTGGCCGCCGTCGCCGCCGCCAAGGACGC-GTCG-GGCGTCGCCGTCGAGCTCGACGAGGAGGCCCGCCCCCGCGTCAAGGCCAGCAGCGAGTGGATCCTCGACTGCATCGCCCACGGCGGCGACATCTACGGCGTCACCACCGGCTTCGGCGGCACCTCCCACCGCCGCACCAAGGACGGGC-CCGCTCTCCAGGTCGAGCTGCTCAGGCATCTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCT",
                                    "hseq": "CACCTCGACGAGGTGAAGCGGATGGTCGCCGAGTACCGCCAGCCCTTGGTGAAGATCGAGGGCGCCAGCCTCCGCATCGCGCAGGTGGCCGCCGT-G--GCCGCC--GG-CGCTGGCGAGGC-CCG-CGTCGAGCTCGACGAGTCCGCCCGTGGCCGGGTCAAGGCCAGCAGCGACTGGGTCATGAACAGCATGATGAACGGCACCGACAGCTACGGCGTCACCACCGGCTTCGGCGCCACGTCCCACAGGAGGACCAAGGA-GGGCGGCGCTCTCCAGAGGGAGCTCATCCGGTTCCTCAACGCTGGCGCATTCGGCACCGGCACCGACGGCCACGTCCTGCCGGCCGAGGCCACGCGTGCGGCCATGCTCGTCCGCATCAACACCCTCCTCCAGGGCTACTCCGGGATCCGCTTCGAGATCCTCGAGGCGATCGTCAAGCTGCTCAACGCCAACGTCACGCCGTGCCTGCCGCTCCGCGGCACGGTCACCGCGTCCGGCGACCTCGTGCCGCTCTCCTACATTGCCGGCCTCGTCACCGGGCGTGAGAACTCTGTTGCAGTCGCCCCGGATGGCAGCAAGGTGAACGCCGCAGAGGCGTTCAAGATTGCCGGCATCCAGGGCGGCTTCTTCGAGCTGCAGCCCAAGGAGGGTCT",
                                    "midline": "||||| |||||||||||||| ||||| ||  ||  ||| |||||| ||||||||||||||||| |||  |||||| |||  |||||||||||||| |  ||||||  || ||| | || |||  || ||||||||||||||||   |||||   ||| ||||||||||||||||| ||| || |  || ||||     |||||  ||||| |||||||||||||||||||||||||| ||| |||||| |  | |||||||| ||||  ||||||||||   |||||  || ||   |||||||| ||    ||||||||||||| ||| ||||||   |||||| | |||| |   || ||||| ||||| || ||||||||||||||||||||||||||||| || ||||||||||||||||| ||||| |||  ||||||||||||| ||   ||||  ||||||||||||||||| |||||  |||||||||| ||||||||||| |||||||||||||| ||||||||| |||| || ||    ||| |    ||   | ||   || || || |||||| ||||||| |||||||||||||| ||||||||| |||||||||||||| ||||  | |||||||| |||||"
                                }
                            ]
                        },
                        {
                            "num": 6,
                            "description": [
                                {
                                    "id": "GT42G022914",
                                    "accession": "GT42G022914",
                                    "title": ""
                                }
                            ],
                            "len": 2173,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 388.917,
                                    "score": 210,
                                    "evalue": 7.73362e-107,
                                    "identity": 316,
                                    "query_from": 709,
                                    "query_to": 1071,
                                    "query_strand": "Plus",
                                    "hit_from": 2013,
                                    "hit_to": 1651,
                                    "hit_strand": "Minus",
                                    "align_len": 367,
                                    "gaps": 8,
                                    "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAAC---G-CGCAGGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
                                    "hseq": "CTCAATGCCGGCGCCTTCGGCACCGGCGCCGACGGCCACGTGCTGCCGGCCGAGGCCACCCGCGCGGCGATGCTCGTGCGCATCAACACCCTCCTCCAGGGCTACTCCGGCATCCGCTTCGAGATCCTCGAGGCCATCGCCAAGCTGCTCAACGCCAACGTCACGCCGTGCCTGCCGCTGCGGGGCACCATCACCGCGTCGGGCGACCTCGTGCCGCTCTCCTACATTGCGGGACTCATCACGGGCCGCCAGAACTCCGTCGC-GGTGGCC-CC--CGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGCATCGAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGCCTCGCC",
                                    "midline": "||||| |||||   |||||||||||||  ||| ||||||  ||||||| | |||| |  ||||||||||||||| |||||||||||||||||||||||||||||||| |||||||||||||||||||| ||||||||| |||||||||||||| ||   ||||  |||||||||||||| |||||||||||||||||||||||||||||||| |||||||||||||| || || ||||||||||||||||  |||   | ||| ||   || ||  |||||| ||||||||||||||||| |||||||||||||||||||||||||||  |||||||||| ||||  | ||||||||||| ||||||"
                                }
                            ]
                        },
                        {
                            "num": 7,
                            "description": [
                                {
                                    "id": "GT42G003238",
                                    "accession": "GT42G003238",
                                    "title": ""
                                }
                            ],
                            "len": 2883,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 311.357,
                                    "score": 168,
                                    "evalue": 1.72208e-83,
                                    "identity": 1071,
                                    "query_from": 709,
                                    "query_to": 1071,
                                    "query_strand": "Plus",
                                    "hit_from": 700,
                                    "hit_to": 1062,
                                    "hit_strand": "Plus",
                                    "align_len": 364,
                                    "gaps": 2,
                                    "qseq": "CTCAACGCCGGAATCTTCGGCACCGGCAGCGATGGCCACACGCTGCCGTCGGAGGTCGTCCGCGCGGCGATGCTGGTGCGCATCAACACCCTCCTCCAGGGCTACTCGGGCATCCGCTTCGAGATCCTGGAGGCCATCACCAAGCTGCTCAACACCGGGGTCAGCCCGTGCCTGCCGCTCCGGGGCACCATCACCGCGTCGGGCGACCTCGTCCCGCTCTCCTACATCGCCGGCCTCATCACGGGCCGCCCCAACGCGCA-GGCCACCACCATCGACGGGAGGAAGGTGGACGCCGCCGAGGCGTTCAAGATCGCCGGCATCGAGGGCGGCTTCTTCAAGCTCAACCCCAAGGAAGGTCTCGCC",
                                    "hseq": "CTTAATGCCGGAGCGTTCGGGACCGGCGACGACGGCCACGTGCTGCCGGCGGCGGCCACGCGCGCCGCGATGCTCGTCCGCATCAACACCCTGCTGCAGGGCTACTCCGGCATCCGCTTCGAGATCCTGGAGACGATCGCCGCGCTGCTCAACGCCAACGTGACGCCGTGCCTGCCGCTGAGGGGCACCATCACCGCGTCGGGCGACCTGGTCCCGCTCTCCTACATCGCGGGACTCGTCACCGGCCGGCCCAACTC-CACGGCGGTGGCGCCCGACGGCAGGAAGGTGGACGCCGCGGAGGCGTTCAAGATCGCCGGGATCCAGCACGGCTTCTTCGAGCTGCAGCCCAAGGAAGGGCTCGCC",
                                    "midline": "|| || ||||||   ||||| ||||||  ||| ||||||  ||||||| ||| || |   ||||| |||||||| || |||||||||||||| || ||||||||||| |||||||||||||||||||||||| | ||| ||  |||||||||| ||   || |  ||||||||||||||  |||||||||||||||||||||||||||| |||||||||||||||||||| || ||| |||| ||||| |||||| | || |||     |   |||||| ||||||||||||||||| |||||||||||||||||||| ||| ||  |||||||||| ||||  | ||||||||||| ||||||"
                                }
                            ]
                        }
                    ],
                    "stat": {
                        "db_num": 29945,
                        "db_len": 88856201,
                        "hsp_len": 26,
                        "eff_space": 92041124395,
                        "kappa": 0.46,
                        "lambda": 1.28,
                        "entropy": 0.85
                    }
                }
            }
        }
    },
    {
        "report": {
            "program": "blastn",
            "version": "BLASTN 2.16.0+",
            "reference": "Zheng Zhang, Scott Schwartz, Lukas Wagner, and Webb Miller (2000), \"A greedy algorithm for aligning DNA sequences\", J Comput Biol 2000; 7(1-2):203-14.",
            "search_target": {
                "db": "mosaic_nucleotide"
            },
            "params": {
                "expect": 10,
                "sc_match": 1,
                "sc_mismatch": -2,
                "gap_open": 0,
                "gap_extend": 0,
                "filter": "L;m;"
            },
            "results": {
                "search": {
                    "query_id": "Query_2",
                    "query_title": "q2",
                    "query_len": 286,
                    "hits": [
                        {
                            "num": 1,
                            "description": [
                                {
                                    "id": "GT42G016702",
                                    "accession": "GT42G016702",
                                    "title": ""
                                }
                            ],
                            "len": 4219,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 529.262,
                                    "score": 286,
                                    "evalue": 1.09116e-149,
                                    "identity": 286,
                                    "query_from": 1,
                                    "query_to": 286,
                                    "query_strand": "Plus",
                                    "hit_from": 242,
                                    "hit_to": 527,
                                    "hit_strand": "Plus",
                                    "align_len": 286,
                                    "gaps": 0,
                                    "qseq": "GTGGGTGGCAGCGCTGGTCCAGCGGGAGGTGCGCGCCCAGATGGTGGCGGAGGAGGAGAGGCGCATCACGCGCGACCGCCTGCGCGCCGCGGTGGAGGAGTCGGCCGCCCGCCGCCGCCAGCTTGCGGACGAGGTGGAGCTCTGGGCTGGGTACTGCGCCTGCTCCGCCATTCTGGGCGGGTGGGCCGTGGGCGCCGGGTTGGCGATGCTGTTGTTTGCTCGCTGAAAGGGAGGGTCTTGTCAAGGCGGGTGAGAACGATAGGGATGCCAGTTGAGTATGTTAGAG",
                                    "hseq": "GTGGGTGGCAGCGCTGGTCCAGCGGGAGGTGCGCGCCCAGATGGTGGCGGAGGAGGAGAGGCGCATCACGCGCGACCGCCTGCGCGCCGCGGTGGAGGAGTCGGCCGCCCGCCGCCGCCAGCTTGCGGACGAGGTGGAGCTCTGGGCTGGGTACTGCGCCTGCTCCGCCATTCTGGGCGGGTGGGCCGTGGGCGCCGGGTTGGCGATGCTGTTGTTTGCTCGCTGAAAGGGAGGGTCTTGTCAAGGCGGGTGAGAACGATAGGGATGCCAGTTGAGTATGTTAGAG",
                                    "midline": "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
                                }
                            ]
                        }
                    ],
                    "stat": {
                        "db_num": 29945,
                        "db_len": 88856201,
                        "hsp_len": 25,
                        "eff_space": 22996077336,
                        "kappa": 0.46,
                        "lambda": 1.28,
                        "entropy": 0.85
                    }
                }
            }
        }
    }
];

let blastDataArrayPeptide = [
    {
        "report": {
            "program": "blastp",
            "version": "BLASTP 2.16.0+",
            "reference": "Stephen F. Altschul, Thomas L. Madden, Alejandro A. Sch&auml;ffer, Jinghui Zhang, Zheng Zhang, Webb Miller, and David J. Lipman (1997), \"Gapped BLAST and PSI-BLAST: a new generation of protein database search programs\", Nucleic Acids Res. 25:3389-3402.",
            "search_target": {
                "db": "transcript_peptide"
            },
            "params": {
                "matrix": "BLOSUM62",
                "expect": 10,
                "gap_open": 11,
                "gap_extend": 1,
                "filter": "F",
                "cbs": 2
            },
            "results": {
                "search": {
                    "query_id": "Query_1",
                    "query_title": "unnamed protein product",
                    "query_len": 186,
                    "hits": [
                        {
                            "num": 1,
                            "description": [
                                {
                                    "id": "GT42G017641.SO.1.1",
                                    "accession": "GT42G017641.SO.1.1",
                                    "title": ""
                                }
                            ],
                            "len": 187,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 357.836,
                                    "score": 917,
                                    "evalue": 2.84225e-127,
                                    "identity": 186,
                                    "positive": 186,
                                    "query_from": 1,
                                    "query_to": 186,
                                    "hit_from": 1,
                                    "hit_to": 186,
                                    "align_len": 186,
                                    "gaps": 0,
                                    "qseq": "MAPPALPRALTVLLLLLLASTARSQEEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPAPAADQIKAANASASIGSGEPEEEEHREMNGGSKAGVVLGTFAAATVLGLGVFVWRKRRANIRRARYADYAARLELV",
                                    "hseq": "MAPPALPRALTVLLLLLLASTARSQEEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPAPAADQIKAANASASIGSGEPEEEEHREMNGGSKAGVVLGTFAAATVLGLGVFVWRKRRANIRRARYADYAARLELV",
                                    "midline": "MAPPALPRALTVLLLLLLASTARSQEEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPAPAADQIKAANASASIGSGEPEEEEHREMNGGSKAGVVLGTFAAATVLGLGVFVWRKRRANIRRARYADYAARLELV"
                                }
                            ]
                        },
                        {
                            "num": 2,
                            "description": [
                                {
                                    "id": "GT42G004718.SO.4.5",
                                    "accession": "GT42G004718.SO.4.5",
                                    "title": ""
                                }
                            ],
                            "len": 383,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 31.9574,
                                    "score": 71,
                                    "evalue": 2.15253,
                                    "identity": 31,
                                    "positive": 45,
                                    "query_from": 71,
                                    "query_to": 150,
                                    "hit_from": 52,
                                    "hit_to": 129,
                                    "align_len": 85,
                                    "gaps": 12,
                                    "qseq": "PSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPA----PAADQIKAAN-ASASIGSGEPEEEEHREMNGGSKAGVVLGT",
                                    "hseq": "PLLRPP-TSPTTAASDD----PFVIDDFLDEDDFTTPSPSVARPPRAARVDAASPVFAKITVSDP--KKHAEPSGAGAAGVIPGS",
                                    "midline": "P L PP TSP  A S D    P   D++  +DD  +PSP+    P A ++ AA+   A I   +P  ++H E +G   AGV+ G+"
                                }
                            ]
                        },
                        {
                            "num": 3,
                            "description": [
                                {
                                    "id": "GT42G004718.SO.4.4",
                                    "accession": "GT42G004718.SO.4.4",
                                    "title": ""
                                }
                            ],
                            "len": 485,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 31.9574,
                                    "score": 71,
                                    "evalue": 2.27514,
                                    "identity": 31,
                                    "positive": 45,
                                    "query_from": 71,
                                    "query_to": 150,
                                    "hit_from": 61,
                                    "hit_to": 138,
                                    "align_len": 85,
                                    "gaps": 12,
                                    "qseq": "PSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPA----PAADQIKAAN-ASASIGSGEPEEEEHREMNGGSKAGVVLGT",
                                    "hseq": "PLLRPP-TSPTTAASDD----PFVIDDFLDEDDFTTPSPSVARPPRAARVDAASPVFAKITVSDP--KKHAEPSGAGAAGVIPGS",
                                    "midline": "P L PP TSP  A S D    P   D++  +DD  +PSP+    P A ++ AA+   A I   +P  ++H E +G   AGV+ G+"
                                }
                            ]
                        },
                        {
                            "num": 4,
                            "description": [
                                {
                                    "id": "GT42G004718.SO.4.1",
                                    "accession": "GT42G004718.SO.4.1",
                                    "title": ""
                                }
                            ],
                            "len": 511,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 31.5722,
                                    "score": 70,
                                    "evalue": 2.49498,
                                    "identity": 31,
                                    "positive": 45,
                                    "query_from": 71,
                                    "query_to": 150,
                                    "hit_from": 40,
                                    "hit_to": 117,
                                    "align_len": 85,
                                    "gaps": 12,
                                    "qseq": "PSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPA----PAADQIKAAN-ASASIGSGEPEEEEHREMNGGSKAGVVLGT",
                                    "hseq": "PLLRPP-TSPTTAASDD----PFVIDDFLDEDDFTTPSPSVARPPRAARVDAASPVFAKITVSDP--KKHAEPSGAGAAGVIPGS",
                                    "midline": "P L PP TSP  A S D    P   D++  +DD  +PSP+    P A ++ AA+   A I   +P  ++H E +G   AGV+ G+"
                                }
                            ]
                        },
                        {
                            "num": 5,
                            "description": [
                                {
                                    "id": "GT42G004718.SO.2.2",
                                    "accession": "GT42G004718.SO.2.2",
                                    "title": ""
                                }
                            ],
                            "len": 405,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 31.5722,
                                    "score": 70,
                                    "evalue": 2.52784,
                                    "identity": 31,
                                    "positive": 45,
                                    "query_from": 71,
                                    "query_to": 150,
                                    "hit_from": 74,
                                    "hit_to": 151,
                                    "align_len": 85,
                                    "gaps": 12,
                                    "qseq": "PSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPA----PAADQIKAAN-ASASIGSGEPEEEEHREMNGGSKAGVVLGT",
                                    "hseq": "PLLRPP-TSPTTAASDD----PFVIDDFLDEDDFTTPSPSVARPPRAARVDAASPVFAKITVSDP--KKHAEPSGAGAAGVIPGS",
                                    "midline": "P L PP TSP  A S D    P   D++  +DD  +PSP+    P A ++ AA+   A I   +P  ++H E +G   AGV+ G+"
                                }
                            ]
                        },
                        {
                            "num": 6,
                            "description": [
                                {
                                    "id": "GT42G004718.SO.2.1",
                                    "accession": "GT42G004718.SO.2.1",
                                    "title": ""
                                }
                            ],
                            "len": 492,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 31.5722,
                                    "score": 70,
                                    "evalue": 2.66401,
                                    "identity": 31,
                                    "positive": 45,
                                    "query_from": 71,
                                    "query_to": 150,
                                    "hit_from": 75,
                                    "hit_to": 152,
                                    "align_len": 85,
                                    "gaps": 12,
                                    "qseq": "PSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPA----PAADQIKAAN-ASASIGSGEPEEEEHREMNGGSKAGVVLGT",
                                    "hseq": "PLLRPP-TSPTTAASDD----PFVIDDFLDEDDFTTPSPSVARPPRAARVDAASPVFAKITVSDP--KKHAEPSGAGAAGVIPGS",
                                    "midline": "P L PP TSP  A S D    P   D++  +DD  +PSP+    P A ++ AA+   A I   +P  ++H E +G   AGV+ G+"
                                }
                            ]
                        },
                        {
                            "num": 7,
                            "description": [
                                {
                                    "id": "GT42G004718.SO.4.2",
                                    "accession": "GT42G004718.SO.4.2",
                                    "title": ""
                                }
                            ],
                            "len": 483,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 31.5722,
                                    "score": 70,
                                    "evalue": 2.80335,
                                    "identity": 31,
                                    "positive": 45,
                                    "query_from": 71,
                                    "query_to": 150,
                                    "hit_from": 68,
                                    "hit_to": 145,
                                    "align_len": 85,
                                    "gaps": 12,
                                    "qseq": "PSLPPPKTSPVAAPSSDTPAHPPAADEYKGDDDSKSPSPA----PAADQIKAAN-ASASIGSGEPEEEEHREMNGGSKAGVVLGT",
                                    "hseq": "PLLRPP-TSPTTAASDD----PFVIDDFLDEDDFTTPSPSVARPPRAARVDAASPVFAKITVSDP--KKHAEPSGAGAAGVIPGS",
                                    "midline": "P L PP TSP  A S D    P   D++  +DD  +PSP+    P A ++ AA+   A I   +P  ++H E +G   AGV+ G+"
                                }
                            ]
                        },
                        {
                            "num": 8,
                            "description": [
                                {
                                    "id": "GT42G001440.SO.5.1",
                                    "accession": "GT42G001440.SO.5.1",
                                    "title": ""
                                }
                            ],
                            "len": 1026,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 31.187,
                                    "score": 69,
                                    "evalue": 4.07132,
                                    "identity": 30,
                                    "positive": 44,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSK---AD--VSEQPMT-PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    AD  ++  P++ P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 9,
                            "description": [
                                {
                                    "id": "GT42G001440.SO.4.1",
                                    "accession": "GT42G001440.SO.4.1",
                                    "title": ""
                                }
                            ],
                            "len": 772,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.8018,
                                    "score": 68,
                                    "evalue": 5.5354,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 10,
                            "description": [
                                {
                                    "id": "GT42G001440.SO.1.1",
                                    "accession": "GT42G001440.SO.1.1",
                                    "title": ""
                                }
                            ],
                            "len": 1027,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.8018,
                                    "score": 68,
                                    "evalue": 6.11909,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKTDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 11,
                            "description": [
                                {
                                    "id": "GT42G001440.SO.4.2",
                                    "accession": "GT42G001440.SO.4.2",
                                    "title": ""
                                }
                            ],
                            "len": 1025,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.4166,
                                    "score": 67,
                                    "evalue": 6.69724,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 12,
                            "description": [
                                {
                                    "id": "GT42G001440.SO.3.4",
                                    "accession": "GT42G001440.SO.3.4",
                                    "title": ""
                                }
                            ],
                            "len": 1026,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.4166,
                                    "score": 67,
                                    "evalue": 6.82001,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEEKQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 13,
                            "description": [
                                {
                                    "id": "GT42G001440.SO.6.1",
                                    "accession": "GT42G001440.SO.6.1",
                                    "title": ""
                                }
                            ],
                            "len": 1026,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.4166,
                                    "score": 67,
                                    "evalue": 6.88196,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 14,
                            "description": [
                                {
                                    "id": "GT42G001440.SO.2.2",
                                    "accession": "GT42G001440.SO.2.2",
                                    "title": ""
                                }
                            ],
                            "len": 1026,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.4166,
                                    "score": 67,
                                    "evalue": 7.39815,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 15,
                            "description": [
                                {
                                    "id": "GT42G001440.SS.1.1",
                                    "accession": "GT42G001440.SS.1.1",
                                    "title": ""
                                }
                            ],
                            "len": 1026,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.4166,
                                    "score": 67,
                                    "evalue": 7.39815,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 16,
                            "description": [
                                {
                                    "id": "GT42G001440.SS.1.3",
                                    "accession": "GT42G001440.SS.1.3",
                                    "title": ""
                                }
                            ],
                            "len": 960,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.0314,
                                    "score": 66,
                                    "evalue": 9.30505,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 61,
                                    "hit_to": 145,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 17,
                            "description": [
                                {
                                    "id": "GT42G001440.SS.2.1",
                                    "accession": "GT42G001440.SS.2.1",
                                    "title": ""
                                }
                            ],
                            "len": 877,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.0314,
                                    "score": 66,
                                    "evalue": 9.31188,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        },
                        {
                            "num": 18,
                            "description": [
                                {
                                    "id": "GT42G001440.SS.2.5",
                                    "accession": "GT42G001440.SS.2.5",
                                    "title": ""
                                }
                            ],
                            "len": 683,
                            "hsps": [
                                {
                                    "num": 1,
                                    "bit_score": 30.0314,
                                    "score": 66,
                                    "evalue": 9.8254,
                                    "identity": 27,
                                    "positive": 40,
                                    "query_from": 26,
                                    "query_to": 114,
                                    "hit_from": 127,
                                    "hit_to": 211,
                                    "align_len": 91,
                                    "gaps": 8,
                                    "qseq": "EEAPSPTAEPPASAPLAADYQLAHSPISHPPTASAPSAADTAADAPSLPP-PKTSPVAAP-SSDTPAHPPAADEYKGDDDSKSPSPAPAAD",
                                    "hseq": "EEAHSISNESPVSKADVSEQSMT------PQTPTHPSVAEEKIDGSTEAPASKVGDAEAPETSQSPGHPSTVEENQDHQDSKHSGPSDEAE",
                                    "midline": "EEA S + E P S    ++  +       P T + PS A+   D  +  P  K     AP +S +P HP   +E +   DSK   P+  A+"
                                }
                            ]
                        }
                    ],
                    "stat": {
                        "db_num": 292099,
                        "db_len": 131431772,
                        "hsp_len": 109,
                        "eff_space": 7668659537,
                        "kappa": 0.041,
                        "lambda": 0.267,
                        "entropy": 0.14
                    }
                }
            }
        }
    }
]

let blastDataArray = blastDataArrayNucleotide;


const batchSize = 2; // 每批加载的数量
let currentQueryIndex = 0; // 当前加载到的query索引，为了编码简洁统一，从0开始
let currentHitIndex = 0; // 当前加载到的对象索引，从0开始
let currentHspIndex = 0; // 当前加载到的hsp索引，从0开始
let currentSeqType = 'nucleotide'; // 当前展示的序列类型
// currentSeqType = 'peptide'; // 当前展示的序列类型

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
// 使用动态值
let currentQueryID = dynamicValues.currentQueryID;
let currentQueryLen = dynamicValues.currentQueryLen;

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
    return {
        "queryIndex": queryIndex,
        "hitIndex": hitIndex,
        "hspIndex": hspIndex,
        ...queryInfo,
        ...subjectInfo,
        ...hsp
    };
}

function updateBlastResultDetailsContainer(queryIndex, hitIndex, hspIndex) {
    let objectData = getObjectDataByIndex(queryIndex, hitIndex, hspIndex);
    let blastResultDetailsContainer = document.getElementById(`blast_result_details_container_${hitIndex}`);
    blastResultDetailsContainer.innerHTML = '';
    blastResultDetailsContainer.innerHTML = `
        <div class="content_box">
            <h1 class="main_title">Result Details</h1>
            <div class="result_details">
                ${getResultDetails(objectData)}
            </div>
        </div>
        `;
}

function updateAlignSeqContainer(queryIndex, hitIndex, hspIndex) {
    let objectData = getObjectDataByIndex(queryIndex, hitIndex, hspIndex);
    let alignSeqContainer = document.getElementById(`align_seq_container_${hitIndex}`);
    alignSeqContainer.innerHTML = '';
    visualizeBlastResult(objectData, chunkSize, currentSeqType, alignSeqContainer);
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
            updateBlastResultDetailsContainer(currentQueryIndex, targetPolygon.attr("hitIndex"), targetPolygon.attr("hspIndex"));
            updateAlignSeqContainer(currentQueryIndex, targetPolygon.attr("hitIndex"), targetPolygon.attr("hspIndex"));
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

// let currentParamsOfBlastOutput = {
//     queryIndex: 1,
//     hitIndex: 1,
//     hspIndex: 1,

//     seqType: 'nucleotide',

//     query_id: 'Query_1',
//     query_len: 286,
// };

function getResultDetails(objectData) {
    if (currentSeqType === 'nucleotide') {
        return `
            <div class="item_container">
                <div class="item_title">Query Index</div>
                <div class="item_content">${objectData.queryIndex}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit Index</div>
                <div class="item_content">${objectData.hitIndex}</div>
            </div>
            <div class="item_container">
                <div class="item_title">HSP Index</div>
                <div class="item_content">${objectData.hspIndex}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query ID</div>
                <div class="item_content">${objectData.query_id}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query Length</div>
                <div class="item_content">${objectData.query_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Subject ID</div>
                <div class="item_content">${objectData.subject_id}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Subject Length</div>
                <div class="item_content">${objectData.subject_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Bit Score</div>
                <div class="item_content">${objectData.bit_score}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Score</div>
                <div class="item_content">${objectData.score}</div>
            </div>
            <div class="item_container">
                <div class="item_title">E-value</div>
                <div class="item_content">${objectData.evalue}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Identity</div>
                <div class="item_content">${objectData.identity}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query From</div>
                <div class="item_content">${objectData.query_from}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query To</div>
                <div class="item_content">${objectData.query_to}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query Strand</div>
                <div class="item_content">${objectData.query_strand}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit From</div>
                <div class="item_content">${objectData.hit_from}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit To</div>
                <div class="item_content">${objectData.hit_to}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit Strand</div>
                <div class="item_content">${objectData.hit_strand}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Alignment Length</div>
                <div class="item_content">${objectData.align_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Gaps</div>
                <div class="item_content">${objectData.gaps}</div>
            </div>
        `;
    } else {
        return `
            <div class="item_container">
                <div class="item_title">Query Index</div>
                <div class="item_content">${objectData.queryIndex}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit Index</div>
                <div class="item_content">${objectData.hitIndex}</div>
            </div>
            <div class="item_container">
                <div class="item_title">HSP Index</div>
                <div class="item_content">${objectData.hspIndex}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query ID</div>
                <div class="item_content">${objectData.query_id}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query Length</div>
                <div class="item_content">${objectData.query_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Subject ID</div>
                <div class="item_content">${objectData.subject_id}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Subject Length</div>
                <div class="item_content">${objectData.subject_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Bit Score</div>
                <div class="item_content">${objectData.bit_score}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Score</div>
                <div class="item_content">${objectData.score}</div>
            </div>
            <div class="item_container">
                <div class="item_title">E-value</div>
                <div class="item_content">${objectData.evalue}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Identity</div>
                <div class="item_content">${objectData.identity}</div>
            </div>
            <div class="item_container">
                <div class="item_title">positive</div>
                <div class="item_content">${objectData.positive}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query From</div>
                <div class="item_content">${objectData.query_from}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Query To</div>
                <div class="item_content">${objectData.query_to}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit From</div>
                <div class="item_content">${objectData.hit_from}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Hit To</div>
                <div class="item_content">${objectData.hit_to}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Alignment Length</div>
                <div class="item_content">${objectData.align_len}</div>
            </div>
            <div class="item_container">
                <div class="item_title">Gaps</div>
                <div class="item_content">${objectData.gaps}</div>
            </div>
        `;
    }

}


function loadNextBatch() {
    // 获取容器元素，向其中一组一组地填充数据
    const container = document.getElementById('all_hits_align_details');

    // 第一次填充的时候，清空除了summary之外的所有子元素
    if (currentHitIndex === 0) {
        container.querySelectorAll(':not(summary)').forEach(child => child.remove());
    }

    // 一次性加载 batchSize 个数据
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

function loadRemainingData() {
    let hitArrayLength = dynamicValues.currentHitArray.length;
    while (currentHitIndex < hitArrayLength) {
        loadNextBatch();
    }
}

function createAlignSeqResultContainer(objectData, hitIndex) {
    console.log('createAlignSeqResultContainer', objectData, hitIndex);

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
                    <li><a class="download_align_seq_file" hitIndex="${hitIndex}">Alignment Sequence File</a></li>
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
    // 每行展示的碱基数量
    const chunkSize = 50;
    visualizeBlastResult(objectData, chunkSize, currentSeqType, alignSeqContainer);


    // 为序列匹配结果的导航栏的四个结果跳转按钮添加点击事件
    alignSeqResultContainer.querySelectorAll('.page_turning').forEach(pageTurning => {
        pageTurning.addEventListener('click', function () {
            let hitIndex = parseInt(this.getAttribute('hitIndex'));
            let hitArrayLength = dynamicValues.currentHitArray.length;
            if (hitIndex === 0 && this.classList.contains('to_top') ||
                hitIndex === 0 && this.classList.contains('to_previous') ||
                hitIndex === hitArrayLength - 1 && this.classList.contains('to_next') ||
                hitIndex === hitArrayLength - 1 && this.classList.contains('to_bottom')) {
                return;
            }

            // 移动到id为align_seq_result_container_i的标签
            let idPrefix = 'align_seq_result_container_';

            if (this.classList.contains('to_top')) {
                hitIndex = 0;
            }
            else if (this.classList.contains('to_previous')) {
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

            let targetElement = document.getElementById(idPrefix + hitIndex);
            // 获取最外层的 details 元素作为滚动容器，让内部的元素在这个视界内滚动
            let scrollContainer = document.getElementById('blast_result_container');

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

    // 使用经典的SVG序列化方法，为d3.js生成的SVG图像添加下载功能
    alignSeqResultContainer.querySelector('.download_align_area_pic').addEventListener('click', function () {
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
                opacity: 0.5;
                cursor: pointer;
            }
            .hit_area_align_plot .highlighted {
                stroke: red;
                stroke-width: 2;
                stroke-dasharray: 4;
                opacity: 0.8;
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

    return alignSeqResultContainer;
}


document.addEventListener('DOMContentLoaded', () => {
    loadNextBatch(); // 初始加载第一批数据

    // 实现滚动到底部加载更多数据
    document.getElementById('blast_result_container').addEventListener('scroll', (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 5) { // 接近底部时加载更多数据
            loadNextBatch();
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    let blastnButton = document.getElementById('blastn');
    let blastpButton = document.getElementById('blastp');
    let blastResultContainer = document.getElementById('blast_result_container');
    blastnButton.addEventListener('click', function () {
        currentSeqType = 'nucleotide';
        blastDataArray = blastDataArrayNucleotide;
        allHitsBarPlotData = allHitsBarPlotDataNucleotide;
        allHitsTableData = allHitsTableDataNucleotide;

        // 将blastResultContainer这个details标签的open属性设置为true，展开details标签
        blastResultContainer.setAttribute('open', '');

        // 重新加载数据
        option = getAllHitsBarPlotOption(allHitsBarPlotData);
        myChart.setOption(option);

        populateTable(allHitsTableData);
        updateTableFooter(allHitsTableData);

        currentHitIndex = 0;
        loadNextBatch();
    });

    blastpButton.addEventListener('click', function () {
        currentSeqType = 'peptide';
        blastDataArray = blastDataArrayPeptide;
        allHitsBarPlotData = allHitsBarPlotDataPeptide;
        allHitsTableData = allHitsTableDataPeptide;

        // 将blastResultContainer这个details标签的open属性设置为true，展开details标签
        blastResultContainer.setAttribute('open', '');

        // 重新加载数据
        option = getAllHitsBarPlotOption(allHitsBarPlotData);
        myChart.setOption(option);

        populateTable(allHitsTableData);
        updateTableFooter(allHitsTableData);

        currentHitIndex = 0;
        loadNextBatch();
    });
});
