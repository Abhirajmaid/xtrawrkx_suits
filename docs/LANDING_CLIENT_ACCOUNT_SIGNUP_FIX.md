# Landing Client Account Signup Fix

## Summary

Website signups on `apps/landing` create a Strapi **client account** with extended profile fields stored in `onboardingData`. Production failed with:

```text
column "onboarding_data" of relation "client_accounts" does not exist
```

This was a **schema / database drift** issue: application code wrote `onboardingData`, but the `client_accounts` table had no matching column.

## Scope

| Area | Change |
|------|--------|
| `apps/backend/src/api/client-account/content-types/client-account/schema.json` | Added `onboardingData` (json), `source`, `isActive` |
| `apps/backend/src/api/client-account/controllers/client-account.js` | Website signup path, friendly DB errors |
| `apps/backend/src/utils/website-signup.js` | Shared helpers for landing → Strapi provisioning |
| `apps/landing/app/api/public/profile/route.js` | Strapi auth headers, sanitized error messages |

## Details

### New schema fields

- **`onboardingData`** (json) — website profile snapshot (company, address, bio, social links, etc.)
- **`source`** (string) — e.g. `ONBOARDING` for marketing-site signups
- **`isActive`** (boolean) — account active flag

Strapi applies these on **backend restart** (SQLite dev / Postgres production).

### Production migration (Postgres)

If restart does not add columns automatically, run on the production database:

```sql
ALTER TABLE client_accounts
  ADD COLUMN IF NOT EXISTS onboarding_data JSONB,
  ADD COLUMN IF NOT EXISTS source VARCHAR(255) DEFAULT 'MANUAL',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
```

Then restart the Strapi API service.

### Environment variables

Set on **both** `apps/backend` and `apps/landing` (server-side):

| Variable | Required | Purpose |
|----------|----------|---------|
| `LANDING_SIGNUP_SECRET` | Recommended | Shared key sent as `X-Landing-Signup-Key` from landing to Strapi |
| `WEBSITE_SIGNUP_ORG_ID` | Optional | CRM organization id for website-created client accounts |
| `STRAPI_API_TOKEN` | Optional | Strapi API token if using token auth instead of signup key |

When `LANDING_SIGNUP_SECRET` is unset, website onboarding requests are still accepted (legacy behavior). **Set a strong secret in production.**

## Usage

1. Pull changes and deploy backend + landing together.
2. Set `LANDING_SIGNUP_SECRET` on both services.
3. Restart Strapi so schema sync runs.
4. Test signup on landing with a new email + company name.

## Error handling

Raw SQL / database errors are no longer shown to end users on the signup form. Users see a generic retry/support message; details remain in server logs.
