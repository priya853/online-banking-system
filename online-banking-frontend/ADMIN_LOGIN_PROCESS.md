# Admin Login Process

1. Start Spring Boot backend on port 8080.
2. Start frontend with `npm install` and `npm run dev`.
3. Customer/Bank login: `http://localhost:5173/login`
4. Admin login: `http://localhost:5173/admin/login`
5. `/admin` automatically sends unauthenticated users to `/admin/login`.
6. Admin login accepts only users whose backend role is `ROLE_ADMIN`.
7. Successful admin login sends the user to `/admin/dashboard`.
8. Non-admin users see an admin-only login error instead of entering the admin area.
