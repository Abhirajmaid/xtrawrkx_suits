# Event Registration Deadline

## Summary

Admins can set a **registration deadline** on events in the Landing admin portal. Registrations automatically close at the end of that date on the public site.

## Scope

- `apps/landing/app/(admin)/admin/events/page.jsx` — Edit Event modal (Basic Info → Registration settings)
- `apps/landing/app/(admin)/admin/events/new/page.jsx` — Create event (already had fields)
- `apps/landing/src/utils/eventRegistration.js` — Shared open/closed logic
- `apps/landing/app/(primary)/events/[slug]/page.jsx` — Hide register CTAs when closed
- `apps/landing/app/(primary)/events/[slug]/register/page.jsx` — Block direct register URL
- `apps/landing/app/(primary)/events/season/[season]/register/page.jsx` — Season flow respects deadlines

## Admin usage

1. Open **Admin → Events** and edit an event (or create via **New Event**).
2. Under **Registration settings**:
   - **Enable registration** — uncheck to close immediately.
   - **Registration deadline** — optional date; registrations stay open through the end of that day (local time).
3. Leave deadline empty to keep registration open until the event day (existing behavior).

Data is stored on Firestore `events` documents as `registrationEnabled` and `registrationDeadline`.

## Public behavior

Registration is closed when any of the following is true:

- `registrationEnabled === false`
- Event status is `cancelled`
- Event date is in the past
- Registration deadline date is before today

Closed state hides register buttons, shows a message on the event page, and blocks `/register` routes.
