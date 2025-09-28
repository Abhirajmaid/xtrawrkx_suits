"use client";

import { Button } from "@xtrawrkx/ui";
import {
  Plus,
  Users,
  UserCheck,
  Briefcase,
  Calendar,
  MoreHorizontal
} from "lucide-react";

export default function SalesOverviewHeader() {
  const quickAddItems = [
    { label: "Lead", icon: Users, href: "/sales/leads/new" },
    { label: "Contact", icon: UserCheck, href: "/sales/contacts/new" },
    { label: "Deal", icon: Briefcase, href: "/sales/deals/new" },
  ];

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-5xl font-light text-brand-foreground tracking-tight">
          Good Morning, Homies
        </h1>
        <p className="text-brand-text-light mt-1">
          It's Wednesday, 11 November 2024
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {quickAddItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="h-6 w-px bg-brand-border"></div>

        <Button variant="ghost" size="sm">
          <Calendar className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}