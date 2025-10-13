"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building, User, Lock, Mail } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Onboarding form state
  const [onboardingData, setOnboardingData] = useState({
    // Company information
    companyName: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    employees: "",
    description: "",
    founded: "",

    // Primary contact information
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    contactPhone: "",
    contactTitle: "",
    contactDepartment: "",

    // Authentication
    password: "",
    confirmPassword: "",
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("client_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/client/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store authentication data
      localStorage.setItem("client_token", data.token);
      localStorage.setItem("client_account", JSON.stringify(data.account));
      localStorage.setItem("client_contacts", JSON.stringify(data.contacts));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboarding = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    const requiredFields = [
      "companyName",
      "industry",
      "email",
      "contactFirstName",
      "contactLastName",
      "contactEmail",
      "password",
    ];

    for (const field of requiredFields) {
      if (!onboardingData[field]) {
        setError(
          `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`
        );
        setLoading(false);
        return;
      }
    }

    // Validate password match
    if (onboardingData.password !== onboardingData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (onboardingData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/onboarding/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Onboarding failed");
      }

      // Store authentication data
      localStorage.setItem("client_token", data.token);
      localStorage.setItem("client_account", JSON.stringify(data.account));
      localStorage.setItem(
        "client_contacts",
        JSON.stringify([data.primaryContact])
      );

      setSuccess("Account created successfully! Redirecting to dashboard...");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value, isOnboarding = false) => {
    if (isOnboarding) {
      setOnboardingData((prev) => ({ ...prev, [field]: value }));
    } else {
      setLoginData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            XtraWrkx Client Portal
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Access your projects, documents, and collaborate with our team
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Login
              </TabsTrigger>
              <TabsTrigger
                value="onboarding"
                className="flex items-center gap-2"
              >
                <Building className="w-4 h-4" />
                New Account
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Company Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="company@example.com"
                    value={loginData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentTab("onboarding")}
                    className="text-blue-600 hover:underline"
                  >
                    Create one here
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="onboarding" className="mt-6">
              <form onSubmit={handleOnboarding} className="space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Company Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="Your Company Inc."
                        value={onboardingData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value, true)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Input
                        id="industry"
                        placeholder="Technology, Healthcare, etc."
                        value={onboardingData.industry}
                        onChange={(e) =>
                          handleInputChange("industry", e.target.value, true)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-email">Company Email *</Label>
                      <Input
                        id="company-email"
                        type="email"
                        placeholder="info@company.com"
                        value={onboardingData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value, true)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Phone</Label>
                      <Input
                        id="company-phone"
                        placeholder="+1 (555) 123-4567"
                        value={onboardingData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value, true)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="https://company.com"
                        value={onboardingData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value, true)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employees">Number of Employees</Label>
                      <Input
                        id="employees"
                        placeholder="1-10, 11-50, 51-200, etc."
                        value={onboardingData.employees}
                        onChange={(e) =>
                          handleInputChange("employees", e.target.value, true)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Primary Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactFirstName">First Name *</Label>
                      <Input
                        id="contactFirstName"
                        placeholder="John"
                        value={onboardingData.contactFirstName}
                        onChange={(e) =>
                          handleInputChange(
                            "contactFirstName",
                            e.target.value,
                            true
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactLastName">Last Name *</Label>
                      <Input
                        id="contactLastName"
                        placeholder="Doe"
                        value={onboardingData.contactLastName}
                        onChange={(e) =>
                          handleInputChange(
                            "contactLastName",
                            e.target.value,
                            true
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="john@company.com"
                        value={onboardingData.contactEmail}
                        onChange={(e) =>
                          handleInputChange(
                            "contactEmail",
                            e.target.value,
                            true
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        placeholder="+1 (555) 123-4567"
                        value={onboardingData.contactPhone}
                        onChange={(e) =>
                          handleInputChange(
                            "contactPhone",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactTitle">Job Title</Label>
                      <Input
                        id="contactTitle"
                        placeholder="CEO, CTO, Project Manager, etc."
                        value={onboardingData.contactTitle}
                        onChange={(e) =>
                          handleInputChange(
                            "contactTitle",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactDepartment">Department</Label>
                      <Input
                        id="contactDepartment"
                        placeholder="Executive, IT, Marketing, etc."
                        value={onboardingData.contactDepartment}
                        onChange={(e) =>
                          handleInputChange(
                            "contactDepartment",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Password Setup */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Account Security
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={onboardingData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value, true)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={onboardingData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange(
                            "confirmPassword",
                            e.target.value,
                            true
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account & Access Portal"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentTab("login")}
                    className="text-blue-600 hover:underline"
                  >
                    Sign in here
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
