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

// 为切换按钮添加点击事件
if (sidebarFixedToggle) {
    sidebarFixedToggle.addEventListener('click', toggleSidebar);
}

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