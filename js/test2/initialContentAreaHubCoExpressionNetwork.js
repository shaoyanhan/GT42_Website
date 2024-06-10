import { drawHubCoExpressionNetwork } from "./echartsEventsHubCoExpressionNetwork.js";
import { updateTableContainer, setUpPaginationEventListeners } from "./tablePagination.js";
import { getData, updateData, fetchHubNetworkGraphJSON } from "./data.js";
import { moveHighlightSliderByResolution, toggleButtonsDisabled } from "./hubNetworkSelectorContainerEvents.js";




async function initialHubCoExpressionNetwork(networkResolution = 'mosaic') {
    // 更新全局变量currentHubNetworkType，用于判断用户点击的是哪种分辨率的网络元素
    updateData('currentHubNetworkType', networkResolution);

    // 显示loading动画
    const loadingElement = document.getElementById('hub_network_loading_container');
    loadingElement.style.display = 'block';

    // 更新网络选择器容器中的高亮滑块
    let hub_network_selector_container = document.querySelector('#hub_network_selector_container');
    // 禁用所有精度选择按钮
    toggleButtonsDisabled(hub_network_selector_container, true);
    moveHighlightSliderByResolution(hub_network_selector_container, networkResolution);

    // 初始化时，由于用户还未点击任何图中的元素，将detailsContainer关闭，避免用户看到空白的detailsContainer
    let detailsContainer = document.querySelector('#hub_network_details_container');
    detailsContainer.open = false;

    // 如果此时不是第一次初始化，那么detailsContainer中的旧内容需要清空
    let resultDetailsContainer = document.querySelector('#hub_network_result_details_container');
    // 定位到result_details容器
    const resultDetails = resultDetailsContainer.querySelector('.result_details');
    resultDetails.innerHTML = '';

    // const graph = await getHubGraphData();

    // 根据networkResolution的类型，先尝试从全局变量中获取这种类型的数据，如果没有数据，那么请求数据
    let networkType = networkResolution + 'HubNetworkGraphJSON';
    console.log(networkType);
    let graph = getData(networkType);
    console.log(graph);
    if (Object.keys(graph).length === 0) {
        graph = await fetchHubNetworkGraphJSON(networkResolution);
        console.log(graph);
        updateData(networkType, graph);
    }

    drawHubCoExpressionNetwork(graph);


    // 关闭loading动画
    loadingElement.style.display = 'none';
    // 过渡动画，设置延迟时间之后隐藏loading动画，防止初始网络加载卡顿
    // setTimeout(() => {
    //     loadingElement.style.display = 'none';
    // }, 3000);

    // 启用所有精度选择按钮
    toggleButtonsDisabled(hub_network_selector_container, false);

    // 更新表格容器
    let hub_network_nodes_table_container_id = '#hub_network_nodes_table_container'
    let hub_network_edges_table_container_id = '#hub_network_edges_table_container'
    let hub_network_nodes_table_container = document.querySelector(hub_network_nodes_table_container_id); // 获取相应id的表格容器
    let hub_network_edges_table_container = document.querySelector(hub_network_edges_table_container_id);
    let networkNodesPaginationType = networkResolution + 'NetworkNodesPagination';
    let networkEdgesPaginationType = networkResolution + 'NetworkEdgesPagination';
    updateTableContainer(networkNodesPaginationType, 'all', 1, hub_network_nodes_table_container); // 初始化表格
    updateTableContainer(networkEdgesPaginationType, 'all', 1, hub_network_edges_table_container);
    setUpPaginationEventListeners(hub_network_nodes_table_container_id, networkNodesPaginationType + 'Data'); // 设置分页事件监听器
    setUpPaginationEventListeners(hub_network_edges_table_container_id, networkEdgesPaginationType + 'Data');
}



export { initialHubCoExpressionNetwork };