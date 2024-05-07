
const IDToHandlerMap = {
    '#hub_network_selector_container': hubNetworkSelectorContainerEventsHandlers,
    '#single_network_selector_container': singleNetworkSelectorContainerEventsHandlers
};

function moveHighlightSlider(container, targetButton) {

}

function hubNetworkSelectorContainerEventsHandlers(event) {
    const container = event.currentTarget;
    const target = event.target;
    console.log(container);
    console.log(target);

}

function singleNetworkSelectorContainerEventsHandlers(event) {

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

export { setupNetworkSelectorContainerEventsListeners };