"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { publicUserService } from "../services/publicUserService";

const PublicAuthContext = createContext(null);

export const usePublicAuth = () => {
  const context = useContext(PublicAuthContext);

  if (!context) {
    throw new Error("usePublicAuth must be used within PublicAuthProvider");
  }

  return context;
};

export const PublicAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [communityStatus, setCommunityStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [error, setError] = useState(null);

  const hydrateUserData = async (authUser) => {
    if (!authUser) {
      setProfile(null);
      setCommunityStatus(null);
      return;
    }

    const nextProfile = await publicUserService.getProfile(authUser);
    setProfile(nextProfile);

    const syncResult = await publicUserService.syncProfileWithStrapi({
      uid: authUser.uid,
      email: authUser.email,
      displayName: nextProfile.displayName,
      firstName: nextProfile.firstName,
      lastName: nextProfile.lastName,
      company: nextProfile.company,
      jobTitle: nextProfile.jobTitle,
      location: nextProfile.location,
      bio: nextProfile.bio,
      interests: nextProfile.interests,
      lookingFor: nextProfile.lookingFor,
    });

    if (syncResult.ok && syncResult.data?.profile) {
      setProfile((currentProfile) => ({
        ...currentProfile,
        ...syncResult.data.profile,
      }));
    }

    const nextCommunityStatus = await publicUserService.fetchCommunityStatus(
      authUser.email
    );
    setCommunityStatus(nextCommunityStatus);
  };

  useEffect(() => {
    const unsubscribe = publicUserService.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      setLoading(true);

      try {
        setError(null);
        await hydrateUserData(authUser);
      } catch (nextError) {
        setError(nextError.message || "Unable to load your account.");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    setAuthBusy(true);
    setError(null);

    try {
      const authUser = await publicUserService.signIn(email, password);
      setUser(authUser);
      await hydrateUserData(authUser);
      return authUser;
    } catch (nextError) {
      setError(nextError.message);
      throw nextError;
    } finally {
      setAuthBusy(false);
    }
  };

  const signUp = async (formData) => {
    setAuthBusy(true);
    setError(null);

    try {
      const { user: authUser, clientAccountSetup } =
        await publicUserService.signUp(formData);
      setUser(authUser);
      await hydrateUserData(authUser);
      return { user: authUser, clientAccountSetup };
    } catch (nextError) {
      setError(nextError.message);
      throw nextError;
    } finally {
      setAuthBusy(false);
    }
  };

  const signOut = async () => {
    setAuthBusy(true);
    setError(null);

    try {
      await publicUserService.signOut();
      setUser(null);
      setProfile(null);
      setCommunityStatus(null);
    } catch (nextError) {
      setError(nextError.message);
      throw nextError;
    } finally {
      setAuthBusy(false);
    }
  };

  const refreshUserData = async () => {
    if (!user) return null;

    setProfileBusy(true);
    setError(null);

    try {
      await hydrateUserData(user);
      return true;
    } catch (nextError) {
      setError(nextError.message || "Unable to refresh your account.");
      return null;
    } finally {
      setProfileBusy(false);
    }
  };

  const updateUserProfile = async (payload) => {
    if (!user?.uid) {
      throw new Error("You need to be logged in to update your profile.");
    }

    setProfileBusy(true);
    setError(null);

    try {
      await publicUserService.updateProfile(user.uid, payload);
      const nextProfile = {
        ...profile,
        ...payload,
      };
      setProfile(nextProfile);

      await publicUserService.syncProfileWithStrapi({
        uid: user.uid,
        email: user.email,
        ...nextProfile,
      });

      return nextProfile;
    } catch (nextError) {
      setError(nextError.message);
      throw nextError;
    } finally {
      setProfileBusy(false);
    }
  };

  const retryClientAccountSetup = async () => {
    if (!user?.email) {
      return {
        ok: false,
        message: "You need to be logged in to retry setup.",
      };
    }

    setProfileBusy(true);
    setError(null);

    try {
      const result = await publicUserService.retryClientAccountSetup({
        uid: user.uid,
        email: user.email,
        displayName: profile?.displayName,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        company: profile?.company,
        jobTitle: profile?.jobTitle,
        location: profile?.location,
        bio: profile?.bio,
        interests: profile?.interests,
        lookingFor: profile?.lookingFor,
      });

      if (!result.ok || result.data?.clientAccountSync?.ok === false) {
        const setupError =
          result.message ||
          result.data?.clientAccountSync?.error ||
          "Unable to complete client account setup.";
        setError(setupError);
      } else {
        await hydrateUserData(user);
      }

      return result;
    } catch (nextError) {
      setError(nextError.message || "Unable to retry setup.");
      return {
        ok: false,
        message: nextError.message || "Unable to retry setup.",
      };
    } finally {
      setProfileBusy(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      communityStatus,
      loading,
      authBusy,
      profileBusy,
      error,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
      refreshUserData,
      retryClientAccountSetup,
      updateUserProfile,
      clearError,
      isFirebaseAvailable: publicUserService.isFirebaseAvailable(),
    }),
    [
      user,
      profile,
      communityStatus,
      loading,
      authBusy,
      profileBusy,
      error,
      retryClientAccountSetup,
    ]
  );

  return (
    <PublicAuthContext.Provider value={value}>
      {children}
    </PublicAuthContext.Provider>
  );
};
