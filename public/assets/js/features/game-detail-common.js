// 游戏详情页通用JavaScript功能

class GameDetailBase {
    constructor() {
        this.initAntiTheft();
        this.initGameFeatures();
        this.bindEvents();
    }

    // 初始化防盗和防爬功能
    initAntiTheft() {
        // 禁用右键菜单
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // 禁用F12、Ctrl+Shift+I、Ctrl+U等开发者工具快捷键
        document.addEventListener('keydown', function(e) {
            // 禁用F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            // 禁用Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }
            // 禁用Ctrl+U (查看源码)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }
            // 禁用Ctrl+S (保存)
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                return false;
            }
            // 禁用Ctrl+Shift+C (元素检查器)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                return false;
            }
        });
        
        // 禁用拖拽
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // 禁用选择文本
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // 检测开发者工具
        this.detectDevTools();
        
        // 清空控制台并显示欢迎信息
        this.initConsole();
    }

    // 检测开发者工具
    detectDevTools() {
        let devtools = {
            open: false,
            orientation: null
        };
        
        setInterval(function() {
            if (window.outerHeight - window.innerHeight > 160 || window.outerWidth - window.innerWidth > 160) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.clear();
                    console.log('%c⚠️ 检测到开发者工具！', 'color: red; font-size: 20px; font-weight: bold;');
                    console.log('%c请尊重知识产权，不要进行逆向工程！', 'color: red; font-size: 14px;');
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }

    // 初始化控制台信息
    initConsole() {
        console.clear();
        console.log('%c🎮 欢迎来到 GameSpace！', 'color: #4ECDC4; font-size: 20px; font-weight: bold;');
        console.log('%c请享受您的游戏体验！', 'color: #FF6B6B; font-size: 14px;');
    }

    // 初始化游戏特性
    initGameFeatures() {
        // 监听 iframe 加载完成事件
        window.addEventListener('load', () => {
            // 通知父页面 iframe 已加载完成
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'iframeLoaded' }, '*');
            }
        });

        // 处理iframe错误
        const gameIframe = document.querySelector('.game-iframe');
        if (gameIframe) {
            gameIframe.addEventListener('error', () => {
                this.showGameError();
            });
        }
    }

    // 绑定事件
    bindEvents() {
        // 绑定返回主页按钮（如果存在）
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.history.back();
            });
        }

        // 绑定全屏按钮（如果存在）
        const fullscreenButton = document.querySelector('.fullscreen-button');
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    // 显示游戏加载错误
    showGameError() {
        const iframe = document.querySelector('.game-iframe');
        if (iframe) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'flex items-center justify-center h-full bg-gray-100 text-gray-600';
            errorDiv.innerHTML = `
                <div class="text-center">
                    <div class="text-6xl mb-4">🎮</div>
                    <div class="text-xl mb-2">游戏加载失败</div>
                    <div class="text-sm">请检查网络连接或稍后重试</div>
                </div>
            `;
            iframe.parentNode.replaceChild(errorDiv, iframe);
        }
    }

    // 切换全屏模式
    toggleFullscreen() {
        const iframe = document.querySelector('.game-iframe');
        if (!iframe) return;

        if (!document.fullscreenElement) {
            iframe.requestFullscreen().catch(err => {
                console.log(`全屏模式错误: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // 更新页面语言
    updateLanguage(lang) {
        // 获取语言数据
        const langData = window.translations && window.translations[lang];
        if (!langData) return;

        // 更新所有带有data-i18n属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const keys = element.getAttribute('data-i18n').split('.');
            let value = langData;
            for (const key of keys) {
                value = value[key];
                if (!value) break;
            }
            if (value) {
                element.textContent = value;
            }
        });

        // 更新meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && metaDesc.hasAttribute('data-i18n')) {
            const keys = metaDesc.getAttribute('data-i18n').split('.');
            let value = langData;
            for (const key of keys) {
                value = value[key];
                if (!value) break;
            }
            if (value) {
                metaDesc.setAttribute('content', value);
            }
        }

        // 更新页面标题
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const keys = titleElement.getAttribute('data-i18n').split('.');
            let value = langData;
            for (const key of keys) {
                value = value[key];
                if (!value) break;
            }
            if (value) {
                document.title = value;
            }
        }

        // 更新HTML lang属性
        document.documentElement.lang = lang === 'cn' ? 'zh-CN' : 'en';
    }

    // 记录游戏播放统计
    trackGamePlay(gameName) {
        // 这里可以添加游戏统计逻辑
        console.log(`游戏开始: ${gameName}`);
        
        // 记录到localStorage
        const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
        stats[gameName] = (stats[gameName] || 0) + 1;
        localStorage.setItem('gameStats', JSON.stringify(stats));
    }

    // 获取相关游戏推荐
    getRelatedGames(category) {
        // 这里可以实现相关游戏推荐逻辑
        // 返回同类别的其他游戏
        return [];
    }
}

// 游戏详情页工具函数
const GameDetailUtils = {
    // 格式化日期
    formatDate: function(dateString) {
        const date = new Date(dateString);
        const currentLang = localStorage.getItem('language') || 'cn';
        
        if (currentLang === 'cn') {
            return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    },

    // 生成星级评分HTML
    generateStarRating: function(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let html = '';
        for (let i = 0; i < fullStars; i++) {
            html += '★';
        }
        if (hasHalfStar) {
            html += '☆';
        }
        for (let i = 0; i < emptyStars; i++) {
            html += '☆';
        }
        return html;
    },

    // 获取游戏截图占位符
    getGamePlaceholder: function(gameName) {
        return `https://via.placeholder.com/400x225/FF6B6B/FFFFFF?text=${encodeURIComponent(gameName)}`;
    }
};

// 当页面加载完成时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化游戏详情页基础功能
    window.gameDetail = new GameDetailBase();
    
    // 如果有游戏名称，记录统计
    const gameName = document.querySelector('h1')?.textContent;
    if (gameName) {
        window.gameDetail.trackGamePlay(gameName);
    }

    // Get language from localStorage, or default to 'en' to match index.html
    const currentLang = localStorage.getItem('lang') || 'en';
    console.log(`详情页加载完毕. 从 localStorage 读取到的语言: ${currentLang}`);
    
    if (typeof translations !== 'undefined') {
        applyTranslations(currentLang, translations);
    } else {
        console.error('页面未定义 "translations" 对象。');
    }

    // Listen for language changes from other tabs/windows
    window.addEventListener('storage', function(event) {
        if (event.key === 'lang') {
            const newLang = event.newValue;
            console.log(`在其他标签页侦测到语言变更. 新语言: ${newLang}`);
            if (typeof translations !== 'undefined') {
                applyTranslations(newLang, translations);
            }
        }
    });
});

// 导出供其他脚本使用
window.GameDetailBase = GameDetailBase;
window.GameDetailUtils = GameDetailUtils; 

// ================= Game Detail Page Specific Functions =================

// --- Iframe Controls ---

// 这些函数现在在 initializeGameDetailPage() 中通过事件监听器处理
// 保留全局函数以确保向后兼容性

function reloadGame() {
    const gameFrame = document.getElementById('gameFrame');
    if (gameFrame) {
        console.log('Reloading game...');
        const currentSrc = gameFrame.src;
        gameFrame.src = '';
        setTimeout(() => {
            gameFrame.src = currentSrc;
        }, 100);
    }
}

function toggleFullscreen() {
    const gameFrame = document.getElementById('gameFrame');
    const exitBtn = document.getElementById('exitFullscreenBtn');
    if (gameFrame) {
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen();
        } else if (gameFrame.mozRequestFullScreen) { /* Firefox */
            gameFrame.mozRequestFullScreen();
        } else if (gameFrame.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            gameFrame.webkitRequestFullscreen();
        } else if (gameFrame.msRequestFullscreen) { /* IE/Edge */
            gameFrame.msRequestFullscreen();
        }
        if(exitBtn) exitBtn.classList.remove('hidden');
    }
}

