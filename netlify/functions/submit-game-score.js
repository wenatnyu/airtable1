const axios = require('axios');

exports.handler = async (event) => {
  console.log('Function started');
  console.log('HTTP Method:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    console.log('Raw event body:', event.body);
    
    const { username, score } = JSON.parse(event.body);
    console.log('Parsed data:', { username, score });
    
    if (!username || score === undefined) {
      console.error('Validation failed:', { username, score });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const AIRTABLE_API_KEY = 'patIIWCRruEl0DNFW.6f3c99d7dbbd7cda96ac97c764009a1d310f06261daa4f2d7798573fa114708c';
    const BASE_ID = 'app3ZPcIMsG2hqsCB';
    const TABLE_NAME = 'Game';

    const airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
    
    console.log('Preparing Airtable request');
    
    const airtableData = {
      records: [{
        fields: {
          Username: username,
          Score: parseInt(score),
          SubmitTime: new Date().toISOString()
        }
      }]
    };
    
    console.log('Airtable request data:', airtableData);

    try {
      const response = await axios.post(
        airtableUrl,
        airtableData,
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Airtable response:', response.data);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Game score submitted successfully!',
          data: response.data
        })
      };
    } catch (airtableError) {
      console.error('Airtable API Error:', {
        message: airtableError.message,
        response: airtableError.response?.data,
        status: airtableError.response?.status
      });
      throw airtableError;
    }

  } catch (error) {
    console.error('General Error:', {
      message: error.message,
      stack: error.stack
    });
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data || 'No additional details available'
      })
    };
  }
}; 