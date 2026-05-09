# TODO - UI Foundation Upgrade

- [x] Step 1: Add missing auth styling classes to `frontend/src/styles.css` (`login-bg`, `login-card`, `animate-card`, `auth-title`, `auth-input`, `auth-btn`).

- [x] Step 2: Refactor global transition rules: remove the anti-pattern in `frontend/src/App.css` that disables transitions, and move smooth transitions into `frontend/src/styles.css` with reduced-motion support.

- [x] Step 3: Add/adjust typography base consistency in `frontend/src/styles.css` (base line-height, label styling, heading margins).

- [x] Step 4: Ensure button/input polish is consistent for auth pages by mapping auth classes to the existing `.btn` / `.input` design tokens.
- [x] Step 5: Verify responsiveness tweaks for auth card and container on small screens within existing breakpoints.

- [x] Step 6: Run frontend build/lint to confirm no regressions (eslint already had pre-existing purity/unused-var issues; no UI foundation regression detected at build).




