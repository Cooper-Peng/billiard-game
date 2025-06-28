// 游戏详情页面交互逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 获取URL参数中的游戏ID
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        window.location.href = '/index.html';
        return;
    }

    // 加载游戏数据
    loadGameData(gameId);
});

// 加载游戏数据
async function loadGameData(gameId) {
    try {
        // 从游戏数据文件加载游戏信息
        const response = await fetch(`/game_data_crawler/data/games/action/${gameId}.json`);
        const gameData = await response.json();

        // 确保游戏数据包含必要的字段
        if (!gameData.iframeUrl) {
            console.error('游戏数据缺少iframeUrl字段');
            showError('游戏数据不完整，请稍后重试');
            return;
        }

        // 更新页面内容
        updateGameInfo(gameData);
        
        // 加载相关游戏
        loadRelatedGames(gameData.categories);
        
        // 加载游戏评论
        loadGameComments(gameId);
        
        // 加载游戏攻略
        loadGameGuide(gameId);
    } catch (error) {
        console.error('加载游戏数据失败:', error);
        showError('加载游戏数据失败，请稍后重试');
    }
}

// 更新游戏信息
function updateGameInfo(gameData) {
    // 更新页面标题
    document.title = `${gameData.title || gameData.game_name} - xGame.best`;
    
    // 更新游戏封面
    document.getElementById('gameImage').src = gameData.imageUrl;
    document.getElementById('gameImage').alt = gameData.title || gameData.game_name;
    
    // 更新游戏标题
    document.getElementById('gameTitle').textContent = gameData.title || gameData.game_name;
    
    // 更新游戏描述
    document.getElementById('gameDescription').textContent = gameData.description || '暂无描述';
    
    // 更新游戏分类
    if (Array.isArray(gameData.categories)) {
        document.getElementById('gameCategory').textContent = gameData.categories.join(', ');
    } else {
        document.getElementById('gameCategory').textContent = gameData.categories || '未分类';
    }
    
    // 更新游戏标签
    if (gameData.tags) {
        document.getElementById('gameTags').textContent = gameData.tags.join(', ');
    }
    
    // 更新游戏iframe
    const gameFrame = document.getElementById('gameFrame');
    gameFrame.src = gameData.iframeUrl;
    
    // 更新游戏控制说明
    if (gameData.controls) {
        const controlsList = gameData.controls.split('\n').map(control => {
            const [key, action] = control.split(':').map(s => s.trim());
            return `<li><strong>${key}:</strong> ${action}</li>`;
        }).join('');
        
        document.getElementById('gameGuide').innerHTML = `
            <h3>游戏控制</h3>
            <ul class="list-disc pl-5">
                ${controlsList}
            </ul>
            ${gameData.howToPlay ? `<h3 class="mt-4">游戏玩法</h3><p>${gameData.howToPlay}</p>` : ''}
        `;
    }
    
    // 更新评分
    updateRating(gameData.rating || 0);
    
    // 更新播放次数
    document.getElementById('playCount').textContent = `${gameData.playCount || 0} 次播放`;
}

// 更新评分显示
function updateRating(rating) {
    const ratingStars = document.getElementById('ratingStars');
    const ratingScore = document.getElementById('ratingScore');
    
    // 清空现有星星
    ratingStars.innerHTML = '';
    
    // 添加星星
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = i <= rating ? '★' : '☆';
        ratingStars.appendChild(star);
    }
    
    // 更新评分数字
    ratingScore.textContent = rating.toFixed(1);
}

// 加载相关游戏
async function loadRelatedGames(category) {
    try {
        const response = await fetch(`/game_data_crawler/data/games/action/action_games.json`);
        const games = await response.json();
        
        // 筛选同类别游戏
        const relatedGames = games
            .filter(game => game.categories === category)
            .slice(0, 5); // 只显示5个相关游戏
        
        const relatedGamesContainer = document.getElementById('relatedGames');
        relatedGamesContainer.innerHTML = '';
        
        relatedGames.forEach(game => {
            const gameCard = createGameCard(game);
            relatedGamesContainer.appendChild(gameCard);
        });
    } catch (error) {
        console.error('加载相关游戏失败:', error);
    }
}

// 创建游戏卡片
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer';
    card.onclick = () => window.location.href = `/gameDetail.html?id=${game.id}`;
    
    card.innerHTML = `
        <img src="${game.imageUrl}" alt="${game.game_name}" class="w-20 h-20 object-cover rounded-lg">
        <div>
            <h3 class="font-medium">${game.game_name}</h3>
            <p class="text-sm text-gray-500">${game.categories}</p>
        </div>
    `;
    
    return card;
}

// 加载游戏评论
async function loadGameComments(gameId) {
    try {
        // 这里应该从后端API获取评论数据
        // 目前使用模拟数据
        const comments = [
            {
                user: '玩家1',
                content: '非常好玩的游戏！',
                rating: 5,
                date: '2024-03-20'
            },
            {
                user: '玩家2',
                content: '画面很精美，操作也很流畅。',
                rating: 4,
                date: '2024-03-19'
            }
        ];
        
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';
        
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });
    } catch (error) {
        console.error('加载评论失败:', error);
    }
}

// 创建评论元素
function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'border-b border-gray-200 pb-4';
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div>
                <span class="font-medium">${comment.user}</span>
                <div class="flex text-yellow-400 text-sm">
                    ${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}
                </div>
            </div>
            <span class="text-sm text-gray-500">${comment.date}</span>
        </div>
        <p class="text-gray-600">${comment.content}</p>
    `;
    
    return div;
}

// 加载游戏攻略
async function loadGameGuide(gameId) {
    try {
        // 这里应该从后端API获取攻略数据
        // 目前使用模拟数据
        const guide = `
            <h3>游戏攻略</h3>
            <ol>
                <li>熟悉基本操作</li>
                <li>掌握游戏技巧</li>
                <li>了解游戏规则</li>
            </ol>
        `;
        
        document.getElementById('gameGuide').innerHTML = guide;
    } catch (error) {
        console.error('加载攻略失败:', error);
    }
}

// 显示错误信息
function showError(message) {
    // 创建错误提示元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
    errorDiv.textContent = message;
    
    // 添加到页面
    document.body.appendChild(errorDiv);
    
    // 3秒后自动消失
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// 事件监听器
document.getElementById('favoriteButton').addEventListener('click', () => {
    // 实现收藏功能
    const button = document.getElementById('favoriteButton');
    button.classList.toggle('text-red-500');
});

document.getElementById('shareButton').addEventListener('click', () => {
    // 实现分享功能
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: '来和我一起玩这个游戏吧！',
            url: window.location.href
        });
    } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href)
            .then(() => showError('链接已复制到剪贴板'))
            .catch(() => showError('复制链接失败'));
    }
});

document.getElementById('submitComment').addEventListener('click', () => {
    const commentInput = document.getElementById('commentInput');
    const comment = commentInput.value.trim();
    
    if (!comment) {
        showError('请输入评论内容');
        return;
    }
    
    // 这里应该发送评论到后端API
    // 目前只是模拟添加评论
    const newComment = {
        user: '当前用户',
        content: comment,
        rating: 5,
        date: new Date().toISOString().split('T')[0]
    };
    
    const commentsList = document.getElementById('commentsList');
    const commentElement = createCommentElement(newComment);
    commentsList.insertBefore(commentElement, commentsList.firstChild);
    
    // 清空输入框
    commentInput.value = '';
    
    showError('评论发表成功');
}); 