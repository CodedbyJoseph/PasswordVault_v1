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

FastAPI + Vercel
PRO: free
CON: Vercel is designed to support serverless functions, FastAPI works best as a
     persistent process — loses lifespan events, BackgroundTasks, WebSockets,
     connection pools; ~1-2s cold start after idle

## Stages of development / Workflow

```
STAGE                    |  COMPONENTS                           |  RUN/TEST
1. UI                    |  html, css, js                        |  fake hardcoded data, live server
2. logic and database    |  python, js fetch, fastAPI, supabase  |  real database, vercel dev
3. auth + per-user data  |  html, css, js, python, google oauth  |  vercel dev
4. polish UI + UX        |  html, css, js, python                |  vercel dev
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
4. Frontend: load supabase's js library so the browser can handle auth (logging in/out, sessions)
5. Frontend: wire log in — click redirects to google sign-in page and redirects back
6. Frontend: initialize vault render if session exists
7. Frontend: wire log out — click deletes rendered vault
8. verify account creation: log in, find the new user in supabase's auth table
9. Backend: wire all three request functions to only get/post/del a logged in user's own data, using uuids
   --> Only allow authorized requests (REFER TO "Preventing Unauthorized GET/POST/DEL Requests")
10. verify scoping: log in with a second google account — its vault must be empty
```

## Preventing Unauthorized GET/POST/DEL Requests
```
Problem:
requests can be sent via different methods
- your page's fetch                                (the legit one)
- curl / Postman / DevTools console / address bar  (anyone)

FastAPI server recieves requests all the same, undifferentiable between user vs fraud

Solution: instead of retrieving uuid, retrieve a signed token

1. js reads the session's access_token from localStorage (put there at login)
2. js attaches it to every fetch in an Authorization header

3. python calls supabase.auth.get_user(token) → supabase checks the signature
4. python extracts user.id (uuid) from the verified result
5. all three routes scope by that uuid:
   GET    .eq("user_id", uid)
   POST   entry["user_id"] = uid
   DELETE .eq("id", id).eq("user_id", uid)

Therefore: a request only reaches the rows of whoever's token it carries
no token    → fails
forged uuid → ignored; python only uses the uuid from the token

Why it holds:
uuid never travels — the token does, and it can't be edited
forging one needs supabase's signing secret, which never leaves their servers
DELETE needs both .eq()s — without the uuid check, guessing an int id deletes anyone's row
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


Vercel Dev Setup Instructions:
this app requires public and api folder
1. npm install -g vercel — the CLI.
2. vercel login — authenticates your machine to your Vercel account.
3. cd into the project folder.
4. vercel dev — on first run it prompts:
    - Set up and develop this project? → Enter
    - Which scope? → your account
    - Link to existing project? → No, if it's new
    - Project name / directory → Enter for defaults