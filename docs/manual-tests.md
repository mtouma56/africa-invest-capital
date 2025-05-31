# Manual Test: Supabase Registration

This note describes how to manually verify registration error handling when the `SUPABASE_SERVICE_ROLE_KEY` is missing.

1. Start the development server:
   ```bash
   npm run dev
   ```
   The app runs on [http://localhost:4000](http://localhost:4000) (or the next available port).

2. Ensure `SUPABASE_SERVICE_ROLE_KEY` is **not** defined in `.env.local` or the environment. Attempt to create an account through the registration page.
   - The API returns an error `Server misconfigured`.
   - The frontend should show the translated message **"Erreur technique : réponse du serveur invalide"** rather than a JSON parsing error.

3. Provide a valid `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and restart the server.
   - Retry the registration form; it should succeed and automatically log the user in.

This test confirms the UI properly handles backend errors when the Supabase key is missing.
