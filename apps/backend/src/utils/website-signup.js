'use strict';

/**
 * Shared helpers for landing-site → Strapi client account provisioning.
 * Requests must include X-Landing-Signup-Key matching LANDING_SIGNUP_SECRET.
 */

function hasWebsiteSignupSecret(ctx) {
  const expected = process.env.LANDING_SIGNUP_SECRET;
  if (!expected) return true;
  const provided = ctx.request?.headers?.['x-landing-signup-key'];
  return typeof provided === 'string' && provided.length > 0 && provided === expected;
}

function isWebsiteSignupPayload(data) {
  if (!data || typeof data !== 'object') return false;
  if (String(data.source || '').toUpperCase() === 'ONBOARDING') return true;
  const onboarding = data.onboardingData;
  return (
    onboarding &&
    typeof onboarding === 'object' &&
    onboarding.createdFrom === 'website_public_signup'
  );
}

function extractEmailFilter(ctx) {
  const query = ctx.query || {};
  const nested = query.filters?.email;
  if (nested && typeof nested === 'object') {
    const eq = nested.$eq ?? nested.eq;
    if (typeof eq === 'string' && eq.trim()) {
      return eq.trim().toLowerCase();
    }
  }
  const flat = query['filters[email][$eq]'];
  if (typeof flat === 'string' && flat.trim()) {
    return flat.trim().toLowerCase();
  }
  return null;
}

async function resolveWebsiteSignupOrgId(strapi) {
  const envId = process.env.WEBSITE_SIGNUP_ORG_ID;
  if (envId != null && String(envId).trim() !== '') {
    const id = parseInt(String(envId), 10);
    if (!Number.isNaN(id) && id > 0) {
      const org = await strapi.entityService.findOne('api::organization.organization', id, {
        fields: ['id'],
      });
      if (org) return id;
    }
  }
  return null;
}

function friendlyClientAccountError(err) {
  const msg = String(err?.message || err || '');
  if (msg.includes('does not exist')) {
    return 'Client account storage is not fully configured. Please contact support.';
  }
  if (/unique|duplicate|already exists/i.test(msg)) {
    return 'A client account with this email or company name already exists.';
  }
  return 'Unable to save client account right now. Please try again later.';
}

function stripWebsiteSignupOnlyFields(data) {
  if (!data || typeof data !== 'object') return {};
  const next = { ...data };
  delete next.password;
  delete next.id;
  delete next.documentId;
  return next;
}

module.exports = {
  hasWebsiteSignupSecret,
  isWebsiteSignupPayload,
  extractEmailFilter,
  resolveWebsiteSignupOrgId,
  friendlyClientAccountError,
  stripWebsiteSignupOnlyFields,
};
