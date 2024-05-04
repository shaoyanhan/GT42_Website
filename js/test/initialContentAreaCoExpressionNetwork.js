import { drawHubCoExpressionNetwork, drawSingleCoExpressionNetwork } from "./echartsEventsCoExpressionNetwork.js";

async function fetchGraphData() {
    const url = 'http://127.0.0.1:8080/searchDatabase/getNetworkGraphJSONFile/?type=mosaic';  // URL指向Django服务器中的视图函数
    try {
        const response = await fetch(url); // 发送GET请求
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); // 解析JSON格式的响应体
        return data // 在控制台输出数据，或者你可以在这里处理数据，比如更新DOM
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function getHubGraphData() {
    const data = await fetchGraphData();
    console.log(data);
    return data;
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('数据请求失败:', error);
        throw error; // 重新抛出错误，让调用者处理
    }
}

async function getSingleGraphData() {
    const response = await fetchData('http://127.0.0.1:8080/searchDatabase/getNetworkGraphJSON/?type=mosaic&searchKeyword=GT42G000001');
    console.log(response);
    return response.data;
}


async function initalContentArea(searchKeyword = 'GT42G000001', keywordType = 'mosaic') {

    initialHubCoExpressionNetwork(keywordType);
    initialSingleCoExpressionNetwork(searchKeyword, keywordType);
    // loadingElement.style.display = 'none';
}

async function initialHubCoExpressionNetwork(networkResolution = 'mosaic') {
    const loadingElement = document.getElementById('hub_network_loading_container');
    loadingElement.style.display = 'block';

    const graph = await getHubGraphData();
    drawHubCoExpressionNetwork(graph);

    loadingElement.style.display = 'none';
}

async function initialSingleCoExpressionNetwork(searchKeyword = "GT42G000001", networkResolution = 'mosaic') {
    const loadingElement = document.getElementById('single_network_loading_container');
    loadingElement.style.display = 'block';

    const graph = await getSingleGraphData();
    drawSingleCoExpressionNetwork(graph);

    loadingElement.style.display = 'none';
}


export { initalContentArea };