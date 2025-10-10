"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { Icon } from "@iconify/react";

export default function OnboardingLayout({ children }) {
  const { state, getCurrentStepInfo } = useOnboardingState();
  const currentStepInfo = getCurrentStepInfo();

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Jeremy Winson",
      role: "Founder",
      company: "Elite",
      companyCode: "ELI",
      avatar: "JW",
      quote:
        "Was paying a lot in fees with JPM, I like the pricing transparency and feature offerings",
      bgColor: "from-purple-400 to-indigo-500",
    },
    {
      name: "Sarah Chen",
      role: "CEO",
      company: "TechFlow",
      companyCode: "TF",
      avatar: "SC",
      quote:
        "The community network has been invaluable for finding the right investors and mentors for our growth",
      bgColor: "from-blue-400 to-cyan-500",
    },
    {
      name: "Alex Rodriguez",
      role: "CTO",
      company: "InnovateLab",
      companyCode: "IL",
      avatar: "AR",
      quote:
        "Xtrawrkx helped us connect with key partners and scale our operations efficiently",
      bgColor: "from-emerald-400 to-teal-500",
    },
    {
      name: "Maya Patel",
      role: "Director",
      company: "GreenTech",
      companyCode: "GT",
      avatar: "MP",
      quote:
        "The talent network here is exceptional. We found our core team members through these communities",
      bgColor: "from-rose-400 to-pink-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Split Layout - No Header */}
      <div className="min-h-screen flex">
        {/* Left side - Welcome Section - Fixed */}
        <motion.div
          className="w-2/5 p-16 flex flex-col justify-center overflow-hidden fixed left-0 top-0 h-screen"
          style={{
            backgroundImage: "url('/images/download (10).png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Background overlay for better text readability */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-pink-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div> */}

          <div className="relative z-10">
            {/* Logo/Icon */}
            <div className="mb-12">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                <span className="text-white font-bold text-2xl">X</span>
              </div>
            </div>

            {/* Main heading */}
            <div className="mb-16">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Get started with{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Xtrawrkx
                </span>
                .
              </h1>
              <p className="text-white/90 text-xl leading-relaxed max-w-md drop-shadow-md">
                Answer a couple of questions to make sure your business is a
                good fit.
              </p>
            </div>

            {/* Notification-style Testimonial Slider */}
            <div className="relative max-w-lg">
              <div className="h-48 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ y: 150, opacity: 0 }}
                    animate={{
                      y:
                        index === currentTestimonial
                          ? 0
                          : index > currentTestimonial
                            ? 150
                            : -150,
                      opacity: index === currentTestimonial ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Glass Notification Card */}
                    <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/40 ring-1 ring-white/20">
                      <div className="flex items-start space-x-5">
                        {/* App Icon */}
                        <div className="w-16 h-16 bg-white/65 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/50">
                          <span className="text-primary-600 font-bold text-2xl">
                            X
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white text-lg drop-shadow-md">
                              Xtrawrkx
                            </h4>
                            <span className="text-sm text-white/70">
                              1 min ago
                            </span>
                          </div>
                          <p className="text-sm text-white/80 font-medium mb-3">
                            Success Alert
                          </p>
                          <p className="text-sm text-white/90 leading-relaxed">
                            {testimonial.quote}
                          </p>
                        </div>

                        {/* Heart Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-300/30">
                            <span className="text-white text-sm">
                              <Icon icon="mdi:heart" className="text-red-500" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Glass dot indicators - pushed down */}
              <div className="flex justify-center space-x-3 mt-12">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 ${
                      index === currentTestimonial
                        ? "bg-white w-8 shadow-lg"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Forms - Scrollable */}
        <motion.div
          className="w-3/5 bg-gradient-to-bl from-white via-slate-50 to-gray-50 p-16 flex flex-col justify-center ml-[40%] min-h-screen overflow-y-auto"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="max-w-2xl mx-auto w-full">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
