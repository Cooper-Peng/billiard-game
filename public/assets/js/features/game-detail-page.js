/**
 * 游戏详情页面通用JavaScript功能
 * 包含：国际化、游戏推荐、按钮功能等
 */

// ========== 国际化功能 ==========
const I18N_KEY = 'xgame_lang';

// ========== 相关游戏箭头滚动功能 ==========
let currentScrollPosition = 0;
const SCROLL_AMOUNT = 200; // 每次滚动的像素数

/**
 * 更新箭头按钮状态
 */
function updateArrowButtons() {
    const container = document.getElementById('relatedGamesContainer');
    const scrollContainer = document.getElementById('relatedGamesScrollContainer');
    const leftArrow = document.getElementById('relatedGamesLeftArrow');
    const rightArrow = document.getElementById('relatedGamesRightArrow');
    
    if (!container || !scrollContainer || !leftArrow || !rightArrow) {
        return;
    }
    
    const containerWidth = container.scrollWidth;
    const visibleWidth = scrollContainer.clientWidth;
    const maxScroll = Math.max(0, containerWidth - visibleWidth);
    
    // 添加通用样式类
    leftArrow.classList.add('related-games-arrow');
    rightArrow.classList.add('related-games-arrow');
    
    // 更新左箭头状态
    if (currentScrollPosition <= 0) {
        leftArrow.classList.remove('show');
        leftArrow.classList.add('disabled');
    } else {
        leftArrow.classList.add('show');
        leftArrow.classList.remove('disabled');
    }
    
    // 更新右箭头状态
    if (currentScrollPosition >= maxScroll) {
        rightArrow.classList.remove('show');
        rightArrow.classList.add('disabled');
    } else {
        rightArrow.classList.add('show');
        rightArrow.classList.remove('disabled');
    }
    
    // 如果内容不需要滚动，隐藏所有箭头
    if (maxScroll <= 0) {
        leftArrow.classList.remove('show');
        rightArrow.classList.remove('show');
    }
}

/**
 * 滚动相关游戏容器
 * @param {string} direction - 滚动方向 ('left' 或 'right')
 */
function scrollRelatedGames(direction) {
    const container = document.getElementById('relatedGamesContainer');
    const scrollContainer = document.getElementById('relatedGamesScrollContainer');
    
    if (!container || !scrollContainer) {
        return;
    }
    
    const containerWidth = container.scrollWidth;
    const visibleWidth = scrollContainer.clientWidth;
    const maxScroll = Math.max(0, containerWidth - visibleWidth);
    
    if (direction === 'left') {
        currentScrollPosition = Math.max(0, currentScrollPosition - SCROLL_AMOUNT);
    } else if (direction === 'right') {
        currentScrollPosition = Math.min(maxScroll, currentScrollPosition + SCROLL_AMOUNT);
    }
    
    // 应用滚动变换
    container.style.transform = `translateX(-${currentScrollPosition}px)`;
    
    // 更新箭头状态
    updateArrowButtons();
    
    console.log(`🔄 相关游戏滚动: ${direction}, 位置: ${currentScrollPosition}/${maxScroll}`);
}

/**
 * 初始化相关游戏箭头功能
 */
function initRelatedGamesArrows() {
    const leftArrow = document.getElementById('relatedGamesLeftArrow');
    const rightArrow = document.getElementById('relatedGamesRightArrow');
    
    if (leftArrow) {
        leftArrow.addEventListener('click', (e) => {
            e.preventDefault();
            scrollRelatedGames('left');
        });
        console.log('✅ 左箭头事件已绑定');
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', (e) => {
            e.preventDefault();
            scrollRelatedGames('right');
        });
        console.log('✅ 右箭头事件已绑定');
    }
    
    // 监听窗口大小变化，重新计算箭头状态
    window.addEventListener('resize', () => {
        setTimeout(updateArrowButtons, 100);
    });
}

/**
 * 渲染游戏标签
 * @param {string} lang - 语言代码 ('en' 或 'cn')
 */
function renderGameTags(lang) {
    const container = document.getElementById('gameTagsContainer');
    if (!container || !window.gameTags || !window.tagTranslations) {
        return;
    }

    // 清空容器
    container.innerHTML = '';

    // 遍历标签并渲染
    window.gameTags.forEach(tagKey => {
        const tagTranslation = window.tagTranslations[tagKey];
        if (tagTranslation) {
            const tagText = tagTranslation[lang] || tagTranslation['en'] || tagKey;
            
            // 创建标签元素
            const tagElement = document.createElement('span');
            tagElement.className = 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-1';
            tagElement.textContent = tagText;
            tagElement.setAttribute('data-tag-key', tagKey); // 方便调试
            
            container.appendChild(tagElement);
        }
    });

    console.log(`✅ 已渲染 ${window.gameTags.length} 个标签 (语言: ${lang})`);
}

