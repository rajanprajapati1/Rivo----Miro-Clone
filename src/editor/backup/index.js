import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Tooltip, IconButton, Typography } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import TopBar from './TopBar';
import ToolsPanel from './Toolspanel';
import CanvasArea from './CanvasArea';
import SettingsPanel from './SettingsPanel';

// Pure White Premium Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#18181b',
    },
    background: {
      default: '#f4f4f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#18181b',
      secondary: '#71717a',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#ffffff',
          color: '#18181b',
          fontSize: '12px',
          fontWeight: 500,
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        },
        arrow: {
          color: '#ffffff',
          '&::before': {
            boxShadow: '0 0 0 1px rgba(0,0,0,0.04)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#f4f4f5',
        }}
      >
        {/* Fullscreen Canvas */}
        <CanvasArea />

        {/* Floating Toolbar */}
        <ToolsPanel />

        {/* Top Right Actions */}
        <TopBar />

        {/* Properties Panel */}
        <SettingsPanel />

        {/* Bottom Info */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: '#ffffff',
            borderRadius: '10px',
            padding: '8px 14px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#a1a1aa',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            WebP Canvas Editor
          </Typography>

          <Tooltip
            title="Double-click to add text • Scroll to zoom • Drag images to upload"
            placement="top"
            arrow
          >
            <IconButton size="small" sx={{ color: '#a1a1aa', p: 0.5 }}>
              <HelpOutline sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;