from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

from bs4 import BeautifulSoup

from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.dbhabits

# global 변수선언
current_email = ''

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/habits', methods=['GET'])
def listing():
    global current_email
    habit_list = list(db.habits.find({}, {'_id': 0}))
    print(habit_list)
    user_habit_list = []
    for habit in habit_list:
        if habit['email'] == current_email:
            user_habit_list.append(habit)
    username=current_email.split("@")[0]
    return render_template("habits.html", email=username, habits=user_habit_list)

@app.route('/habits', methods=['POST'])
def saving():
    global current_email
    email_receive = request.form['email']
    habits_receive = request.form.getlist('habits[]')

    # save current email
    current_email = email_receive

    # email_receive를 listing 에서 참조해야함

    for h in habits_receive:
        if str(h).strip() == "":
            continue
        habit = {'email': email_receive, 'habit': h}
        db.habits.insert_one(habit)

    return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
