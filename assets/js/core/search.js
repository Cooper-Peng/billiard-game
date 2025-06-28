/**
 * Game Search Component
 * 支持中英文游戏搜索，包括实时搜索、键盘导航、高亮显示等功能
 */

class GameSearch {
    constructor() {
        this.games = [];
        this.selectedIndex = -1;
        this.isLoading = false;
        this.debounceTimer = null;
        this.currentLanguage = 'en';
        
        // DOM 元素
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchResults = document.getElementById('searchResults');
        this.searchResultsList = document.getElementById('searchResultsList');
        this.noResults = document.getElementById('noResults');
        
        this.init();
    }
    
    async init() {
        try {
            // 加载游戏数据
            await this.loadGamesData();
            
            // 绑定事件
            this.bindEvents();
            
            // 获取当前语言
            this.updateLanguage();
            
            console.log('🔍 搜索功能初始化完成，游戏数量:', this.games.length);
        } catch (error) {
            console.error('❌ 搜索功能初始化失败:', error);
        }
    }
    
    async loadGamesData() {
        console.log('📦 使用内置游戏数据，无需服务器');
        
        // 完整的游戏数据内嵌，支持双击直接打开HTML文件
        this.games = [
            {
                "title": "Monster Survivors",
                "category": "action",
                "href": "games/categories/action/monster-survivors.html",
                "names": {
                    "en": "Monster Survivors",
                    "cn": "怪物幸存者"
                }
            },
            {
                "title": "Crazy Shooters",
                "category": "action",
                "href": "games/categories/action/crazy-shooters.html",
                "names": {
                    "en": "Crazy Shooters",
                    "cn": "疯狂射手"
                }
            },
            {
                "title": "Stickman GTA City",
                "category": "action",
                "href": "games/categories/action/stickman-gta-city.html",
                "names": {
                    "en": "Stickman GTA City",
                    "cn": "火柴人GTA城市"
                }
            },
            {
                "title": "Rainbow Survival",
                "category": "action",
                "href": "games/categories/action/rainbow-survival.html",
                "names": {
                    "en": "Rainbow Survival",
                    "cn": "彩虹生存"
                }
            },
            {
                "title": "Pixel Survival",
                "category": "action",
                "href": "games/categories/action/pixel-survival.html",
                "names": {
                    "en": "Pixel Survival",
                    "cn": "像素生存"
                }
            },
            {
                "title": "Tank Arena",
                "category": "action",
                "href": "games/categories/action/tank-arena.html",
                "names": {
                    "en": "Tank Arena",
                    "cn": "坦克竞技场"
                }
            },
            {
                "title": "Crazy Cattle 3D",
                "category": "action",
                "href": "games/categories/action/crazy-cattle-3d.html",
                "names": {
                    "en": "Crazy Cattle 3D",
                    "cn": "疯狂牛3D"
                }
            },
            {
                "title": "Tank War Simulator",
                "category": "action",
                "href": "games/categories/action/tank-war-simulator.html",
                "names": {
                    "en": "Tank War Simulator",
                    "cn": "坦克战争模拟器"
                }
            },
            {
                "title": "Five Nights at Freddy's 4",
                "category": "action",
                "href": "games/categories/action/five-nights-at-freddys-4.html",
                "names": {
                    "en": "Five Nights at Freddy's 4",
                    "cn": "玩具熊的五夜后宫4"
                }
            },
            {
                "title": "War of Tanks Paper Note",
                "category": "action",
                "href": "games/categories/action/war-of-tanks-paper-note.html",
                "names": {
                    "en": "War of Tanks Paper Note",
                    "cn": "纸片坦克战争"
                }
            },
            {
                "title": "Squad Shooter",
                "category": "action",
                "href": "games/categories/action/squad-shooter.html",
                "names": {
                    "en": "Squad Shooter",
                    "cn": "小队射手"
                }
            },
            {
                "title": "Five Nights at Freddy's 3",
                "category": "action",
                "href": "games/categories/action/five-nights-at-freddys-3.html",
                "names": {
                    "en": "Five Nights at Freddy's 3",
                    "cn": "玩具熊的五夜后宫3"
                }
            },
            {
                "title": "Stick Fighter 3D",
                "category": "action",
                "href": "games/categories/action/stick-fighter-3d.html",
                "names": {
                    "en": "Stick Fighter 3D",
                    "cn": "火柴人格斗3D"
                }
            },
            {
                "title": "Kingdom Battle 3D",
                "category": "action",
                "href": "games/categories/action/kingdom-battle-3d.html",
                "names": {
                    "en": "Kingdom Battle 3D",
                    "cn": "王国战争3D"
                }
            },
            {
                "title": "Warstrike",
                "category": "action",
                "href": "games/categories/action/warstrike.html",
                "names": {
                    "en": "Warstrike",
                    "cn": "战争打击"
                }
            },
            {
                "title": "Masked Special Forces",
                "category": "action",
                "href": "games/categories/action/masked-special-forces.html",
                "names": {
                    "en": "Masked Special Forces",
                    "cn": "特种部队"
                }
            },
            {
                "title": "Stickman Parkour",
                "category": "adventure",
                "href": "games/categories/adventure/stickman-parkour.html",
                "names": {
                    "en": "Stickman Parkour",
                    "cn": "火柴人跑酷"
                }
            },
            {
                "title": "Vex 7",
                "category": "adventure",
                "href": "games/categories/adventure/vex-7.html",
                "names": {
                    "en": "Vex 7",
                    "cn": "维克斯7"
                }
            },
            {
                "title": "Run 3D",
                "category": "arcade",
                "href": "games/categories/arcade/run-3d.html",
                "names": {
                    "en": "Run 3D",
                    "cn": "跑酷3D"
                }
            },
            {
                "title": "Geometry Dash",
                "category": "arcade",
                "href": "games/categories/arcade/geometry-dash.html",
                "names": {
                    "en": "Geometry Dash",
                    "cn": "几何冲刺"
                }
            },
            {
                "title": "Burnout City",
                "category": "car",
                "href": "games/categories/car/burnout-city.html",
                "names": {
                    "en": "Burnout City",
                    "cn": "燃烧城市"
                }
            },
            {
                "title": "Fun Party Makeup",
                "category": "girl",
                "href": "games/categories/girl/fun-party-makeup.html",
                "names": {
                    "en": "Fun Party Makeup",
                    "cn": "趣味派对化妆"
                }
            },
            {
                "title": "Poptropica",
                "category": "kids",
                "href": "games/categories/kids/poptropica.html",
                "names": {
                    "en": "Poptropica",
                    "cn": "泡泡岛"
                }
            },
            {
                "title": "World Guesser",
                "category": "multiplayer",
                "href": "games/categories/multiplayer/world-guesser.html",
                "names": {
                    "en": "World Guesser",
                    "cn": "世界猜测者"
                }
            },
            {
                "title": "Google Feud",
                "category": "puzzle",
                "href": "games/categories/puzzle/google-feud.html",
                "names": {
                    "en": "Google Feud",
                    "cn": "谷歌世仇"
                }
            },
            {
                "title": "Duck Life Adventure",
                "category": "racing",
                "href": "games/categories/racing/duck-life-adventure.html",
                "names": {
                    "en": "Duck Life Adventure",
                    "cn": "鸭子生活冒险"
                }
            },
            {
                "title": "Alien Sky Invasion",
                "category": "shooting",
                "href": "games/categories/shooting/alien-sky-invasion.html",
                "names": {
                    "en": "Alien Sky Invasion",
                    "cn": "外星天空入侵"
                }
            },
            {
                "title": "Hoop World 3D",
                "category": "sports",
                "href": "games/categories/sports/hoop-world-3d.html",
                "names": {
                    "en": "Hoop World 3D",
                    "cn": "篮球世界3D"
                }
            },
            {
                "title": "Hero Tower",
                "category": "strategy",
                "href": "games/categories/strategy/hero-tower.html",
                "names": {
                    "en": "Hero Tower",
                    "cn": "英雄塔"
                }
            }
        ];
        
        console.log('✅ 游戏数据加载完成，游戏数量:', this.games.length);
    }
    
