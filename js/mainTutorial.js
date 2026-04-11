const expandListButton = document.getElementById("expand_list_button");
const navList = document.getElementById("nav_list");
const navLinks = document.querySelectorAll('.nav_link');
const clickToClose = document.querySelector(".click_to_close2");
const sections = document.querySelectorAll('h2, h3');
const titleLinks = document.querySelectorAll(".title_link");

// 为导航列表展开关闭按钮添加点击事件
function setUpNavListExpandEventListner() {
    expandListButton.addEventListener("click", () => {
        navList.style.display = "flex";
        clickToClose.style.display = "block";
    });

    clickToClose.addEventListener("click", () => {
        navList.style.display = "none";
        clickToClose.style.display = "none";
    });
}

function activateNavLink(targetId) {
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + targetId) {
            link.classList.add('active');
        }
    });
}

function setNavListLinkEventListener() {
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'instant', block: 'center' });
                activateNavLink(targetId);
            }
            if (window.innerWidth < 1440) {
                navList.style.display = "none";
                clickToClose.style.display = "none";
            }
        });
    });
}

function setTitleLinkEventListener() {
    titleLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'instant', block: 'center' });
                activateNavLink(targetId);
            }
            if (window.innerWidth < 1440) {
                navList.style.display = "none";
                clickToClose.style.display = "none";
            }
        });
    });
}

// ==================== Image Viewer ====================

function setImageViewerEventListeners() {
    const modal = document.getElementById('image_modal');
    const modalImage = modal.querySelector('.modal_image');
    const modalCaption = modal.querySelector('.modal_caption');
    const closeBtn = modal.querySelector('.modal_close_btn');
    const zoomInBtn = document.getElementById('modal_zoom_in');
    const zoomOutBtn = document.getElementById('modal_zoom_out');
    const resetBtn = document.getElementById('modal_reset');
    const downloadBtn = document.getElementById('modal_download');
    const imageContainers = document.querySelectorAll('.image_container');

    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 5.0;
    const ZOOM_STEP = 0.25;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartTranslateX = 0;
    let dragStartTranslateY = 0;
    let currentFullSrc = '';

    function applyTransform() {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function resetView() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
    }

    function openModal(thumbImg, caption) {
        currentFullSrc = thumbImg.getAttribute('data-full') || thumbImg.src;
        modalImage.src = currentFullSrc;
        modalCaption.textContent = caption;
        resetView();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalImage.src = '';
    }

    function zoomAt(delta, clientX, clientY) {
        const wrapper = modal.querySelector('.modal_image_wrapper');
        const rect = wrapper.getBoundingClientRect();
        const centerX = clientX !== undefined ? clientX - rect.left : rect.width / 2;
        const centerY = clientY !== undefined ? clientY - rect.top : rect.height / 2;

        const prevScale = scale;
        scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale + delta));

        if (scale !== prevScale) {
            const ratio = scale / prevScale;
            translateX = centerX - ratio * (centerX - translateX);
            translateY = centerY - ratio * (centerY - translateY);
            applyTransform();
        }
    }

    imageContainers.forEach(container => {
        const img = container.querySelector('.clickable_image');
        if (!img) return;
        img.addEventListener('click', () => {
            const captionEl = container.querySelector('.image_caption');
            openModal(img, captionEl ? captionEl.textContent : '');
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomAt(ZOOM_STEP);
    });

    zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomAt(-ZOOM_STEP);
    });

    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetView();
    });

    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!currentFullSrc) return;
        const a = document.createElement('a');
        a.href = currentFullSrc;
        a.download = currentFullSrc.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    modalImage.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
        zoomAt(delta, e.clientX, e.clientY);
    }, { passive: false });

    modalImage.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartTranslateX = translateX;
        dragStartTranslateY = translateY;
        modalImage.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = dragStartTranslateX + (e.clientX - dragStartX);
        translateY = dragStartTranslateY + (e.clientY - dragStartY);
        applyTransform();
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            modalImage.classList.remove('dragging');
        }
    });

    // Prevent toolbar clicks from closing the modal
    modal.querySelector('.modal_toolbar').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    modal.querySelector('.modal_image_wrapper').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    modal.querySelector('.modal_caption').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}


// ==================== Hash Navigation ====================

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

function checkLinkHasID() {
    let hash = window.location.hash;
    if (hash) {
        window.scrollTo(0, 0);
        let targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'instant', block: 'center' });
                activateNavLink(hash.substring(1));
            }, 0);
        }
    }
}


// ==================== Responsive Resize ====================

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


// ==================== Scroll Highlight ====================

window.addEventListener('scroll', function () {
    if (window.scrollY < 10) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[0].classList.add('active');
        return;
    }

    let currentPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach(function (section) {
        let sectionTop = section.offsetTop;
        let sectionHeight = section.offsetHeight;

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


// ==================== Init ====================

document.addEventListener('DOMContentLoaded', () => {
    setUpNavListExpandEventListner();
    setNavListLinkEventListener();
    setTitleLinkEventListener();
    setImageViewerEventListeners();
});

window.addEventListener('load', () => {
    checkLinkHasID();
});
