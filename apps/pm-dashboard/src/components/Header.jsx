import { Search, Settings, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ title = "Home", subtitle = "Monitor all of your projects and tasks here" }) {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  return (
    <header className="bg-gradient-glass backdrop-blur-xl border-b border-white/30 shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title and subtitle */}
          <div>
            <h1 className="text-2xl font-semibold text-brand-foreground mb-1">
              {title}
            </h1>
            <p className="text-sm text-brand-text-light">
              {subtitle}
            </p>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <input
                type="text"
                placeholder="Search anything"
                className="w-80 pl-10 pr-12 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary focus:bg-white/15 transition-all duration-300 placeholder:text-brand-text-light shadow-lg"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs text-brand-text-light bg-white/10 rounded border border-white/20">
                  ⌘
                </kbd>
                <kbd className="px-1.5 py-0.5 text-xs text-brand-text-light bg-white/10 rounded border border-white/20">
                  K
                </kbd>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Settings */}
              <button 
                onClick={handleSettingsClick}
                className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
              >
                <Settings className="w-5 h-5 text-brand-text-light" />
              </button>

              {/* Help */}
              <button className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg">
                <HelpCircle className="w-5 h-5 text-brand-text-light" />
              </button>

              {/* User Profile */}
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg cursor-pointer hover:from-gray-500 hover:to-gray-700 transition-all duration-300">
                JB
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
