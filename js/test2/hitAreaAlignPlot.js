// 模拟的BLAST结果数据
const blastData = [
    { queryStart: 709, queryEnd: 1071, subjectStart: 2013, subjectEnd: 1651 },
    { queryStart: 709, queryEnd: 1071, subjectStart: 700, subjectEnd: 1062 },
];

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
    let xScaleQuery = d3.scaleLinear()
        .domain([0, 1071]) // query序列的长度
        .range([margin.left, width - margin.right]);
    let xScaleSubject = d3.scaleLinear()
        .domain([0, 2883])  // subject序列的长度
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
        .attr("points", d => { // 设置四边形的四个顶点坐标
            const x1 = xScaleQuery(d.queryStart); // 使用查询序列的起始位置d.queryStart计算第一个顶点的x坐标。xScaleQuery是一个比例尺函数，将序列位置映射到SVG的x坐标。
            const x2 = xScaleQuery(d.queryEnd);
            const y1 = margin.top + 10;
            const y2 = height - margin.bottom - 10;
            const x3 = xScaleSubject(d.subjectStart);
            const x4 = xScaleSubject(d.subjectEnd);
            return `${x1},${y1} ${x2},${y1} ${x4},${y2} ${x3},${y2}`; // 返回四个顶点的坐标, 用空格分隔, 顺时针方向绘制
        })
        .on("click", function (event, d) { // 为每个多边形添加一个点击事件处理函数
            const isHighlighted = d3.select(this).classed("highlighted");
            hitGroup.selectAll(".hit").classed("highlighted", false);
            if (!isHighlighted) {
                d3.select(this).classed("highlighted", true);
            }
        });

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
            const x1 = newXScaleQuery(d.queryStart);
            const x2 = newXScaleQuery(d.queryEnd);
            const y1 = margin.top + 10;
            const y2 = height - margin.bottom - 10;
            const x3 = newXScaleSubject(d.subjectStart);
            const x4 = newXScaleSubject(d.subjectEnd);
            return `${x1},${y1} ${x2},${y1} ${x4},${y2} ${x3},${y2}`;
        });
    }

    // 将 hitGroup 提升到SVG的顶部，确保匹配区域在所有其他元素之上，从而避免被rect元素遮挡
    hitGroup.raise();
}

drawHitAreaAlignPlot(blastData, "#hit_area_align_plot_1");