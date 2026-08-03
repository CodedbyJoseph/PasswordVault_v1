# STAGE 2: create database to store accounts permanently using supabase via python fastAPI
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

# create an instance of FastAPI class
app = FastAPI()

# create and store client object connected to Supabase project
supabase = create_client(
    os.environ.get("SUPABASE_URL"), # retrieve supabase url (read from env)
    os.environ.get("SUPABASE_KEY")  # retrieve supabase key (read from env)
)

# @app.get/post/delete decorators register functions to be automatically called when js fetches

# vercel dev starts live server using this app object, calling corresponding function to fetch() request

@app.get("/accounts")

# read all data from the accounts table of supabase project and return them to the caller/js
def get_accounts():
    response = supabase.table("accounts").select("*").execute()
    return response.data

@app.post("/accounts")

# insert new account entry into supabase accounts table, return the created row
def add_account(entry: dict):
    response = supabase.table("accounts").insert(entry).execute()
    return response.data

@app.delete("/accounts/{id}")

# delete account with matching id from supabase accounts table, confirm deletion to caller/js
def delete_account(id: int):
    supabase.table("accounts").delete().eq("id", id).execute()
    return {"deleted": id}