import { initialHubCoExpressionNetwork } from "./initialContentAreaHubCoExpressionNetwork.js";


const IDToHandlerMap = {
    '#hub_network_selector_container': hubNetworkSelectorContainerEventsHandlers,
    // '#single_network_selector_container': singleNetworkSelectorContainerEventsHandlers
};

// 将滑块移动到目标按钮
function moveHighlightSlider(container, targetButton) {
    const slider = container.querySelector('.highlight_slider');
    const index = targetButton.getAttribute('data_index');
    slider.style.left = `${index * 120 + (2 * index + 1) * 10}px`;
}

// 根据分辨率移动滑块
function moveHighlightSliderByResolution(container, resolution) {
    // 从容器中的按钮中找到data_resolution属性值为resolution的按钮
    const targetButton = container.querySelector(`button[data_resolution="${resolution}"]`);
    moveHighlightSlider(container, targetButton);
}

// 控制容器内所有按钮的禁用与否，disabled为true时禁用所有按钮，为false时启用所有按钮
function toggleButtonsDisabled(container, disabled) {
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => button.disabled = disabled);
}

function hubNetworkSelectorContainerEventsHandlers(event) {
    // event.currentTarget 总是指向添加了事件监听器的元素，无论事件处理函数是如何定义的。也可以考虑使用闭包
    const container = event.currentTarget;
    const target = event.target;

    // 如果点击的不是按钮，直接返回
    if (target.tagName !== 'BUTTON') {
        return;
    }

    // 将滑块移动到目标按钮
    moveHighlightSlider(container, target);

    // 按照点击按钮中存储的精度类型切换网络类型
    const data_resolution = target.getAttribute('data_resolution');
    initialHubCoExpressionNetwork(data_resolution);
}




function setupNetworkSelectorContainerEventsListeners(containerID) {

    const container = document.querySelector(containerID);
    if (!container) {
        console.error(`The container with ID ${containerID} is not found`);
        return;
    }
    const eventHandler = IDToHandlerMap[containerID];
    container.addEventListener('click', eventHandler);

}

export { setupNetworkSelectorContainerEventsListeners, moveHighlightSliderByResolution, toggleButtonsDisabled };