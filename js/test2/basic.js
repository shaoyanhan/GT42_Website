import { downloadGenomeIDList, validateSearchForm } from './searchEvents.js';
import { validateGenomeID } from "./data.js";
import { showCustomAlert } from './showCustomAlert.js';

// 在新标签页打开链接
function openInNewTab(url) {
    window.open(url, '_blank');
}

// 回到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 点击关闭按钮关闭容器
function clickToCloseEventHandler(containerID) {
    const container = document.getElementById(containerID);
    container.style.display = 'none';
}

// 在窄屏幕上，点击菜单按钮展开导航栏的事件处理函数
async function expandedNavEventHandler() {
    const menuToggle = document.querySelector('.menu_toggle');
    const menuClose = document.querySelector('.menu_close');
    const expandedNav = document.querySelector('.expanded_nav');
    const searchBox = document.querySelector('.search_box_container input');
    const searchIcon = document.querySelector('.search_box_container .search_icon');

    const navBar = document.querySelector('.nav_bar');
    const navContainer = document.querySelector('.nav_container');

    // 新增 .menu_open 类，用于控制 .menu_toggle 和 .menu_close 的显示和隐藏。这里不使用改变 display的方法，
    // 因为会覆盖媒体查询中的 CSS 规则。
    menuToggle.addEventListener('click', function () {
        navBar.classList.add('menu_open');
        navContainer.classList.add('expanded_nav_open');
    });
    menuClose.addEventListener('click', function () {
        navBar.classList.remove('menu_open');
        navContainer.classList.remove('expanded_nav_open');
    });
    // 新增 resize 事件监听器。当窗口大小发生变化时，如果宽度大于 1150px，则移除 menu_open 类。否则如果
    // 没有点击关闭按钮直接调整窗口大小，导致 menu_open 类一直存在，这样会导致菜单一直显示。
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1150) {
            navBar.classList.remove('menu_open');
            navContainer.classList.remove('expanded_nav_open');
        }
    });

    searchIcon.addEventListener('click', function () {
        searchBox.focus();
    });
}

// 手风琴菜单的事件处理函数
async function accordionMenuEventHandler() {
    // 获取所有手风琴元素
    const accordions = document.querySelectorAll('.accordion');
    // 遍历所有手风琴元素
    accordions.forEach(accordion => {
        // 获取手风琴元素中的第一个 a 标签和 .accordion_content 元素
        const trigger = accordion.querySelector('a');
        const content = accordion.querySelector('.accordion_content');

        // 给 a 标签添加点击事件监听器
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            // 记录当前的手风琴容器中的 .accordion_content 是否显示
            const isVisible = content.style.display === 'block';
            // 隐藏所有手风琴容器中的 .accordion_content
            document.querySelectorAll('.accordion .accordion_content').forEach(el => {
                el.style.display = 'none';
            });
            // 如果当前的手风琴容器中的 .accordion_content 是隐藏的，则显示，否则隐藏
            // 这样就实现了点击某一个手风琴标题，只展开其所属的 .accordion_content，其他的都收起来，并且也能实现自己的收起和展开
            content.style.display = isVisible ? 'none' : 'block';
        });
    });
}

// 为contact卡片添加点击事件监听器
async function setupContactCardEventListeners() {
    const contactOverlay = document.getElementById("contact_overlay");
    console.log(contactOverlay);
    const contactCard = document.getElementById("contact_card");
    console.log(contactCard);

    const contactButtons = document.querySelectorAll(".contact_button");
    console.log(contactButtons);
    contactButtons.forEach(contactButton => {

        // 显示卡片和遮罩
        contactButton.addEventListener("click", () => {
            contactOverlay.classList.add("active");
            contactCard.classList.add("active");
        });

        // 点击遮罩关闭卡片和遮罩
        contactOverlay.addEventListener("click", () => {
            contactCard.classList.remove("active"); // 先移除居中显示
            contactCard.classList.add("slide_out"); // 然后添加向右滑出的效果

            // 延迟移除遮罩和slide_out类，确保动画播放完成
            setTimeout(() => {
                contactOverlay.classList.remove("active");
                contactCard.classList.add("reset"); // 重置卡片的位置
                contactCard.classList.remove("slide_out"); // 滑出完成后移除该状态

                // 额外的延迟确保 `reset` 类生效后再移除
                setTimeout(() => {
                    contactCard.classList.remove("reset"); // 确保重置完成后移除该状态
                }, 300); // 设定一个足够的时间使 reset 生效

            }, 300); // 这里的时间和 CSS transition 保持一致，保证移出动画完成之后立即执行，避免卡顿
        });

    });
}

// 为所有点击打开新网页的链接添加事件监听器
async function setupClickToOpenNewUrlEventListeners() {
    const links = document.querySelectorAll('.click_to_open_new_url');
    // 如果没有这样的链接，直接返回
    if (links.length === 0) {
        return;
    }
    // 遍历所有标签，获取new-url属性
    links.forEach(link => {
        const url = link.getAttribute('new-url');
        // 为每个链接添加点击事件监听器
        link.addEventListener('click', function () {
            openInNewTab(url);
        });
    });
}

