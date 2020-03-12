from flask import Flask
from flask import request, make_response, jsonify
from flask_mysqldb import MySQL
import json

app = Flask(__name__)

#configuring sql db with auth
app.config['MYSQL_USER'] = 'sagar'
app.config['MYSQL_PASSWORD'] = 'anku123'
app.config['MYSQL_DB'] = 'Task_Manager'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

from blueprint_auth import auth
from blueprint_task import task
app.register_blueprint(auth,url_prefix='/auth')
app.register_blueprint(task,url_prefix='/task')
