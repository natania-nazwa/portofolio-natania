export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme_mode';

export const getPreferredTheme = (): ThemeMode => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (saved === 'light' || saved === 'dark') return saved;

  // fallback: system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'light';
};

export const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  localStorage.setItem(STORAGE_KEY, mode);
};

export const toggleTheme = () => {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
};

