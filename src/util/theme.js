import React from "react";
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";

const themeConfig = {
  // Light theme
  light: {
    palette: {
      type: "light",
      primary: {
        main: colors.indigo["500"],
      },
      secondary: {
        main: colors.pink["500"],
      },
      background: {
        default: "#fff",
        paper: "#fff",
      },
    },
  },

  common: {
    typography: {
      fontSize: 14,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1200,
        xl: 1920,
      },
    },

    overrides: {
      MuiCssBaseline: {
        "@global": {
          "#root": {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            "& > *": {
              flexShrink: 0,
            },
          },
        },
      },
    },
  },
};

function getTheme(name) {
  // Create MUI theme from themeConfig
  return createMuiTheme({
    ...themeConfig[name],
    // Merge in common values
    ...themeConfig.common,
    overrides: {
      // Merge overrides
      ...(themeConfig[name] && themeConfig[name].overrides),
      ...(themeConfig.common && themeConfig.common.overrides),
    },
  });
}

export const ThemeProvider = (props) => {
  const theme = getTheme("light");

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </MuiThemeProvider>
  );
};