    bindEvents() {
        // 搜索输入事件
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // 搜索按钮点击事件
        this.searchBtn.addEventListener('click', () => {
            this.handleSearch(this.searchInput.value);
        });
        
        // 键盘导航
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });
        
        // 失去焦点时隐藏结果
        this.searchInput.addEventListener('blur', () => {
            // 延迟隐藏，允许点击结果
            setTimeout(() => {
                this.hideResults();
            }, 150);
        });
        
        // 获得焦点时显示结果
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim() && this.searchResultsList.children.length > 0) {
                this.showResults();
            }
        });
        
        // 监听语言变化
        window.addEventListener('storage', (e) => {
            if (e.key === 'xgame_lang') {
                this.updateLanguage();
            }
        });
        
        // 点击外部隐藏结果
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
                this.hideResults();
            }
        });
    }
    
    updateLanguage() {
        this.currentLanguage = localStorage.getItem('xgame_lang') || 'en';
        // 如果当前有搜索结果，重新渲染以更新语言
        if (this.searchInput.value.trim()) {
            this.handleSearch(this.searchInput.value);
        }
    }
    
    handleSearch(query) {
        // 防抖处理
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 200);
    }
    
    performSearch(query) {
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery) {
            this.hideResults();
            return;
        }
        
        if (trimmedQuery.length < 1) {
            this.hideResults();
            return;
        }
        
        // 检测搜索语言
        const searchLanguage = this.detectSearchLanguage(trimmedQuery);
        
        this.showLoading(searchLanguage);
        
        // 搜索逻辑
        const results = this.searchGames(trimmedQuery);
        
        // 渲染结果（传递检测到的语言）
        this.renderResults(results, trimmedQuery, searchLanguage);
    }
    
    searchGames(query) {
        const lowercaseQuery = query.toLowerCase();
        console.log('🔍 搜索查询:', lowercaseQuery, '游戏总数:', this.games.length);
        
        const results = this.games.filter(game => {
            // 搜索英文名称
            const englishName = game.names.en.toLowerCase();
            // 搜索中文名称
            const chineseName = game.names.cn.toLowerCase();
            // 搜索游戏ID
            const gameId = game.title.toLowerCase();
            
            const match = englishName.includes(lowercaseQuery) || 
                         chineseName.includes(lowercaseQuery) ||
                         gameId.includes(lowercaseQuery);
            
            if (match) {
                console.log('✅ 匹配游戏:', game.names.en, '/', game.names.cn);
            }
            
            return match;
        }).slice(0, 8); // 限制结果数量
        
        console.log('📊 搜索结果数量:', results.length);
        return results;
    }
    
    renderResults(results, query, searchLanguage = null) {
        this.selectedIndex = -1;
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }
        
        // 清空之前的结果
        this.searchResultsList.innerHTML = '';
        
        // 渲染每个结果
        results.forEach((game, index) => {
            const resultItem = this.createResultItem(game, query, index, searchLanguage);
            this.searchResultsList.appendChild(resultItem);
        });
        
        this.showResults();
    }
    
    createResultItem(game, query, index, searchLanguage = null) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.dataset.index = index;
        item.dataset.href = game.href;
        
        // 根据搜索语言决定显示语言（优先级：搜索语言检测 > 当前语言设置）
        const displayLanguage = searchLanguage || this.currentLanguage;
        const gameName = displayLanguage === 'cn' ? game.names.cn : game.names.en;
        const highlightedName = this.highlightText(gameName, query);
        
        // 游戏图标路径
        const iconPath = `assets/images/games/${game.category}/${game.title}.jpg`;
        
        // 分类名称（使用与游戏名相同的语言）
        const categoryName = this.getCategoryName(game.category, displayLanguage);
        
        item.innerHTML = `
            <img src="${iconPath}" alt="${gameName}" class="game-icon" 
                 onerror="this.style.display='none';">
            <div class="game-info">
                <div class="game-title">${highlightedName}</div>
                <div class="game-category">${categoryName}</div>
            </div>
        `;
        
        // 点击事件
        item.addEventListener('click', () => {
            this.selectGame(game);
        });
        
        return item;
    }
    
    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * 检测搜索关键词的语言
     * @param {string} query - 搜索关键词
     * @returns {string} 'cn' 或 'en'
     */
    detectSearchLanguage(query) {
        // 检测是否包含中文字符
        const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
        
        if (chineseRegex.test(query)) {
            console.log('🔍 检测到中文搜索:', query);
            return 'cn';
        } else {
            console.log('🔍 检测到英文搜索:', query);
            return 'en';
        }
    }
    
    getCategoryName(category, language = null) {
        const targetLanguage = language || this.currentLanguage;
        const categoryNames = {
            'action': targetLanguage === 'cn' ? '动作' : 'Action',
            'adventure': targetLanguage === 'cn' ? '冒险' : 'Adventure',
            'arcade': targetLanguage === 'cn' ? '街机' : 'Arcade',
            'car': targetLanguage === 'cn' ? '汽车' : 'Car',
            'girl': targetLanguage === 'cn' ? '女生' : 'Girl',
            'kids': targetLanguage === 'cn' ? '儿童' : 'Kids',
            'multiplayer': targetLanguage === 'cn' ? '多人' : 'Multiplayer',
            'puzzle': targetLanguage === 'cn' ? '益智' : 'Puzzle',
            'racing': targetLanguage === 'cn' ? '竞速' : 'Racing',
            'shooting': targetLanguage === 'cn' ? '射击' : 'Shooting',
            'sports': targetLanguage === 'cn' ? '体育' : 'Sports',
            'strategy': targetLanguage === 'cn' ? '策略' : 'Strategy'
        };
        
        return categoryNames[category] || category;
    }
    
    handleKeyNavigation(e) {
        const items = this.searchResultsList.children;
        
        if (items.length === 0) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                    const href = items[this.selectedIndex].dataset.href;
                    if (href) {
                        this.loadGamePage(href);
                    }
                }
                break;
                
            case 'Escape':
                this.hideResults();
                this.searchInput.blur();
                break;
        }
    }
    
    updateSelection() {
        const items = this.searchResultsList.children;
        
        // 清除之前的选择
        Array.from(items).forEach(item => {
            item.classList.remove('keyboard-selected');
        });
        
        // 设置当前选择
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].classList.add('keyboard-selected');
            // 滚动到可见区域
            items[this.selectedIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    selectGame(game) {
        const gameName = game.names[this.currentLanguage] || game.names.en || game.title;
        console.log('🎮 选择游戏:', gameName, '链接:', game.href);
        this.loadGamePage(game.href);
        this.hideResults();
        this.searchInput.value = '';
    }
    
    loadGamePage(href) {
        // 在主 iframe 中加载游戏详情页
        const mainFrame = document.getElementById('mainFrame');
        if (mainFrame) {
            mainFrame.src = href;
            console.log('🔗 加载游戏页面:', href);
        } else {
            console.error('❌ 未找到主 iframe');
        }
    }
    
    showLoading(language = null) {
        const targetLanguage = language || this.currentLanguage;
        const searchingText = targetLanguage === 'cn' ? '搜索中...' : 'Searching...';
        this.searchResultsList.innerHTML = `
            <div class="search-loading">
                <div class="loading-spinner"></div>
                <span>${searchingText}</span>
            </div>
        `;
        this.noResults.classList.add('hidden');
        this.showResults();
    }
    
    showResults() {
        this.searchResults.classList.remove('hidden');
    }
    
    hideResults() {
        this.searchResults.classList.add('hidden');
        this.selectedIndex = -1;
    }
    
    showNoResults() {
        this.searchResultsList.innerHTML = '';
        this.noResults.classList.remove('hidden');
        this.showResults();
    }
}

// 页面加载完成后初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 初始化游戏搜索功能...');
    window.gameSearch = new GameSearch();
});

// 导出供外部使用
window.GameSearch = GameSearch; 