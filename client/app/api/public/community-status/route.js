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

const membershipPaths = (email) => [
  `/client-accounts?filters[email][$eq]=${encodeURIComponent(
    email
  )}&pagination[pageSize]=1`,
  `/client-accounts/by-email?email=${encodeURIComponent(email)}`,
  `/client-accounts/status?email=${encodeURIComponent(email)}`,
  `/community-memberships/status?email=${encodeURIComponent(email)}`,
  `/communities/membership-status?email=${encodeURIComponent(email)}`,
  `/users/community-status?email=${encodeURIComponent(email)}`,
];

const extractClientAccount = (data) => {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (Array.isArray(data) && data.length > 0) {
    const firstRow = data[0];
    if (firstRow?.attributes) {
      return { id: firstRow.id, ...firstRow.attributes };
    }
    return firstRow;
  }

  if (data.clientAccount && typeof data.clientAccount === "object") {
    return data.clientAccount;
  }

  if (data.client_account && typeof data.client_account === "object") {
    return data.client_account;
  }

  if (Array.isArray(data.data) && data.data.length > 0) {
    const firstRow = data.data[0];
    if (firstRow?.attributes) {
      return { id: firstRow.id, ...firstRow.attributes };
    }
    return firstRow;
  }

  if (data.data && typeof data.data === "object") {
    if (data.data.attributes) {
      return { id: data.data.id, ...data.data.attributes };
    }
    return data.data;
  }

  if (data.status || data.source) {
    return data;
  }

  return null;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to fetch community status." },
        { status: 400 }
      );
    }

    const baseUrl = buildBaseUrl();
    let lastResult = null;

    for (const path of membershipPaths(email)) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (response.status === 404) {
        lastResult = {
          status: 404,
          error: "Endpoint not found",
        };
        continue;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return NextResponse.json(
          {
            error:
              data?.error || "Unable to fetch community membership status.",
          },
          { status: response.status }
        );
      }

      const clientAccount = extractClientAccount(data);
      const clientAccountStatus =
        clientAccount?.status || data?.status || data?.clientAccountStatus || null;
      const clientAccountSource =
        clientAccount?.source || data?.source || data?.clientAccountSource || null;
      const hasClientAccount = Boolean(clientAccount);

      return NextResponse.json(
        {
          hasClientAccount,
          clientAccount: hasClientAccount
            ? {
                id: clientAccount?.id || null,
                status: clientAccountStatus,
                source: clientAccountSource,
                raw: clientAccount,
              }
            : null,
          hasCommunity:
            Boolean(data?.hasCommunity) ||
            Boolean(data?.communityName) ||
            Boolean(data?.community?.name) ||
            [
              "COMMUNITY_MEMBER",
              "COMMUNITY_PAID",
              "COMMUNITY_NON_PAID",
              "ACTIVE",
            ].includes(String(clientAccountStatus || "").toUpperCase()),
          communityName: data?.communityName || data?.community?.name || "",
          communitySlug: data?.communitySlug || data?.community?.slug || "",
          membershipId: data?.membershipId || data?.id || "",
          ...data,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error:
          lastResult?.error ||
          "No compatible community membership endpoint was found.",
      },
      { status: lastResult?.status || 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to fetch community status." },
      { status: 500 }
    );
  }
}