function exitFullscreen() {
    const exitBtn = document.getElementById('exitFullscreenBtn');
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
    if(exitBtn) exitBtn.classList.add('hidden');
}

// 确保这些函数在全局作用域中可用（向后兼容性）
window.reloadGame = reloadGame;
window.toggleFullscreen = toggleFullscreen;
window.exitFullscreen = exitFullscreen;


// --- Parent-Iframe Communication for Language ---
// This section is now updated to use localStorage for cross-page language persistence.

// I18N Key - MUST match the key in js/language.js
const I18N_KEY = 'xgame_lang';

/**
 * Applies translations to the page.
 * It's designed to be safe and not overwrite SVG icons in buttons.
 * @param {string} lang - The language code ('en' or 'cn').
 * @param {object} translations - The translations object for the current page.
 */
function applyTranslations(lang, translations) {
    if (!lang || !translations || !translations[lang]) {
        // console.error('Translation failed: Invalid language or missing translation data.');
        return;
    }
    const langData = translations[lang];

    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = key.split('.').reduce((obj, i) => obj?.[i], langData);

        if (translation) {
            // For buttons with SVG, only update the 'title' attribute for tooltips
            if (element.tagName === 'BUTTON' && element.querySelector('svg')) {
                element.setAttribute('title', translation);
            } else {
                // For other elements, safely update the text content.
                // Find the first text node and update it. This preserves child elements like <span> or <br>.
                const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                if (textNode) {
                    textNode.textContent = translation;
                } else {
                    // If no text node is found, set the textContent as a fallback.
                    element.textContent = translation;
                }
            }
        }
    });

    // Translate element attributes like placeholder or title
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = key.split('.').reduce((obj, i) => obj?.[i], langData);
        if (translation) {
            element.setAttribute('placeholder', translation);
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = key.split('.').reduce((obj, i) => obj?.[i], langData);
        if (translation) {
            element.setAttribute('title', translation);
        }
    });

    // Update the document's lang attribute
    document.documentElement.lang = lang === 'cn' ? 'zh-CN' : 'en';
}


