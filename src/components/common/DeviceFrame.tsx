import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Sparkles,
  PlusSquare,
  Compass,
  Clock,
  Wifi,
  BatteryCharging,
  Signal,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { viewportMode, activeTab, setActiveTab, unreadNotificationsCount, currentUser } = useApp();

  if (viewportMode === 'responsive-web') {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#28231F] flex flex-col">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Quiet Minimal Footer adhering to anti-slop rules */}
        <footer className="border-t border-[#DFD5C8] bg-white py-6 mt-12 text-xs text-[#786D65]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#28231F]">LendLoop</span>
              <span>— Borrow smarter. Share more.</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Security Deposit Escrow Policy (Option B)</span>
              <span>·</span>
              <span>Peer-to-Peer Community Lending</span>
              <span>·</span>
              <button
                onClick={() => setActiveTab('flutter-code')}
                className="hover:text-[#9E6E4F] transition-colors cursor-pointer underline-offset-2 hover:underline"
              >
                Developer Specs
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Mobile Android Phone Bezel Frame Mode
  return (
    <div className="min-h-screen bg-[#28231F] py-6 px-4 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[412px] h-[860px] bg-[#F7F3EC] rounded-[44px] shadow-2xl border-[10px] border-[#3E3630] flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Android Punch Hole Camera & Speaker */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#181818] z-50 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d]" />
        </div>

        {/* Android Status Bar */}
        <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-[#28231F] select-none shrink-0 z-40 bg-white/70 backdrop-blur-sm">
          <span>10:42 AM</span>
          <div className="flex items-center gap-2 text-[#28231F]">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] tabular-nums font-mono">94%</span>
              <BatteryCharging className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden relative ${
          currentUser && activeTab !== 'auth' ? 'pb-20' : 'pb-4'
        }`}>
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar (Shown when logged in) */}
        {currentUser && activeTab !== 'auth' && (
          <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#DFD5C8] grid grid-cols-5 items-center px-1 z-40">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-[#9E6E4F]' : 'text-[#786D65]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('match')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'match' ? 'text-[#9E6E4F]' : 'text-[#786D65]'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Match</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className="flex flex-col items-center justify-center h-full text-[#9E6E4F] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#9E6E4F] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform -mt-3">
              <PlusSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">List</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'map' ? 'text-[#9E6E4F]' : 'text-[#786D65]'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Nearby</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex flex-col items-center justify-center h-full relative transition-colors cursor-pointer ${
              activeTab === 'activity' ? 'text-[#9E6E4F]' : 'text-[#786D65]'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Activity</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-[#9E6E4F]" />
            )}
          </button>
        </nav>
      )}

        {/* Android Gesture Navigation Bar Pill */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#28231F]/30 rounded-full pointer-events-none z-50" />
      </div>
    </div>
  );
};
