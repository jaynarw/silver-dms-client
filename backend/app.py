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

@app.route("/<int:name>",methods=["GET"])
def greet_user(name):
    return "Hello"+str(name)
if __name__ == "__main__":
    app.run(debug=True, port=5000)