/**
 * Initializes all functionalities for the game detail page.
 */
function initializeGameDetailPage() {
    
    // --- Anti-Theft / Anti-Debug ---
    // Note: These are basic deterrents and can be bypassed.
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.keyCode === 85)) {
            e.preventDefault();
        }
    });

    // --- Iframe Controls ---
    const reloadBtn = document.getElementById('reloadBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const exitFullscreenBtn = document.getElementById('exitFullscreenBtn');
    
    if(reloadBtn) {
        reloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Reload button clicked');
            const gameFrame = document.getElementById('gameFrame');
            if (gameFrame) {
                const currentSrc = gameFrame.src;
                gameFrame.src = '';
                setTimeout(() => {
                    gameFrame.src = currentSrc;
                }, 100);
                console.log('Game reloaded');
            }
        });
    }

    if(fullscreenBtn) {
        fullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fullscreen button clicked');
            const gameFrame = document.getElementById('gameFrame');
            if (gameFrame) {
                if (gameFrame.requestFullscreen) {
                    gameFrame.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message}`));
                } else if (gameFrame.mozRequestFullScreen) { /* Firefox */
                    gameFrame.mozRequestFullScreen();
                } else if (gameFrame.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                    gameFrame.webkitRequestFullscreen();
                } else if (gameFrame.msRequestFullscreen) { /* IE/Edge */
                    gameFrame.msRequestFullscreen();
                }
                // Show exit button
                if(exitFullscreenBtn) exitFullscreenBtn.classList.remove('hidden');
                console.log('Entering fullscreen mode');
            }
        });
    }
    
    if(exitFullscreenBtn) {
        exitFullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Exit fullscreen button clicked');
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
            exitFullscreenBtn.classList.add('hidden');
            console.log('Exiting fullscreen mode');
        });
    }
    
    // Handle fullscreen change events
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && exitFullscreenBtn) {
            exitFullscreenBtn.classList.add('hidden');
        }
    });
    
    document.addEventListener('webkitfullscreenchange', () => {
        if (!document.webkitFullscreenElement && exitFullscreenBtn) {
            exitFullscreenBtn.classList.add('hidden');
        }
    });
    
    document.addEventListener('mozfullscreenchange', () => {
        if (!document.mozFullScreenElement && exitFullscreenBtn) {
            exitFullscreenBtn.classList.add('hidden');
        }
    });
    
    document.addEventListener('MSFullscreenChange', () => {
        if (!document.msFullscreenElement && exitFullscreenBtn) {
            exitFullscreenBtn.classList.add('hidden');
        }
    });

    // --- Language Synchronization ---
    function syncLanguage() {
        const currentLang = localStorage.getItem(I18N_KEY) || 'en';
        if (typeof window.translations !== 'undefined') {
            applyTranslations(currentLang, window.translations);
        }
        updateLanguageSwitchDetail(currentLang);
    }
    // 1. 初始同步
    syncLanguage();
    // 2. 监听 storage 事件
    window.addEventListener('storage', (event) => {
        if (event.key === I18N_KEY && event.newValue) {
            if (typeof window.translations !== 'undefined') {
                applyTranslations(event.newValue, window.translations);
            }
            updateLanguageSwitchDetail(event.newValue);
        }
    });
    // 3. 监听 postMessage
    window.addEventListener('message', (event) => {
        if (event.data?.type === 'languageChange' && event.data.lang) {
            if (typeof window.translations !== 'undefined') {
                applyTranslations(event.data.lang, window.translations);
            }
            updateLanguageSwitchDetail(event.data.lang);
        }
    });

    // --- 语言切换按钮 ---
    createLanguageSwitchForDetail();
}

// --- Run Initialization ---
// Using an if check for DOMContentLoaded state for robustness
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGameDetailPage);
} else {
    initializeGameDetailPage();
}

function createLanguageSwitchForDetail() {
    // 检查是否已存在语言切换按钮
    if (document.getElementById('languageSwitchDetail')) return;
    // 创建滑动开关容器
    const switchContainer = document.createElement('div');
    switchContainer.className = 'relative inline-flex items-center bg-gray-200 rounded-full p-1 cursor-pointer select-none transition-colors duration-200 hover:bg-gray-300 fixed top-6 right-6 z-50';
    switchContainer.style.width = '80px';
    switchContainer.style.height = '32px';
    switchContainer.id = 'languageSwitchDetail';

    // 创建滑块
    const slider = document.createElement('div');
    slider.className = 'absolute bg-white rounded-full shadow-md transition-transform duration-300 ease-out';
    slider.style.width = '28px';
    slider.style.height = '28px';
    slider.style.left = '2px';
    slider.id = 'languageSliderDetail';

    // 创建文字标签
    const enLabel = document.createElement('span');
    enLabel.className = 'text-xs font-medium text-gray-600 transition-colors duration-200';
    enLabel.textContent = 'EN';
    enLabel.style.marginLeft = '8px';
    enLabel.style.marginRight = 'auto';

    const cnLabel = document.createElement('span');
    cnLabel.className = 'text-xs font-medium text-gray-600 transition-colors duration-200';
    cnLabel.textContent = '中';
    cnLabel.style.marginRight = '8px';
    cnLabel.style.marginLeft = 'auto';

    // 组装开关
    switchContainer.appendChild(slider);
    switchContainer.appendChild(enLabel);
    switchContainer.appendChild(cnLabel);

    // 插入到页面右上角
    document.body.appendChild(switchContainer);

    // 点击切换
    switchContainer.addEventListener('click', function(e) {
        const rect = switchContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const currentLang = localStorage.getItem(I18N_KEY) || 'en';
        let nextLang = currentLang;
        if (clickX < rect.width / 2 && currentLang === 'cn') {
            nextLang = 'en';
        } else if (clickX >= rect.width / 2 && currentLang === 'en') {
            nextLang = 'cn';
        }
        if (nextLang !== currentLang) {
            setDetailLanguage(nextLang);
        }
    });
}

function updateLanguageSwitchDetail(lang) {
    const slider = document.getElementById('languageSliderDetail');
    const enLabel = document.querySelector('#languageSwitchDetail span:first-of-type');
    const cnLabel = document.querySelector('#languageSwitchDetail span:last-of-type');
    if (!slider || !enLabel || !cnLabel) return;
    const isEnglish = lang === 'en';
    slider.style.transform = `translateX(${isEnglish ? '0' : '48px'})`;
    enLabel.className = `${isEnglish ? 'text-blue-600' : 'text-gray-600'} text-xs font-medium transition-colors duration-200`;
    cnLabel.className = `${!isEnglish ? 'text-blue-600' : 'text-gray-600'} text-xs font-medium transition-colors duration-200`;
}

function setDetailLanguage(lang) {
    localStorage.setItem(I18N_KEY, lang);
    if (typeof window.translations !== 'undefined') {
        applyTranslations(lang, window.translations);
    }
    updateLanguageSwitchDetail(lang);
    // 如果在 iframe 中，通知父页面
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'languageChange', lang: lang }, '*');
    }
} 