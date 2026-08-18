## Password Vault v1

```
FRONTEND
Structure  |  html
Style      |  css
Behaviour  |  js

BACKEND
user auth  |  supabase auth, google Oauth
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
STAGE                    |  COMPONENTS                               |  RUN/TEST
1. UI                    |  html, css, js                            |  fake hardcoded data, live server
2. logic and database    |  python, js fetch, fastAPI, supabase      |  real database, vercel dev
3. auth + per-user data  |  js, python, supabase auth, google oauth  |  vercel dev
4. polish UI + UX        |  html, css, js, python                    |  vercel dev
5. deploy                |  push to vercel                           |  vercel --prod
```

## SECURITY MODEL
```
trust boundary  |  FastAPI (the only path to accounts_table)
RLS             |  on, no policies — locks public anon key in js from accessing data
ownership       |  all get/post/del requests are row-scoped to only logged in user
signed token    |  uuid comes from supabase's verified token, not the request — forged uuids/tokens cant get through
```

## Stage 3 app-user-auth architecture
```
Auth System (log in/out, session): Supabase Auth
OAuth Provider: Google

CONFIG AUTH SETTINGS IN DASHBOARDS
1. GCP: create an OAuth client (google sign in page)
2. Supabase: enable and link Google as OAuth Provider

CONFIG LOG IN/OUT IN FRONTEND
3. load supabase lib, create client for Supabase Auth service (allows browser to handle logging in/out, sessions)
4. wire log in btn — redirect to google sign-in page
5. initialize vault render if session exists
6. wire log out btn — clear session and hide panels

CONFIG DATABASE AND BACKEND
7. Supabase: add a user_id column to accounts_table to label each entry with its owner
8. Backend: scope request functions to only the logged in user's data, using uuids
   --> Only allow authorized requests (REFER TO "Preventing Unauthorized GET/POST/DEL Requests")
```

## Preventing Unauthorized GET/POST/DEL Requests
```
Problem:
requests can be sent via different methods
- own js fetch                (the legit one)
- curl, DevTools console, etc (anyone)

Solution: instead of retrieving uuid, retrieve a signed token

1. js reads session token from localStorage
2. js attaches token to every fetch request in Authorization Header
3. python verifies the token's signature and denies frauds
4. python extracts user.id (uuid) from verified result
5. all fastapi functions scope by that uuid:
   GET    .eq("user_id", uid)
   POST   entry["user_id"] = uid
   DELETE .eq("id", id).eq("user_id", uid)

Curl Ex -> https://your-app.vercel.app/api/accounts -H "Authorization: Bearer <token>"

Barriers stopping unauthorized requests:
1 - header (authorization type) required
2 - signature verified
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