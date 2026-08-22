# file purpose:
# - connect to supabase database via python fastAPI
# - fastAPI enables http requests (get/post/del) to database
# - serverless function hosted by vercel that responds to fetches (vercel detects fastapi app and routes /api/* to it)
# - RESTful API

from fastapi import FastAPI, Header
from supabase import create_client
import os

# ------------------------------------------------------ LINK SUPABASE PROJECT
supabase = create_client(
    os.environ.get("SUPABASE_URL"), # retrieve supabase url
    os.environ.get("SUPABASE_KEY")  # retrieve supabase service_role key

    # local dev: url + key retrieved from load_dotenv() in local_server.py
    # vercel prod: url + key retrieved from vercel dashboard

    # this key ignores rls (security measure that prevents supabase data access w/o policies)
)

# js fetch     → sends HTTP request (GET/POST/DELETE) to fastapi app via Vercel server
# Vercel       → detects the fastapi app and hands it the request
# fastapi app  → matches method + path to the right function below
# function     → retrieves/modifies database data via HTTP request
# return       → fastapi serializes the result to JSON → back to js fetch

app = FastAPI()

# @app decorators register functions to be automatically called when a js fetch is made
# each fetch type calls a function (ex. get request calls get function)

# ------------------------------------------------------ GET/POST/DEL FUNCTIONS

# call Supabase API to return accounts data table
@app.get("/api/accounts")   # path js fetches; personally named
def get_accounts(authorization: str = Header(...)):    # parameter meaning: store authorization header from fetch, if DNE then request rejected
    token = authorization.split(" ")[1]

    # supabase verifies the signature (unique formula based) via calculation
    # fraud: function fails and stops
    uid = supabase.auth.get_user(token).user.id     # extract uuid from token

    # return only the data that belongs to the user
    response = supabase.table("accounts_table").select("*").eq("user_id", uid).execute()
    return response.data        # list of dictionaries [{"id": 1, "site": __, "username": __, "password": __, "user_id": __}]

# post new entry into accounts data table
@app.post("/api/accounts")
def add_account(entry: dict, authorization: str = Header(...)):   # parameter 1: store JSON body from fetch and parse into "entry" dict
    token = authorization.split(" ")[1]
    uid = supabase.auth.get_user(token).user.id

    # entry's user_id column contains uuid
    entry["user_id"] = uid
    response = supabase.table("accounts_table").insert(entry).execute()
    return response.data        # return required, value optional and not used; useful in devtools to confirm what was stored

# delete entry with matching id
@app.delete("/api/accounts/{id}")
def delete_account(id: int, authorization: str = Header(...)):    # parameter 1: store {id} from path in var "id"
    token = authorization.split(" ")[1]
    uid = supabase.auth.get_user(token).user.id
    
    supabase.table("accounts_table").delete().eq("id", id).eq("user_id", uid).execute()
    return {"deleted": id}
