const expandListButton = document.getElementById("expand_list_button");
const navList = document.getElementById("nav_list");
const navLinks = document.querySelectorAll('.nav_link');
const clickToClose = document.querySelector(".click_to_close2");
const sections = document.querySelectorAll('h2, h3');
const titleLinks = document.querySelectorAll(".title_link");

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
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // 阻止默认行为

            // // 清除所有链接的active状态
            // navLinks.forEach(link => {
            //     link.classList.remove('active');
            // });

            // // 为当前点击的链接添加active状态
            // this.classList.add('active');

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

// 设置标题链接的点击事件监听器
function setTitleLinkEventListener() {
    titleLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // 阻止默认行为

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

// 设置图片的放大缩小事件监听器
function setImageZoomEventListner() {
    const imageModal = document.querySelector('.image_modal');
    const zoomedImage = document.querySelector('.zoomed_image');
    const zoomedCaption = document.querySelector('.zoomed_caption');
    const closeButton = document.querySelector('.close_button');
    const imageContainers = document.querySelectorAll('.image_container');


    // 处理图片点击事件，显示放大的图片和caption
    imageContainers.forEach(imageContainer => {
        const clickableImage = imageContainer.querySelector('.clickable_image');

        clickableImage.addEventListener('click', function () {
            zoomedImage.src = clickableImage.src; // 使用相同的图片
            zoomedCaption.textContent = imageContainer.querySelector('.image_caption').textContent; // 设置相同的caption
            imageModal.style.display = 'flex'; // 显示遮罩层和图片
        });
    });


    // 点击遮罩层关闭图片放大模式
    imageModal.addEventListener('click', function (e) {
        if (e.target === imageModal || e.target === closeButton) {
            imageModal.style.display = 'none'; // 隐藏遮罩层
        }
    });

    // 处理鼠标滚轮放大/缩小图片
    let zoomLevel = 1;
    zoomedImage.addEventListener('wheel', function (e) {
        e.preventDefault();

        // 获取鼠标相对于图片的坐标
        const rect = zoomedImage.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // 计算 transform-origin 为鼠标位置
        const originX = (offsetX / rect.width) * 100;
        const originY = (offsetY / rect.height) * 100;

        zoomedImage.style.transformOrigin = `${originX}% ${originY}%`;

        // 根据滚轮方向调整缩放级别
        if (e.deltaY < 0) {
            // 滚轮向上滚动，放大图片
            zoomLevel += 0.1;
        } else {
            // 滚轮向下滚动，缩小图片
            zoomLevel = Math.max(zoomLevel - 0.1, 0.1); // 限制最小缩放为0.1
        }

        // 应用缩放效果
        zoomedImage.style.transform = `scale(${zoomLevel})`;
    });
}



// 防止浏览器在导航后自动滚动到先前的位置
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// 修改 checkLinkHasID 函数
function checkLinkHasID() {
    let hash = window.location.hash;

    if (hash) {
        window.scrollTo(0, 0); // 立即将页面滚动到顶部，防止默认行为
        let targetElement = document.querySelector(hash);

        if (targetElement) {
            // 确保在页面布局稳定后再滚动
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 0);
        }
    }
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

// 滚动时导航栏的高亮事件监听器
window.addEventListener('scroll', function () {

    // 如果滚动高度小于10，那么高亮第一个链接，因为链接移动的目的位置是视口的中间位置，因此需要单独对顶部标题进行处理
    if (window.scrollY < 10) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        if (window.scrollY === 0) {
            navLinks[0].classList.add('active');
        } else {
            navLinks[1].classList.add('active');
        }
        return;
    }

    // 获取当前位置，定位到视口中间位置
    let currentPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach(function (section) {
        let sectionTop = section.offsetTop; // 返回元素相对于文档顶部的距离
        let sectionHeight = section.offsetHeight; // 返回元素的高度

        // 如果某个标题处于视口中间位置，那么高亮对应的链接
        if (currentPosition >= sectionTop && currentPosition < sectionTop + sectionHeight) {
            let id = section.getAttribute('id');
            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// 当HTML文档完全加载并解析完成后触发，但不需要等待样式表、图片等资源加载完毕
document.addEventListener('DOMContentLoaded', () => {
    setUpNavListExpandEventListner();
    setNavListLinkEventListener();
    setTitleLinkEventListener();
    setImageZoomEventListner();
    checkLinkHasID();
});

// // 确保在所有资源加载完成后再触发
// window.addEventListener('load', () => {
//     setUpNavListExpandEventListner();
//     setNavListLinkEventListener();
//     setTitleLinkEventListener();
//     checkLinkHasID();
// });
