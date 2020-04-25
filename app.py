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

    return jsonify({'result': 'success', 'current_email': current_email})


@app.route('/habits-add', methods=['POST'])
def addHabits():
    email_receive = request.form['email']
    habit_receive = request.form['habit']
    color_receive = request.form['color']

    db.habits.insert_one({'email': email_receive, 'habit': habit_receive, 'color': color_receive})

    return jsonify({'result': 'success'})


@app.route('/habits-edit', methods=['POST'])
def editName():
    email_receive = request.form['email']
    title_receive = request.form['title']
    edited_title_receive = request.form['newTitle']
    color_name = request.form['colorName']
    edited_color_name = request.form['newColorName']
    color_receive = request.form['color']
    # print(color_name, edited_color_name)
    # print(color_receive)

    if (title_receive != edited_title_receive):
        db.habits.update_one({'email': email_receive, 'habit': title_receive},
                             {'$set': {'habit': edited_title_receive}})
        db.calendars.update_many({'title': title_receive, 'email': email_receive},
                                 {'$set': {'title': edited_title_receive}})
    elif (color_name != edited_color_name):
        db.habits.update_one({'email': email_receive, 'habit': title_receive},
                             {'$set': {'color': edited_color_name}})
        db.calendars.update_many({'title': title_receive, 'email': email_receive},
                                 {'$set': {'colorName': edited_color_name, 'color': color_receive}})
    elif (title_receive != edited_title_receive, color_name != edited_color_name):
        db.habits.update_one({'email': email_receive, 'habit': title_receive},
                             {'$set': {'habit': edited_title_receive, 'color': edited_color_name}})
        db.calendars.update_many({'title': title_receive, 'email': email_receive},
                                 {'$set': {'habit': edited_title_receive, 'colorName': edited_color_name,
                                           'color': color_receive}})

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
            'email': 1,
            'color': 1
        }
    }]))

    return jsonify({'result': 'success', 'events_list': events_list})


@app.route('/habits-date', methods=['POST'])
def savingEvents():
    date_receive = request.form['date']
    title_receive = request.form['title']
    email = request.form['email']
    color_name = request.form['colorName']
    color = request.form['color']

    calendar = {'date': date_receive, 'title': title_receive, 'email': email, 'colorName': color_name, 'color': color}
    db.calendars.insert_one(calendar)

    return jsonify({'result': 'success'})


@app.route('/habits-delete', methods=['POST'])
def deleteEvents():
    target_event = request.form['targetId_give']

    db.calendars.delete_one({'_id': ObjectId(target_event)})

    return jsonify({'result': 'success'})


@app.route('/habits-delete2', methods=['POST'])
def deleteHabit():
    email_receive = request.form['email']
    title_receive = request.form['title']

    # print(email_receive, title_receive)

    db.habits.delete_one({'email': email_receive, 'habit': title_receive})
    db.calendars.delete_many({'email': email_receive, 'title': title_receive})

    return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