/**
 * 应用翻译到页面
 * @param {string} lang - 语言代码 ('en' 或 'cn')
 */
function applyTranslations(lang) {
    if (!lang || !window.translations) {
        return;
    }

    const targetLangData = window.translations[lang];
    const fallbackLang = lang === 'en' ? 'cn' : 'en';
    const fallbackLangData = window.translations[fallbackLang];

    if (!targetLangData) {
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        const findTranslation = (data, k) => k.split('.').reduce((obj, i) => obj?.[i], data);

        // 1. Try target language. An empty string is not a valid translation.
        let translation = findTranslation(targetLangData, key);

        // 2. If not found or empty, try fallback language
        if (!translation && fallbackLangData) {
            translation = findTranslation(fallbackLangData, key);
        }

        if (translation) {
            // For buttons with SVG, only update the 'title'
            if (element.tagName === 'BUTTON' && element.querySelector('svg')) {
                element.setAttribute('title', translation);
            } else {
                // For other elements, safely update text content
                const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                if (textNode) {
                    textNode.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        }
    });

    // Update document's lang attribute
    document.documentElement.lang = lang === 'cn' ? 'zh-CN' : 'en';

    // Controls 列表特殊处理
    const controlsList = document.getElementById('controlsList');
    if (controlsList && window.translations && window.translations[lang] && window.translations[lang][window.currentGameId] && window.translations[lang][window.currentGameId].controlsListHtml) {
        controlsList.innerHTML = window.translations[lang][window.currentGameId].controlsListHtml;
    }

    // 渲染国际化标签
    renderGameTags(lang);
}

/**
 * 同步语言设置
 */
function syncLanguage() {
    const currentLang = localStorage.getItem(I18N_KEY) || 'en';
    applyTranslations(currentLang);
    // 重新渲染游戏推荐以支持国际化
    renderGameRecommendations(currentLang);
    renderGameTags(currentLang);
    console.log(`🌐 语言同步完成，当前语言: ${currentLang}`);
}

// ========== 游戏推荐功能 ==========

/**
 * 获取相关游戏（基于标签匹配）
 * @param {string} currentGameId - 当前游戏ID
 * @param {number} count - 返回游戏数量
 * @returns {Array} 相关游戏列表
 */
function getRelatedGames(currentGameId, count = 5) {
    const currentGame = window.gameDatabase[currentGameId];
    if (!currentGame) return [];

    const currentTags = currentGame.tags;
    const otherGames = Object.entries(window.gameDatabase).filter(([id]) => id !== currentGameId);
    
    // 计算标签匹配度并排序
    const gamesWithScore = otherGames.map(([id, game]) => {
        const matchingTags = game.tags.filter(tag => currentTags.includes(tag));
        return {
            id,
            game,
            score: matchingTags.length,
            matchingTags
        };
    });

    // 按匹配度排序，匹配度相同的按评分排序
    gamesWithScore.sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return b.game.rating - a.game.rating;
    });

    return gamesWithScore.slice(0, count).map(item => ({
        id: item.id,
        ...item.game,
        matchingTags: item.matchingTags
    }));
}

/**
 * 获取推荐游戏（随机推荐）
 * @param {string} currentGameId - 当前游戏ID
 * @param {Array} excludeIds - 要排除的游戏ID列表
 * @param {number} count - 返回游戏数量
 * @returns {Array} 推荐游戏列表
 */
function getRecommendedGames(currentGameId, excludeIds = [], count = 4) {
    const allExcludeIds = [currentGameId, ...excludeIds];
    const availableGames = Object.entries(window.gameDatabase)
        .filter(([id]) => !allExcludeIds.includes(id))
        .map(([id, game]) => ({ id, ...game }));

    // 随机打乱数组
    for (let i = availableGames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableGames[i], availableGames[j]] = [availableGames[j], availableGames[i]];
    }

    return availableGames.slice(0, count);
}

