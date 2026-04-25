"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import Button from "../common/Button";
import { usePublicAuth } from "@/src/contexts/PublicAuthContext";
import { commonToasts, toastUtils } from "@/src/utils/toast";

const signupInitialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  company: "",
  jobTitle: "",
  location: "",
  interests: "",
  lookingFor: "",
  bio: "",
};

const loginInitialState = {
  email: "",
  password: "",
};

export default function AuthForm({
  initialMode = "signup",
  onSuccess,
  onClose,
  isPage = false,
  redirectTo = "/profile",
}) {
  const { signIn, signUp, authBusy, error, clearError } = usePublicAuth();
  const [mode, setMode] = useState(initialMode);
  const [loginData, setLoginData] = useState(loginInitialState);
  const [signupData, setSignupData] = useState(signupInitialState);
  const [localError, setLocalError] = useState("");

  const isSignup = mode === "signup";

  const activeTitle = useMemo(
    () =>
      isSignup
        ? "Create your xtrawrkx account"
        : "Sign in to your xtrawrkx account",
    [isSignup]
  );

  const handleModeChange = (nextMode) => {
    clearError();
    setLocalError("");
    setMode(nextMode);
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((current) => ({ ...current, [name]: value }));
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;
    setSignupData((current) => ({ ...current, [name]: value }));
  };

  const validateSignup = () => {
    if (
      !signupData.firstName.trim() ||
      !signupData.lastName.trim() ||
      !signupData.email.trim() ||
      !signupData.password.trim() ||
      !signupData.company.trim() ||
      !signupData.jobTitle.trim()
    ) {
      return "Please complete the required account fields.";
    }

    if (signupData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();
    setLocalError("");

    try {
      if (isSignup) {
        const validationError = validateSignup();
        if (validationError) {
          setLocalError(validationError);
          return;
        }

        const signupResult = await signUp(signupData);
        commonToasts.saveSuccess();
        if (signupResult?.clientAccountSetup?.ok === false) {
          toastUtils.warning(
            `${signupResult.clientAccountSetup.error} Open your profile and use Retry Setup.`
          );
        }
      } else {
        if (!loginData.email.trim() || !loginData.password.trim()) {
          setLocalError("Please enter your email and password.");
          return;
        }

        await signIn(loginData.email, loginData.password);
        commonToasts.loginSuccess();
      }

      if (onSuccess) {
        onSuccess();
      } else if (isPage && typeof window !== "undefined") {
        window.location.href = redirectTo;
      }

      onClose?.();
    } catch (submitError) {
      setLocalError(submitError.message || "Unable to continue right now.");
    }
  };

  const surfaceClassName = isPage
    ? "w-full overflow-hidden rounded-[2rem] border border-white/60 bg-white/95 shadow-[0_32px_80px_rgba(15,23,42,0.14)] backdrop-blur"
    : "w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.24)]";

  return (
    <div className={surfaceClassName}>
      <div className="grid lg:min-h-[760px] lg:grid-cols-[1fr_0.94fr]">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-slate-700 px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
          <div className="absolute inset-0">
            <video
              src="/mountain_vid1.webm"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover opacity-30"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-sky-900/60 to-pink-500/30" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-white/90">
                xtrawrkx access
              </span>
              <h2 className="mt-5 max-w-md font-heading text-4xl leading-tight sm:text-5xl">
                From complexity to clarity.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
                Build your public profile, keep your details in sync, and move
                into the right community experience from one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="solar:user-id-bold" width={18} />
                  Profile ready
                </div>
                <p className="text-sm text-white/80">
                  Capture portal-style identity and company details during
                  signup.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="solar:users-group-rounded-bold" width={18} />
                  Community aware
                </div>
                <p className="text-sm text-white/80">
                  Membership status is checked after sign-in so users get the
                  right next step.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-[520px]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-primary">
                Welcome
              </p>
              <h3 className="mt-3 text-3xl font-semibold leading-tight text-slate-900">
                {activeTitle}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                {isSignup
                  ? "Set up your account to unlock your profile page and community routing."
                  : "Use your email and password to continue to your profile and community access."}
              </p>
            </div>
            {!isPage && onClose ? (
              <button
                type="button"
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                onClick={onClose}
                aria-label="Close authentication"
              >
                <Icon icon="solar:close-circle-linear" width={22} />
              </button>
            ) : null}
          </div>

          <div className="mt-8 grid grid-cols-2 rounded-[1.15rem] border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                !isSignup
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => handleModeChange("login")}
            >
              I already have an account
            </button>
            <button
              type="button"
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                isSignup
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => handleModeChange("signup")}
            >
              I need to register
            </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {isSignup ? (
              <>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Account details
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Start with the essentials to create your account.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        First name
                      </span>
                      <input
                        name="firstName"
                        value={signupData.firstName}
                        onChange={handleSignupChange}
                        className="input"
                        placeholder="Alex"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Last name
                      </span>
                      <input
                        name="lastName"
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                        className="input"
                        placeholder="Johnson"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Email
                      </span>
                      <input
                        name="email"
                        type="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        className="input"
                        placeholder="alex@company.com"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Password
                      </span>
                      <input
                        name="password"
                        type="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        className="input"
                        placeholder="At least 6 characters"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Profile overview
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      These details appear on your overview page after signup.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Company
                      </span>
                      <input
                        name="company"
                        value={signupData.company}
                        onChange={handleSignupChange}
                        className="input"
                        placeholder="xtrawrkx"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Role / title
                      </span>
                      <input
                        name="jobTitle"
                        value={signupData.jobTitle}
                        onChange={handleSignupChange}
                        className="input"
                        placeholder="Founder"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Location
                      </span>
                      <input
                        name="location"
                        value={signupData.location}
                        onChange={handleSignupChange}
                        className="input"
                        placeholder="Toronto, Canada"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Focus areas
                      </span>
                      <input
                        name="interests"
                        value={signupData.interests}
                        onChange={handleSignupChange}
                        className="input"
                        placeholder="Strategy, product, partnerships"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        What are you looking for?
                      </span>
                      <input
                        name="lookingFor"
                        value={signupData.lookingFor}
                        onChange={handleSignupChange}
                        className="input"
                        placeholder="Advisory, community, events, partnerships"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Short bio
                      </span>
                      <textarea
                        name="bio"
                        value={signupData.bio}
                        onChange={handleSignupChange}
                        className="input min-h-28 resize-none"
                        placeholder="Tell us a little about your work and goals."
                      />
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Login details
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter your credentials to continue to your profile.
                  </p>
                </div>
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="input"
                      placeholder="alex@company.com"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Password
                    </span>
                    <input
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="input"
                      placeholder="Enter your password"
                    />
                  </label>
                </div>
              </div>
            )}

            {localError || error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {localError || error}
              </div>
            ) : null}

            <Button
              text={isSignup ? "Create Account" : "Login"}
              type="primary"
              className="w-full justify-center"
              hideArrow={authBusy}
              disabled={authBusy}
              htmlType="submit"
              icon={authBusy ? "solar:loading-bold" : undefined}
            />
          </form>

          <p className="mt-5 text-sm text-slate-500">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <button
              type="button"
              className="font-medium text-brand-primary transition hover:text-brand-secondary"
              onClick={() => handleModeChange(isSignup ? "login" : "signup")}
            >
              {isSignup ? "Sign in here" : "Register here"}
            </button>
          </p>
          {!isPage ? (
            <p className="mt-3 text-xs leading-6 text-slate-400">
              You can also continue on the full auth page at{" "}
              <a
                href={`/auth?mode=${isSignup ? "signup" : "login"}&redirect=${encodeURIComponent(
                  redirectTo
                )}`}
                className="font-medium text-brand-primary"
              >
                /auth
              </a>
              .
            </p>
          ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
