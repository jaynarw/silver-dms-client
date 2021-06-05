from logging import debug
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_expects_json import expects_json
import drive_handler
import schema
import firebase_handler
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/", methods=["GET", "POST"])
def home():
    msg = "Backend for Exam_Vault. ADMIN ACCESS ONLY"
    return msg


@app.route("/data", methods=["POST", "GET"])
@cross_origin()
def get_data_from_firebase():
    return jsonify(firebase_handler.get_all_data())


@app.route("/get/<string:id>", methods=["GET"])
@cross_origin()
def get_file_data(id):
    return drive_handler.get_file_data_by_id(id)


@app.route("/acceptFile", methods=["POST"])
@cross_origin()
@expects_json(schema.acceptFile)
def acceptFile():
    try:
        row_id = request.json["row_id"]
        id = request.json["id"]
        course_code = request.json["course_code"]
        ### Move/Rename File in drive
        if "updated_title" in request.json:
            drive_handler.accept_file_drive(
                id, course_code, request.json["updated_title"]
            )
        else:
            drive_handler.accept_file_drive(id, course_code)
        ### Update accepted in firebase
        firebase_handler.accept_file(row_id, id)
        return "success"
    except:
        return "fail"


@app.route("/acceptMultipleFiles", methods=["POST"])
@cross_origin()
@expects_json(schema.acceptMultipleFiles)
def accept_multiple_files():
    try:
        row_id = request.json["row_id"]
        ids = request.json["ids"]
        course_code = request.json["course_code"]
        ### Move/Rename File in drive
        if "updated_title_obj" in request.json:
            drive_handler.accept_multiple_files_drive(
                ids, course_code, request.json["updated_title_obj"]
            )
        else:
            drive_handler.accept_multiple_files_drive(ids, course_code)
        ### Update accepted in firebase
        firebase_handler.accept_multiple_files(row_id, ids)
        return "success"
    except:
        return "fail"


@socketio.on("loaddata")
def handle_my_custom_event(methods=["GET", "POST"]):
    print("received my event: ")
    socketio.emit("data", firebase_handler.get_all_data())


# Listen change to data
firebase_handler.on_data_change(
    lambda event: socketio.emit("data", firebase_handler.get_all_data())
)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
