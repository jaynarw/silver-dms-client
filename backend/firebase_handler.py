import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import utils
from concurrent.futures import ThreadPoolExecutor, as_completed

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


def accept_multiple_files(row_id, file_ids):
    if len(file_ids) == 0:
        return
    ref = db.reference(f"{sheet_id}/Form%20responses%201/{row_id}/acceptedFiles/")
    ref.update({file_id: True for file_id in file_ids})


def get_all_data():
    ref = db.reference(f"{sheet_id}/Form%20responses%201/")
    return ref.get()


def on_data_change(callback):
    ref = db.reference(f"{sheet_id}/Form%20responses%201/")
    return ref.listen(callback)


def initializeAccepted():
    data = get_all_data()
    with ThreadPoolExecutor(max_workers=30) as executor:
        futures = []
        for (row_id, file_metadata) in enumerate(data, 0):
            ids = [
                utils.get_attr_from_url(url, "id")
                for url in file_metadata["Upload Files"].split(", ")
            ]
            if "Resource Accepted?" not in file_metadata:
                continue
            if len(file_metadata["Resource Accepted?"].split(", ")) != len(ids):
                continue
            resource_accepted = file_metadata["Resource Accepted?"].split(", ")
            accepted_ids = [
                id
                for (index, id) in enumerate(ids)
                if resource_accepted[index] == "Yes"
            ]
            futures.append(
                executor.submit(
                    accept_multiple_files,
                    row_id=row_id,
                    file_ids=accepted_ids,
                )
            )