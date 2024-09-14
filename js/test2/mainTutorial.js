const expandListButton = document.getElementById("expand_list_button");
const navList = document.getElementById("nav_list");
const clickToClose = document.querySelector(".click_to_close2");

// 为导航列表展开关闭按钮添加点击事件
function setUpNavListExpandEventListner() {
    // 导航列表的显示与隐藏
    expandListButton.addEventListener("click", () => {
        navList.style.display = "flex";
        clickToClose.style.display = "block";
    });

    clickToClose.addEventListener("click", () => {
        // // 由于使用了响应式布局，这里不能直接设置display为none，否则会影响到响应式布局的显示
        // // 获取元素的style属性
        // let styleAttr = navList.getAttribute("style");
        // if (styleAttr && styleAttr.indexOf("display: flex") !== -1) {
        //     // 移除 'display: flex' 样式
        //     let updatedStyle = styleAttr.replace(/display:\s*flex;?/i, "").trim();

        //     // 如果去除后还有其他样式，重新设置style属性；否则移除style属性
        //     if (updatedStyle) {
        //         navList.setAttribute("style", updatedStyle);
        //     } else {
        //         navList.removeAttribute("style");
        //     }
        // }
        // clickToClose.classList.remove("tmp_display_block");

        navList.style.display = "none";
        clickToClose.style.display = "none";
    });
}

// 设置链接跳转事件监听器
function setNavListLinkEventListener() {
    const navLinks = document.querySelectorAll('.nav_link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // 阻止默认行为

            // 清除所有链接的active状态
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // 为当前点击的链接添加active状态
            this.classList.add('active');

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            // 先滚动到目标元素，再调整滚动位置
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (window.innerWidth < 1440) {
                navList.style.display = "none";
                clickToClose.style.display = "none";
            }
        });


    });
}

// 随屏幕宽度动态变化的事件监听器
window.addEventListener("resize", () => {
    if (window.innerWidth >= 1440) {
        navList.style.display = "flex";
        clickToClose.style.display = "none";
        expandListButton.style.display = "none";
    } else {
        navList.style.display = "none";
        clickToClose.style.display = "none";
        expandListButton.style.display = "block";
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    setUpNavListExpandEventListner();
    setNavListLinkEventListener();

    // TODO：为标题中的链接添加点击事件监听器
    // TODO：初始时检查链接中是否有#ID，如果有，滚动到对应的位置并高亮导航栏中对应的链接
    // TODO：将h2_p中的内容使用无序列表展示
});