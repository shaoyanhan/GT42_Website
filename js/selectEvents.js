function fillSelect(selectContainer, stringList, selectedIndex = 0) {
    // 检查是否是有效的 DOM 元素
    if (!(selectContainer instanceof HTMLSelectElement)) {
        console.error('Provided container is not a valid select element.');
        return;
    }

    // 清空现有的 options
    selectContainer.innerHTML = '';

    // 为每个字符串创建一个 option 元素
    stringList.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        // 添加一个索引属性，用于在回调函数中获取当前选中的索引
        option.setAttribute('data-index', index);

        // 如果当前索引是预选索引，则设置为选中
        if (index === selectedIndex) {
            option.selected = true;
        }

        // 添加 option 到 select 容器
        selectContainer.appendChild(option);
    });
}

// 控制select标签的禁用状态
function disableSelect(selectContainer, disabled = true) {
    // 检查是否是有效的 DOM 元素
    if (!(selectContainer instanceof HTMLSelectElement)) {
        console.error('Provided container is not a valid select element.');
        return;
    }

    // 设置 select 元素的禁用状态
    selectContainer.disabled = disabled;
}

// 显示和隐藏全局覆盖层, 用于禁用用户交互
function showGlobalOverlay() {
    document.querySelector('#global_overlay').style.display = 'block';
}

function hideGlobalOverlay() {
    document.querySelector('#global_overlay').style.display = 'none';
}


// 设置 select 元素的事件监听器
function setUpSelectEventListeners(selectContainer, callback) {


    // 检查是否是有效的 DOM 元素
    selectContainer = document.querySelector(selectContainer);
    if (!(selectContainer instanceof HTMLSelectElement)) {
        console.error('Provided container is not a valid select element.');
        return;
    }

    // 添加事件监听器
    selectContainer.addEventListener('change', async () => {
        // 禁用用户交互
        showGlobalOverlay();
        console.log(selectContainer.value);

        try {
            // 等待回调函数执行完成
            await callback(selectContainer.value);
        } catch (error) {
            console.error('Error during callback execution:', error);
        } finally {

            // 启用用户交互
            hideGlobalOverlay();
        }
    });
}

// 函数用于设置Select2和事件监听器
function setUpSelectWithSelect2(selectContainerSelector, callback) {
    // 初始化Select2
    const selectElement = $(selectContainerSelector).select2({
        width: '230px',
        dropdownAutoWidth: true,
        dropdownCssClass: 'select2-dropdown', // 自定义下拉框样式类
    });

    console.log(selectElement);

    // 添加事件监听器到Select2
    selectElement.on('change', async () => {
        // 禁用用户交互
        showGlobalOverlay();

        try {
            // 等待回调函数执行完成
            await callback(selectElement.val());
        } catch (error) {
            console.error('Error during callback execution:', error);
        } finally {

            // 启用用户交互
            hideGlobalOverlay();
        }
    });
}
// 上述代码是将下列代码进行了重构：
// < script >
// $(document).ready(function () {
//     $('#haplotype_select').select2({
//         width: '230px',
//         // font- size: '16px',
//         dropdownAutoWidth: true,
//         dropdownCssClass: 'select2-dropdown', // 自定义下拉框样式类
//     });
// });
// </script >

export { fillSelect, setUpSelectEventListeners, setUpSelectWithSelect2, disableSelect };