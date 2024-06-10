import { singleCoExpressionNetworkChart } from "./mainSingleCoExpressionNetwork.js";
import { getSingleCoExpressionNetworkOption } from "./echartsOptionSingleCoExpressionNetwork.js";
import { updateResultDetailsContainer } from "./resultDetailsContainer.js";
import { setupClickToDrawSingleNetworkEventListeners } from "./clickToDrawSingleNetwork.js";



function drawSingleCoExpressionNetwork(graph) {
    singleCoExpressionNetworkChart.setOption(getSingleCoExpressionNetworkOption(graph));
}



function clickSingleCoExpressionNetworkEventsHandler(params) {
    console.log(params);

    let detailsContainer = document.querySelector('#single_network_details_container');
    // 保证用户点击时，details标签是打开的
    detailsContainer.open = true;

    let singleNetworkResultDetailsContainer = document.querySelector('#single_network_result_details_container'); // 获取single网络的result details容器
    let updateFunctionType = params.dataType === 'node' ? 'singleNetworkNode' : 'singleNetworkEdge'; // 判断用户点击的是节点还是边，并选择相应的更新函数

    let singleNetworkResultDetailsData = { type: updateFunctionType, data: params.data };



    updateResultDetailsContainer(singleNetworkResultDetailsData, singleNetworkResultDetailsContainer) // 初始化result details容器
        .then(() => { // 由于result details容器的内容是异步更新的，所以需要在更新完成后再设置链接的点击事件监听器
            // 每次修改result details container之后，都需要重新设置链接的点击事件监听器，因为每次填充新的链接都会将之前的事件监听器清空
            setupClickToDrawSingleNetworkEventListeners(singleNetworkResultDetailsContainer);
        })
        .catch(error => {
            console.error('Error:', error);  // 错误处理
        });
}

export { drawSingleCoExpressionNetwork, clickSingleCoExpressionNetworkEventsHandler };