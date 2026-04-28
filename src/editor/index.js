import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TopBar from './TopBar';
import ToolsPanel from './Toolspanel';
import AssetPanel from './AssetPanel';
import CanvasArea from './CanvasArea';
import SettingsPanel from './SettingsPanel';

// Miro exact color palette + DM Sans typography
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4262ff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#050038',
      secondary: '#696880',
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Open Sans", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 13,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#050038',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 500,
          padding: '4px 10px',
          borderRadius: '4px',
        },
        arrow: {
          color: '#050038',
        },
      },
    },
  },
});

function CanvaApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
        }}
      >
        {/* Canvas with grid background */}
        <CanvasArea />

        {/* Top bar — full width Miro style */}
        <TopBar />

        {/* Left vertical toolbar — Miro style */}
        <ToolsPanel />

        {/* Asset Panel */}
        <AssetPanel />

        {/* Properties Panel */}
        <SettingsPanel />
      </Box>
    </ThemeProvider>
  );
}

export default CanvaApp;
