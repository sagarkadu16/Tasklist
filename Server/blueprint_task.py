from flask import Blueprint
from flask import request, make_response, jsonify
import json
import csv
from helper_auth import *
from flask_mysqldb import MySQL
import MySQLdb as err
from server import mysql

task = Blueprint("task",__name__)


#check whether addressed user is valid or not
def isUserValid(id):
    print('isUserValid',id)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM users WHERE id = %s""",(id,)
    )
    user = cursor.fetchone()
    cursor.close()
    if user:return True
    else: return False


#=======================================================================
#create tasklist
@task.route('/',methods = ['POST'])
def createTasklist():
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])
    if isUserValid(user_id):
        listname = request.json['listname']
        category = request.json['category']
        cursor = mysql.connection.cursor()
        cursor.execute(
            """INSERT INTO tasklist(listname,user_id,category) VALUES(%s,%s,%s)""",(listname,user_id,category)
        )   
        mysql.connection.commit()
        cursor.close()

        #fetch all tasklists
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT tasklist.id,listname,category,COUNT(task.id) as taskcount FROM tasklist LEFT JOIN task ON task.tasklist_id = tasklist.id WHERE tasklist.user_id = %s GROUP BY(tasklist.id);""",(user_id,)
        )
        tasklists = cursor.fetchall()
        cursor.close()

        return {"message":"tasklist created","tasklist":tasklists}
    else:
        return {"message":"User is not registered in record"}


#Update Specific tasklist
@task.route('/<tasklist_id>',methods=['PUT'])
def updateTasklist(tasklist_id):
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])
    if isUserValid(user_id):
        tasklist_id = int(tasklist_id)
        listname = request.json['listname']
        category = request.json['category']
        cursor = mysql.connection.cursor()
        cursor.execute(
            """UPDATE tasklist SET listname = %s,category = %s WHERE id = %s && user_id = %s""",(listname,category,tasklist_id,user_id)
        )
        mysql.connection.commit()
        cursor.close()

        #fetching updated details
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT id,listname,category FROM tasklist WHERE id = %s""",(tasklist_id,)
        )       
        result = cursor.fetchone()
        cursor.close()

        return {"message":"List Updated","tasklist":result}
    else:
        return {"message":"User is not registered in record"}


#Delete Specific List
@task.route('/<tasklist_id>',methods = ['DELETE'])
def deleteSpecificList(tasklist_id):
    tasklist_id = int(tasklist_id)
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])
    if isUserValid(user_id):
        tasklist_id = int(tasklist_id)
        #deleting all task belonging to list
        cursor = mysql.connection.cursor()
        cursor.execute(
            """DELETE FROM task WHERE tasklist_id = %s && user_id = %s""",(tasklist_id,user_id)
        )
        mysql.connection.commit()
        cursor.close()

        #Now,deleting list details
        cursor = mysql.connection.cursor()
        cursor.execute(
            """DELETE FROM tasklist WHERE id = %s && user_id = %s""",(tasklist_id,user_id)
        )       
        mysql.connection.commit()
        cursor.close()

        #fetch records of list
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT tasklist.id,listname,category,COUNT(task.id) as taskcount FROM tasklist LEFT JOIN task ON task.tasklist_id = tasklist.id WHERE tasklist.user_id = %s GROUP BY(tasklist.id);""",(user_id,)
        )
        tasklists = cursor.fetchall()
        cursor.close()
    

        return {"message":"List Removed","tasklists":tasklists}
    else:
        return {"message":"User is not registered in record"}



