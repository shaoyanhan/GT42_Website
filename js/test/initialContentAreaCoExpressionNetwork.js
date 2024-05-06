import { drawHubCoExpressionNetwork, drawSingleCoExpressionNetwork } from "./echartsEventsCoExpressionNetwork.js";
import { getData, updateData, fetchHubNetworkGraphJSON, fetchSingleNetworkGraphJSON } from "./data.js";
import { updateResultDetailsContainer } from "./resultDetailsContainer.js";
import { setupClickToDrawSingleNetworkEventListeners } from "./clickToDrawSingleNetwork.js";


// async function fetchGraphData() {
//     const url = 'http://127.0.0.1:8080/searchDatabase/getNetworkGraphJSONFile/?type=mosaic';  // URL指向Django服务器中的视图函数
//     try {
//         const response = await fetch(url); // 发送GET请求
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json(); // 解析JSON格式的响应体
//         return data // 在控制台输出数据，或者你可以在这里处理数据，比如更新DOM
//     } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//     }
// }

// async function getHubGraphData() {
//     const data = await fetchGraphData();
//     console.log(data);
//     return data;
// }

// async function fetchData(url) {
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data;
//     }
//     catch (error) {
//         console.error('数据请求失败:', error);
//         throw error; // 重新抛出错误，让调用者处理
//     }
// }

// async function getSingleGraphData() {
//     const response = await fetchData('http://127.0.0.1:8080/searchDatabase/getNetworkGraphJSON/?type=mosaic&searchKeyword=GT42G013405');
//     console.log(response);
//     return response.data;
// }


async function initalContentArea(searchKeyword = 'GT42G000001', keywordType = 'mosaic') {
    // hub网络的初始化较为卡顿，因此只能在页面载入时初始化，为了兼容searchEvents.js中的代码，
    // 当搜索事件发生时调用initialContentArea方法时，只调用initialSingleCoExpressionNetwork方法
    // initialHubCoExpressionNetwork(keywordType); 
    initialSingleCoExpressionNetwork(searchKeyword, keywordType);
    // loadingElement.style.display = 'none';
}

async function initialHubCoExpressionNetwork(networkResolution = 'mosaic') {
    // 更新全局变量currentHubNetworkType，用于判断用户点击的是哪种分辨率的网络元素
    updateData('currentHubNetworkType', networkResolution);

    const loadingElement = document.getElementById('hub_network_loading_container');
    loadingElement.style.display = 'block';

    // const graph = await getHubGraphData();

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

    // loadingElement.style.display = 'none';
    // 过渡动画，设置延迟时间之后隐藏loading动画，防止初始网络加载卡顿
    setTimeout(() => {
        loadingElement.style.display = 'none';
    }, 3000);
}

async function initialSingleCoExpressionNetwork(searchKeyword = 'GT42G000001', networkResolution = 'mosaic') {


    const loadingElement = document.getElementById('single_network_loading_container');
    loadingElement.style.display = 'block';

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
    console.log(networkType);
    let graph = getData(networkType);
    console.log(graph);



    // 根据当前的搜索关键词和当前的网络分辨率，判断是否需要重新请求数据，下面的算法间接实现了缓存机制
    let currentSearchKeywordType = networkResolution + 'CurrentSearchKeyword';
    let currentSearchKeyword = getData(currentSearchKeywordType); // 上次搜索的这个类型的关键词
    let currentSingleNetworkType = getData('currentSingleNetworkType'); // 上次绘制的网络分辨率是哪种类型

    // 如果当前的数据为空，那么直接请求相应类型的数据；如果当前的数据不为空，那么判断当前的搜索关键词是否上一次搜索已经搜索过了，如果上次没有搜索过，那么请求数据
    if (Object.keys(graph).length === 0 || searchKeyword !== currentSearchKeyword) {

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

    }
    // 当前的搜索关键词上一次搜索已经搜索过了，但是网络分辨率发生了改变，那么依旧需要重绘网络图，但是只需要用上次缓存的数据更新网络图即可
    else if (searchKeyword === currentSearchKeyword && networkResolution !== currentSingleNetworkType) {
        drawSingleCoExpressionNetwork(graph);
        // 更新全局变量currentHubNetworkType，用于判断用户点击的是哪种分辨率的网络元素
        updateData('currentSingleNetworkType', networkResolution);
    }


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
    updateResultDetailsContainer(singleNetworkResultDetailsData, singleNetworkResultDetailsContainer); // 初始化result details容器
    detailsContainer.open = true; // 数据已经到达，打开detailsContainer

    // 每次修改result details container之后，都需要重新设置链接的点击事件监听器，因为每次填充新的链接都会将之前的事件监听器清空
    setupClickToDrawSingleNetworkEventListeners(singleNetworkResultDetailsContainer);

    // 关闭loading动画
    loadingElement.style.display = 'none';

    // 过渡动画，设置延迟时间之后隐藏loading动画，防止初始网络加载卡顿
    // setTimeout(() => {
    //     loadingElement.style.display = 'none';
    // }, 1000);


}


export { initalContentArea, initialHubCoExpressionNetwork };