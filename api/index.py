# file purpose:
# - connect to supabase database via python fastAPI
# - serverless function hosted by vercel that responds to fetches
# - RESTful API

# FastAPI framework automates:
# - parse raw incoming HTTP requests
# - figure out which URL/method was requested
# - convert Python data into JSON text for the response
# - parse incoming JSON request bodies into Python objects

from fastapi import FastAPI, Header
from supabase import create_client
import os

# ------------------------------------------------------ LINK SUPABASE PROJECT
supabase = create_client(
    os.environ.get("SUPABASE_URL"), # retrieve supabase url (read from env)
    os.environ.get("SUPABASE_KEY")  # retrieve supabase service_role key (read from env)
    # this key ignores rls (security measure that prevents supabase data access w/o policies)
)

# ------------------------------------------------------ INITIATE SERVERLESS FUNCTION
# purpose: JS and Python are separate programs, must communicate over HTTP

# fetch    → sends HTTP request (GET/POST/DELETE) to the Vercel server
# Vercel   → reads vercel.json, picks the file (index.py), invokes its "app" callable
# app      → matches method + path to the right function below
# function → returns Python data, FastAPI serializes it to JSON text → back to fetch

app = FastAPI()

# @app decorators register functions to be automatically called when a js fetch is made
# each fetch type calls a function (ex. get request calls get function)

# ------------------------------------------------------ GET/POST/DEL FUNCTIONS

# call Supabase API to return accounts data table
@app.get("/api/accounts")   # "/api" required by vercel.json rewrite, "/accounts" personally named
def get_accounts(authorization: str = Header(...)):    # parameter meaning: store authorization header from fetch, if DNE request rejected
    # extract uuid from token                          # this prevents fraud requests from working (ex. public user sends curl req)
    token = authorization.split(" ")[1]
    uid = supabase.auth.get_user(token).user.id

    # return only the data that belongs to the user
    response = supabase.table("accounts_table").select("*").eq("user_id", uid).execute()
    return response.data        # list of dictionaries [{"id": 1, "site": __, "username": __, "password": __}]

# post new entry into accounts data table
@app.post("/api/accounts")
def add_account(entry: dict, authorization: str = Header(...)):   # parameter 1: store JSON body from fetch and parse into "entry" dict
    token = authorization.split(" ")[1]
    uid = supabase.auth.get_user(token).user.id

    # entry's user_id column contains uuid
    entry["user_id"] = uid
    response = supabase.table("accounts_table").insert(entry).execute()
    return response.data

# delete entry with matching id
@app.delete("/api/accounts/{id}")
def delete_account(id: int, authorization: str = Header(...)):    # parameter 1: store {id} from path in var "id"
    token = authorization.split(" ")[1]
    uid = supabase.auth.get_user(token).user.id
    
    supabase.table("accounts_table").delete().eq("id", id).eq("user_id", uid).execute()
    return {"deleted": id}