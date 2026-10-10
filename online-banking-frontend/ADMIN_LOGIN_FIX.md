# Admin login compatibility fix

This frontend now supports both login response formats:
- JSON containing `token` + `role` + `name`
- legacy/plain JWT token responses where the role is stored inside JWT claims (`role`, `authorities`, `roles`, or `scope`)

After replacing the frontend, clear session storage and login again so the stale customer role is removed.
