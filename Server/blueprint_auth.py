from flask import Blueprint
from flask import request, make_response, jsonify
import json
import csv
from helper_auth import *
from flask_mysqldb import MySQL
import MySQLdb as err
from server import mysql

auth = Blueprint("auth",__name__)

@auth.route('/register',methods = ['POST'])
def registerUser():
    username = request.json['username']
    password = request.json['password']
    #generating new salt and password_hash
    salt = generate_salt()
    password_hash = multiple_hashing(password,salt)

    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """INSERT INTO users (name,password,salt)
            VALUES (%s, %s, %s) """, (username,password_hash,salt) 
        )
        mysql.connection.commit()
        cursor.close()
        message = {"message": "Registration Completed"}
        return message
    except err.IntegrityError: #if email already present it will show integrity error
        message = {"message":"Name is already present"}
        return message


@auth.route('/login', methods = ['POST'])
def loginUser():
    username = request.json['username']
    password = request.json['password']

    #check if name is valid/present in db
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT id,name,password,salt FROM users WHERE name = %s""",(username,))
    user = cursor.fetchone()
    cursor.close()
    if user: #if user is present
        if multiple_hashing(password,user['salt']) == user['password']: #if password is correct
            #returning token
            token = Encode(user['id'])
            return {"message":"Entered password is correct",
                "token":token,"status":True}
        else:
            return {"message":"Password is incorrect","status":False}
    else:
        return {"message":"Email is not registered","status":False}