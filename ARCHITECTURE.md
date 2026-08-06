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
Stage               |                             |  Run/Test
UI                  |  html, css, js              |  fake hardcoded data, live server
logic and database  |  python, fastAPI, supabase  |  vercel dev
auth                |  html, css, js, python      |  vercel dev
link components     |  html, css, js, python      |  vercel dev
deploy              |  push to vercel             |  vercel --prod
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