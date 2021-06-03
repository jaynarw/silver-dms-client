from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse

#
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
import gspread
import pandas as pd
import json
import urllib.parse as urlparse
from urllib.parse import parse_qs
import itertools

### Authenticating GAuth

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

### Init Drive object

drive = GoogleDrive(gauth)
print(gauth.credentials)

# gc = gspread.oauth()
gc = gspread.authorize(gauth.credentials)
sh = gc.open_by_url(
    "https://docs.google.com/spreadsheets/d/1bGfaEfaik3KWwFBEtXBLB_ABumuv_x4Sp_6P-s25sL0/edit#gid=1340675612"
)


def getContextWithoutFetch(request):
    responses = pd.DataFrame(sh.sheet1.get_all_records())
    context = {}
    data = []
    curr_row = 2
    for index, row in responses.iterrows():
        print(row)
        item = {}
        item["Timestamp"] = row["Timestamp"]
        item["AcademicSession"] = row["Academic Session"]
        item["CourseCode"] = row["Course Code"]
        item["Type"] = row["Type of material"].split(", ")
        ids = [
            parse_qs(urlparse.urlparse(i).query)["id"][0]
            for i in row["Upload Files"].split(", ")
        ]
        files = [drive.CreateFile({"id": id}) for id in ids]
        # for file in files:
        #   file.FetchMetadata()
        item["UploadFiles"] = files
        ## If empty string of resource accepted
        if row["Resource Accepted?"] == "":
            item["Accepted"] = ["None"] * len(files)
        else:
            item["Accepted"] = row["Resource Accepted?"].split(", ")
        item["RowID"] = curr_row
        curr_row = curr_row + 1
        data.append(item)
    context["data"] = data
    return JsonResponse(context)


def getContext(request):
    responses = pd.DataFrame(sh.sheet1.get_all_records())
    print("Received responses")
    context = {}
    data = []
    curr_row = 2
    for index, row in itertools.islice(responses.iterrows(), 85):
        print("{} of {}".format(index + 1, len(responses)))
        if index > 90:
            break
        item = {}
        item["Timestamp"] = row["Timestamp"]
        item["AcademicSession"] = row["Academic Session"]
        item["CourseCode"] = row["Course Code"]
        item["Type"] = row["Type of material"].split(", ")
        ids = [
            parse_qs(urlparse.urlparse(i).query)["id"][0]
            for i in row["Upload Files"].split(", ")
        ]
        files = [drive.CreateFile({"id": id}) for id in ids]
        item["UploadFiles"] = files
        ## If empty string of resource accepted
        if row["Resource Accepted?"] == "":
            item["Accepted"] = ["None"] * len(files)
        else:
            item["Accepted"] = row["Resource Accepted?"].split(", ")
        for index, file in enumerate(files, 0):
            if item["Accepted"][index] != "Yes":
                file.FetchMetadata()
        item["RowID"] = curr_row
        curr_row = curr_row + 1
        data.append(item)
    context["data"] = data
    return JsonResponse(context)


def manage(request):
    return render(request, "frontend/admin.html", {})


def main(request):
    return render(request, "frontend/front.html", {})


def index(request):
    file_list = drive.ListFile(
        {
            "q": "parents = 'root' and mimeType = 'application/vnd.google-apps.folder' and trashed=false"
        }
    ).GetList()
    courses = [i for i in file_list if "[Course] " in i["title"]]
    return render(request, "main.html", {"courses": courses})


### GEnerate
import os

print(os.system("ls"))
with open("gdrivedms/CourseNameMap.json", "r") as file:
    course_name_map = json.loads(file.read())


def generate(request):
    file_list = drive.ListFile(
        {
            "q": "parents = 'root' and mimeType = 'application/vnd.google-apps.folder' and trashed=false"
        }
    ).GetList()
    courses = [i for i in file_list if "[Course] " in i["title"]]
    [i.FetchMetadata(fields="permissions") for i in courses]

    metadata = []
    for i in courses:
        # print(i)
        print(i["permissions"])
        # insert new permission
        permission = i.InsertPermission(
            {"type": "anyone", "value": "anyone", "role": "reader", "withLink": True}
        )
        print(i)
        courseId = i["title"][len("[Course] ") :]
        link = i["alternateLink"]
        metadata.append(
            {"cid": courseId, "cname": course_name_map[courseId], "link": link}
        )
    with open("static/dist/metadata.json", "w+") as file:
        file.write(json.dumps(metadata, indent=2))
    return HttpResponse("done!")


