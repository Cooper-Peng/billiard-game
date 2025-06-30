/**
 * 初始化相关游戏区域的滚动功能
 */
function initializeScrollArrows() {
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    const scrollAmount = 300; // 每次滚动的像素数

    if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) {
        console.warn('⚠️ 滚动相关元素未找到');
        return;
    }

    // 更新箭头状态
    function updateArrowStates() {
        const isAtStart = scrollContainer.scrollLeft === 0;
        const isAtEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth;
        
        scrollLeftBtn.classList.toggle('disabled', isAtStart);
        scrollRightBtn.classList.toggle('disabled', isAtEnd);
    }

    // 向左滚动
    scrollLeftBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    // 向右滚动
    scrollRightBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // 监听滚动事件以更新箭头状态
    scrollContainer.addEventListener('scroll', updateArrowStates);
    
    // 监听窗口大小变化以更新箭头状态
    window.addEventListener('resize', updateArrowStates);

    // 初始化时更新箭头状态
    updateArrowStates();

    // 在相关游戏加载完成后再次更新箭头状态
    const observer = new MutationObserver(updateArrowStates);
    observer.observe(document.getElementById('relatedGamesContainer'), {
        childList: true,
        subtree: true
    });

    console.log('✅ 滚动箭头功能初始化完成');
}

// 当DOM加载完成后初始化滚动功能
document.addEventListener('DOMContentLoaded', initializeScrollArrows); 