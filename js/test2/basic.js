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
    setupClickToOpenNewUrlEventListeners(); // 控制点击打开新网页的链接的事件

    document.querySelector('.scroll_to_top_button').addEventListener('click', scrollToTop); // 为回到顶部按钮添加点击事件监听器
    setupClickToCloseEventListeners(); // 为所有点击关闭按钮添加事件监听器
});

