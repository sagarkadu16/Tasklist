import hashlib
import os
import jwt

#generate new salt 
def generate_salt():
    salt = os.urandom(16)
    # print(salt.encode('base-64'))
    return salt.encode('base-64')

#hashing of string 
def md5_hash(string):
    hash = hashlib.md5()
    hash.update(string.encode('utf-8'))
    # print(hash.hexdigest())
    return hash.hexdigest()


#hashing of string
def multiple_hashing(string,salt):
    string = string + salt
    hashed_string = md5_hash(string)
    for i in range(50):
        hashed_string = md5_hash(hashed_string)

    return hashed_string

#encode user id
def Encode(id):
    encode_data = jwt.encode({"id": id}, 'masai', algorithm='HS256')
    return encode_data

#decode user id
def Decode(auth_header):
    token_encoded = auth_header.split(' ')[1]
    decode_id = jwt.decode(token_encoded, 'masai', algorithms=['HS256'])
    return decode_id