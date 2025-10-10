import { clsx } from "clsx";
import { useState } from "react";

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className,
  tabsClassName,
  contentClassName,
  variant = "default",
  ...props
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };

  const variants = {
    default: {
      tabs: "border-b border-gray-200",
      tab: "border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700",
      activeTab: "border-blue-500 text-blue-600",
    },
    pills: {
      tabs: "",
      tab: "rounded-lg hover:bg-gray-100",
      activeTab: "bg-blue-100 text-blue-700",
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={clsx("w-full", className)} {...props}>
      {/* Tab Headers */}
      <div
        className={clsx("flex space-x-8", currentVariant.tabs, tabsClassName)}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={clsx(
              "py-2 px-1 text-sm font-medium transition-colors duration-200",
              currentVariant.tab,
              activeTab === tab.id ? currentVariant.activeTab : "text-gray-500"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={clsx("mt-6", contentClassName)}>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

export default Tabs;
