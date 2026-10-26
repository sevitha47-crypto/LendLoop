import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import {
  PlusCircle,
  Bell,
  Smartphone,
  Monitor,
  ShieldCheck,
  User,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  Code2,
  LogOut,
  LogIn
} from 'lucide-react';
import { MOCK_USERS } from '../../data/mockData';

export const TopNavigation: React.FC = () => {
  const {
    currentUser,
    logout,
    switchUser,
    isDemoMode,
    setIsDemoMode,
    viewportMode,
    setViewportMode,
    activeTab,
    setActiveTab,
    unreadNotificationsCount
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoNoticeDismissed, setDemoNoticeDismissed] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Explore' },
    { id: 'match', label: 'LendLoop Match' },
    { id: 'map', label: 'Nearby Map' },
    { id: 'activity', label: 'My Activity' },
    ...(currentUser?.role === 'admin' ? [{ id: 'admin', label: 'Admin Console' }] : [])
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DFD5C8]">
      {/* Demo Evaluation Notice Bar (Only if demo mode active & not dismissed) */}
      {isDemoMode && !demoNoticeDismissed && (
        <div className="bg-[#28231F] text-[#F7F3EC] px-4 py-1.5 text-xs flex items-center justify-between border-b border-[#3E3630]">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold text-[#9E6E4F]">DEMO EVALUATION MODE:</span>
            <span>All UPI payments & security deposit refunds are simulated. No real currency is transferred.</span>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <button
              onClick={() => setActiveTab('activity')}
              className="text-[#9E6E4F] hover:underline font-medium cursor-pointer"
            >
              View Escrow Activity
            </button>
            <button
              onClick={() => setDemoNoticeDismissed(true)}
              className="text-white/60 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Top Bar (Standard 3-Zone Contract) */}
      {/* Main Top Bar (Standard 3-Zone Contract) */}
      <div className={`max-w-7xl mx-auto h-16 flex items-center justify-between gap-3 ${
        viewportMode === 'mobile-frame' ? 'px-3.5' : 'px-4 sm:px-6 lg:px-8'
      }`}>
        {/* Zone 1: Single Brand Wordmark */}
        <div
          onClick={() => setActiveTab('home')}
          className="cursor-pointer shrink-0"
        >
          <BrandLogo size={viewportMode === 'mobile-frame' ? 'sm' : 'md'} />
        </div>

        {/* Zone 2: Navigation Links (Only in expanded web view when logged in) */}
        {viewportMode !== 'mobile-frame' && currentUser && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#786D65]">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 relative py-2 cursor-pointer ${
                    isActive
                      ? 'text-[#9E6E4F] font-semibold'
                      : 'hover:text-[#28231F]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E6E4F] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Zone 3: Actions & Role Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Viewport Frame Toggle (Mobile Phone vs Desktop Web) */}
          <button
            onClick={() => setViewportMode(viewportMode === 'mobile-frame' ? 'responsive-web' : 'mobile-frame')}
            title={viewportMode === 'mobile-frame' ? 'Switch to Full Web View' : 'Preview as Android Phone Frame'}
            className="p-2 rounded-xl border border-[#DFD5C8] text-[#28231F] hover:bg-[#F7F3EC] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
          >
            {viewportMode === 'mobile-frame' ? (
              <>
                <Monitor className="w-4 h-4 text-[#9E6E4F]" />
                <span className="hidden sm:inline">Web View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-[#28231F]" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>

          {/* Primary CTA: List an Item (Shown in web view when logged in) */}
          {viewportMode !== 'mobile-frame' && currentUser && (
            <button
              onClick={() => setActiveTab('list')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#9E6E4F] hover:bg-[#855739] rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Item</span>
            </button>
          )}

          {/* User Profile & Logout or Auth CTA */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-[#DFD5C8] hover:border-[#9E6E4F]/50 transition-colors bg-white cursor-pointer"
              >
                <div className="flex flex-col text-left leading-tight hidden lg:block">
                  <span className="text-xs font-semibold text-[#28231F] truncate max-w-[100px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#9E6E4F] capitalize font-medium">
                    {currentUser.role}
                  </span>
                </div>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg border border-[#DFD5C8] bg-[#F7F3EC]"
                />
                <ChevronDown className="w-3.5 h-3.5 text-[#786D65]" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#DFD5C8] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-[#DFD5C8]">
                    <p className="text-xs font-bold text-[#28231F] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#786D65] truncate">{currentUser.email}</p>
                  </div>
                  <div className="px-3 py-1.5">
                    <p className="text-[10px] uppercase font-bold text-[#786D65] tracking-wider">Switch Role:</p>
                  </div>
                  <div className="space-y-1">
                    {Object.values(MOCK_USERS).map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          currentUser.id === u.id
                            ? 'bg-[#F7F3EC] text-[#9E6E4F] font-semibold'
                            : 'hover:bg-neutral-50 text-[#28231F]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-md border border-[#DFD5C8]" />
                          <div className="truncate">
                            <p className="truncate leading-none">{u.name}</p>
                            <p className="text-[10px] text-[#786D65] capitalize mt-0.5">{u.role}</p>
                          </div>
                        </div>
                        {currentUser.id === u.id && <CheckCircle2 className="w-4 h-4 text-[#9E6E4F] shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#DFD5C8] space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('flutter-code');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#786D65] hover:text-[#28231F] hover:bg-neutral-50 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Code2 className="w-3.5 h-3.5 text-[#9E6E4F]" />
                        <span>Developer Specs & Tests</span>
                      </span>
                      <span className="text-[10px] text-[#786D65]">Dev</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDemoMode(!isDemoMode);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#28231F] hover:bg-neutral-50 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <span>Demo Mode Enabled</span>
                      <span className={`w-3 h-3 rounded-full ${isDemoMode ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                    </button>

                    {/* Dedicated Logout Option */}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#9E6E4F] hover:bg-[#855739] rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
