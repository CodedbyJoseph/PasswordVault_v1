# file purpose:
# - create database using supabase via python fastAPI
# - store accounts permanently via table called "accounts_table"
# - serverless function
# - RESTful API

# FastAPI framework automates:
# - parse raw incoming HTTP requests, 
# - figure out which URL/method was requested
# - convert Python data into JSON text for the response
# - parse incoming JSON request bodies into Python objects

from fastapi import FastAPI
from supabase import create_client
import os

# create and store client object connected to Supabase project
supabase = create_client(
    os.environ.get("SUPABASE_URL"), # retrieve supabase url (read from env)
    os.environ.get("SUPABASE_KEY")  # retrieve supabase key (read from env)
)

# create an instance of FastAPI class
# vercel listens for http requests (js fetches) and passes them to app using vercel.json rules (any path starting with '/api/' goes to index.py)
app = FastAPI()

# @app decorators register functions to be automatically called when a js fetch is made
# each fetch type calls a function (ex. get request calls get function)

# function to call Supabase API to read and return accounts table data
@app.get("/api/accounts")
def get_accounts():
    response = supabase.table("accounts_table").select("*").execute()
    return response.data        # list of dictionaries [{"id": 1, "site": __, "username": __, "password": __}]

# function to insert new entry into accounts table, return the created row
@app.post("/api/accounts")
def add_account(entry: dict):
    response = supabase.table("accounts_table").insert(entry).execute()
    return response.data

# function to delete entry with matching id, return deleted entry
@app.delete("/api/accounts/{id}")
def delete_account(id: int):
    supabase.table("accounts_table").delete().eq("id", id).execute()
    return {"deleted": id}
