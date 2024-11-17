const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }


    try {
      const { username, userId, teacher, rating, comment } = JSON.parse(event.body);

    const AIRTABLE_API_KEY = 'patIIWCRruEl0DNFW.6f3c99d7dbbd7cda96ac97c764009a1d310f06261daa4f2d7798573fa114708c'; // Replace with your actual Airtable API key
    const BASE_ID = 'app3ZPcIMsG2hqsCB'; // Replace with your Airtable base ID
    const TABLE_NAME = 'Responses'; // Replace with your table name

    // Prepare headers and endpoint
    const config = {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    // Prepare the data for Airtable
    const record = {
      fields: {
        Username: username,
        UserID: userId,
        Teacher: teacher,
        Rating: parseInt(rating, 10), // 转换为整数
        Comment: comment,
      },
    };

    await axios.post(airtableUrl, { records: [record] }, config);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Response submitted successfully!' }),
    };
  } catch (error) {
    console.error('Error submitting survey:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