### Authentication

import base64
import hashlib
import jwt
from datetime import datetime, timedelta


def encryptPWD(password):
    bytes = password.encode("ascii")
    base64_bytes = base64.b64encode(bytes)
    base64_message = base64_bytes.decode("ascii")
    return hashlib.pbkdf2_hmac(
        "sha256", base64_message.encode("ascii"), b"saltbae", 100000
    ).hex()


SECRET_ = "034c07c0a62d57326b3c5c7601a616b0aa6c202b85521c9196c53f80ec046b12"


def verify(password):
    return encryptPWD(password) == SECRET_


def authenticate_req(request):
    if "token" in request.COOKIES:
        token = request.COOKIES["token"][len("Bearer ") :]
    else:
        return False
    try:
        jwt.decode(token.encode("ascii"), SECRET_, algorithm="HS256", verify_exp=True)
        return True
    except:
        return False
    return False


from django.views.generic import View


class login(View):
    def get(self, request, *args, **kwargs):
        if authenticate_req(request):
            print("Authenticated User")
            return redirect("/gdrivedms/")
        # return HttpResponse('This is GET request')
        print(request.COOKIES)
        return render(
            request, "login.html", {"error_message": authenticate_req(request)}
        )

    def post(self, request, *args, **kwargs):
        password = request.POST.get("password")
        if verify(password):
            dt = datetime.now() + timedelta(days=1)
            encoded_token = jwt.encode(
                {"user_id": "abc", "email": "nancy@gmail.com", "exp": dt},
                SECRET_,
                algorithm="HS256",
            )
            encoded_token = encoded_token.decode("ascii")
            response = HttpResponse("This is POST request")
            response.set_cookie("token", "Bearer " + encoded_token, expires=dt)
            return response
        else:
            return HttpResponse("This is not POST request")


# 1) Main page, forms, drive jo jo subject ke folder exist karte hai, unki links daalna
# 1) Manage karne waala page hai, if logged in nahi to redirect.

##########
## CRUD ##
##########

## Helpers
def createRemoteFolder(folderName, parentID=None):
    # Create a folder on Drive, returns the newely created folders ID
    body = {"title": folderName, "mimeType": "application/vnd.google-apps.folder"}
    if parentID:
        body["parents"] = [{"id": parentID}]
    created_folder = drive.CreateFile(body)
    created_folder.Upload()
    return created_folder


def get_row(rowID):
    range_ = "A{}:F{}".format(rowID, rowID)
    return sh.sheet1.get(range_)[0]


