


// 为容器的流动边框添加监听事件
function setUpFlowBorderEventListener() {
    const outerContainers = document.querySelectorAll('.outer_container');
    outerContainers.forEach((container) => {
        // 用于存储动画暂停时的位置
        let lastBackgroundPosition = 0;

        // 鼠标移入时开始动画
        container.addEventListener('mouseenter', () => {
            // 恢复上次停止的位置
            container.style.backgroundPosition = `${lastBackgroundPosition}% 0%`;
            container.style.animationPlayState = 'running'; // 恢复动画
        });

        // 鼠标移出时暂停动画
        container.addEventListener('mouseleave', () => {
            // 获取当前背景位置
            const computedStyle = getComputedStyle(container);
            const backgroundPosition = computedStyle.backgroundPositionX;

            // 计算当前的位置，并保存为上一次的位置
            lastBackgroundPosition = parseFloat(backgroundPosition) / container.offsetWidth * 100;

            // 暂停动画
            container.style.animationPlayState = 'paused';
        });
    })
}


// 为全选和全不选按钮添加事件监听
function setUpSelectAllButton() {
    const outerContainers = document.querySelectorAll('.outer_container');
    outerContainers.forEach((outerContainer) => {
        const selectAllBtn = outerContainer.querySelector('.select_all_btn');
        const unselectAllBtn = outerContainer.querySelector('.unselect_all_btn');
        const fileCheckboxes = outerContainer.querySelectorAll('.file_checkbox');
        const fileItems = outerContainer.querySelectorAll('.file_item');

        // 当点击 "Select All" 按钮时，选中所有文件按钮
        selectAllBtn.addEventListener('click', () => {
            fileCheckboxes.forEach((checkbox) => {
                checkbox.checked = true;
                const fileItem = checkbox.closest('.file_item');  // 找到对应的文件按钮
                fileItem.classList.add('selected');  // 添加选中样式
            });
            unselectAllBtn.disabled = false;
        });

        // 当点击 "Unselect All" 按钮时，取消所有文件按钮的选中
        unselectAllBtn.addEventListener('click', () => {
            fileCheckboxes.forEach((checkbox) => {
                checkbox.checked = false;
                const fileItem = checkbox.closest('.file_item');  // 找到对应的文件按钮
                fileItem.classList.remove('selected');  // 移除选中样式
            });
            unselectAllBtn.disabled = true;
        });

        // 监听每个文件按钮的变化，根据选择状态添加或移除样式
        fileCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                const fileItem = checkbox.closest('.file_item');
                if (checkbox.checked) {
                    fileItem.classList.add('selected');  // 选中时添加选中样式
                } else {
                    fileItem.classList.remove('selected');  // 未选中时移除选中样式
                }

                // 检查是否有任何一个文件按钮被选中，控制 "Unselect All" 按钮的禁用状态
                const anyChecked = Array.from(fileCheckboxes).some(checkbox => checkbox.checked);
                unselectAllBtn.disabled = !anyChecked;
            });
        });


    });
}

// 为下载按钮添加事件监听
function setUpDownloadEventListener() {
    document.querySelectorAll('.download_btn').forEach(button => {
        button.addEventListener('click', function () {
            // 获取按钮的category属性值
            const category = this.getAttribute('category');
            console.log('category:', category);

            const downloadBoxContainer = document.getElementById(`${category}_download_box`);

            // 获取文件列表
            const selectedFiles = Array.from(downloadBoxContainer.querySelectorAll('.file_checkbox:checked'))
                .map(checkbox => checkbox.value);

            if (selectedFiles.length === 0) {
                alert('请至少选择一个文件进行下载！');
                return;
            }

            // 下载链接格式：https://cbi.gxu.edu.cn/download/yhshao/GT42_web/sequence/haplotype.fasta
            // 依次生成链接并点击下载
            // 使用延迟逐个下载文件
            selectedFiles.forEach((file, index) => {
                setTimeout(() => {
                    const downloadLink = `https://cbi.gxu.edu.cn/download/yhshao/GT42_web/${category}/${file}`;
                    const link = document.createElement('a');
                    link.href = downloadLink;
                    link.download = file;
                    document.body.appendChild(link); // 将链接添加到页面中
                    link.click(); // 模拟点击下载
                    document.body.removeChild(link); // 下载完成后移除链接
                }, index * 1000); // 每次下载延迟1秒，避免冲突
            });
        });
    });

}

document.addEventListener('DOMContentLoaded', async () => {
    setUpFlowBorderEventListener();
    setUpSelectAllButton();
    setUpDownloadEventListener();
});