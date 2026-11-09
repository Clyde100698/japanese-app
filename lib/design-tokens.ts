// Design Tokens for Nihongo Reviewer
// Centralised design specifications: Blue primary palette (#2563EB), WCAG AA contrast ratios,
// typography font-families, 16px border-radius, and 48px minimum touch targets.

export const tokens = {
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb", // Main brand primary
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    semantic: {
      success: {
        light: "#10b981",
        bgLight: "#ecfdf5",
        textLight: "#065f46",
        dark: "#34d399",
        bgDark: "rgba(6, 78, 59, 0.4)",
        textDark: "#a7f3d0",
      },
      warning: {
        light: "#f59e0b",
        bgLight: "#fffbeb",
        textLight: "#92400e",
        dark: "#fbbf24",
        bgDark: "rgba(120, 53, 15, 0.4)",
        textDark: "#fde68a",
      },
      danger: {
        light: "#ef4444",
        bgLight: "#fef2f2",
        textLight: "#991b1b",
        dark: "#f87171",
        bgDark: "rgba(127, 29, 29, 0.4)",
        textDark: "#fecaca",
      },
      info: {
        light: "#0284c7",
        bgLight: "#f0f9ff",
        textLight: "#075985",
        dark: "#38bdf8",
        bgDark: "rgba(12, 74, 110, 0.4)",
        textDark: "#bae6fd",
      },
    },
    neutral: {
      light: {
        bg: "#f8fafc", // slate-50
        surface: "#ffffff",
        surfaceElevated: "#ffffff",
        border: "#e2e8f0", // slate-200
        text: "#0f172a", // slate-900 (WCAG AAA against white)
        textMuted: "#64748b", // slate-500 (WCAG AA compliant)
        textSubtle: "#94a3b8", // slate-400
      },
      dark: {
        bg: "#090d16", // deep obsidian slate
        surface: "#111827", // gray-900
        surfaceElevated: "#1e293b", // slate-800
        border: "#1f293d", // subtle slate border
        text: "#f8fafc", // slate-50 (WCAG AAA)
        textMuted: "#94a3b8", // slate-400 (WCAG AA compliant)
        textSubtle: "#64748b", // slate-500
      },
    },
  },
  typography: {
    fontHeading: "var(--font-poppins), 'Poppins', sans-serif",
    fontBody: "var(--font-inter), 'Inter', sans-serif",
    fontJapanese: "var(--font-noto-jp), 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  geometry: {
    cardRadius: "1rem", // 16px (rounded-2xl)
    buttonRadius: "9999px", // rounded-full for pills / 1rem for blocks
    minTapTarget: "3rem", // 48px minimum touch target for mobile
  },
  elevation: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
    popover: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
} as const;

export type ThemeMode = "light" | "dark" | "system";