// 为所有点击关闭按钮添加事件监听器
async function setupClickToCloseEventListeners() {
    const closeButtons = document.querySelectorAll('.click_to_close');
    if (closeButtons.length === 0) {
        return;
    }
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetContainerID = button.getAttribute('close-target-id');
            clickToCloseEventHandler(targetContainerID);
        });
    });
}

// 检查搜索关键词的合法性
async function checkSearchKeyword(keyword) {
    // 格式清洗
    keyword = keyword.replace(/^['"]+|['"]+$/g, ''); // 去除首尾的引号
    keyword = keyword.trim(); // 去除首尾的空格

    // 检查是否为空
    if (keyword === '') {
        showCustomAlert('Please enter a search keyword!', 'warning', 2000);
        return false;
    }

    // 前端验证格式正确性
    if (validateSearchForm(keyword)) {
        const response = await validateGenomeID(keyword); // 后端验证ID是否存在
        console.log(response);

        // 确保当前的searchKeyword是有效的，然后再进行后续更新的一系列操作
        if (response && response.status === 'success') {
            return true;
        } else {
            console.error('Backend genome ID validation failed', response);
            showCustomAlert('Backend genome ID validation failed.', 'error', 2000);
            return false;
        }

    } else {
        console.error('Invalid search keyword');
        showCustomAlert('Invalid search keyword !', 'error', 2000);
        return false;
    }

}

// 为搜索框中的搜索按钮添加事件监听器
async function setUpSearchBoxSearchButtonEventListeners() {
    const searchBoxContainer = document.querySelectorAll('.search_box_container');
    if (searchBoxContainer.length === 0) {
        return;
    }
    searchBoxContainer.forEach(searchBox => {
        const searchButton = searchBox.querySelector('.search_button');
        searchButton.addEventListener('click', async function () {
            const searchInput = searchBox.querySelector('input');
            const searchKeyword = searchInput.value;

            const isValid = await checkSearchKeyword(searchKeyword);
            // 检查搜索关键词的合法性
            if (!isValid) {
                return;
            }

            const url = './searchBox.html?searchKeyword=' + searchKeyword;
            openInNewTab(url);
        });
    });

}

// 为搜索框的提示框的示例按钮添加事件监听器
async function setUpSearchBoxExampleIDEventListeners() {
    const searchBoxContainer = document.querySelectorAll('.search_box_container');
    if (searchBoxContainer.length === 0) {
        return;
    }
    searchBoxContainer.forEach(searchBox => {
        const exampleID = searchBox.querySelectorAll('.example_id');
        exampleID.forEach(
            ID => {
                ID.addEventListener('click', function () {
                    const searchInput = searchBox.querySelector('input');
                    searchInput.value = ID.textContent;
                });
            });
    });
}

// 为搜索框的提示框的ID列表下载按钮添加事件监听器
async function setUpSearchBoxIDListDownloadButtonEventListeners() {
    const searchBoxContainer = document.querySelectorAll('.search_box_container');
    if (searchBoxContainer.length === 0) {
        return;
    }
    searchBoxContainer.forEach(searchBox => {
        const downloadButton = searchBox.querySelector('.download_button');
        downloadButton.addEventListener('click', function () {
            downloadGenomeIDList();
        });
    });
}

// 为所有的email_address元素添加点击事件，点击后复制内容到剪贴板
async function setUpEmailAdressEventListeners(params) {
    const emailAddresses = document.querySelectorAll(".email_address");

    emailAddresses.forEach(email => {
        email.addEventListener("click", () => {
            const emailText = email.textContent;
            const tempInput = document.createElement("input");
            tempInput.value = emailText;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            showCustomAlert("Email copied to clipboard!", "success", 1000);
        });
    });
}



// 动态显示回到顶部按钮
window.addEventListener('scroll', function () {
    var button = document.querySelector('.scroll_to_top_button');
    if (window.scrollY > 300) {
        button.style.display = 'block';
    } else {
        button.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    expandedNavEventHandler(); // 控制下拉框导航栏中菜单按钮的事件
    accordionMenuEventHandler(); // 控制手风琴菜单的事件
    setupContactCardEventListeners(); // 控制contact卡片的事件
    setupClickToOpenNewUrlEventListeners(); // 控制点击打开新网页的链接的事件

    // 为搜索框中的搜索按钮添加事件监听器
    setUpSearchBoxSearchButtonEventListeners();

    // 为搜索框的提示框的示例按钮添加事件监听器
    setUpSearchBoxExampleIDEventListeners();

    // 为搜索框的提示框的ID列表下载按钮添加事件监听器
    setUpSearchBoxIDListDownloadButtonEventListeners();

    document.querySelector('.scroll_to_top_button').addEventListener('click', scrollToTop); // 为回到顶部按钮添加点击事件监听器
    setupClickToCloseEventListeners(); // 为所有点击关闭按钮添加事件监听器
    setUpEmailAdressEventListeners(); // 为所有的email_address元素添加点击事件
});

