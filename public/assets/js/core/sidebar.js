// 侧边栏状态管理
const sidebar = document.getElementById('sidebar');
const sidebarFixedToggle = document.getElementById('sidebarFixedToggle');
let isSidebarExpanded = true; // 侧边栏展开状态管理

// 侧边栏切换功能
function toggleSidebar() {
    const toggleButton = document.getElementById('sidebarFixedToggle');
    
    if (isSidebarExpanded) {
        // 收缩侧边栏 - 只显示图标，悬停时自动展开
        sidebar.classList.add('collapsed');
        toggleButton.classList.add('collapsed');
        isSidebarExpanded = false;
    } else {
        // 展开侧边栏 - 显示图标和文字
        sidebar.classList.remove('collapsed');
        toggleButton.classList.remove('collapsed');
        isSidebarExpanded = true;
    }
}

// 更新主内容区域的左边距，确保布局协调
function updateMainContentMargin(sidebarWidth) {
    if (mainContent) {
        // 使用CSS变量来平滑过渡
        document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
        
        // 添加过渡效果
        mainContent.style.transition = 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // 在较小屏幕上不调整边距（响应式设计会处理）
        if (window.innerWidth > 768) {
            mainContent.style.marginLeft = `${sidebarWidth}px`;
        }
    }
}

// 响应窗口大小变化
function handleWindowResize() {
    if (window.innerWidth <= 768) {
        // 小屏幕自动处理，不需要手动调整边距
        if (mainContent) {
            mainContent.style.marginLeft = '';
        }
    } else {
        // 大屏幕根据当前状态调整边距
        const currentWidth = isSidebarExpanded ? 240 : 70;
        updateMainContentMargin(currentWidth);
    }
}

// 为切换按钮添加点击事件
if (sidebarFixedToggle) {
    sidebarFixedToggle.addEventListener('click', toggleSidebar);
}

// 监听窗口大小变化
window.addEventListener('resize', handleWindowResize);

// 初始化时设置正确的边距
document.addEventListener('DOMContentLoaded', () => {
    updateMainContentMargin(240); // 默认展开状态
});

// 处理侧边栏链接点击
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const hash = href.split('#')[1];
        
        // 使用 postMessage 向 iframe 发送消息
        const iframe = document.getElementById('mainFrame');
        iframe.contentWindow.postMessage({
            type: 'scrollToSection',
            sectionId: hash
        }, '*');
    });
});

// 监听 iframe 消息
window.addEventListener('message', (event) => {
    if (event.data.type === 'iframeLoaded') {
        console.log('iframe loaded');
    } else if (event.data.type === 'navigateToGame') {
        // 处理游戏详情页导航
        const iframe = document.getElementById('mainFrame');
        iframe.src = 'gameDetail.html';
        
        // 保存当前语言设置
        const gameLanguage = event.data.language || currentLang;
        
        // 在 iframe 加载完成后发送语言设置
        iframe.onload = function() {
            iframe.contentWindow.postMessage({
                type: 'updateLanguage',
                language: gameLanguage
            }, '*');
        };
    }
}); 