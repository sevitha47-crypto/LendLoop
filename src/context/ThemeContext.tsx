import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'emerald' | 'terracotta' | 'midnight' | 'nordic';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  tagline: string;
  primaryColor: string;
  canvasColor: string;
  cardColor: string;
  textColor: string;
  isDark: boolean;
  accentBadge: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'emerald',
    name: 'Eco Emerald',
    tagline: 'Sustainable Neighborhood',
    primaryColor: '#0D9488',
    canvasColor: '#F4F8F6',
    cardColor: '#FFFFFF',
    textColor: '#132E27',
    isDark: false,
    accentBadge: 'New Default'
  },
  {
    id: 'terracotta',
    name: 'Warm Clay',
    tagline: 'Original Heritage',
    primaryColor: '#EA580C',
    canvasColor: '#FAF7F2',
    cardColor: '#FFFFFF',
    textColor: '#201D1A',
    isDark: false,
    accentBadge: 'Classic'
  },
  {
    id: 'midnight',
    name: 'Midnight Dark',
    tagline: 'Deep Slate Contrast',
    primaryColor: '#10B981',
    canvasColor: '#0F1513',
    cardColor: '#17211D',
    textColor: '#F3F7F5',
    isDark: true,
    accentBadge: 'Dark Mode'
  },
  {
    id: 'nordic',
    name: 'Nordic Slate',
    tagline: 'Minimalist Clean Blue',
    primaryColor: '#2563EB',
    canvasColor: '#F8FAFC',
    cardColor: '#FFFFFF',
    textColor: '#0F172A',
    isDark: false,
    accentBadge: 'Crisp'
  }
];

interface ThemeContextType {
  theme: ThemeMode;
  currentThemeConfig: ThemeOption;
  setTheme: (theme: ThemeMode) => void;
  availableThemes: ThemeOption[];
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'lendloop_selected_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to 'emerald' as the newly requested theme!
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      if (saved && THEMES.some(t => t.id === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'emerald';
  });

  const currentThemeConfig = THEMES.find(t => t.id === theme) || THEMES[0];

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  };

  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex(t => t.id === theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex].id);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (currentThemeConfig.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, currentThemeConfig.isDark]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentThemeConfig,
        setTheme,
        availableThemes: THEMES,
        cycleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
