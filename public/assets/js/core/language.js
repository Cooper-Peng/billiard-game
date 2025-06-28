// 全局语言包
const translations = {
    en: {
        common: { login: "Login", register: "Register", search: "Search games...", playFreeGames: "Play Free Online Games" },
        nav: { home: "Home", newGames: "New Games", popular: "Popular", categories: "Categories" },
        sidebar: { fixedMode: "固定", action: "Action", adventure: "Adventure", arcade: "Arcade", car: "Car", girl: "Girl", kids: "Kids", multiplayer: "Multiplayer", puzzle: "Puzzle", racing: "Racing", shooting: "Shooting", sports: "Sports", strategy: "Strategy" },
        footer: { about: "About xGame.best", aboutText: "Your ultimate destination for free online games. Play the best games across multiple categories!", quickLinks: "Quick Links", aboutUs: "About Us", contact: "Contact", privacy: "Privacy Policy", terms: "Terms of Service", connect: "Connect With Us" },
        main: { viewAll: "View All" }
    },
    cn: {
        common: { login: "登录", register: "注册", search: "搜索游戏...", playFreeGames: "免费在线游戏" },
        nav: { home: "首页", newGames: "新游戏", popular: "热门", categories: "分类" },
        sidebar: { fixedMode: "固定", action: "动作", adventure: "冒险", arcade: "街机", car: "汽车", girl: "女生", kids: "儿童", multiplayer: "多人", puzzle: "益智", racing: "竞速", shooting: "射击", sports: "体育", strategy: "策略" },
        footer: { about: "关于xGame.best", aboutText: "您的终极免费在线游戏目的地。畅玩多个类别的最佳游戏！", quickLinks: "快速链接", aboutUs: "关于我们", contact: "联系我们", privacy: "隐私政策", terms: "服务条款", connect: "关注我们" },
        main: { viewAll: "查看全部" }
    }
};

const I18N_KEY = 'xgame_lang';

/**
 * 获取初始语言
 * 1. 尝试从 localStorage 获取
 * 2. 如果没有，则根据浏览器语言判断
 * 3. 默认为 'en'
 * @returns {string} 'en' or 'cn'
 */
function getInitialLanguage() {
    const savedLang = localStorage.getItem(I18N_KEY);
    if (savedLang) {
        return savedLang;
    }
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('zh') ? 'cn' : 'en';
}

/**
 * 将翻译应用到页面所有元素
 * @param {string} lang - 'en' or 'cn'
 */
function applyTranslations(lang) {
    if (!['en', 'cn'].includes(lang)) {
        console.error(`Invalid language: ${lang}`);
        return;
    }
    document.documentElement.lang = lang === 'cn' ? 'zh-CN' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(lang, key);
        if (translation) {
             // 防止替换掉元素内的其他内容，比如SVG图标
            const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) {
                textNode.textContent = translation;
            } else {
                element.textContent = translation;
            }
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(lang, key);
        if (translation) {
            element.setAttribute('placeholder', translation);
        }
    });
}

/**
 * 根据key从语言包获取翻译
 * @param {string} lang 
 * @param {string} key - e.g., 'common.login'
 * @returns {string|null}
 */
function getTranslation(lang, key) {
    if (!key) return null;
    const keys = key.split('.');
    let result = translations[lang];
    for (const k of keys) {
        result = result?.[k];
    }
    return typeof result === 'string' ? result : null;
}

/**
 * 通知Iframe语言变更
 * @param {string} lang 
 */
function notifyIframe(lang) {
    const iframe = document.getElementById('mainFrame');
    if (iframe && iframe.contentWindow) {
        try {
            iframe.contentWindow.postMessage({ type: 'languageChange', lang: lang }, '*');
            console.log('[语言切换] 已通知 iframe 语言变更:', lang);
        } catch (e) {
            console.error('Failed to send language change message to iframe:', e);
        }
    }
}

/**
 * 设置网站语言
 * @param {string} lang 
 */
function setLanguage(lang) {
    console.log('[语言切换] setLanguage 被调用，目标语言:', lang);
    localStorage.setItem(I18N_KEY, lang);
    applyTranslations(lang);
    notifyIframe(lang);
    updateLanguageSwitch(lang);
    console.log('[语言切换] 已应用语言:', lang);
}

/**
 * 创建苹果风格的滑动开关
 */
function createLanguageSwitch() {
const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;

    // 创建滑动开关容器
    const switchContainer = document.createElement('div');
    switchContainer.className = 'relative inline-flex items-center bg-gray-200 rounded-full p-1 cursor-pointer select-none transition-colors duration-200 hover:bg-gray-300';
    switchContainer.style.width = '80px';
    switchContainer.style.height = '32px';
    switchContainer.id = 'languageSwitch';

    // 创建滑块
    const slider = document.createElement('div');
    slider.className = 'absolute bg-white rounded-full shadow-md transition-transform duration-300 ease-out';
    slider.style.width = '28px';
    slider.style.height = '28px';
    slider.style.left = '2px';
    slider.id = 'languageSlider';

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

    // 替换原有的选择器
    languageSelect.parentNode.replaceChild(switchContainer, languageSelect);

    return { switchContainer, slider, enLabel, cnLabel };
}

