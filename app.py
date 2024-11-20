@app.route('/submit_final_score', methods=['POST'])
def submit_final_score():
    data = request.get_json()
    username = data['username']
    score = data['score']
    
    # 提交到 Game 表
    game_table = Airtable(AIRTABLE_BASE_ID, 'Game', AIRTABLE_API_KEY)
    game_table.insert({
        'Username': username,
        'Score': score
    })
    
    # 获取最高分记录
    records = game_table.get_all(sort=[('Score', 'desc')])
    top_record = records[0]['fields'] if records else {'Username': 'No records', 'Score': 0}
    
    return jsonify({
        'top_player': top_record['Username'],
        'top_score': top_record['Score']
    }) 