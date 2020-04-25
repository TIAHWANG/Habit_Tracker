from bson import ObjectId
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

from bs4 import BeautifulSoup

from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.dbhabits


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/habits', methods=['GET'])
def listing():
    current_email = request.args.get('email')
    habit_list = list(db.habits.find({}, {'_id': 0}))

    user_habit_list = []
    for habit in habit_list:
        if habit['email'] == current_email:
            user_habit_list.append(habit)

    username = current_email.split("@")[0]

    return render_template("habits.html", username=username, email=current_email, habits=user_habit_list)


@app.route('/habits', methods=['POST'])
def saving():
    email_receive = request.form['email']
    habit_receive = request.form['habit']
    color_receive = request.form['bgColor']

    # save current email
    current_email = email_receive

    # 습관이름이 빈칸이면 로그인되도록 설정
    if str(habit_receive).strip() != "":
        habit = {'email': email_receive, 'habit': habit_receive, 'color': color_receive}
        db.habits.insert_one(habit)

    return jsonify({'result': 'success', 'current_email': current_email, 'bgColor': color_receive})

@app.route('/habits-add', methods=['POST'])
def addHabits():
    email_receive = request.form['email']
    habit_receive = request.form['habits']

    db.habits.insert_one({'email': email_receive, 'habit': habit_receive})

    return jsonify({'result': 'success'})

@app.route('/habits-edit', methods=['POST'])
def editName():
    email_receive = request.form['email']
    name_receive = request.form['title']
    edited_name_receive = request.form['newTitle']
    color_receive = request.form['backgroundColor']
    # print(color_receive)

    # db.habits.update_one({'email': email_receive, 'habit': name_receive}, {'$set': {'habit': edited_name_receive}})
    # db.calendars.update_many({'title': name_receive, 'email': email_receive}, {'$set': {'title': edited_name_receive}})

    return jsonify({'result': 'success'})


@app.route('/habits-date', methods=['GET'])
def listingEvents():
    events_list = list(db.calendars.aggregate([{
        '$project': {
            '_id': {
                '$toString': "$_id"
            },
            'date': 1,
            'title': 1,
            'email': 1
        }
    }]))

    return jsonify({'result': 'success', 'events_list': events_list})


@app.route('/habits-date', methods=['POST'])
def savingEvents():
    date_receive = request.form['date']
    title_receive = request.form['title']
    email = request.form['email']

    calendar = {'date': date_receive, 'title': title_receive, 'email': email}
    db.calendars.insert_one(calendar)

    return jsonify({'result': 'success'})


@app.route('/habits-delete', methods=['POST'])
def deleteEvents():
    target_event = request.form['targetId_give']

    db.calendars.delete_one({'_id': ObjectId(target_event)})

    return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
