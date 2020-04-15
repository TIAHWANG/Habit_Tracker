from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

import requests
from bs4 import BeautifulSoup

from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.dbhabits

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/habits', methods=['GET'])
def listing():
    result = list(db.habits.find({}, {'_id': 0}))
    return jsonify({'result': 'success', 'habits': result})

@app.route('/habits', methods=['POST'])
def saving():
    email_receive = request.form['email']
    habits_receive = request.form.getlist('habits[]')

    for h in habits_receive:
        habit = {'email': email_receive, 'habit': h}
        db.habits.insert_one(habit)

    return jsonify({'result': 'success'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)