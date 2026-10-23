import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { Palette, Check, Sparkles, Moon, Sun, Leaf, Compass } from 'lucide-react';

interface ThemeSwitcherProps {
  compact?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ compact = false }) => {
  const { theme, currentThemeConfig, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (id: ThemeMode) => {
    switch (id) {
      case 'emerald':
        return <Leaf className="w-3.5 h-3.5 text-teal-600" />;
      case 'terracotta':
        return <Sparkles className="w-3.5 h-3.5 text-orange-600" />;
      case 'midnight':
        return <Moon className="w-3.5 h-3.5 text-emerald-400" />;
      case 'nordic':
        return <Compass className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Current theme: ${currentThemeConfig.name}. Click to change theme.`}
        className="p-2 sm:px-2.5 sm:py-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] hover:border-[var(--theme-primary)]/60 text-[var(--theme-text-main)] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium shadow-xs"
      >
        <Palette className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
        <span className="hidden sm:inline font-semibold">{currentThemeConfig.name}</span>
        {/* Color preview pip */}
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10 shadow-xs"
          style={{ backgroundColor: currentThemeConfig.primaryColor }}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--theme-card)] rounded-2xl shadow-xl border border-[var(--theme-border)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-[var(--theme-border)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--theme-text-main)]">Visual Theme</span>
              <span className="text-[10px] text-[var(--theme-primary)] font-semibold uppercase tracking-wider">
                Customizable
              </span>
            </div>
            <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">
              Select your preferred color palette & mood.
            </p>
          </div>

          <div className="py-1.5 space-y-1">
            {availableThemes.map(t => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--theme-primary-subtle)] text-[var(--theme-primary)] font-bold'
                      : 'hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 text-[var(--theme-text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Swatch Pill */}
                    <div
                      className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border border-black/10 shadow-xs"
                      style={{ backgroundColor: t.primaryColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate leading-none">{t.name}</span>
                        {t.accentBadge && (
                          <span className="text-[9px] px-1 py-0.2 rounded-md font-medium bg-neutral-200/60 dark:bg-neutral-700/60 text-[var(--theme-text-muted)]">
                            {t.accentBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--theme-text-muted)] truncate mt-0.5">
                        {t.tagline}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[var(--theme-primary)] shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
