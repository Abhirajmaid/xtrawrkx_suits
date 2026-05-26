"use client";

import { Icon } from "@iconify/react";
import Button from "../common/Button";
import { usePublicAuth } from "@/src/contexts/PublicAuthContext";
import { communityPortalService } from "@/src/services/communityPortalService";
import { portalCommunityIdFromMembership } from "@/src/data/communityPortalLink";
import {
  deriveHasClientAccount,
  getCommunityCardState,
  getProfileCommunitySurfaceState,
} from "@/src/utils/communityCardState";

export default function ProfileCommunityCard() {
  const {
    user,
    isAuthenticated,
    communityStatus,
    profileBusy,
    refreshUserData,
    retryClientAccountSetup,
  } = usePublicAuth();

  const portalEmail = user?.email?.trim() || "";

  const hasClientAccount = deriveHasClientAccount(communityStatus);

  const cardState =
    communityStatus == null
      ? getCommunityCardState(null, null, true)
      : getProfileCommunitySurfaceState({
          hasClientAccount,
          hasCommunity: Boolean(communityStatus.hasCommunity),
          loadingError: communityStatus.loadingError || null,
          status: communityStatus.status,
          source: communityStatus.source,
          memberships: communityStatus.memberships || [],
        });

  const toneClass = {
    positive: "border-emerald-200 bg-emerald-50",
    neutral: "border-slate-200 bg-slate-50",
    warning: "border-amber-200 bg-amber-50",
    critical: "border-red-200 bg-red-50",
    info: "border-sky-200 bg-sky-50",
  }[cardState.tone];

  const handleCommunityClick = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth?mode=login&redirect=%2Fprofile";
      return;
    }

    switch (cardState.ctaAction) {
      case "retry_setup": {
        // Open a blank tab synchronously (still a user gesture). After `await`,
        // `window.open(url)` is often blocked; assigning `location` on this tab is not.
        const portalTab =
          typeof window !== "undefined"
            ? window.open("about:blank", "_blank")
            : null;

        await retryClientAccountSetup();
        await refreshUserData();

        const url = communityPortalService.getClientPortalAuthUrl({
          email: portalEmail,
          intent: "complete-setup",
        });

        if (communityPortalService.assignPreparedPortalTab(portalTab, url)) {
          return;
        }

        communityPortalService.openClientPortal({
          email: portalEmail,
          intent: "complete-setup",
          newTab: true,
        });
        return;
      }
      case "refresh_status":
        await refreshUserData();
        return;
      case "view_client_portal_community":
        communityPortalService.openClientPortalCommunities({
          email: portalEmail,
          newTab: true,
        });
        return;
      case "open_client_portal_dashboard":
        communityPortalService.openClientPortalDashboard({
          email: portalEmail,
          newTab: true,
        });
        return;
      case "client_portal_community":
      case "join_community":
        communityPortalService.openClientPortal({
          email: portalEmail,
          newTab: true,
        });
        return;
      case "open_crm_community":
        communityPortalService.openCrmPortal({ email: portalEmail });
        return;
      case "contact_support":
        window.location.href = "/contact";
        return;
      case "manage_membership":
      case "view_plan":
      case "upgrade_membership":
      case "reactivate_membership":
        communityPortalService.openClientPortalDashboard({
          email: portalEmail,
          newTab: true,
        });
        return;
      default:
        if (communityStatus?.hasCommunity) {
          communityPortalService.openClientPortalCommunities({
            email: portalEmail,
            newTab: true,
          });
          return;
        }
        communityPortalService.openClientPortal({
          email: portalEmail,
          newTab: true,
        });
        return;
    }
  };

  const handleOpenCompanyPortal = () => {
    if (!isAuthenticated) {
      window.location.href = "/auth?mode=login&redirect=%2Fprofile";
      return;
    }
    communityPortalService.openClientPortalDashboard({
      email: portalEmail,
      newTab: true,
    });
  };

  const openMembershipInPortal = (membership) => {
    if (!isAuthenticated) {
      window.location.href = "/auth?mode=login&redirect=%2Fprofile";
      return;
    }
    const portalId = portalCommunityIdFromMembership(membership);
    communityPortalService.openClientPortalCommunity({
      email: portalEmail,
      portalId,
      newTab: true,
    });
  };

  return (
    <aside className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/95 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="bg-gradient-to-br from-slate-900 via-sky-900 to-brand-primary px-6 py-6 text-white">
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em]">
          {cardState.badge}
        </span>
        <h3 className="mt-4 text-2xl font-semibold">{cardState.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/85">
          {cardState.description}
        </p>
      </div>

      <div className="space-y-5 px-6 py-6">
        <div className={`rounded-2xl border p-4 ${toneClass}`}>
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 text-brand-primary shadow-sm">
              <Icon
                icon={
                  communityStatus?.hasCommunity
                    ? "solar:users-group-rounded-bold"
                    : cardState.ctaAction === "retry_setup"
                    ? "solar:refresh-bold"
                    : "solar:user-plus-bold"
                }
                width={22}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{cardState.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {communityStatus?.loadingError
                  ? communityStatus.loadingError
                  : cardState.description}
              </p>
            </div>
          </div>
        </div>

        {communityStatus?.memberships?.length ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">
              Your communities
            </p>
            <p className="text-xs text-slate-500">
              Each card opens that community&apos;s page in the client portal (new
              tab), same handoff as &quot;View your community&quot;.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {communityStatus.memberships.map((m) => (
                <button
                  key={`${m.id}-${m.community}`}
                  type="button"
                  onClick={() => openMembershipInPortal(m)}
                  className="group flex flex-col rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
                        {(m.label || m.community || "?").charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-900">
                          {m.label || m.community}
                        </p>
                        {m.joinedAt ? (
                          <p className="text-xs text-slate-500">
                            Member since{" "}
                            {new Date(m.joinedAt).toLocaleDateString(undefined, {
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      className="shrink-0 text-emerald-600 opacity-70 transition group-hover:opacity-100"
                      width={22}
                    />
                  </div>
                  <span className="mt-3 text-xs font-medium text-emerald-700">
                    View this community in portal →
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <Button
          text={cardState.ctaLabel}
          type="primary"
          className="w-full justify-center"
          onClick={handleCommunityClick}
          disabled={profileBusy}
        />
        <Button
          text="Open your company portal"
          type="secondary"
          className="w-full justify-center"
          onClick={handleOpenCompanyPortal}
          disabled={profileBusy}
        />
      </div>
    </aside>
  );
}
