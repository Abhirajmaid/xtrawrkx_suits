import { Search, Settings, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({
  title = "Home",
  subtitle = "Monitor all of your projects and tasks here",
  onSearchClick,
}) {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-4">
      <div className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left side - Title and subtitle */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {title}
            </h1>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search anything"
                onClick={onSearchClick}
                readOnly
                className="w-80 pl-10 pr-12 py-2.5 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:bg-white/70 transition-all duration-300 placeholder:text-gray-500 shadow-sm cursor-pointer"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs text-gray-500 bg-white/50 rounded border border-white/30">
                  ⌘
                </kbd>
                <kbd className="px-1.5 py-0.5 text-xs text-gray-500 bg-white/50 rounded border border-white/30">
                  K
                </kbd>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Settings */}
              <button
                onClick={handleSettingsClick}
                className="p-2 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/70 hover:border-white/50 transition-all duration-300 shadow-sm"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {/* Help */}
              <button className="p-2 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/70 hover:border-white/50 transition-all duration-300 shadow-sm">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>

              {/* User Profile */}
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm cursor-pointer hover:from-primary-600 hover:to-primary-700 transition-all duration-300">
                JB
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
