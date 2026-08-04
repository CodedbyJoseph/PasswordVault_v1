# STAGE 2: create database using supabase via python fastAPI
# - store accounts permanently via table called "accounts"

# js can only save temporary data (not a database)
# js will fetch data from this file

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
# vercel listens for http requests (js fetches) and passes them to app
app = FastAPI()

# @app decorators register functions to be automatically called when a js fetch is made (each fetch type calls a function)

# api call to Supabase API to read all data from the accounts table of supabase project and return them
@app.get("/accounts")
def get_accounts():
    response = supabase.table("accounts").select("*").execute()
    return response.data    # list of dictionaries [{"id": 1, "site": __, "username": __, "password": __}]

# insert new account entry into supabase accounts table, return the created row
@app.post("/accounts")
def add_account(entry: dict):
    response = supabase.table("accounts").insert(entry).execute()
    return response.data

# delete account with matching id from supabase accounts table, confirm deletion to caller/js
@app.delete("/accounts/{id}")
def delete_account(id: int):
    supabase.table("accounts").delete().eq("id", id).execute()
    return {"deleted": id}