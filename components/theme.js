import { extendTheme } from "native-base";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#CCFFFF",
      100: "#99FFFF",
      200: "#66FFFF",
      300: "#33FFFF",
      400: "#00FFFF",
      500: "#00CCCC",
      600: "#009999",
      700: "#006666",
      800: "#003333",
      900: "#001A1A",
    },
    secondary: {
      50: "#FFCCFF",
      100: "#FF99FF",
      200: "#FF66FF",
      300: "#FF33FF",
      400: "#FF00FF",
      500: "#CC00CC",
      600: "#990099",
      700: "#660066",
      800: "#330033",
      900: "#1A001A",
    },
    success: {
      400: "#39FF14",
    },
    error: {
      400: "#FF0033",
    },
    background: {
      dark: "#0A0A0A",
      card: "#1F0033",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#AAAAAA",
      placeholder: "#666666",
    },
    border: {
      primary: "#00FFFF",
      secondary: "#FF00FF",
    },
  },

  fontConfig: {
    Exo2: {
      700: {
        normal: "Exo2-Bold",
      },
    },
    Roboto: {
      400: {
        normal: "Roboto-Regular",
      },
    },
  },
  fonts: {
    heading: "Exo2", // Matches Exo2 configuration in fontConfig
    body: "Roboto", // Matches Roboto configuration in fontConfig
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 32,
    "3xl": 48,
  },
});

export default theme;