/**
 * 渲染游戏卡片（完全匹配main.html风格）
 * @param {Object} game - 游戏对象
 * @param {string} lang - 当前语言
 * @param {boolean} isSidebar - 是否为侧边栏样式
 * @param {boolean} isHorizontal - 是否为水平布局
 * @returns {string} HTML字符串
 */
function renderGameCard(game, lang = 'cn', isSidebar = false, isHorizontal = false) {
    const title = game.title[lang] || game.title.en || game.title.cn;
    const description = game.description[lang] || game.description.en || game.description.cn;
    
    // 生成星级评分
    const fullStars = Math.floor(game.rating);
    const totalStars = 5;
    let starsHtml = '';
    for (let i = 0; i < totalStars; i++) {
        starsHtml += i < fullStars ? '★' : '★';
    }

    if (isHorizontal) {
        // 水平布局样式 - 完全匹配main.html的游戏卡片结构
        const categoryTags = game.tags.slice(0, 2).map(tag => {
            const tagTranslation = window.tagTranslations[tag];
            const tagText = tagTranslation ? (tagTranslation[lang] || tagTranslation['en'] || tag) : tag;
            return `<span class="horizontal-tag">${tagText}</span>`;
        }).join('');

        return `
            <div class="game-card-horizontal">
                <a href="../../../${game.url}">
                    <img src="../../../${game.image}" alt="${title}" onerror="this.src='https://via.placeholder.com/190x170/f8fafc/666?text=${encodeURIComponent(title.slice(0, 3))}'">
                    <div class="p-4">
                        <h3>${title}</h3>
                        <p>${description}</p>
                        <div class="rating-container">
                            <div class="stars">${starsHtml}</div>
                            <span class="rating-score">${game.rating}</span>
                        </div>
                        <div class="game-tags">
                            ${categoryTags}
                        </div>
                    </div>
                </a>
            </div>
        `;
    } else if (isSidebar) {
        // 侧边栏样式
        const categoryTags = game.tags.slice(0, 2).map(tag => {
            return `<span class="category-pill-mini">${tag}</span>`;
        }).join('');

        return `
            <div class="game-card-sidebar">
                <a href="../../../${game.url}" class="w-full h-full block">
                    <img src="../../../${game.image}" alt="${title}" onerror="this.src='https://via.placeholder.com/100x100/f8fafc/666?text=${encodeURIComponent(title.slice(0, 3))}'">
                    <div class="game-info">
                        <h3>${title}</h3>
                        <p class="game-description">${description}</p>
                        <div class="rating-tags-container">
                            <div class="rating-mini">
                                <span class="stars-mini">${starsHtml}</span>
                                <span class="rating-score-mini">${game.rating}</span>
                            </div>
                            <div class="category-tags">
                                ${categoryTags}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    } else {
        // 标准网格样式
        return `
            <div class="game-card-recommendation">
                <a href="../../../${game.url}">
                    <img src="../../../${game.image}" alt="${title}" onerror="this.src='https://via.placeholder.com/190x170/f8fafc/666?text=${encodeURIComponent(title)}'">
                    <div class="p-4">
                        <h3>${title}</h3>
                        <p>${description}</p>
                        <div class="rating-container">
                            <div class="stars">${starsHtml}</div>
                            <span class="rating-score">${game.rating}</span>
                        </div>
                        <div class="game-tags">
                            <span class="category-pill">${game.tags[0]}</span>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }
}

/**
 * 渲染游戏推荐区域
 * @param {string} lang - 当前语言
 */
