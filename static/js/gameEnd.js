function getCurrentScore() {
    // 从页面获取当前分数
    return parseInt(document.getElementById('score').textContent);
}

function playAgain() {
    window.location.href = '/game';
}

function endGame() {
    const username = document.getElementById('username').value;
    const finalScore = getCurrentScore();

    fetch('/submit_final_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            score: finalScore
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(`游戏结束！\n当前记录保持者: ${data.top_player}\n最高分: ${data.top_score}`);
        window.location.href = '/';
    });
}

function submitScore() {
    const username = document.getElementById('username').value;
    const finalScore = getCurrentScore();

    // 调用 Netlify function 提交分数
    fetch('/.netlify/functions/submit-game-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            score: finalScore
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('分数提交成功！');
        } else {
            alert('提交失败：' + (data.error || '未知错误'));
        }
    });
}

async function showVipEndScreen() {
    // 播放对应角色的结束音频
    const currentCharacter = birdImage.src.split('/').pop();
    if (currentCharacter === 'wzj.png') {
        playSound(endSoundWu);
    } else if (currentCharacter === 'david.png') {
        playSound(endSoundDavid);
    }
    
    const vipScreen = document.getElementById('vipEndScreen');
    const characterAnimation = document.getElementById('characterAnimation');
    const finalScore = document.getElementById('finalScore');
    const schoolRecord = document.getElementById('schoolRecord');
    const funnyMessage = document.getElementById('funnyMessage');
    
    // 显示结算界面
    vipScreen.style.display = 'block';
    
    // 创建角色动画
    const character = document.createElement('img');
    character.src = birdImage.src;
    character.style.width = '150px';
    character.style.height = '150px';
    character.style.animation = 'bounce 1s infinite';
    characterAnimation.innerHTML = '';
    characterAnimation.appendChild(character);
    
    // 显示当前分数
    finalScore.textContent = `最终得分: ${Math.floor(score)}`;
    
    // 显示随机搞笑消息
    const messages = funnyMessages[birdImage.src.split('/').pop()];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    funnyMessage.textContent = randomMessage;
} 