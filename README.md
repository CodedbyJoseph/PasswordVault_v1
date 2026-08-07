# Password Vault v1

A simple full-stack password vault. Users sign in with Google.

This is a learning project — kept intentionally simple, with no security considerations

## Stack

| Layer      | Tech                      |
|------------|---------------------------|
| Frontend   | HTML, CSS, JavaScript     |
| Backend    | Python + FastAPI          |
| Auth       | Google OAuth              |
| Database   | Supabase (Postgres)       |
| Hosting    | Vercel                    |

## How it works

1. User signs up / logs in with Google OAuth.
2. User can view, add, and manage saved passwords in their vault.

## How to run

**Live app:** _link goes here once deployed_

## Local dev setup (Windows) BUG FIX

`vercel dev` crashes on startup with:

    SyntaxError: (unicode error) 'unicodeescape' codec can't decode bytes

Cause: `@vercel/python` interpolates the project's absolute path into a Python
string literal without escaping backslashes. `C:\Users\...` makes `\U` an
invalid escape, so the generated dev shim won't parse. Windows-only; the cloud
build is unaffected.

Fix — in
`<npm-global>/node_modules/vercel/node_modules/@vercel/python/templates/vc_init_dev.py`
make line 8 a raw string:

    "VERCEL_DEV_ENTRY_ABS": r"__VC_DEV_ENTRY_ABS__",

Reapply after any `npm install -g vercel`. Present in every @vercel/python from
6.30.0 (Apr 2026) through 6.55.1.
