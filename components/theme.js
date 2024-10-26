import { extendTheme } from "native-base";

const theme = extendTheme({
  colors: {
    /* Primary Colors */
    primary: {
      50: "#CCFFFF", // Light shade of electric blue for backgrounds
      100: "#99FFFF",
      200: "#66FFFF",
      300: "#33FFFF",
      400: "#00FFFF", // Main electric blue accent
      500: "#00CCCC",
      600: "#009999",
      700: "#006666",
      800: "#003333",
      900: "#001A1A",
    },
    secondary: {
      50: "#FFCCFF", // Light neon pink accent
      100: "#FF99FF",
      200: "#FF66FF",
      300: "#FF33FF",
      400: "#FF00FF", // Main neon pink accent
      500: "#CC00CC",
      600: "#990099",
      700: "#660066",
      800: "#330033",
      900: "#1A001A",
    },
    success: {
      400: "#39FF14", // Lime green for success icons or known states
    },
    error: {
      400: "#FF0033", // Red glitch for error or unknown states
    },
    background: {
      dark: "#0A0A0A", // Deep black main background
      card: "#1F0033", // Dark purple card background
    },
    text: {
      primary: "#FFFFFF", // Main text color
      secondary: "#AAAAAA", // Less important text
      placeholder: "#666666", // Placeholder text color
    },
    border: {
      primary: "#00FFFF", // Electric blue card outlines
      secondary: "#FF00FF", // Neon pink button outlines
    },
  },
  fonts: {
    heading: "Orbitron, sans-serif", // Futuristic font for headings
    body: "Roboto Mono, monospace", // Monospace for body text
    mono: "Roboto Mono, monospace",
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
  },
});

export default theme;
