import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

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

sheet_id = "1bGfaEfaik3KWwFBEtXBLB_ABumuv_x4Sp_6P-s25sL0"


def accept_file(row_id, file_id):
    ref = db.reference(f"{sheet_id}/Form%20responses%201/{row_id}/acceptedFiles/")
    ref.update({file_id: True})


def get_all_data():
    ref = db.reference(f"{sheet_id}/Form%20responses%201/")
    return ref.get()
