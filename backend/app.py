from logging import debug
from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
from flask_cors import CORS, cross_origin
"""
    Initialize firebase app
"""
cred = credentials.Certificate('exam-vault-firebase-adminsdk-he4z9-a435dd6534.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
@app.route('/',methods=['GET'])
def home():
    msg = 'Backend for Exam_Vault. ADMIN ACCESS ONLY'
    return msg
@app.route('/data',methods=['POST','GET'])
@cross_origin()
def get_data_from_firebase():
    data_list = []
    
    docs = db.collection(u'covid').stream()
    for doc in docs:

        data_list.append(({"Course":doc.get('state'),"Link":doc.get('cases')}))
    data = {"uploaded_files":data_list}
    return json.dumps(data)
if __name__ == '__main__':
    app.run(debug=True,port=5000)