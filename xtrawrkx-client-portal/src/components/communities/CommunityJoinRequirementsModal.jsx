"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { joinCommunityWithRequirements } from "@/lib/api/communityProgramService";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Media & Entertainment",
  "Other",
];

const initialForm = {
  phone: "",
  industry: "",
  jobTitle: "",
  company: "",
  interests: "",
  lookingFor: "",
  whyJoin: "",
};

export default function CommunityJoinRequirementsModal({
  isOpen,
  onClose,
  community,
  clientAccountId,
  accountDefaults = {},
  onSuccess,
}) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm({
      ...initialForm,
      company: accountDefaults.company || "",
      jobTitle: accountDefaults.jobTitle || "",
      phone: accountDefaults.phone || "",
    });
  }, [isOpen, accountDefaults.company, accountDefaults.jobTitle, accountDefaults.phone]);

  if (!community) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!clientAccountId) {
      setError("Missing client account. Please sign out and sign in again.");
      return;
    }
    if (!form.whyJoin.trim()) {
      setError("Please tell us why you want to join this community.");
      return;
    }
    if (!form.industry) {
      setError("Please select your industry.");
      return;
    }

    const requirements = {
      phone: form.phone.trim(),
      industry: form.industry,
      jobTitle: form.jobTitle.trim(),
      company: form.company.trim(),
      interests: form.interests.trim(),
      lookingFor: form.lookingFor.trim(),
      whyJoin: form.whyJoin.trim(),
      communityName: community.name,
      communityEnum: community.strapiEnum,
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      await joinCommunityWithRequirements({
        clientAccountId,
        communityEnum: community.strapiEnum,
        requirements,
      });
      onSuccess?.(community);
      onClose();
    } catch (err) {
      setError(err.message || "Unable to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Join ${community.name}`}
      size="lg"
    >
      <p className="text-sm text-gray-600 mb-4">
        A few details (similar to onboarding) help us route your request. You
        will be added to this community and it will appear in your CRM profile
        and on the xtrawrkx website.
      </p>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company / organization <span className="text-red-500">*</span>
          </label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="As on your client profile"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role / title <span className="text-red-500">*</span>
            </label>
            <input
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Optional"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            name="industry"
            value={form.industry}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interests & focus areas
          </label>
          <textarea
            name="interests"
            value={form.interests}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Technologies, sectors, themes…"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What are you looking for in this community?
          </label>
          <textarea
            name="lookingFor"
            value={form.lookingFor}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Networking, hiring, funding, partnerships…"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Why do you want to join {community.name}?{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name="whyJoin"
            value={form.whyJoin}
            onChange={handleChange}
            rows={3}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-xtrawrkx-500 text-white hover:bg-xtrawrkx-600 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit & join"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
