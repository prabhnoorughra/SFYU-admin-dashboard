

# STEM Fellowship @ YorkU — Admin Dashboard

Modern React dashboard for club executives to authenticate, review, search, and filter student applications.

- Tech Stack: Vite + React, Bootstrap, React Router, Vitest/Jest

## Use Case
- **Sign in as Admin** to manage incoming applications.
- **Search & Filter** by name/email/student ID, study year (`First` → `Fifth+`), and email consent.
- **Pagination** and totals for fast browsing.
- **Clean UX** with responsive layout and accessible components.

## Key Features
- **JWT auth flow** against the Backend API.
- **Applications table/list** with:
  - Free-text search (email, full name, student ID)
  - Filters for `studyYear` and `emailConsent`
  - Page/Take controls with total results
- **Mobile-first design**: Responsive navbar, dropdown on small screens.

## Communication with the Backend
- **Auth**: `POST /adminlogin` → store JWT (Bearer) for future requests
- **Public Site Analytics**:
  - `GET /application?page=&take=&search=&studyYear=&emailConsent=`
  - `GET /application/count`

## Future Improvements
- Give admins more permissions (editing/deleting applications)
- Allow executives to log in and view data (no editing permissions)
- Set up notifications to notify admins or executives of new applications
