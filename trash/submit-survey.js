const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const dataFilePath = path.join(__dirname, '..', '..', 'responses.json');
    const currentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    const newResponse = JSON.parse(event.body);

    // Append new response
    currentData.push(newResponse);
    fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2), 'utf-8');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Response submitted successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
