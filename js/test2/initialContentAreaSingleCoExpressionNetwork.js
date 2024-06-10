import { drawSingleCoExpressionNetwork } from "./echartsEventsSingleCoExpressionNetwork.js";

import { getData, updateData, fetchSingleNetworkGraphJSON, fetchRawData, validateGenomeID } from "./data.js";
import { updateResultDetailsContainer } from "./resultDetailsContainer.js";
import { setupClickToDrawSingleNetworkEventListeners } from "./clickToDrawSingleNetwork.js";
import { updateTableContainer, setUpPaginationEventListeners } from "./tablePagination.js";
import { moveHighlightSliderByResolution, toggleButtonsDisabled } from "./singleNetworkSelectorContainerEvents.js";
import { fillSelect, disableSelect } from "./selectEvents.js";


async function initalContentArea(searchKeyword, keywordType) { // 这里没有为keywordType设置默认值，请查看函数中的解释
    // hub网络的初始化较为卡顿，因此只能在页面载入时初始化，为了兼容searchEvents.js中的代码，
    // 当搜索事件发生时调用initialContentArea方法时，只调用initialSingleCoExpressionNetwork方法
    // initialHubCoExpressionNetwork(keywordType); 


    // setUpSelectEventListeners的代码只会填充searchKeyword，因此如果没有传入keywordType参数，需要自行查询searchKeyword的类型并填充
    if (!keywordType) {
        const response = await validateGenomeID(searchKeyword);
        keywordType = response.type;
    }
    initialSingleCoExpressionNetwork(searchKeyword, keywordType);
    // loadingElement.style.display = 'none';

    // 将搜索关键词填充到搜索框中
    let searchInput = document.getElementById('search_input');
    searchInput.value = searchKeyword;
}



// 返回数组中指定关键字的索引，如果没有找到，返回-1
function findIndexInArray(array, keyword) {
    return array.indexOf(keyword);
}

