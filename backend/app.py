from logging import debug
from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
from flask_cors import CORS, cross_origin

"""
    Initialize firebase app
"""
cred = credentials.Certificate("exam-vault-firebase-adminsdk-he4z9-a435dd6534.json")
firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://exam-vault-default-rtdb.firebaseio.com/",
    },
)

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/", methods=["GET","POST"])
def home():
    msg = "Backend for Exam_Vault. ADMIN ACCESS ONLY"
    return msg


@app.route("/data", methods=["POST", "GET"])
@cross_origin()
def get_data_from_firebase():
    ref = db.reference(
        "1gnOVIlv3xDotqqsDeFXRoFF4rkGCVYgEwQ3CH0iPlYo/Form%20responses%201/"
    )
    return json.dumps(ref.get())
@app.route("/file-accepted/<int:id>&<int:sub_index>",methods=['GET','POST'])
@cross_origin()
def update_accepted_file(id,sub_index):
    ref = db.reference(
        "1gnOVIlv3xDotqqsDeFXRoFF4rkGCVYgEwQ3CH0iPlYo/Form%20responses%201/"
    )
    data = (ref.get())
    num_files = len(data[int(id)]['Upload Files'].split(", "))
    if data[int(id)]['Resource Accepted?'] == '':
        upd_list = ['no']*num_files
        upd_list[sub_index] = 'Yes'
        separator = ', '
        data[id]['Resource Accepted?'] = separator.join(upd_list)
        ref.child(str(id)).update({'Resource Accepted?':data[id]['Resource Accepted?']})
        return 'File Accepted Successfully'
    else:
        prev_list = data[id]['Resource Accepted?'].split(', ')
        if prev_list[sub_index] == 'Yes':
            return 'File Already Accepted'
        else:
            prev_list[sub_index] = 'Yes' 
            separator = ', '
            data[id]['Resource Accepted?'] = separator.join(prev_list)
            ref.child(str(id)).update({'Resource Accepted?':data[id]['Resource Accepted?']})
            return 'File Accepted Successfully'
@app.route('/file-rejected/<int:id>&<int:sub_index>',methods=['GET','POST'])
@cross_origin()
def update_rejected_file(id,sub_index):
    ref = db.reference(
        "1gnOVIlv3xDotqqsDeFXRoFF4rkGCVYgEwQ3CH0iPlYo/Form%20responses%201/"
    )
    data = (ref.get())
    num_files = len(data[int(id)]['Upload Files'].split(", "))
    if data[id]['Resource Accepted?'] == '':
        upd_list = ['no']*num_files
        separator = ', '
        data[id]['Resource Accepted?'] = separator.join(upd_list)
        ref.child(str(id)).update({'Resource Accepted?':data[id]['Resource Accepted?']})
        return 'File Rejected Successfully'
    else:
        prev_list = data[id]['Resource Accepted?'].split(', ')
        if prev_list[sub_index] == 'No':
            return 'File Already Rejected'
        else:
            prev_list[sub_index] = 'No' 
            separator = ', '
            data[id]['Resource Accepted?'] = separator.join(prev_list)
            ref.child(str(id)).update({'Resource Accepted?':data[id]['Resource Accepted?']})
            return 'File Rejected Successfully'
if __name__ == "__main__":
    app.run(debug=True, port=5000)
