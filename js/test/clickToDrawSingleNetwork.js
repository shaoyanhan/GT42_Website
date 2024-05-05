import { initalContentArea } from "./initialContentAreaCoExpressionNetwork.js";
import { showCustomAlert } from "./showCustomAlert.js";


function createLinkClickHandler() {
    return function (event) {
        event.preventDefault();
        let link = event.target;
        // 获取链接标签所夹的文本
        let genomeID = link.textContent;
        showCustomAlert(`You clicked on ${genomeID}`);
    };

}

function setupClickToDrawSingleNetworkEventListeners() {
    // 获取所有具有特定类名的链接
    let links = document.querySelectorAll('.click_to_draw_single_network');

    const linkClickHandler = createLinkClickHandler();
    // 为这些链接添加点击事件监听器
    links.forEach(function (link) {
        link.addEventListener('click', linkClickHandler);
    });
}

export { setupClickToDrawSingleNetworkEventListeners };