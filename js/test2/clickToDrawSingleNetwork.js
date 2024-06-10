import { initalContentArea } from "./initialContentAreaSingleCoExpressionNetwork.js";
import { showCustomAlert } from "./showCustomAlert.js";
import { validateGenomeID } from "./data.js"

async function clickToDrawSingleNetwork(linkElement) {
    // 获取链接标签所夹的文本，并调用validateGenomeID函数验证genomeID的类型
    const genomeID = linkElement.textContent;
    const response = await validateGenomeID(genomeID);
    const IDType = response.type;


    initalContentArea(genomeID, IDType);
}

function createLinkClickHandler() {
    return function (event) {
        event.preventDefault();
        let link = event.target;
        clickToDrawSingleNetwork(link);

        // showCustomAlert(`You clicked on ${genomeID}`);
    };

}

function setupClickToDrawSingleNetworkEventListeners(container) {
    // 获取某个容器下的所有具有特定类名的链接
    let links = container.querySelectorAll('.click_to_draw_single_network');
    // console.log(links);

    const linkClickHandler = createLinkClickHandler();
    // 为这些链接添加点击事件监听器
    links.forEach(function (link) {
        link.addEventListener('click', linkClickHandler);
    });
}

export { setupClickToDrawSingleNetworkEventListeners };