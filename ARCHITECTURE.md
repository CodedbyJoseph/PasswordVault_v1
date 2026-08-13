## Password Vault v1

```
FRONTEND
Structure  |  html
Style      |  css
Behaviour  |  js

BACKEND
user auth  |  google Oauth
logic      |  python + fastAPI
database   |  supabase Postgres

APP RUN
local dev  |  vercel dev
deployed   |  vercel
```

## Stages of development / Workflow

```
STAGE                    |  COMPONENTS                           |  RUN/TEST
1. UI                    |  html, css, js                        |  fake hardcoded data, live server
2. logic and database    |  python, js fetch, fastAPI, supabase  |  real database, vercel dev
3. auth + per-user data  |  html, css, js, python, google oauth  |  vercel dev
4. link components       |  html, css, js, python                |  vercel dev
5. deploy                |  push to vercel                       |  vercel --prod
```

## SECURITY MODEL
```
trust boundary  |  FastAPI (the only path to accounts_table)
RLS             |  on, no policies — locks public anon key in js from accessing data
row scoping     |  .eq("user_id", uid) in api/index.py
```

## Stage 3 app-user-auth architecture
```
1. GCP: create an OAuth client (for standard google sign in page)
2. Supabase: enable auth from Google, link client id + secret
3. Supabase: add a user_id column to accounts_table to label each entry with its owner
3. Frontend: load supabase's js library so the browser can handle auth (logging in/out, sessions)
4. Frontend: wire log in — click redirects to google sign-in page and redirects back
5. Frontend: initialize vault render if session exists

6. Frontend: wire log out — sign out and reload back to the logged-out view
7. Frontend: attach the session's token to every fetch (get/post/delete)
8. Backend: read that token, ask supabase whose it is, get the user's uuid
9. Backend: filter reads by that uuid and stamp it onto new entries, so each user
   only ever touches their own rows (POST)
10. verify by logging in and finding the new user in supabase's auth table
```

## Comparison: Expense Tracker v2 vs Password Vault v1

```
FRONTEND
Structure:                 tkinter  |  html
Style:                     tkinter  |  css
Behaviour:                 tkinter  |  js

BACKEND
user auth:                    NONE  |  google Oauth
logic:                      python  |  python + fastAPI
database:                     JSON  |  supabase Postgres

APP RUN
local dev:              python cmd  |  vercel dev
deployed:                     NONE  |  vercel
```


Vercel Dev Notes:
this app requires public and api folder
1. npm install -g vercel — the CLI.
2. vercel login — authenticates your machine to your Vercel account.
3. cd into the project folder.
4. vercel dev — on first run it prompts:
    - Set up and develop this project? → Enter
    - Which scope? → your account
    - Link to existing project? → No, if it's new
    - Project name / directory → Enter for defaults