/**
 * 更新滑动开关状态
 * @param {string} lang 
 */
function updateLanguageSwitch(lang) {
    console.log('[语言切换] updateLanguageSwitch 被调用，当前语言:', lang);
    const slider = document.getElementById('languageSlider');
    const enLabel = document.querySelector('#languageSwitch span:first-of-type');
    const cnLabel = document.querySelector('#languageSwitch span:last-of-type');
    
    if (!slider || !enLabel || !cnLabel) return;

    const isEnglish = lang === 'en';
    
    // 更新滑块位置
    slider.style.transform = `translateX(${isEnglish ? '0' : '48px'})`;
    
    // 更新文字颜色
    enLabel.className = `${isEnglish ? 'text-blue-600' : 'text-gray-600'} text-xs font-medium transition-colors duration-200`;
    cnLabel.className = `${!isEnglish ? 'text-blue-600' : 'text-gray-600'} text-xs font-medium transition-colors duration-200`;
}

/**
 * 初始化滑动开关事件
 */
function initLanguageSwitchEvents() {
    const switchContainer = document.getElementById('languageSwitch');
    if (!switchContainer) return;

    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    // 点击切换
    switchContainer.addEventListener('click', (e) => {
        if (isDragging) return;
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
            console.log(`[语言切换] 点击按钮，准备从 ${currentLang} 切换到 ${nextLang}`);
            setLanguage(nextLang);
        } else {
            console.log(`[语言切换] 点击按钮，语言未变，当前为 ${currentLang}`);
        }
    });

    // 触摸事件
    switchContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    currentX = e.touches[0].clientX;
        const slider = document.getElementById('languageSlider');
        if (slider) slider.style.transition = 'none';
});

    switchContainer.addEventListener('touchmove', (e) => {
    if (isDragging) {
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
            const slider = document.getElementById('languageSlider');
            if (slider) {
        const newX = Math.max(0, Math.min(diff, 48));
        slider.style.transform = `translateX(${newX}px)`;
            }
    }
});

    switchContainer.addEventListener('touchend', () => {
    if (isDragging) {
        const diff = currentX - startX;
            const slider = document.getElementById('languageSlider');
            if (slider) slider.style.transition = 'transform 0.3s ease-out';
            
        if (Math.abs(diff) > 25) {
                const currentLang = localStorage.getItem(I18N_KEY) || 'en';
            const newLang = diff < 0 ? 'cn' : 'en';
                if (newLang !== currentLang) {
                    setLanguage(newLang);
                } else {
                    updateLanguageSwitch(currentLang);
                }
        } else {
                const currentLang = localStorage.getItem(I18N_KEY) || 'en';
                updateLanguageSwitch(currentLang);
        }
        isDragging = false;
    }
});

    // 鼠标事件
    switchContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    currentX = e.clientX;
        const slider = document.getElementById('languageSlider');
        if (slider) slider.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        currentX = e.clientX;
        const diff = currentX - startX;
            const slider = document.getElementById('languageSlider');
            if (slider) {
        const newX = Math.max(0, Math.min(diff, 48));
        slider.style.transform = `translateX(${newX}px)`;
            }
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        const diff = currentX - startX;
            const slider = document.getElementById('languageSlider');
            if (slider) slider.style.transition = 'transform 0.3s ease-out';
            
        if (Math.abs(diff) > 25) {
                const currentLang = localStorage.getItem(I18N_KEY) || 'en';
            const newLang = diff < 0 ? 'cn' : 'en';
                if (newLang !== currentLang) {
                    setLanguage(newLang);
                } else {
                    updateLanguageSwitch(currentLang);
                }
        } else {
                const currentLang = localStorage.getItem(I18N_KEY) || 'en';
                updateLanguageSwitch(currentLang);
        }
        isDragging = false;
    }
});
}

// ===== 初始化和事件监听 =====
document.addEventListener('DOMContentLoaded', () => {
    const initialLang = getInitialLanguage();
    
    // 创建滑动开关
    createLanguageSwitch();
    
    // 初始化语言
    setLanguage(initialLang);
    
    // 初始化滑动开关事件
    initLanguageSwitchEvents();

    // iframe加载后，也通知一下语言
    const iframe = document.getElementById('mainFrame');
    if (iframe) {
        iframe.addEventListener('load', () => {
             const currentLang = localStorage.getItem(I18N_KEY) || 'en';
             notifyIframe(currentLang);
        });
    }
});

// 监听其他页面对localStorage的修改，实现多页面同步
window.addEventListener('storage', (event) => {
    if (event.key === I18N_KEY && event.newValue) {
        applyTranslations(event.newValue);
        notifyIframe(event.newValue);
        updateLanguageSwitch(event.newValue);
    }
}); 