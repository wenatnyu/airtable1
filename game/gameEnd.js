function getCurrentScore() {
    return parseInt(document.getElementById('score').textContent);
}

function playAgain() {
    window.location.href = '/game';
}

function submitScore() {
    const username = document.getElementById('username').value;
    const finalScore = getCurrentScore();

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
    })
    .catch(error => {
        console.error('Error:', error);
        alert('提交时发生错误，请重试！');
    });
}