#Get records of specific list
@task.route('/<tasklist_id>')
def getSpecificRecord(tasklist_id):
    tasklist_id = int(tasklist_id)
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])
    if isUserValid(user_id):
        #fetching tasklist details first:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT tasklist.id,listname,category,users.name as username FROM tasklist JOIN users ON tasklist.user_id = users.id WHERE tasklist.id = %s && tasklist.user_id = %s""",(tasklist_id,user_id)
        )
        listdetails = cursor.fetchone()
        cursor.close()

        #Now,fetching details of all tasks
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT * FROM task WHERE tasklist_id = %s && user_id = %s""",(tasklist_id,user_id)
        )       
        result = cursor.fetchall()
        cursor.close()
        tasks = []
        for task in result:
            tasks.append(task)

        return {"message":"List Details Sent","list":listdetails,"task":tasks}
    else:
        return {"message":"User is not registered in record"}

    
#Get records of all tasks for specific user
@task.route('/')
def getAllTaskRecords():
    print('reached route')
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])
    if isUserValid(user_id):
        #fetching all tasklist records for this user:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT tasklist.id,listname,category,COUNT(task.id) as taskcount FROM tasklist LEFT JOIN task ON task.tasklist_id = tasklist.id WHERE tasklist.user_id = %s GROUP BY(tasklist.id);""",(user_id,)
        )
        tasklists = cursor.fetchall()
        cursor.close()

        return {"message":"All List records received","tasklists":tasklists}
    else:
        return {"message":"User is not registered in record"}

    



#=======================================================================================================
#adding tasks in specific list
@task.route('/<tasklist_id>',methods = ['POST'])
def addTask(tasklist_id):
    tasklist_id = int(tasklist_id)
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])
    if isUserValid(user_id):
        taskname = request.json['taskname']
        #adding task in specified list
        cursor = mysql.connection.cursor()
        cursor.execute(
            """INSERT INTO task(taskname,tasklist_id,user_id) VALUES (%s,%s,%s)""",(taskname,tasklist_id,user_id)
        )
        mysql.connection.commit()
        cursor.close()

        #fetching updated task details
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT * FROM task WHERE tasklist_id = %s && user_id = %s""",(tasklist_id,user_id)
        )
        result = cursor.fetchall()
        cursor.close()
        tasks = []
        for task in result:
            tasks.append(task)

        return {"message":"Task Added","tasks":tasks}
    else:
        return {"message":"User is not registered in record"}



#updating specific task
@task.route('/<tasklist_id>/<task_id>',methods=['PUT'])
def updateTask(tasklist_id,task_id):
    tasklist_id = int(tasklist_id)
    task_id = int(task_id)
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])
    if isUserValid(user_id):
        taskname = request.json['taskname']
        #updating task in specified list
        cursor = mysql.connection.cursor()
        cursor.execute(
            """UPDATE task SET taskname = %s WHERE id=%s""",(taskname,task_id)
        )
        mysql.connection.commit()
        cursor.close()

        #fetching updated task details
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT * FROM task WHERE tasklist_id = %s && user_id = %s""",(tasklist_id,user_id)
        )
        result = cursor.fetchall()
        cursor.close()
        tasks = []
        for task in result:
            tasks.append(task)

        return {"message":"Task Updated","tasks":tasks}
    else:
        return {"message":"User is not registered in record"}



#deleting specific task
@task.route('/<tasklist_id>/<task_id>',methods=['DELETE'])
def deleteTask(tasklist_id,task_id):
    tasklist_id = int(tasklist_id)
    task_id = int(task_id)
    #taking user validation
    auth_header = request.headers.get('Authorization')
    user_id = Decode(auth_header)
    user_id = int(user_id['id'])
    if isUserValid(user_id):
        #deleting task in specified list
        cursor = mysql.connection.cursor()
        cursor.execute(
            """DELETE FROM task WHERE id = %s && user_id = %s""",(task_id,user_id)
        )
        mysql.connection.commit()
        cursor.close()

        #fetching updated task details
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT * FROM task WHERE tasklist_id = %s && user_id = %s""",(tasklist_id,user_id)
        )
        result = cursor.fetchall()
        cursor.close()
        tasks = []
        for task in result:
            tasks.append(task)


        #fetching all tasklist records for this user:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """SELECT tasklist.id,listname,category,COUNT(task.id) as taskcount FROM tasklist LEFT JOIN task ON task.tasklist_id = tasklist.id WHERE tasklist.user_id = %s GROUP BY(tasklist.id);""",(user_id,)
        )
        tasklists = cursor.fetchall()
        cursor.close()

        return {"message":"Task Deleted","tasks":tasks,"tasklist":tasklists}
    else:
        return {"message":"User is not registered in record"}
    



