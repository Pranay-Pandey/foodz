import jwt
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
BACKEND_ENCRYPTION_KEY = os.getenv('BACKEND_ENCRYPTION_KEY')
BACKEND_ENCRYPTION_IV = os.getenv('BACKEND_ENCRYPTION_IV')

def create_token(id, role="user"):
    payload = {
        'id': id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=15),
        'iat': datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    
def decrypt_message(encrypted_message):
    derived_key = base64.b64decode(BACKEND_ENCRYPTION_KEY)
    iv = BACKEND_ENCRYPTION_IV.encode('utf-8')
    enc = base64.b64decode(encrypted_message)
    cipher = AES.new(derived_key, AES.MODE_CBC, iv)
    password = unpad(cipher.decrypt(enc), 16).decode('utf-8')
    return password
