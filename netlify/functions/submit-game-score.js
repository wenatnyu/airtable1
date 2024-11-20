const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { username, score } = JSON.parse(event.body);
    
    const AIRTABLE_API_KEY = 'patIIWCRruEl0DNFW.6f3c99d7dbbd7cda96ac97c764009a1d310f06261daa4f2d7798573fa114708c';
    const BASE_ID = 'app3ZPcIMsG2hqsCB';
    const TABLE_NAME = 'GameScores';

    const config = {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    const record = {
      fields: {
        Username: username,
        Score: score,
        PlayTime: new Date().toISOString(),
      },
    };

    await axios.post(airtableUrl, { records: [record] }, config);

    // 获取最高分记录
    const response = await axios.get(`${airtableUrl}?sort[0][field]=Score&sort[0][direction]=desc&maxRecords=1`, config);
    const highScore = response.data.records[0]?.fields || null;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Score submitted successfully!',
        highScore: highScore ? {
          username: highScore.Username,
          score: highScore.Score
        } : null
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 