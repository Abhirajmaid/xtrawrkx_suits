"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wrench, Home, Clock, Sparkles } from "lucide-react";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-main">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-warm rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main content card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-8 text-center max-w-md w-full">
        {/* Icon with gradient background */}
        <div className="relative w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-primary rounded-3xl animate-pulse opacity-75"></div>
          <div className="relative flex items-center justify-center">
            <Wrench className="w-12 h-12 text-white" />
            <Sparkles className="w-6 h-6 text-white absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>

        {/* Title with gradient text */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-tertiary bg-clip-text text-transparent mb-4 font-heading">
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-brand-text-light mb-2 text-lg font-medium">
          Something amazing is brewing
        </p>

        {/* Description */}
        <p className="text-brand-text-muted mb-8 leading-relaxed">
          This feature is currently under development and will be available
          soon. We're working hard to bring you the best experience possible.
        </p>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 p-3 bg-gradient-warm rounded-xl border border-brand-primary/20">
          <Clock className="w-4 h-4 text-brand-primary animate-pulse" />
          <span className="text-sm font-medium text-brand-primary">
            Development in progress
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center gap-3 px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Go Back
          </button>

          <Link
            href="/"
            className="group flex items-center justify-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl font-medium text-brand-foreground hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            Dashboard
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-primary rounded-full opacity-60"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-secondary rounded-full opacity-40"></div>
        <div className="absolute top-1/4 -left-1 w-2 h-2 bg-brand-tertiary rounded-full opacity-50"></div>
        <div className="absolute bottom-1/4 -right-1 w-2 h-2 bg-brand-secondary rounded-full opacity-60"></div>
      </div>

      {/* Additional floating elements */}
      <div
        className="absolute top-20 left-20 w-2 h-2 bg-brand-primary rounded-full opacity-30 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 right-20 w-3 h-3 bg-brand-secondary rounded-full opacity-40 animate-float"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute top-1/3 right-10 w-1 h-1 bg-brand-tertiary rounded-full opacity-50 animate-float"
        style={{ animationDelay: "5s" }}
      ></div>
    </div>
  );
}
