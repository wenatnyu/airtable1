const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // 记录接收到的原始数据
    console.log('Received event body:', event.body);
    
    const { username, questionNumber, comment } = JSON.parse(event.body);
    
    // 验证必要的数据是否存在
    if (!username || !questionNumber || !comment) {
      console.error('Missing required fields:', { username, questionNumber, comment });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const AIRTABLE_API_KEY = 'patIIWCRruEl0DNFW.6f3c99d7dbbd7cda96ac97c764009a1d310f06261daa4f2d7798573fa114708c';
    const BASE_ID = 'app3ZPcIMsG2hqsCB';
    const TABLE_NAME = 'Responses';

    const config = {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    const recipient = questionNumber === 1 ? '殷闻老师' : '籽奥';
    
    const record = {
      fields: {
        Username: username,
        Recipient: recipient,
        Comment: comment,
        SubmitTime: new Date().toISOString(),
      },
    };

    // 记录准备发送到 Airtable 的数据
    console.log('Preparing to send to Airtable:', record);

    try {
      const response = await axios.post(airtableUrl, { records: [record] }, config);
      console.log('Airtable response:', response.data);
    } catch (airtableError) {
      console.error('Airtable API Error:', airtableError.response?.data || airtableError.message);
      throw airtableError;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: '提交成功 Response submitted successfully!' }),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: error.message,
        details: error.response?.data || 'No additional details available'
      }),
    };
  }
};

function endGame() {
    const username = document.getElementById('username').value;
    const finalScore = getCurrentScore(); // 获取当前分数的函数

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
