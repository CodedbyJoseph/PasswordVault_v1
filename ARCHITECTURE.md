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
