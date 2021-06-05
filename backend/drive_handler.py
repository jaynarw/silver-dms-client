from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from concurrent.futures import ThreadPoolExecutor, as_completed

gauth = GoogleAuth()
# Try to load saved client credentials
gauth.LoadCredentialsFile("mycreds.txt")
if gauth.credentials is None:
    # Authenticate if they're not there
    gauth.LocalWebserverAuth()
elif gauth.access_token_expired:
    # Refresh them if expired
    gauth.Refresh()
else:
    # Initialize the saved creds
    gauth.Authorize()
# Save the current credentials to a file
gauth.SaveCredentialsFile("mycreds.txt")

drive = GoogleDrive(gauth)


def get_file_data_by_id(id):
    file = drive.CreateFile({"id": id})
    file.FetchMetadata()
    return file


def get_files_data_by_id(ids):
    return [get_file_data_by_id(i) for i in ids]


def create_remote_folder(folder_name, parentID=None):
    # Create a folder on Drive, returns the newely created folders ID
    body = {"title": folder_name, "mimeType": "application/vnd.google-apps.folder"}
    if parentID:
        body["parents"] = [{"id": parentID}]
    created_folder = drive.CreateFile(body)
    created_folder.Upload()
    return created_folder


def create_folder_doesnt_exist(folder_name):
    folder_list = drive.ListFile(
        {
            "q": "parents = 'root' and mimeType = 'application/vnd.google-apps.folder' and trashed=false"
        }
    ).GetList()
    folder_list = [i for i in folder_list if folder_name == i["title"]]
    ## if not create folder
    if len(folder_list) == 0:
        course_folder = create_remote_folder(folder_name)
    else:
        course_folder = folder_list[0]
    return course_folder


def accept_without_folder_creation(id, folder_id, updated_title=None):
    ## file name if changed, rename file
    ## move to that folder
    updated_file_obj = drive.CreateFile({"id": id})
    updated_file_obj.Upload()
    if updated_title:
        updated_file_obj["title"] = updated_title
    updated_file_obj["parents"] = [{"kind": "drive#parentReference", "id": folder_id}]
    if updated_file_obj["labels"]["trashed"]:
        updated_file_obj.UnTrash()
    updated_file_obj.Upload()
    return updated_file_obj


def accept_file_drive(id, course_code, updated_title=None):
    folder_name = "[Course] {}".format(course_code)
    course_folder = create_folder_doesnt_exist(folder_name)
    accept_without_folder_creation(id, course_folder["id"], updated_title)


def accept_multiple_files_drive(ids, course_code, updated_title_obj={}):
    folder_name = "[Course] {}".format(course_code)
    course_folder = create_folder_doesnt_exist(folder_name)
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = []
        for id in ids:
            if id in updated_title_obj:
                futures.append(
                    executor.submit(
                        accept_without_folder_creation,
                        id=id,
                        folder_id=course_folder["id"],
                        updated_title=updated_title_obj[id],
                    )
                )
            else:
                futures.append(
                    executor.submit(
                        accept_without_folder_creation,
                        id=id,
                        folder_id=course_folder["id"],
                    )
                )
        for future in as_completed(futures):
            print(future.result())