async function initialSingleCoExpressionNetwork(searchKeyword = 'GT42G000001', networkResolution = 'mosaic') {

    // 如果是第一次初始化，页面不滚动，展示hub网络；如果不是第一次初始化，那么滚动到指定元素
    // let firstInitialCoExpressionNetworkGraph = getData('firstInitialCoExpressionNetworkGraph');
    // if (!firstInitialCoExpressionNetworkGraph) {
    //     // 滚动到指定元素
    //     let jumpTargetElement = document.getElementById('drawSingleCoExpressionNetwork');
    //     //  'smooth' 选项会平滑地滚动到指定元素，而不是瞬间跳转，'center' 选项会将元素滚动到视口的中间( block: 'start' 为顶部 )
    //     jumpTargetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // }
    // updateData('firstInitialCoExpressionNetworkGraph', false);


    // 显示loading动画
    const loadingElement = document.getElementById('single_network_loading_container');
    loadingElement.style.display = 'block';

    // 更新网络选择器容器中的高亮滑块
    let single_network_selector_container = document.querySelector('#single_network_selector_container');
    // 禁用所有精度选择框的按钮
    toggleButtonsDisabled(single_network_selector_container, true);
    moveHighlightSliderByResolution(single_network_selector_container, networkResolution);

    // 禁用homologous_id_select选择框
    let homologousIDSelector = document.querySelector('#homologous_id_select');
    disableSelect(homologousIDSelector, true);

    // 初始化时，数据尚未到达之前，将detailsContainer关闭，避免用户看到空白的detailsContainer
    let detailsContainer = document.querySelector('#single_network_details_container');
    detailsContainer.open = false;

    // 如果此时不是第一次初始化，那么detailsContainer中的旧内容需要清空
    let resultDetailsContainer = document.querySelector('#single_network_result_details_container');
    // 定位到result_details容器
    const resultDetails = resultDetailsContainer.querySelector('.result_details');
    resultDetails.innerHTML = '';

    // const graph = await getSingleGraphData();

    // 根据networkResolution的类型，先尝试从全局变量中获取这种类型的数据，如果没有数据，那么请求数据
    let networkType = networkResolution + 'SingleNetworkGraphJSON';
    // console.log(networkType);
    let graph = getData(networkType);
    // console.log(graph);
    let isGraphDataEmpty = Object.keys(graph).length === 0;

    // 获取homologousIDSet，用于填充homologous_id_select选择框
    let homologousIDSet = getData('homologousIDSet');
    let isHomologousIDSetEmpty = Object.keys(homologousIDSet).length === 0;

    // 根据当前的搜索关键词和当前的网络分辨率，判断是否需要重新请求数据，下面的算法间接实现了缓存机制
    let currentSearchKeywordType = networkResolution + 'CurrentSearchKeyword';
    let currentSearchKeyword = getData(currentSearchKeywordType); // 上次搜索的这个类型的关键词
    let currentSingleNetworkType = getData('currentSingleNetworkType'); // 上次绘制的网络分辨率是哪种类型

    // 如果当前的数据为空，那么直接请求相应类型的数据；如果当前的数据不为空，那么判断当前的搜索关键词是否上一次搜索已经搜索过了，如果上次没有搜索过，那么请求数据
    if (isGraphDataEmpty || searchKeyword !== currentSearchKeyword) {

        let responseData = await fetchSingleNetworkGraphJSON(networkResolution, searchKeyword);
        console.log(responseData);
        updateData(networkType, responseData);
        graph = responseData.data;

        // 得到数据后绘制网络图，此处不将绘制放在外面是因为如果用户重复点击submit按钮，那么会重复绘制网络图
        drawSingleCoExpressionNetwork(graph);

        // searchKeyword发生了改变，此时既要更新currentSearchKeyword，又要更新currentSingleNetworkType
        updateData(currentSearchKeywordType, searchKeyword);
        // 更新全局变量currentHubNetworkType，用于判断用户点击的是哪种分辨率的网络元素
        updateData('currentSingleNetworkType', networkResolution);

        // console.log(getData('currentHubNetworkType'))
        // console.log(getData('currentSingleNetworkType'))
        // console.log(getData('mosaicCurrentSearchKeyword'));
        // console.log(getData('xenologousCurrentSearchKeyword'));
        // console.log(getData('geneCurrentSearchKeyword'));

        let mosaicID = searchKeyword.split('.')[0];
        // 检查homologousIDSet是否为空，或者mosaic数组是否不包含mosaicID，如果是，那么请求homologousIDSet数据
        if (isHomologousIDSetEmpty || !homologousIDSet.mosaic.includes(mosaicID)) {
            homologousIDSet = await fetchRawData('homologousIDSet', mosaicID);
            updateData('homologousIDSet', homologousIDSet);
            console.log('homologousIDSet', homologousIDSet);

        }
    }
    // 当前的搜索关键词上一次搜索已经搜索过了，但是网络分辨率发生了改变，那么依旧需要重绘网络图，但是只需要用上次缓存的数据更新网络图即可
    else if (searchKeyword === currentSearchKeyword && networkResolution !== currentSingleNetworkType) {
        drawSingleCoExpressionNetwork(graph);
        // 更新全局变量currentHubNetworkType，用于判断用户点击的是哪种分辨率的网络元素
        updateData('currentSingleNetworkType', networkResolution);
    }

    let searchKeywordIndex = findIndexInArray(homologousIDSet[networkResolution], searchKeyword);
    fillSelect(homologousIDSelector, homologousIDSet[networkResolution], searchKeywordIndex);


    // 初始化的时候，需要将搜索关键词对应的节点的详细信息显示在result details容器中
    // Array.prototype.forEach方法用于遍历数组的每个元素并执行一个函数，但它不返回任何值，因此使用
    // Array.prototype.find方法，它返回数组中满足提供的测试函数的第一个元素的值，否则返回undefined
    let nodeDetailsData = graph.nodes.find(node => {
        return node.name === searchKeyword;
    });
    console.log(nodeDetailsData);
    let singleNetworkResultDetailsContainer = document.querySelector('#single_network_result_details_container'); // 获取single网络的result details容器
    let updateFunctionType = 'singleNetworkNode';
    let singleNetworkResultDetailsData = { type: updateFunctionType, data: nodeDetailsData };
    updateResultDetailsContainer(singleNetworkResultDetailsData, singleNetworkResultDetailsContainer) // 初始化result details容器
        .then(() => { // 由于result details容器的内容是异步更新的，所以需要在更新完成后再设置链接的点击事件监听器
            // 每次修改result details container之后，都需要重新设置链接的点击事件监听器，因为每次填充新的链接都会将之前的事件监听器清空
            setupClickToDrawSingleNetworkEventListeners(singleNetworkResultDetailsContainer);

            // 数据已经到达，打开detailsContainer
            detailsContainer.open = true;

            // 关闭loading动画
            loadingElement.style.display = 'none';

            // 启用所有精度选择框的按钮
            toggleButtonsDisabled(single_network_selector_container, false);

            // 启用homologous_id_select选择框
            disableSelect(homologousIDSelector, false);
        })
        .catch(error => {
            console.error('Error:', error);  // 错误处理
        });


    // 过渡动画，设置延迟时间之后隐藏loading动画，防止初始网络加载卡顿
    // setTimeout(() => {
    //     loadingElement.style.display = 'none';
    // }, 1000);



    // 更新表格容器
    let single_network_nodes_table_container_id = '#single_network_nodes_table_container'
    let single_network_edges_table_container_id = '#single_network_edges_table_container'
    let single_network_nodes_table_container = document.querySelector(single_network_nodes_table_container_id); // 获取相应id的表格容器
    let single_network_edges_table_container = document.querySelector(single_network_edges_table_container_id);
    let networkNodesPaginationType = networkResolution + 'NetworkNodesPagination';
    let networkEdgesPaginationType = networkResolution + 'NetworkEdgesPagination';
    updateTableContainer(networkNodesPaginationType, searchKeyword, 1, single_network_nodes_table_container); // 初始化表格
    updateTableContainer(networkEdgesPaginationType, searchKeyword, 1, single_network_edges_table_container);
    setUpPaginationEventListeners(single_network_nodes_table_container_id, networkNodesPaginationType + 'Data'); // 设置分页事件监听器
    setUpPaginationEventListeners(single_network_edges_table_container_id, networkEdgesPaginationType + 'Data');

}


export { initalContentArea };