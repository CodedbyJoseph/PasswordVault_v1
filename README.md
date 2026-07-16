# Password Vault v1

A simple full-stack password vault. Users sign in with Google, then unlock their saved passwords with a separate master password.

This is a learning project — kept intentionally simple, with no security considerations

## Stack

| Layer      | Tech                          |
|------------|--------------------------------|
| Frontend   | HTML, CSS, JavaScript          |
| Backend    | Python + FastAPI               |
| Auth       | Google OAuth + master password |
| Database   | Supabase (Postgres)            |
| Hosting    | Vercel                         |

## How it works

1. User signs up / logs in with Google OAuth.
2. User enters a master password to unlock their vault.
3. User can view, add, and manage saved passwords.

## How to run

**Live app:** _link goes here once deployed_