class update(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse("Lol")

    def post(self, request, *args, **kwargs):
        if not (authenticate_req(request)):
            return redirect("/gdrivedms/login/")
        print("Authenticated User")
        to_update = json.loads(urlparse.unquote(request.POST.get("updated_row")))
        print(to_update)

        ## Get request data
        accepted = to_update["Accepted"]
        acadsess = to_update["AcademicSession"]
        course_code = to_update["CourseCode"]
        rowID = to_update["RowID"]
        # acadsess = to_update['CourseCode']
        updated_resource = to_update["UpdatedResource"]

        ## Check if accepted or rejected

        if not accepted:
            ## Thrash File
            # Initialize GoogleDriveFile instance with file id.
            file1 = drive.CreateFile({"id": updated_resource["id"]})
            file1.Trash()  # Move file to trash.

            # file1.UnTrash()  # Move file out of trash.
            # file1.Delete()  # Permanently delete the file.

            ## Update Sheet
            row_data = get_row(rowID)
            files_uploaded_ids = [
                parse_qs(urlparse.urlparse(i).query)["id"][0]
                for i in row_data[4].split(", ")
            ]
            if len(row_data) == 6:
                accepted_info = row_data[5]
                accepted_info = accepted_info.split(", ")
            else:
                accepted_info = ["None"] * len(files_uploaded_ids)

            accepted_info[files_uploaded_ids.index(updated_resource["id"])] = "No"
            accepted_info = ", ".join(accepted_info)

            updated_row = row_data[:5]
            updated_row.append(accepted_info)
            sh.sheet1.update("A{}:F{}".format(rowID, rowID), [updated_row])
            return HttpResponse("Coolio")

        ## Check folder exist karta hai,
        folder_name = "[Course] {}".format(course_code)

        folder_list = drive.ListFile(
            {
                "q": "parents = 'root' and mimeType = 'application/vnd.google-apps.folder' and trashed=false"
            }
        ).GetList()
        folder_list = [i for i in folder_list if folder_name == i["title"]]
        ## if not create folder
        if len(folder_list) == 0:
            course_folder = createRemoteFolder(folder_name)
        else:
            course_folder = folder_list[0]

        ## academic session folder create
        # academic_ = drive.ListFile({'q': "parents = 'root' and mimeType = 'application/vnd.google-apps.folder' and trashed=false".format(course_code)}).GetList()

        ## file name if changed, rename file
        ## move to that folder
        print(updated_resource["id"], updated_resource["title"], course_folder["id"])
        updated_file_obj = drive.CreateFile({"id": updated_resource["id"]})
        updated_file_obj.Upload()
        updated_file_obj["title"] = updated_resource["title"]
        updated_file_obj["parents"] = [
            {"kind": "drive#parentReference", "id": course_folder["id"]}
        ]
        if updated_file_obj["labels"]["trashed"]:
            updated_file_obj.UnTrash()
        updated_file_obj.Upload()

        ## accepted waala field update karna..
        row_data = get_row(rowID)
        files_uploaded_ids = [
            parse_qs(urlparse.urlparse(i).query)["id"][0]
            for i in row_data[4].split(", ")
        ]
        if len(row_data) == 6:
            accepted_info = row_data[5]
            accepted_info = accepted_info.split(", ")
        else:
            accepted_info = ["None"] * len(files_uploaded_ids)

        accepted_info[files_uploaded_ids.index(updated_resource["id"])] = "Yes"
        accepted_info = ", ".join(accepted_info)

        updated_row = row_data[:5]
        updated_row.append(accepted_info)
        sh.sheet1.update("A{}:F{}".format(rowID, rowID), [updated_row])

        return getContext(request)
        # return HttpResponse('Coolio')


class updateAll(View):
    def post(self, request, *args, **kwargs):
        if not (authenticate_req(request)):
            return redirect("/gdrivedms/login/")
        print("Authenticated User")
        to_update = json.loads(urlparse.unquote(request.POST.get("updated_row")))
        print(to_update)

        ## Get request data
        accepted = to_update["Accepted"]
        acadsess = to_update["AcademicSession"]
        course_code = to_update["CourseCode"]
        rowID = to_update["RowID"]
        # acadsess = to_update['CourseCode']
        updated_resources = to_update["UpdatedResources"]

        ## Check if accepted or rejected

        ## Check flder exist karta hai,
        folder_name = "[Course] {}".format(course_code)

        folder_list = drive.ListFile(
            {
                "q": "parents = 'root' and mimeType = 'application/vnd.google-apps.folder' and trashed=false"
            }
        ).GetList()
        folder_list = [i for i in folder_list if folder_name == i["title"]]
        ## if not create folder
        if len(folder_list) == 0:
            course_folder = createRemoteFolder(folder_name)
        else:
            course_folder = folder_list[0]

        ## academic session folder create
        # academic_ = drive.ListFile({'q': "parents = 'root' and mimeType = 'application/vnd.google-apps.folder' and trashed=false".format(course_code)}).GetList()

        ## file name if changed, rename file
        ## move to that folder
        for updated_resource in updated_resources:
            print(
                updated_resource["id"], updated_resource["title"], course_folder["id"]
            )
            updated_file_obj = drive.CreateFile({"id": updated_resource["id"]})
            updated_file_obj.Upload()
            updated_file_obj["title"] = updated_resource["title"]
            updated_file_obj["parents"] = [
                {"kind": "drive#parentReference", "id": course_folder["id"]}
            ]
            if updated_file_obj["labels"]["trashed"]:
                updated_file_obj.UnTrash()
            updated_file_obj.Upload()

        ## accepted waala field update karna..
        row_data = get_row(rowID)
        files_uploaded_ids = [
            parse_qs(urlparse.urlparse(i).query)["id"][0]
            for i in row_data[4].split(", ")
        ]
        if len(row_data) == 6:
            accepted_info = row_data[5]
            accepted_info = accepted_info.split(", ")
        else:
            accepted_info = ["Yes"] * len(files_uploaded_ids)
        accepted_info = ", ".join(accepted_info)

        updated_row = row_data[:5]
        updated_row.append(accepted_info)
        sh.sheet1.update("A{}:F{}".format(rowID, rowID), [updated_row])

        return getContext(request)
