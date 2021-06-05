from logging import debug
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from drive_handler import *
import firebase_handler

app = Flask(__name__)
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


@app.route("/get/<string:id>")
@cross_origin()
def get_file_data(id):
    return get_file_data_by_id(id)


@app.route("/acceptFile", methods=["POST"])
@cross_origin()
def acceptFile():
    if ("id" not in request.json) or ("course_code" not in request.json):
        print(request.json)
        return ("Bad request", 400)
    try:
        id = request.json["id"]
        course_code = request.json["course_code"]
        if "updated_title" in request.json:
            accept_file_drive(id, course_code, request.json["updated_title"])
        else:
            accept_file_drive(id, course_code)

        return "success"
    except:
        return "fail"


# @app.route("/acceptMultipleFile", methods=["POST"])
# @cross_origin()
# def acceptFile():
#     if ("id" not in request.json) or ("course_code" not in request.json):
#         print(request.json)
#         return ("Bad request", 400)
#     try:
#         id = request.json["id"]
#         course_code = request.json["course_code"]
#         if "updated_title" in request.json:
#             accept_file_drive(id, course_code, request.json["updated_title"])
#         else:
#             accept_file_drive(id, course_code)
#         return "success"
#     except:
#         return "fail"


if __name__ == "__main__":
    app.run(debug=True, port=5000)
