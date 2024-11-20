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