function renderGameRecommendations(lang = 'cn') {
    const currentGameId = window.currentGameId; // 从全局变量获取当前游戏ID
    
    // 获取相关游戏（左侧主要区域）
    const relatedGames = getRelatedGames(currentGameId, 5);
    const relatedContainer = document.getElementById('relatedGamesContainer');
    
    if (relatedContainer) {
        if (relatedGames.length > 0) {
            relatedContainer.innerHTML = relatedGames
                .map(game => renderGameCard(game, lang, false, true)) // 使用水平布局样式
                .join('');
                
            // 重置滚动位置
            currentScrollPosition = 0;
            relatedContainer.style.transform = 'translateX(0px)';
            
            // 等待DOM更新后再更新箭头状态
            setTimeout(() => {
                updateArrowButtons();
            }, 100);
        } else {
            relatedContainer.innerHTML = `
                <div class="text-center text-gray-500 py-8 min-w-full">
                    ${lang === 'en' ? 'No related games found' : '暂无相关游戏'}
                </div>
            `;
            
            // 隐藏箭头
            const leftArrow = document.getElementById('relatedGamesLeftArrow');
            const rightArrow = document.getElementById('relatedGamesRightArrow');
            if (leftArrow) leftArrow.classList.remove('show');
            if (rightArrow) rightArrow.classList.remove('show');
        }
    }
    
    // 获取推荐游戏（右侧边栏）
    const relatedGameIds = relatedGames.map(game => game.id);
    const recommendedGames = getRecommendedGames(currentGameId, relatedGameIds, 4);
    const recommendedContainer = document.getElementById('recommendedGamesContainer');
    
    if (recommendedContainer) {
        if (recommendedGames.length > 0) {
            recommendedContainer.innerHTML = recommendedGames
                .map(game => renderGameCard(game, lang, true)) // 使用侧边栏样式
                .join('');
        } else {
            recommendedContainer.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    ${lang === 'en' ? 'No recommended games found' : '暂无推荐游戏'}
                </div>
            `;
        }
    }

    console.log(`✅ 游戏推荐渲染完成 - 相关游戏: ${relatedGames.length}, 推荐游戏: ${recommendedGames.length}`);
}

/**
 * 刷新推荐游戏
 * @param {string} lang - 当前语言
 */
function refreshRecommendations(lang = 'cn') {
    const currentGameId = window.currentGameId;
    const relatedGames = getRelatedGames(currentGameId, 5);
    const relatedGameIds = relatedGames.map(game => game.id);
    
    // 重新随机获取推荐游戏
    const newRecommendedGames = getRecommendedGames(currentGameId, relatedGameIds, 4);
    const recommendedContainer = document.getElementById('recommendedGamesContainer');
    
    if (recommendedContainer && newRecommendedGames.length > 0) {
        // 添加刷新动画效果
        recommendedContainer.style.opacity = '0.5';
        recommendedContainer.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            recommendedContainer.innerHTML = newRecommendedGames
                .map(game => renderGameCard(game, lang, true))
                .join('');
            recommendedContainer.style.opacity = '1';
            recommendedContainer.style.transform = 'translateY(0)';
        }, 300);
    }
    
    console.log(`🔄 推荐游戏已刷新 - 新推荐: ${newRecommendedGames.length}`);
}

// ========== 按钮功能实现 ==========

// 重载游戏功能
function reloadGame() {
    console.log('🔄 重载游戏按钮被点击');
    const gameFrame = document.getElementById('gameFrame');
    if (gameFrame) {
        const currentSrc = gameFrame.src;
        console.log('📍 当前游戏URL:', currentSrc);
        gameFrame.src = '';
        setTimeout(() => {
            gameFrame.src = currentSrc;
            console.log('✅ 游戏重载完成');
        }, 100);
    } else {
        console.error('❌ 未找到游戏iframe');
    }
}

// 全屏功能
function toggleFullscreen() {
    console.log('🖥️ 全屏按钮被点击');
    const gameFrame = document.getElementById('gameFrame');
    const exitBtn = document.getElementById('exitFullscreenBtn');
    
    if (gameFrame) {
        try {
            if (gameFrame.requestFullscreen) {
                gameFrame.requestFullscreen();
            } else if (gameFrame.mozRequestFullScreen) { /* Firefox */
                gameFrame.mozRequestFullScreen();
            } else if (gameFrame.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                gameFrame.webkitRequestFullscreen();
            } else if (gameFrame.msRequestFullscreen) { /* IE/Edge */
                gameFrame.msRequestFullscreen();
            }
            
            if (exitBtn) {
                exitBtn.classList.remove('hidden');
                console.log('👁️ 退出全屏按钮已显示');
            }
            console.log('✅ 全屏模式已激活');
        } catch (error) {
            console.error('❌ 全屏模式激活失败:', error);
        }
    } else {
        console.error('❌ 未找到游戏iframe');
    }
}

// 退出全屏功能
function exitFullscreen() {
    console.log('🚪 退出全屏按钮被点击');
    const exitBtn = document.getElementById('exitFullscreenBtn');
    
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
        
        if (exitBtn) {
            exitBtn.classList.add('hidden');
            console.log('👁️ 退出全屏按钮已隐藏');
        }
        console.log('✅ 已退出全屏模式');
    } catch (error) {
        console.error('❌ 退出全屏失败:', error);
    }
}

// 绑定按钮事件
function bindButtonEvents() {
    console.log('🔗 开始绑定按钮事件');
    
    const reloadBtn = document.getElementById('reloadBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const exitFullscreenBtn = document.getElementById('exitFullscreenBtn');
    
    if (reloadBtn) {
        console.log('✅ 找到重载按钮，绑定点击事件');
        reloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            reloadGame();
        });
    } else {
        console.error('❌ 未找到重载按钮 (id: reloadBtn)');
    }
    
    if (fullscreenBtn) {
        console.log('✅ 找到全屏按钮，绑定点击事件');
        fullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFullscreen();
        });
    } else {
        console.error('❌ 未找到全屏按钮 (id: fullscreenBtn)');
    }
    
    if (exitFullscreenBtn) {
        console.log('✅ 找到退出全屏按钮，绑定点击事件');
        exitFullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exitFullscreen();
        });
    } else {
        console.error('❌ 未找到退出全屏按钮 (id: exitFullscreenBtn)');
    }
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', () => {
        const exitBtn = document.getElementById('exitFullscreenBtn');
        if (!document.fullscreenElement && exitBtn) {
            exitBtn.classList.add('hidden');
            console.log('📱 检测到退出全屏，隐藏退出按钮');
        }
    });
    
    // 兼容不同浏览器的全屏事件
    document.addEventListener('webkitfullscreenchange', () => {
        const exitBtn = document.getElementById('exitFullscreenBtn');
        if (!document.webkitFullscreenElement && exitBtn) {
            exitBtn.classList.add('hidden');
        }
    });
    
    document.addEventListener('mozfullscreenchange', () => {
        const exitBtn = document.getElementById('exitFullscreenBtn');
        if (!document.mozFullScreenElement && exitBtn) {
            exitBtn.classList.add('hidden');
        }
    });
    
    document.addEventListener('MSFullscreenChange', () => {
        const exitBtn = document.getElementById('exitFullscreenBtn');
        if (!document.msFullscreenElement && exitBtn) {
            exitBtn.classList.add('hidden');
        }
    });
    
    console.log('🎉 按钮事件绑定完成');
}

// ========== 事件监听 ==========

// 监听来自父页面的消息
window.addEventListener('message', function(event) {
    if (event.data.type === 'languageChange' && event.data.lang) {
        // 处理来自父页面的语言变更消息
        applyTranslations(event.data.lang);
        // 重新渲染游戏推荐以支持国际化
        renderGameRecommendations(event.data.lang);
        renderGameTags(event.data.lang);
        console.log(`🌐 收到语言切换消息，已切换到: ${event.data.lang}`);
    } else if (event.data.type === 'scrollToSection') {
        // 游戏详情页无法处理滚动请求，不发送确认消息
        // 父页面会因为没收到确认而重新加载main.html
        console.log('⚠️ 游戏详情页收到滚动请求，但无法处理:', event.data.sectionId);
    }
});

// 监听 localStorage 变化（主要同步方式）
window.addEventListener('storage', (event) => {
    if (event.key === I18N_KEY && event.newValue) {
        applyTranslations(event.newValue);
        // 重新渲染游戏推荐以支持国际化
        renderGameRecommendations(event.newValue);
        renderGameTags(event.newValue);
        console.log(`🌐 检测到语言变化，已切换到: ${event.newValue}`);
    }
});

// ========== 初始化函数 ==========

// DOMContentLoaded 时初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 页面DOM加载完成，开始初始化');
    
    // 初始化相关游戏箭头功能
    initRelatedGamesArrows();
    
    // 初始同步语言
    syncLanguage();
    
    // 绑定按钮事件
    bindButtonEvents();
    
    // 初始化游戏推荐
    const currentLang = localStorage.getItem(I18N_KEY) || 'cn';
    renderGameRecommendations(currentLang);
    
    // 添加"换一批"按钮事件监听器（支持国际化）
    const refreshBtn = document.getElementById('refreshRecommendations');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const currentLang = localStorage.getItem(I18N_KEY) || 'cn';
            refreshRecommendations(currentLang);
            console.log(`🔄 "换一批"按钮被点击，当前语言: ${currentLang}`);
        });
        console.log('✅ "换一批"按钮事件已绑定（支持国际化）');
    } else {
        console.error('❌ 未找到"换一批"按钮 (id: refreshRecommendations)');
    }
    
    console.log('🎯 页面初始化完成');
});

// 确保函数在全局作用域中可用（向后兼容）
window.reloadGame = reloadGame;
window.toggleFullscreen = toggleFullscreen;
window.exitFullscreen = exitFullscreen; 