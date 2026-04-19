import { NextResponse } from "next/server";
import { CMS_CONFIG } from "@/src/config/cms";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  process.env.STRAPI_API_URL ||
  (process.env.NODE_ENV !== "production"
    ? "http://localhost:1337/api"
    : CMS_CONFIG.STRAPI_API_URL || "http://localhost:1337/api");

const buildBaseUrl = () =>
  STRAPI_API_URL.endsWith("/") ? STRAPI_API_URL.slice(0, -1) : STRAPI_API_URL;

const profileGetPaths = (email) => [
  `/public-user-profiles/by-email?email=${encodeURIComponent(email)}`,
  `/user-profiles/by-email?email=${encodeURIComponent(email)}`,
  `/users/profile?email=${encodeURIComponent(email)}`,
];

const profileSyncPaths = () => [
  "/public-user-profiles/sync",
  "/user-profiles/sync",
  "/users/sync-profile",
];

const clientAccountSearchPath = (email) =>
  `/client-accounts?filters[email][$eq]=${encodeURIComponent(
    email
  )}&pagination[pageSize]=1`;

const tryRequest = async ({ paths, method, body }) => {
  const baseUrl = buildBaseUrl();
  let lastError = null;

  for (const path of paths) {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (response.status === 404) {
      lastError = { status: 404, error: "Endpoint not found" };
      continue;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data,
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
    };
  }

  return {
    ok: false,
    status: lastError?.status || 404,
    data: {
      error:
        "No compatible Strapi profile endpoint was found. Configure the expected endpoint path if it differs.",
    },
  };
};

const ensureClientAccount = async (body) => {
  const email = String(body?.email || "").trim().toLowerCase();
  if (!email) {
    return {
      attempted: false,
      ok: false,
      status: 400,
      error: "Email is required for client account setup.",
      data: null,
    };
  }

  const existing = await tryRequest({
    paths: [clientAccountSearchPath(email)],
    method: "GET",
  });

  if (!existing.ok) {
    return {
      attempted: true,
      ok: false,
      status: existing.status,
      error:
        existing.data?.error ||
        "Unable to check existing client account before setup.",
      data: null,
    };
  }

  const existingRows = Array.isArray(existing.data?.data)
    ? existing.data.data
    : Array.isArray(existing.data)
    ? existing.data
    : [];
  if (existingRows.length > 0) {
    const first = existingRows[0];
    const attrs = first?.attributes || {};
    return {
      attempted: true,
      ok: true,
      status: 200,
      error: null,
      data: {
        id: first?.id || null,
        status: attrs.status || body?.status || "REGISTERED",
        source: attrs.source || body?.source || "ONBOARDING",
        raw: first,
      },
    };
  }

  const firstName = String(body?.firstName || "").trim();
  const lastName = String(body?.lastName || "").trim();
  const displayName = String(body?.displayName || "").trim();
  const company = String(body?.company || "").trim();
  const uid = String(body?.uid || "").trim();
  const localName = email.split("@")[0] || "website-user";
  const derivedCompany = company || displayName || `${firstName} ${lastName}`.trim() || localName;
  const fallbackIndustry = String(body?.jobTitle || "").trim() || "General";

  const createResult = await tryRequest({
    paths: ["/client-accounts"],
    method: "POST",
    body: {
      data: {
        email,
        companyName: `${derivedCompany}-${uid || Date.now()}`,
        industry: fallbackIndustry,
        type: "CUSTOMER",
        status: "REGISTERED",
        source: "ONBOARDING",
        isActive: true,
        onboardingData: {
          profileUid: uid || null,
          firstName,
          lastName,
          displayName,
          createdFrom: "website_public_signup",
        },
      },
    },
  });

  if (!createResult.ok) {
    return {
      attempted: true,
      ok: false,
      status: createResult.status,
      error: createResult.data?.error || "Client account setup failed.",
      data: null,
    };
  }

  const created = createResult.data?.data || createResult.data;
  const attrs = created?.attributes || {};
  return {
    attempted: true,
    ok: true,
    status: createResult.status,
    error: null,
    data: {
      id: created?.id || null,
      status: attrs.status || "REGISTERED",
      source: attrs.source || "ONBOARDING",
      raw: created,
    },
  };
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to fetch the profile." },
        { status: 400 }
      );
    }

    const result = await tryRequest({
      paths: profileGetPaths(email),
      method: "GET",
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.data?.error || "Unable to fetch Strapi profile." },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to fetch Strapi profile." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body?.email) {
      return NextResponse.json(
        { error: "Email is required to sync the profile." },
        { status: 400 }
      );
    }

    const result = await tryRequest({
      paths: profileSyncPaths(),
      method: "POST",
      body,
    });

    const shouldEnsureClientAccount = body?.ensureClientAccount !== false;
    let clientAccountResult = null;

    if (shouldEnsureClientAccount) {
      clientAccountResult = await ensureClientAccount(body);
    }

    return NextResponse.json(
      {
        ...(result.ok ? result.data : {}),
        profileSync: {
          attempted: true,
          ok: Boolean(result.ok),
          error: result.ok
            ? null
            : result.data?.error || "Unable to sync Strapi profile.",
          status: result.status,
        },
        clientAccount: clientAccountResult?.ok ? clientAccountResult.data : null,
        clientAccountSync: {
          attempted: Boolean(clientAccountResult?.attempted),
          ok: Boolean(clientAccountResult?.ok),
          error: clientAccountResult?.ok
            ? null
            : clientAccountResult?.error ||
              (shouldEnsureClientAccount
                ? "Client account setup failed."
                : null),
          status: clientAccountResult?.status || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to sync Strapi profile." },
      { status: 500 }
    );
  }
}
