# file purpose:
# - local dev entry point; not used in prod
# - activate venv:  .\.venv\Scripts\Activate.ps1
# - run:            uvicorn local_server:app --reload

# startup
#   1. uvicorn starts one continuous process using this file
#   2. imports url + key to index.py
#   3. import app (with /api/* already registered)
#   4. mount StaticFiles at / → app now knows the frontend lives in public/
#
# on page load
# You open http://127.0.0.1:8000/ → URL path is / → mount → html=True → public/index.html
# Browser parses it, finds style.css and script.js, translates to /style.css and /script.js
# Two more requests → mount → public/style.css, public/script.js
#
# per fetch/request
#   6. script.js hits /api/* → app → route function → supabase

from dotenv import load_dotenv

load_dotenv()  # retrieve supabase url and key from .env

from fastapi.staticfiles import StaticFiles
from api.index import app

# mounted last so the /api/* routes registered in index.py are matched first;
# everything else falls through to public/, and html=True serves index.html at /
app.mount("/", StaticFiles(directory="public", html=True), name="public")
